// 引擎：读节拍表 → 每个时刻 t 的相机、焦平面、太阳、调色 → 子帧累积 → 输出一帧像素。
import * as THREE from './three.module.min.js';
import { City, BOARD, RAIL, railPoint, railS, railOff, RAIL_HEADING } from './city.js';
import { Post } from './post.js';
import { keyed, clamp, lerp, smooth, smoother, win, EASE } from './util.js';

export class Engine {
  constructor(cue, W, H) {
    this.cue = cue; this.W = W; this.H = H;
    const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H; canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    document.body.appendChild(canvas);
    const r = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    r.setPixelRatio(1); r.setSize(W, H, false);
    r.shadowMap.enabled = true; r.shadowMap.type = THREE.BasicShadowMap; r.shadowMap.autoUpdate = false;
    r.outputColorSpace = THREE.LinearSRGBColorSpace; r.toneMapping = THREE.NoToneMapping;
    this.r = r;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(cue.camera?.fov || 30, W / H, 2, 6000);
    // 光：太阳（硬阴影）+ 天空半球
    this.sun = new THREE.DirectionalLight(0xffffff, 3);
    this.sun.castShadow = true; this.sun.shadow.mapSize.set(cue.shadowMap || 4096, cue.shadowMap || 4096);
    this.sun.shadow.bias = -0.0004; this.sun.shadow.normalBias = 0.04;
    this.scene.add(this.sun); this.scene.add(this.sun.target);
    this.hemi = new THREE.HemisphereLight(0xbfdcff, 0x9a8a6a, 0.9); this.scene.add(this.hemi);
    this.scene.background = new THREE.Color(0xdfe6ea);
    this.makeEnv();
    this.city = new City(this.scene, cue);
    for (const m of this.city.envMats) { m.envMap = this.envTex; m.needsUpdate = true; }
    this.installClouds();
    this.post = new Post(r, W, H);
    this.halton = (i, b) => { let f = 1, x = 0; while (i > 0) { f /= b; x += f * (i % b); i = Math.floor(i / b); } return x; };
  }

