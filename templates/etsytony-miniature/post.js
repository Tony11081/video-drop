// 后期管线（每个子帧）：场景 → AO + 倾斜焦平面弥散圈 → 半分辨率深度感知散景 → 合成 → 累积（动态模糊）
// 累积完一帧后：色调映射 + 玩具调色 + 暗角 + 抖动 → 画布。
import * as THREE from './three.module.min.js';

const FS_QUAD = `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const COMMON = `
uniform sampler2D tDepth; uniform mat4 projInv; uniform mat4 camWorld; uniform vec2 res;
vec3 viewPos(vec2 uv){ float d = texture2D(tDepth, uv).x; vec4 c = vec4(uv*2.0-1.0, d*2.0-1.0, 1.0); vec4 v = projInv*c; return v.xyz/v.w; }
float ign(vec2 p, float f){ return fract(52.9829189*fract(dot(p + f*5.588238, vec2(0.06711056,0.00583715)))); }
`;

export class Post {
  constructor(renderer, W, H) {
    this.r = renderer; this.W = W; this.H = H;
    const rt = (w, h, opts = {}) => new THREE.WebGLRenderTarget(w, h, Object.assign({ type: THREE.HalfFloatType, format: THREE.RGBAFormat, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false }, opts));
    const depth = new THREE.DepthTexture(W, H); depth.type = THREE.UnsignedIntType; depth.minFilter = depth.magFilter = THREE.NearestFilter;
    this.rtScene = rt(W, H, { depthBuffer: true, depthTexture: depth });
    this.rtPrep = rt(W, H);
    this.rtHalf = rt(Math.ceil(W / 2), Math.ceil(H / 2));
    this.rtAccum = rt(W, H, { type: THREE.FloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
    this.rtBloomA = rt(Math.ceil(W / 4), Math.ceil(H / 4)); this.rtBloomB = rt(Math.ceil(W / 4), Math.ceil(H / 4));
    this.quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    this.qScene = new THREE.Scene(); this.qScene.add(this.quad);

    this.prep = new THREE.ShaderMaterial({
      vertexShader: FS_QUAD,
      uniforms: { tColor: { value: this.rtScene.texture }, tDepth: { value: depth }, projInv: { value: new THREE.Matrix4() }, camWorld: { value: new THREE.Matrix4() }, proj: { value: new THREE.Matrix4() }, res: { value: new THREE.Vector2(W, H) },
        fPoint: { value: new THREE.Vector3() }, fNormal: { value: new THREE.Vector3(0, 0, 1) }, fSharp: { value: 8 }, fK: { value: 0.6 }, cocMax: { value: 24 }, blurAll: { value: 0 },
        aoRadius: { value: 1.6 }, aoStrength: { value: 0.65 }, frame: { value: 0 } },
      fragmentShader: `
        varying vec2 vUv; uniform sampler2D tColor; uniform mat4 proj;
        uniform vec3 fPoint; uniform vec3 fNormal; uniform float fSharp, fK, cocMax, blurAll, aoRadius, aoStrength, frame;
        ${COMMON}
        void main(){
          vec3 col = texture2D(tColor, vUv).rgb;
          float d = texture2D(tDepth, vUv).x;
          float coc = cocMax; float ao = 1.0;
          if (d < 0.99999) {
            vec3 vp = viewPos(vUv);
            vec3 n = normalize(cross(dFdx(vp), dFdy(vp)));
            // AO：半球随机采样（交错梯度噪声 + 子帧旋转，累积后去噪）
            float occ = 0.0; float rr = aoRadius;
            float a0 = ign(gl_FragCoord.xy, frame) * 6.2831;
            for (int i = 0; i < 5; i++) {
              float fi = float(i);
              float a = a0 + fi * 2.39996; float z = fract(fi * 0.618 + ign(gl_FragCoord.yx, frame));
              float rad = sqrt(1.0 - z*z);
              vec3 dir = vec3(cos(a)*rad, sin(a)*rad, z);
              // 以法线为 z 轴的切线空间
              vec3 t = normalize(abs(n.y) < 0.9 ? cross(n, vec3(0,1,0)) : cross(n, vec3(1,0,0))); vec3 b = cross(n, t);
              float sc = mix(0.2, 1.0, (fi+1.0)/5.0);
              vec3 sp = vp + (t*dir.x + b*dir.y + n*dir.z) * rr * sc;
              vec4 pc = proj * vec4(sp, 1.0); vec2 suv = pc.xy / pc.w * 0.5 + 0.5;
              if (suv.x < 0.0 || suv.x > 1.0 || suv.y < 0.0 || suv.y > 1.0) continue;
              float sz = viewPos(suv).z;
              float range = smoothstep(0.0, 1.0, rr / abs(vp.z - sz));
              occ += (sz >= sp.z + 0.03 * rr ? 1.0 : 0.0) * range;
            }
            ao = 1.0 - aoStrength * occ / 5.0;
            // 弥散圈：像素到倾斜焦平面的世界空间距离
            vec3 wp = (camWorld * vec4(vp, 1.0)).xyz;
            float sd = dot(wp - fPoint, fNormal);
            vec3 camP = (camWorld * vec4(0.0,0.0,0.0,1.0)).xyz;
            float camSide = sign(dot(camP - fPoint, fNormal));
            coc = clamp(fK * max(0.0, abs(sd) - fSharp), 0.0, cocMax);
            if (sign(sd) == camSide) coc = -coc; // 近景
          }
          coc = sign(coc + 1e-4) * mix(abs(coc), cocMax, blurAll);
          gl_FragColor = vec4(col * ao, coc);
        }`,
    });
    this.prep.extensions = { derivatives: true };

    this.gather = new THREE.ShaderMaterial({
      vertexShader: FS_QUAD,
      uniforms: { tPrep: { value: this.rtPrep.texture }, tDepth: { value: depth }, res: { value: new THREE.Vector2(W, H) }, cocMax: { value: 24 }, frame: { value: 0 }, projInv: { value: new THREE.Matrix4() }, camWorld: { value: new THREE.Matrix4() } },
      fragmentShader: `
        varying vec2 vUv; uniform sampler2D tPrep; uniform float cocMax, frame;
        ${COMMON}
        void main(){
          vec4 c0 = texture2D(tPrep, vUv); float sc0 = c0.a; float cc = abs(sc0);
          vec3 acc = c0.rgb / (cc*cc + 1.0); float wsum = 1.0 / (cc*cc + 1.0);
          float fg = 0.0;
          const int N = 32;
          float rot = ign(gl_FragCoord.xy, frame) * 6.2831;
          float R = cocMax;
          for (int i = 0; i < N; i++) {
            float fi = float(i) + 0.5;
            float r = sqrt(fi / float(N)) * R;
            float a = fi * 2.39996 + rot;
            vec2 uv = vUv + vec2(cos(a), sin(a)) * r / res;
            vec4 s = texture2D(tPrep, uv);
            float cs = abs(s.a);
            // 采样点是否在中心点之前（离相机更近）：近景对近景比谁更虚，远景对远景比谁更清
            bool sNear = s.a < 0.0, cNear = sc0 < 0.0;
            bool inFront = sNear ? (!cNear || cs > cc) : (!cNear && cs < cc);
            // 背景不能越过更清晰的前景
            float ce = inFront ? cs : min(cs, cc);
            float w = smoothstep(r - 1.5, r + 0.5, ce) / (ce*ce + 1.0);
            acc += s.rgb * w; wsum += w;
            if (inFront && cs > cc + 1.0) fg += smoothstep(r - 1.5, r + 0.5, cs);
          }
          gl_FragColor = vec4(acc / wsum, clamp(fg / float(N) * 3.0, 0.0, 1.0));
        }`,
    });

    this.composite = new THREE.ShaderMaterial({
      vertexShader: FS_QUAD, blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendEquation: THREE.AddEquation, depthTest: false, depthWrite: false, transparent: true,
      uniforms: { tPrep: { value: this.rtPrep.texture }, tHalf: { value: this.rtHalf.texture }, weight: { value: 1 } },
      fragmentShader: `
        varying vec2 vUv; uniform sampler2D tPrep, tHalf; uniform float weight;
        void main(){
          vec4 s = texture2D(tPrep, vUv); vec4 b = texture2D(tHalf, vUv);
          float k = max(smoothstep(0.7, 2.6, abs(s.a)), b.a);
          gl_FragColor = vec4(mix(s.rgb, b.rgb, k) * weight, weight);
        }`,
    });

    // 简易泛光：1/4 分辨率亮部 + 两次模糊
    this.bright = new THREE.ShaderMaterial({ vertexShader: FS_QUAD, uniforms: { tSrc: { value: this.rtAccum.texture }, res: { value: new THREE.Vector2(W, H) }, thr: { value: 1.4 } },
      fragmentShader: `varying vec2 vUv; uniform sampler2D tSrc; uniform vec2 res; uniform float thr;
        void main(){ vec3 c = vec3(0.0); for (int x=-1;x<=1;x++) for(int y=-1;y<=1;y++){ c += texture2D(tSrc, vUv + vec2(float(x),float(y))*1.5/res).rgb; } c/=9.0;
          float l = max(c.r, max(c.g, c.b)); gl_FragColor = vec4(c * smoothstep(thr, thr*2.5, l), 1.0); }` });
    this.blur = new THREE.ShaderMaterial({ vertexShader: FS_QUAD, uniforms: { tSrc: { value: null }, dir: { value: new THREE.Vector2(1, 0) }, res: { value: new THREE.Vector2(W / 4, H / 4) } },
      fragmentShader: `varying vec2 vUv; uniform sampler2D tSrc; uniform vec2 dir, res;
        void main(){ vec3 c = vec3(0.0); float ws=0.0; for (int i=-8;i<=8;i++){ float w = exp(-float(i*i)/24.0); c += texture2D(tSrc, vUv + dir*float(i)/res).rgb*w; ws+=w; } gl_FragColor = vec4(c/ws,1.0); }` });

    this.final = new THREE.ShaderMaterial({
      vertexShader: FS_QUAD,
      uniforms: { tAccum: { value: this.rtAccum.texture }, tBloom: { value: this.rtBloomB.texture }, res: { value: new THREE.Vector2(W, H) }, exposure: { value: 1.0 }, sat: { value: 1.28 }, contrast: { value: 1.12 }, lift: { value: 0.03 },
        warm: { value: new THREE.Vector3(1, 1, 1) }, vignette: { value: 0.22 }, frame: { value: 0 }, bloom: { value: 0.35 } },
      fragmentShader: `
        varying vec2 vUv; uniform sampler2D tAccum, tBloom; uniform vec2 res; uniform float exposure, sat, contrast, lift, vignette, frame, bloom; uniform vec3 warm;
        vec3 aces(vec3 x){ const float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14; return clamp((x*(a*x+b))/(x*(c*x+d)+e),0.0,1.0); }
        vec3 toSRGB(vec3 c){ return mix(c*12.92, 1.055*pow(c, vec3(1.0/2.4)) - 0.055, step(0.0031308, c)); }
        float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + frame*0.618) * 43758.5453); }
        void main(){
          vec4 a = texture2D(tAccum, vUv);
          vec3 c = a.rgb / max(a.a, 1e-4);
          c += texture2D(tBloom, vUv).rgb * bloom;
          c *= exposure * warm;
          c = aces(c);
          // 玩具感：提饱和、S 曲线对比、轻微提亮暗部
          float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
          c = mix(vec3(l), c, sat);
          c = clamp(c, 0.0, 1.0);
          c = (c - 0.5) * contrast + 0.5;
          c = c + lift * (1.0 - c);
          // 暗角（竖屏按椭圆）
          vec2 q = (vUv - 0.5) * vec2(1.0, res.y/res.x*0.62);
          c *= 1.0 - vignette * smoothstep(0.18, 0.85, dot(q,q)*2.2);
          c = toSRGB(clamp(c, 0.0, 1.0));
          c += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
          gl_FragColor = vec4(c, 1.0);
        }`,
    });
  }

  pass(mat, target) { this.quad.material = mat; this.r.setRenderTarget(target); this.r.render(this.qScene, this.quadCam); }

  // 渲染一个子帧并累积。focus = {point, normal, sharp, k, blurAll}
  sub(scene, camera, focus, weight, first, frameSeed, opts = {}) {
    const r = this.r;
    r.setRenderTarget(this.rtScene); r.clear(); r.render(scene, camera);
    const P = this.prep.uniforms;
    P.projInv.value.copy(camera.projectionMatrixInverse); P.proj.value.copy(camera.projectionMatrix); P.camWorld.value.copy(camera.matrixWorld);
    P.fPoint.value.copy(focus.point); P.fNormal.value.copy(focus.normal); P.fSharp.value = focus.sharp; P.fK.value = focus.k; P.cocMax.value = focus.cocMax; P.blurAll.value = focus.blurAll; P.frame.value = frameSeed;
    P.aoRadius.value = opts.aoRadius ?? 1.6; P.aoStrength.value = opts.aoStrength ?? 0.65;
    this.pass(this.prep, this.rtPrep);
    const G = this.gather.uniforms; G.projInv.value.copy(camera.projectionMatrixInverse); G.camWorld.value.copy(camera.matrixWorld); G.cocMax.value = focus.cocMax; G.frame.value = frameSeed;
    this.pass(this.gather, this.rtHalf);
    if (first) { r.setRenderTarget(this.rtAccum); r.setClearColor(0x000000, 0); r.clear(); }
    this.composite.uniforms.weight.value = weight;
    this.quad.material = this.composite; r.setRenderTarget(this.rtAccum); r.autoClear = false; r.render(this.qScene, this.quadCam); r.autoClear = true;
  }

  finish(grade, frameSeed) {
    this.bright.uniforms.thr.value = grade.bloomThr ?? 1.4;
    this.pass(this.bright, this.rtBloomA);
    this.blur.uniforms.tSrc.value = this.rtBloomA.texture; this.blur.uniforms.dir.value.set(1, 0); this.pass(this.blur, this.rtBloomB);
    this.blur.uniforms.tSrc.value = this.rtBloomB.texture; this.blur.uniforms.dir.value.set(0, 1); this.pass(this.blur, this.rtBloomA);
    this.final.uniforms.tBloom.value = this.rtBloomA.texture;
    const F = this.final.uniforms;
    F.exposure.value = grade.exposure; F.sat.value = grade.sat; F.contrast.value = grade.contrast; F.lift.value = grade.lift; F.vignette.value = grade.vignette; F.warm.value.set(...grade.warm); F.frame.value = frameSeed; F.bloom.value = grade.bloom ?? 0.35;
    this.pass(this.final, null);
  }
}
