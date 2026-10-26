// 通用工具：固定种子随机数、缓动、几何合并、节拍表插值。全部只依赖输入，不读实时时钟。
import * as THREE from './three.module.min.js';

export function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const smooth = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
export const smoother = (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
export const easeInOut = (x) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const easeOut = (x) => { x = clamp(x); return 1 - Math.pow(1 - x, 3); };
export const easeIn = (x) => { x = clamp(x); return x * x * x; };
export const win = (t, a, b) => clamp((t - a) / (b - a));      // 0→1 的时间窗
export const pulse = (t, a, b, c, d) => win(t, a, b) * (1 - win(t, c, d));
export const EASE = { linear: (x) => clamp(x), smooth, smoother, inOut: easeInOut, out: easeOut, in: easeIn };

// 关键帧插值：keys = [{t, ...数值或数组}]，按 ease 平滑
export function keyed(keys, t, field, ease = smoother) {
  if (t <= keys[0].t) return keys[0][field];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b.t) {
      const k = (b.ease ? EASE[b.ease] : ease)((t - a.t) / (b.t - a.t));
      const va = a[field], vb = b[field];
      if (Array.isArray(va)) return va.map((v, j) => lerp(v, vb[j], k));
      return lerp(va, vb, k);
    }
  }
  return keys[keys.length - 1][field];
}

// 合并若干非索引几何体（位置/法线/颜色/uv），减少 draw call
export class Merger {
  constructor() { this.pos = []; this.nor = []; this.col = []; this.uv = []; }
  add(geo, matrix, color, uvFn) {
    const g = geo.index ? geo.toNonIndexed() : geo.clone();
    g.applyMatrix4(matrix);
    const p = g.attributes.position.array, n = g.attributes.normal.array;
    const uv = g.attributes.uv ? g.attributes.uv.array : null;
    const c = new THREE.Color(color);
    for (let i = 0; i < p.length / 3; i++) {
      this.pos.push(p[i * 3], p[i * 3 + 1], p[i * 3 + 2]);
      this.nor.push(n[i * 3], n[i * 3 + 1], n[i * 3 + 2]);
      this.col.push(c.r, c.g, c.b);
      if (uvFn) { const q = uvFn(p[i * 3], p[i * 3 + 1], p[i * 3 + 2], n[i * 3], n[i * 3 + 1], n[i * 3 + 2]); this.uv.push(q[0], q[1]); }
      else if (uv) this.uv.push(uv[i * 2], uv[i * 2 + 1]); else this.uv.push(0, 0);
    }
    g.dispose();
  }
  box(w, h, d, x, y, z, color, ry = 0, uvFn) {
    const m = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z),
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), ry), new THREE.Vector3(1, 1, 1));
    this.add(new THREE.BoxGeometry(w, h, d), m, color, uvFn);
  }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    g.computeBoundingSphere();
    return g;
  }
  get count() { return this.pos.length / 3; }
}

// 把若干带变换的子部件合成一个可实例化的模板几何体（顶点色）
export function partsGeometry(parts) {
  const m = new Merger();
  for (const p of parts) {
    const mat = new THREE.Matrix4().compose(new THREE.Vector3(...(p.pos || [0, 0, 0])),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(...(p.rot || [0, 0, 0]))), new THREE.Vector3(...(p.scale || [1, 1, 1])));
    m.add(p.geo, mat, p.color ?? 0xffffff);
  }
  return m.geometry();
}

export function canvasTexture(w, h, draw, opts = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  draw(ctx, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (opts.repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  return t;
}