  makeEnv() {
    // 用一个渐变天空 + 地面做 PMREM 环境，给塑料/漆面高光
    const envScene = new THREE.Scene();
    const sky = new THREE.Mesh(new THREE.SphereGeometry(100, 32, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, uniforms: {},
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: 'varying vec3 vP; void main(){ float y = normalize(vP).y; vec3 top = vec3(0.55,0.72,0.95); vec3 hor = vec3(1.0,0.96,0.9); vec3 gnd = vec3(0.35,0.32,0.28); vec3 c = y > 0.0 ? mix(hor, top, pow(y,0.6)) : mix(hor, gnd, pow(-y,0.4)); float s = pow(max(0.0, dot(normalize(vP), normalize(vec3(0.6,0.5,0.3)))), 64.0); gl_FragColor = vec4(c*1.2 + s*6.0, 1.0); }' }));
    envScene.add(sky);
    const pm = new THREE.PMREMGenerator(this.r);
    this.envTex = pm.fromScene(envScene, 0.02).texture;
  }

  // 云影：在所有标准材质里把直射光乘上一张随时间飘移的噪声图
  installClouds() {
    this.cloudU = { cloudT: { value: 0 }, cloudAmt: { value: 0.32 } };
    const U = this.cloudU;
    this.scene.traverse((o) => {
      const ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      for (const m of ms) {
        if (!(m.isMeshStandardMaterial || m.isMeshPhongMaterial) || m.userData.cloud) continue;
        m.userData.cloud = true;
        m.onBeforeCompile = (sh) => {
          sh.uniforms.cloudT = U.cloudT; sh.uniforms.cloudAmt = U.cloudAmt;
          sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vCloudW;')
            .replace('#include <project_vertex>', `#include <project_vertex>
              vec4 cw = vec4(transformed, 1.0);
              #ifdef USE_INSTANCING
                cw = instanceMatrix * cw;
              #endif
              vCloudW = (modelMatrix * cw).xyz;`);
          sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
              varying vec3 vCloudW; uniform float cloudT, cloudAmt;
              float cHash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
              float cNoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(cHash(i),cHash(i+vec2(1,0)),f.x), mix(cHash(i+vec2(0,1)),cHash(i+vec2(1,1)),f.x), f.y); }
              float clouds(vec2 p){ p += vec2(cloudT*14.0, cloudT*5.0); float n = cNoise(p/90.0)*0.6 + cNoise(p/38.0)*0.3 + cNoise(p/17.0)*0.1; return smoothstep(0.52, 0.72, n); }`)
            .replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
              float cs = 1.0 - cloudAmt * clouds(vCloudW.xz);
              reflectedLight.directDiffuse *= cs; reflectedLight.directSpecular *= cs;`);
        };
        m.needsUpdate = true;
      }
    });
  }

  // —— 节拍表解释 ——
  camAt(t) {
    const keys = this.cue.camera.keys;
    const tgt = (k) => k.rail ? railPoint(k.rail[0], k.rail[1] || 0, k.rail[2] || 0).toArray() : k.target;
    const ks = keys.map((k) => ({ ...k, tgt: tgt(k) }));
    const target = new THREE.Vector3(...keyed(ks, t, 'tgt'));
    const mix = keyed(ks, t, 'trackMix') || 0;
    if (mix > 0 && this.cue.camera.track) target.lerp(railPoint(this.trackS(t), this.cue.camera.track.off || 0, 0), mix);
    const dist = keyed(ks, t, 'dist'), pitch = keyed(ks, t, 'pitch') * Math.PI / 180, yaw = keyed(ks, t, 'yaw') * Math.PI / 180;
    // 手持感：非常轻的漂移（解析式）
    const drift = this.cue.camera.drift ?? 0.0;
    target.x += drift * Math.sin(t * 0.7); target.z += drift * Math.cos(t * 0.53);
    const f = new THREE.Vector3(Math.sin(yaw) * Math.cos(pitch), -Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));
    const pos = target.clone().sub(f.clone().multiplyScalar(dist));
    return { target, pos, f, dist, pitch, yaw };
  }

  // 跟拍：沿快线的相机目标位置，速度连续（慢推 → 匀加速 → 与列车同速 → 匀减速 → 停）
  trackS(t) {
    const k = this.cue.camera.track;
    const tt = Math.max(k.t0, t);
    let s = k.s0;
    const seg = (a, b, v0, v1) => { const d = clamp(tt, a, b) - a; if (d <= 0) return 0; const acc = (v1 - v0) / (b - a); return v0 * d + 0.5 * acc * d * d; };
    s += seg(k.t0, k.accelAt, k.creep, k.creep);
    s += seg(k.accelAt, k.lockAt, k.creep, k.v);
    s += seg(k.lockAt, k.brakeAt, k.v, k.v);
    s += seg(k.brakeAt, k.stopAt, k.v, 0);
    return s;
  }

  focusAt(t, cam) {
    const ks = this.cue.focus.keys;
    const get = (f, d) => (ks.some((k) => k[f] !== undefined) ? keyed(ks.map((k) => ({ t: k.t, ease: k.ease, [f]: k[f] ?? d })), t, f) : d);
    // 焦点：默认 = 相机目标点；可偏移（沿视线水平方向前后、或指定沿线 s）
    let point = cam.target.clone();
    const fwdH = new THREE.Vector3(Math.sin(cam.yaw), 0, -Math.cos(cam.yaw));
    point.addScaledVector(fwdH, get('ahead', 0));
    point.y += get('lift', 0);
    const railMix = get('railMix', 0);
    if (railMix > 0) {
      const s = railS(point.x, point.z); const rp = railPoint(s, RAIL.track * (this.cue.train?.track ?? 1), 3);
      point.lerp(rp, railMix);
    }
    // 焦带方向：在地面上与相机横向一致（0），或转到快线方向（angle=1）
    const camRight = new THREE.Vector3(Math.cos(cam.yaw), 0, Math.sin(cam.yaw));
    const railDir = RAIL.d.clone();
    const angleMix = get('angle', 0);
    const d = camRight.clone().lerp(railDir.clone().multiplyScalar(Math.sign(railDir.dot(camRight)) || 1), angleMix).normalize();
    // 焦平面包含 d 和 u；tilt=0 时 u 与相机上方向一致（垂直视线），tilt=1 时 u 竖直（贴着快线竖起的焦平面）
    const tilt = get('tilt', 0);
    const w = new THREE.Vector3(-d.z, 0, d.x); if (w.dot(fwdH) < 0) w.negate();
    const el = cam.pitch * (1 - tilt);
    const u = new THREE.Vector3(0, 1, 0).multiplyScalar(Math.cos(el)).addScaledVector(w, Math.sin(el)).normalize();
    const normal = new THREE.Vector3().crossVectors(d, u).normalize();
    return { point, normal, sharp: get('sharp', 8), k: get('k', 0.6), cocMax: get('cocMax', 24) * this.W / 1080, blurAll: get('blur', 0) };
  }

  sunAt(t) {
    const ks = this.cue.sun.keys;
    return { az: keyed(ks, t, 'az'), el: keyed(ks, t, 'el'), color: keyed(ks, t, 'color'), int: keyed(ks, t, 'int'), sky: keyed(ks, t, 'sky'), ground: keyed(ks, t, 'ground'), hemi: keyed(ks, t, 'hemi'), bg: keyed(ks, t, 'bg') };
  }

  gradeAt(t) {
    const ks = this.cue.grade.keys;
    return { exposure: keyed(ks, t, 'exposure'), sat: keyed(ks, t, 'sat'), contrast: keyed(ks, t, 'contrast'), lift: keyed(ks, t, 'lift'), vignette: keyed(ks, t, 'vignette'), warm: keyed(ks, t, 'warm'), bloom: keyed(ks, t, 'bloom') };
  }

  subframesAt(t) { for (const r of this.cue.render.subframes) if (t >= r.t0 && t < r.t1) return r.n; return this.cue.render.subframesDefault || 4; }

  env(t) {
    const city = this.city, tr = this.cue.train, E = this.cue.events;
    const front = city.trainFront(t), tail = front - city.trainLen;
    return {
      trainPassS: front,
      trainNear: (s) => (s < front + 30 && s > tail - 40) ? clamp(1 - Math.max(0, s - front) / 30) * clamp(1 - Math.max(0, tail - s) / 40) : 0,
      trainNearPerson: (s) => smooth(clamp(1 - Math.abs(s - (front + tail) / 2) / 90)),
      gustAt: (x, z, tt) => {
        const off = Math.abs(railOff(x, z)); if (off > 45) return 0;
        const s = railS(x, z);
        const tf = E.trainIn + (s - tr.s0) / tr.speed, tt2 = tf + city.trainLen / tr.speed;
        let g = 0;
        if (tt > tf - 0.25 && tt < tt2) g = smooth(win(tt, tf - 0.25, tf + 0.1));
        else if (tt >= tt2) g = Math.exp(-(tt - tt2) / 0.9);
        return g * Math.exp(-Math.pow(off / 22, 2));
      },
    };
  }

  setScene(t, sub = 0, nSub = 1, frameIdx = 0) {
    const cam = this.camAt(t);
    const c = this.camera;
    c.position.copy(cam.pos); c.up.set(0, 1, 0); c.lookAt(cam.target);
    c.fov = this.cue.camera.fov; c.updateProjectionMatrix();
    // 子像素抖动（累积后得到抗锯齿）
    const jx = this.halton(frameIdx * nSub + sub + 1, 2) - 0.5, jy = this.halton(frameIdx * nSub + sub + 1, 3) - 0.5;
    c.setViewOffset(this.W, this.H, jx, jy, this.W, this.H);
    c.updateMatrixWorld();
    // 太阳、天空
    const s = this.sunAt(t);
    const az = s.az * Math.PI / 180, el = s.el * Math.PI / 180;
    const dir = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el));
    // 阴影相机罩住相机看到的范围，并对齐到阴影贴图像素网格（避免阴影闪烁）
    const half = clamp(cam.dist * 0.62, 70, 720);
    const center = cam.target.clone(); center.y = 0;
    const sh = this.sun.shadow.camera; sh.left = -half; sh.right = half; sh.top = half; sh.bottom = -half; sh.near = 1; sh.far = 3200;
    sh.updateProjectionMatrix();
    const texel = (2 * half) / this.sun.shadow.mapSize.x;
    const lightRot = new THREE.Matrix4().lookAt(dir, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
    const inv = lightRot.clone().invert();
    const lc = center.clone().applyMatrix4(inv); lc.x = Math.round(lc.x / texel) * texel; lc.y = Math.round(lc.y / texel) * texel; center.copy(lc.applyMatrix4(lightRot));
    this.sun.position.copy(center).addScaledVector(dir, 1400); this.sun.target.position.copy(center); this.sun.target.updateMatrixWorld();
    this.sun.color.setRGB(...s.color); this.sun.intensity = s.int;
    this.hemi.color.setRGB(...s.sky); this.hemi.groundColor.setRGB(...s.ground); this.hemi.intensity = s.hemi;
    this.scene.background.setRGB(...s.bg);
    this.cloudU.cloudT.value = t;
    this.city.update(t, this.env(t));
    return cam;
  }

  // 渲染第 i 帧（t = i / fps），累积 n 个子帧（快门 shutter 帧宽）
  renderFrame(i, opts = {}) {
    const fps = this.cue.fps, t = i / fps;
    const n = opts.subframes || this.subframesAt(t);
    const shutter = this.cue.render.shutter ?? 0.75;
    for (let k = 0; k < n; k++) {
      const ts = n === 1 ? t : t + ((k + 0.5) / n - 0.5) * shutter / fps;
      const cam = this.setScene(ts, k, n, i);
      const focus = this.focusAt(ts, cam);
      const aoRadius = clamp(cam.dist * 0.007, 1.2, 8);
      const fast = (this.cue.render.shadowEverySub || []).some((r) => ts >= r[0] && ts < r[1]);
      this.r.shadowMap.needsUpdate = (k === 0) || fast;
      this.post.sub(this.scene, this.camera, focus, 1 / n, k === 0, i * 7 + k, { aoRadius });
    }
    this.post.finish(this.gradeAt(t), i);
    return n;
  }

  pixels() {
    const gl = this.r.getContext(); const buf = new Uint8Array(this.W * this.H * 4);
    gl.readPixels(0, 0, this.W, this.H, gl.RGBA, gl.UNSIGNED_BYTE, buf);
    return buf; // 自下而上，服务端翻转
  }
}
