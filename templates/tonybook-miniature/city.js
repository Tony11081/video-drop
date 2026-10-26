// 「TonyBook 微缩跨境城」固定布景：一块 320×600 的城市沙盘（单位：米，按 1:150 做成桌上模型）。
// 坐标：x 向东，z 向南，y 向上。相机默认朝北（-z）俯拍，画面上方 = 北 = 远处。
// 所有动态都只由时间 t 决定；随机数全部固定种子。
import * as THREE from './three.module.min.js';
import { rng, clamp, lerp, smooth, smoother, easeInOut, easeOut, easeIn, win, pulse, Merger, partsGeometry, canvasTexture } from './util.js';

export const BOARD = { x0: -160, x1: 160, z0: -300, z1: 300, thick: 12 };
export const RIVER = { z0: -140, z1: -100, water: -2.8, bed: -4.6 };
export const ROADS_EW = [
  { z: 60, w: 19, lanes: 4, main: true }, { z: -40, w: 8, lanes: 2 }, { z: 180, w: 8, lanes: 2 }, { z: -240, w: 8, lanes: 2 },
];
export const ROADS_NS = [
  { x: -55, w: 19, lanes: 4, main: true }, { x: -130, w: 8, lanes: 2 }, { x: 110, w: 8, lanes: 2 },
];
// 快线：经过 P0，方向 D（往西北）。s 为沿线距离，s 增大 = 往西北（远处）。
export const RAIL = { p0: new THREE.Vector3(60, 0, 100), d: new THREE.Vector3(-0.387, 0, -0.922).normalize(), track: 2.4 };
RAIL.n = new THREE.Vector3(-RAIL.d.z, 0, RAIL.d.x); // 水平法线（指向东北侧）
export const railPoint = (s, off = 0, y = 0) => new THREE.Vector3(
  RAIL.p0.x + RAIL.d.x * s + RAIL.n.x * off, y, RAIL.p0.z + RAIL.d.z * s + RAIL.n.z * off);
export const railS = (x, z) => (x - RAIL.p0.x) * RAIL.d.x + (z - RAIL.p0.z) * RAIL.d.z;
export const railOff = (x, z) => (x - RAIL.p0.x) * RAIL.n.x + (z - RAIL.p0.z) * RAIL.n.z;
export const RAIL_HEADING = Math.atan2(RAIL.d.x, -RAIL.d.z); // 相对正北的偏角（弧度）

const ZONE_A = { x: -55, z: 60 };        // 发货街区主路口
const STATION = { s0: -14, s1: 38, off: 8.6 };
const PARK = { x0: -28, x1: 150, z0: -230, z1: -147 };
const PORT = { x0: 12, x1: 64, z0: -98, z1: -50 };
const SITE = { x0: 70, x1: 104, z0: -96, z1: -50 };
const WAREHOUSE = { x0: -98, x1: -72, z0: 76, z1: 106 };

const C = {
  asphalt: 0x4a4d55, asphaltB: 0x555963, walk: 0xc9c3b6, curb: 0xe6e1d6, block: 0xaea692, grass: 0x7fb24a, grass2: 0x6aa23f,
  bike: 0x4f9e6e, white: 0xf4f1ea, yellow: 0xf2c230, ballast: 0x8d857a, sleeper: 0x5b4636, steel: 0xb8bec6,
  coral: 0xff6b4a, mint: 0x3ddc97, water: 0x2f8fa3, board: 0x3b2a1f, table: 0xb08457,
};
const BUILD_PALETTE = [0xf6d7a7, 0xf2a07b, 0x9fd3c7, 0xa7c5eb, 0xf7e3af, 0xe8a5b5, 0xc3e0a6, 0xf4f1ea, 0xd9c2f0, 0xffc56e, 0xb5d6f2, 0xe9e2d0, 0xf4f1ea, 0xff9f80];
const ROOF_COLORS = [0xc8643c, 0x3f8f8a, 0x8a9099, 0x6f9e5a, 0x4f7cb3, 0x9aa3ad, 0xb7b0a2, 0xd98b4a];
const CAR_COLORS = [0xf5f5f2, 0xf5f5f2, 0xe23b2e, 0x2d6cdf, 0xf2c230, 0x1f2328, 0xbfc5cc, 0x2aa198, 0xff8a3d, 0x8b5cf6, 0xf5f5f2, 0x9aa3ad];
const SHIRTS = [0xe23b2e, 0x2d6cdf, 0xf2c230, 0xffffff, 0x3ddc97, 0xff6b4a, 0x1f2328, 0x9b59b6, 0x58a6ff, 0xf28cb1, 0xe9e2d0, 0x2aa198];
const PANTS = [0x2b3240, 0x1f2328, 0x3d4a6b, 0x6b5b4a, 0x2d3e50, 0x8a8f98];
const SKIN = [0xf0c8a0, 0xe0b088, 0xd49c74, 0xf3d2b3];

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const Y = V3(0, 1, 0);

function inRect(x, z, r, pad = 0) { return x > r.x0 - pad && x < r.x1 + pad && z > r.z0 - pad && z < r.z1 + pad; }

// ———————————————————————————————————————— 纹理 ————————————————————————————————————————
function makeTextures() {
  const T = {};
  // 沥青颗粒（平铺）
  T.asphalt = canvasTexture(256, 256, (g, w, h) => {
    const r = rng(11); g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) { const v = 200 + r() * 55; g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2); }
    for (let i = 0; i < 18; i++) { g.strokeStyle = 'rgba(120,120,120,0.25)'; g.lineWidth = 1; g.beginPath(); let x = r() * w, y = r() * h; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (r() - 0.5) * 30; y += (r() - 0.5) * 30; g.lineTo(x, y); } g.stroke(); }
  }, { repeat: true });
  // 窗户：一个单元 = 一扇窗（宽 3.2m × 层高 3.4m）
  const win = (style) => canvasTexture(128, 128, (g, w, h) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    if (style === 0) { // 住宅：窗 + 窗台 + 空调外机
      g.fillStyle = '#3c5368'; g.fillRect(22, 26, 70, 62);
      g.fillStyle = '#7fa3bf'; g.fillRect(26, 30, 30, 26);
      g.fillStyle = '#5b7891'; g.fillRect(60, 30, 28, 54);
      g.fillStyle = '#d6d2c8'; g.fillRect(18, 88, 78, 6);
      g.fillStyle = '#e8e8e8'; g.fillRect(98, 64, 22, 20); g.fillStyle = '#9a9a9a'; g.fillRect(101, 68, 16, 12);
    } else if (style === 1) { // 办公：横向玻璃带
      g.fillStyle = '#2f4f6b'; g.fillRect(0, 22, w, 78);
      g.fillStyle = '#8fb6d4'; g.fillRect(0, 26, w, 18);
      g.fillStyle = '#6a8fae'; g.fillRect(0, 50, w, 40);
      g.fillStyle = '#cfd8df'; for (let x = 0; x < w; x += 32) g.fillRect(x, 22, 3, 78);
    } else { // 老楼：竖窗 + 阳台
      g.fillStyle = '#4a4036'; g.fillRect(30, 18, 52, 74);
      g.fillStyle = '#9fb7c9'; g.fillRect(34, 22, 20, 64); g.fillStyle = '#7c96aa'; g.fillRect(57, 22, 21, 64);
      g.fillStyle = '#c4b8a8'; g.fillRect(20, 92, 72, 10); g.fillStyle = '#8f8476'; for (let x = 22; x < 92; x += 7) g.fillRect(x, 80, 2, 12);
    }
    g.fillStyle = 'rgba(0,0,0,0.06)'; g.fillRect(0, h - 6, w, 6);
  }, { repeat: true });
  T.win = [win(0), win(1), win(2)];
  // 木纹桌面
  T.wood = canvasTexture(1024, 1024, (g, w, h) => {
    const r = rng(5); const grd = g.createLinearGradient(0, 0, w, 0); grd.addColorStop(0, '#a58a70'); grd.addColorStop(1, '#9a8068');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 160; i++) { const y = r() * h; g.strokeStyle = `rgba(${90 + r() * 40},${55 + r() * 25},${30},${0.12 + r() * 0.2})`; g.lineWidth = 1 + r() * 4; g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x * 0.01 + i) * 6 + (r() - 0.5) * 3); g.stroke(); }
    for (let k = 0; k < 4; k++) { const x0 = r() * w; g.fillStyle = 'rgba(255,255,255,0.0)'; g.fillRect(x0, 0, 2, h); g.fillStyle = 'rgba(60,35,20,0.35)'; g.fillRect(x0, 0, 2, h); }
  }, { repeat: true });
  return T;
}

function signTexture(lines, opts = {}) {
  const w = opts.w || 512, h = opts.h || 128;
  return canvasTexture(w, h, (g) => {
    g.fillStyle = opts.bg || '#1f2328'; g.fillRect(0, 0, w, h);
    if (opts.border) { g.strokeStyle = opts.border; g.lineWidth = h * 0.06; g.strokeRect(h * 0.05, h * 0.05, w - h * 0.1, h - h * 0.1); }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    const n = lines.length;
    lines.forEach((ln, i) => {
      g.fillStyle = ln.color || opts.fg || '#ffffff';
      g.font = `${ln.weight || 900} ${Math.round(h * (ln.size || 0.62))}px "Noto Sans CJK SC", sans-serif`;
      g.fillText(ln.text, w / 2, h * (n === 1 ? 0.53 : (0.3 + i * 0.42)));
    });
  });
}

// ———————————————————————————————————————— 实例化帮手 ————————————————————————————————————————
class Inst {
  constructor(scene, geo, mat, count, { shadow = true, receive = true, colors = false } = {}) {
    if (mat.vertexColors && !geo.attributes.color) geo.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(geo.attributes.position.count * 3).fill(1), 3));
    this.mesh = new THREE.InstancedMesh(geo, mat, Math.max(1, count));
    this.mesh.castShadow = shadow; this.mesh.receiveShadow = receive;
    this.mesh.frustumCulled = false;
    this.n = 0; this.cap = count;
    this.m = new THREE.Matrix4(); this.q = new THREE.Quaternion(); this.p = new THREE.Vector3(); this.s = new THREE.Vector3(1, 1, 1); this.e = new THREE.Euler();
    if (colors) this.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(count * 3).fill(1), 3);
    scene.add(this.mesh);
  }
  set(i, x, y, z, ry = 0, sx = 1, sy = 1, sz = 1, rx = 0, rz = 0) {
    this.p.set(x, y, z); this.e.set(rx, ry, rz, 'YXZ'); this.q.setFromEuler(this.e); this.s.set(sx, sy, sz);
    this.m.compose(this.p, this.q, this.s); this.mesh.setMatrixAt(i, this.m);
  }
  hide(i) { this.m.makeScale(0, 0, 0); this.mesh.setMatrixAt(i, this.m); }
  color(i, c) { const col = (c instanceof THREE.Color) ? c : new THREE.Color(c); this.mesh.setColorAt(i, col); }
  add() { if (this.n >= this.cap) return -1; return this.n++; }
  done() { this.mesh.count = this.n; this.mesh.instanceMatrix.needsUpdate = true; if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true; }
  dirty() { this.mesh.instanceMatrix.needsUpdate = true; if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true; }
}

// 路径关键点 [{t,x,z}] → 位置与朝向
function pathAt(path, t) {
  if (t <= path[0].t) return { x: path[0].x, z: path[0].z, h: path[0].h ?? headingOf(path, 0), moving: false, k: 0 };
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i], b = path[i + 1];
    if (t <= b.t) {
      const k = (t - a.t) / Math.max(1e-6, b.t - a.t);
      const dx = b.x - a.x, dz = b.z - a.z; const moving = Math.hypot(dx, dz) > 0.05;
      return { x: a.x + dx * k, z: a.z + dz * k, h: moving ? Math.atan2(dx, dz) : (a.h ?? headingOf(path, i)), moving, k: i, carry: a.carry };
    }
  }
  const l = path[path.length - 1];
  return { x: l.x, z: l.z, h: l.h ?? headingOf(path, path.length - 2), moving: false, k: path.length - 1, carry: l.carry };
}
function headingOf(path, i) {
  for (let j = Math.max(0, i); j < path.length - 1; j++) { const dx = path[j + 1].x - path[j].x, dz = path[j + 1].z - path[j].z; if (Math.hypot(dx, dz) > 0.05) return Math.atan2(dx, dz); }
  for (let j = Math.min(i, path.length - 1); j > 0; j--) { const dx = path[j].x - path[j - 1].x, dz = path[j].z - path[j - 1].z; if (Math.hypot(dx, dz) > 0.05) return Math.atan2(dx, dz); }
  return 0;
}

// ———————————————————————————————————————— 城市 ————————————————————————————————————————
export class City {
  constructor(scene, cue) {
    this.scene = scene; this.cue = cue; this.ev = cue.events; this.dyn = [];
    this.T = makeTextures();
    this.rnd = rng(cue.seed || 2026);
    this.mats();
    this.buildGround();
    this.buildRail();
    this.buildBuildings();
    this.buildStreetFurniture();
    this.buildTrees();
    this.buildZoneA();
    this.buildPort();
    this.buildSite();
    this.buildPark();
    this.buildStation();
    this.buildTraffic();
    this.buildPeople();
    this.buildBirds();
    this.buildTrain();
    this.buildRoom();
    this.buildTitle();
  }

  mats() {
    // Phong：在 CPU 渲染上比 PBR 快得多；塑料/漆面高光靠 shininess
    const ph = (o) => new THREE.MeshPhongMaterial(Object.assign({ vertexColors: true, shininess: 30, specular: 0x222222 }, o));
    this.M = {
      ground: ph({ shininess: 4, specular: 0x050505 }),
      road: ph({ shininess: 6, specular: 0x080808, map: this.T.asphalt }),
      paint: ph({ shininess: 12, specular: 0x111111 }),
      plastic: ph({ shininess: 60, specular: 0x3a3a3a }),
      gloss: ph({ shininess: 110, specular: 0x6a6a6a }),
      matte: ph({ shininess: 8, specular: 0x0a0a0a }),
      walls: this.T.win.map((tx) => ph({ shininess: 28, specular: 0x1c1c1c, map: tx })),
      water: new THREE.MeshStandardMaterial({ color: 0x1f6f86, roughness: 0.12, metalness: 0.0, envMapIntensity: 0.55 }),
      glow: new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }),
      glowI: new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }),
      steel: ph({ color: 0xc9ced4, shininess: 90, specular: 0x8a8a8a, vertexColors: true }),
      wood: new THREE.MeshPhongMaterial({ map: this.T.wood, shininess: 40, specular: 0x2a2a2a }),
    };
    this.envMats = [this.M.water];
  }

  // 统一入口：把合并好的几何体加进场景
  addMerged(merger, mat, { shadow = true, receive = true } = {}) {
    if (!merger.count) return null;
    const mesh = new THREE.Mesh(merger.geometry(), mat); mesh.castShadow = shadow; mesh.receiveShadow = receive; mesh.frustumCulled = false;
    // 先画遮挡物、最后画地面，让被挡住的地面像素在深度测试里提前丢掉
    mesh.renderOrder = mat === this.M.ground ? 3 : mat === this.M.road ? 2 : mat === this.M.paint ? 1 : 0;
    this.scene.add(mesh); return mesh;
  }

  // —— 地面、道路、河道 ——
  buildGround() {
    const B = BOARD, R = RIVER;
    const g = new Merger(), roads = new Merger(), paint = new Merger();
    const worldUV = (x, y, z) => [x / 9, z / 9];
    // 底座与地块
    g.box(B.x1 - B.x0, B.thick - 4.6, B.z1 - B.z0, 0, -B.thick + (B.thick - 4.6) / 2, 0, C.board);
    g.box(B.x1 - B.x0, 4.6, R.z0 - B.z0, 0, -2.3, (B.z0 + R.z0) / 2, 0x6e6252);
    g.box(B.x1 - B.x0, 4.6, B.z1 - R.z1, 0, -2.3, (R.z1 + B.z1) / 2, 0x6e6252);
    // 地块顶面（浅色铺装）
    g.box(B.x1 - B.x0, 0.02, R.z0 - B.z0, 0, 0.0, (B.z0 + R.z0) / 2, C.block);
    g.box(B.x1 - B.x0, 0.02, B.z1 - R.z1, 0, 0.0, (R.z1 + B.z1) / 2, C.block);
    // 河床、驳岸
    g.box(B.x1 - B.x0, 0.2, R.z1 - R.z0, 0, R.bed, (R.z0 + R.z1) / 2, 0x3c5a52);
    g.box(B.x1 - B.x0, 0.9, 1.2, 0, 0.35, R.z0 - 0.6, 0xd8d2c4); g.box(B.x1 - B.x0, 0.9, 1.2, 0, 0.35, R.z1 + 0.6, 0xd8d2c4);
    this.addMerged(g, this.M.ground, { shadow: false });
    // 水面（单独材质，略有光泽）
    const water = new THREE.Mesh(new THREE.BoxGeometry(B.x1 - B.x0, R.water - R.bed, R.z1 - R.z0), this.M.water);
    water.position.set(0, (R.water + R.bed) / 2, (R.z0 + R.z1) / 2); water.receiveShadow = true; this.scene.add(water); this.water = water;

    // 道路：东西向整条（含路口），南北向在路口和河道处断开
    const ewSpans = ROADS_EW.map((r) => [r.z - r.w / 2 - (r.main ? 4.5 : 3.5), r.z + r.w / 2 + (r.main ? 4.5 : 3.5)]);
    for (const r of ROADS_EW) {
      const side = r.main ? 4.5 : 3.5;
      const segs = [[B.x0, B.x1]];
      for (const [z0, z1] of [[r.z - r.w / 2, r.z + r.w / 2]]) {
        roads.box(B.x1 - B.x0, 0.03, r.w, 0, 0.03, r.z, r.main ? C.asphalt : C.asphaltB, 0, worldUV);
      }
      // 人行道（在南北路口处断开为路口）
      const cuts = ROADS_NS.map((n) => [n.x - n.w / 2, n.x + n.w / 2]).sort((a, b) => a[0] - b[0]);
      let x = B.x0;
      const walkSegs = [];
      for (const [a, b] of cuts) { walkSegs.push([x, a]); x = b; } walkSegs.push([x, B.x1]);
      for (const [a, b] of walkSegs) {
        if (b - a < 0.5) continue;
        for (const sgn of [-1, 1]) {
          const zc = r.z + sgn * (r.w / 2 + side / 2);
          if (zc > RIVER.z0 - 1 && zc < RIVER.z1 + 1) continue;
          roads.box(b - a, 0.1, side, (a + b) / 2, 0.06, zc, C.walk);
          paint.box(b - a, 0.12, 0.35, (a + b) / 2, 0.07, r.z + sgn * (r.w / 2 + 0.18), C.curb);
        }
      }
      this.laneMarks(paint, r, 'x', B.x0, B.x1, cuts);
    }
    for (const r of ROADS_NS) {
      const side = r.main ? 4.5 : 3.5;
      // 断开点：东西路、河道
      const cuts = ROADS_EW.map((e) => [e.z - e.w / 2, e.z + e.w / 2]).concat([[RIVER.z0 - 1.2, RIVER.z1 + 1.2]]).sort((a, b) => a[0] - b[0]);
      let z = B.z0; const segs = [];
      for (const [a, b] of cuts) { segs.push([z, a]); z = b; } segs.push([z, B.z1]);
      for (const [a, b] of segs) {
        if (b - a < 0.5) continue;
        roads.box(r.w, 0.03, b - a, r.x, 0.031, (a + b) / 2, r.main ? C.asphalt : C.asphaltB, 0, worldUV);
      }
      // 人行道：在东西路（含其人行道）处断开
      const wc = ewSpans.concat([[RIVER.z0 - 1.2, RIVER.z1 + 1.2]]).sort((a, b) => a[0] - b[0]);
      z = B.z0; const ws = [];
      for (const [a, b] of wc) { ws.push([z, a]); z = b; } ws.push([z, B.z1]);
      for (const [a, b] of ws) {
        if (b - a < 0.5) continue;
        for (const sgn of [-1, 1]) {
          roads.box(side, 0.1, b - a, r.x + sgn * (r.w / 2 + side / 2), 0.06, (a + b) / 2, C.walk);
          paint.box(0.35, 0.12, b - a, r.x + sgn * (r.w / 2 + 0.18), 0.07, (a + b) / 2, C.curb);
        }
      }
      // 路口转角补齐人行道
      for (const e of ROADS_EW) {
        const es = e.main ? 4.5 : 3.5;
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
          const cx = r.x + sx * (r.w / 2 + side / 2), cz = e.z + sz * (e.w / 2 + es / 2);
          roads.box(side, 0.1, es, cx, 0.061, cz, C.walk);
        }
      }
      // 桥面
      roads.box(r.w + side * 2, 0.8, RIVER.z1 - RIVER.z0 + 2.4, r.x, -0.37, (RIVER.z0 + RIVER.z1) / 2, 0xbdb6a8);
      roads.box(r.w, 0.03, RIVER.z1 - RIVER.z0 + 2.4, r.x, 0.06, (RIVER.z0 + RIVER.z1) / 2, C.asphalt, 0, worldUV);
      for (const sgn of [-1, 1]) {
        roads.box(side, 0.1, RIVER.z1 - RIVER.z0 + 2.4, r.x + sgn * (r.w / 2 + side / 2), 0.08, (RIVER.z0 + RIVER.z1) / 2, C.walk);
        paint.box(0.3, 1.1, RIVER.z1 - RIVER.z0 + 2.4, r.x + sgn * (r.w / 2 + side - 0.2), 0.6, (RIVER.z0 + RIVER.z1) / 2, 0xe8e4da);
      }
      for (const zc of [RIVER.z0 + 13, RIVER.z1 - 13]) roads.box(r.w * 0.5, 4, 3, r.x, -2.6, zc, 0xa79f90);
      this.laneMarks(paint, r, 'z', B.z0, B.z1, cuts);
    }
    // 斑马线与停止线：每个路口四边
    for (const e of ROADS_EW) for (const n of ROADS_NS) this.crosswalks(paint, n, e);
    const roadMesh = this.addMerged(roads, this.M.road, { shadow: false });
    const paintMesh = this.addMerged(paint, this.M.paint, { shadow: false });
  }

  laneMarks(m, r, axis, a0, a1, cuts) {
    const along = (from, to, off, color, dash = 0, w = 0.15) => {
      if (axis === 'x') {
        if (dash) { for (let x = from; x < to - dash; x += dash * 2.2) m.box(dash, 0.04, w, x + dash / 2, 0.05, r.z + off, color); }
        else m.box(to - from, 0.04, w, (from + to) / 2, 0.05, r.z + off, color);
      } else {
        if (dash) { for (let z = from; z < to - dash; z += dash * 2.2) m.box(w, 0.04, dash, r.x + off, 0.05, z + dash / 2, color); }
        else m.box(w, 0.04, to - from, r.x + off, 0.05, (from + to) / 2, color);
      }
    };
    // 分段（避开路口），每段留出斑马线空间
    let p = a0; const segs = [];
    for (const [a, b] of cuts) { segs.push([p, a - 6]); p = b + 6; } segs.push([p, a1]);
    for (const [s0, s1] of segs) {
      if (s1 - s0 < 2) continue;
      if (r.main) {
        along(s0, s1, -0.2, C.yellow); along(s0, s1, 0.2, C.yellow);
        along(s0, s1, -3.6, C.white, 3); along(s0, s1, 3.6, C.white, 3);
        along(s0, s1, -7.2, C.white, 0, 0.18); along(s0, s1, 7.2, C.white, 0, 0.18);
        // 非机动车道（绿色）
        if (axis === 'x') { for (const sg of [-1, 1]) m.box(s1 - s0, 0.035, 2.0, (s0 + s1) / 2, 0.045, r.z + sg * 8.3, C.bike); }
        else { for (const sg of [-1, 1]) m.box(2.0, 0.035, s1 - s0, r.x + sg * 8.3, 0.045, (s0 + s1) / 2, C.bike); }
      } else {
        along(s0, s1, 0, C.yellow, 0, 0.18);
      }
    }
  }

  crosswalks(m, n, e) {
    // 东西路 e 上、南北路 n 两侧的斑马线（行人沿 z 过马路），以及南北路上的
    const zebraEW = (xc) => { // 横跨东西路，条纹沿 x 排列
      for (let z = e.z - e.w / 2 + 0.6; z < e.z + e.w / 2 - 0.5; z += 1.1) m.box(4.2, 0.04, 0.6, xc, 0.052, z + 0.3, C.white, 0);
    };
    const zebraNS = (zc) => {
      for (let x = n.x - n.w / 2 + 0.6; x < n.x + n.w / 2 - 0.5; x += 1.1) m.box(0.6, 0.04, 4.2, x + 0.3, 0.052, zc, C.white, 0);
    };
    // 斑马线只画在路口外沿
    const ox = n.w / 2 + 3, oz = e.w / 2 + 3;
    // 东西路两侧 → 沿南北方向
    // 东西向斑马线条纹（行人沿 z 走）：横跨东西路，位于路口东西两侧
    for (const sx of [-1, 1]) {
      const xc = n.x + sx * ox;
      for (let k = 0; k * 1.1 < e.w - 1; k++) m.box(4.2, 0.04, 0.6, xc, 0.052, e.z - e.w / 2 + 0.8 + k * 1.1, C.white);
      // 停止线（东西向车流）
      m.box(0.45, 0.04, e.w / 2 - 0.6, n.x + sx * (ox + 3.2), 0.053, e.z + sx * (e.w / 4 + 0.1), C.white);
    }
    for (const sz of [-1, 1]) {
      const zc = e.z + sz * oz;
      for (let k = 0; k * 1.1 < n.w - 1; k++) m.box(0.6, 0.04, 4.2, n.x - n.w / 2 + 0.8 + k * 1.1, 0.052, zc, C.white);
      m.box(n.w / 2 - 0.6, 0.04, 0.45, n.x - sz * (n.w / 4 + 0.1), 0.053, e.z + sz * (oz + 3.2), C.white);
    }
  }

  // —— 快线：道床、轨枕、钢轨、接触网、河上桥墩、道口 ——
  buildRail() {
    const m = new Merger(), steel = new Merger(), dark = new Merger();
    const sMin = -260, sMax = 400;
    const inBoard = (p) => p.x > BOARD.x0 + 0.5 && p.x < BOARD.x1 - 0.5 && p.z > BOARD.z0 + 0.5 && p.z < BOARD.z1 - 0.5;
    const ry = Math.atan2(RAIL.d.x, RAIL.d.z);
    const bridge = (s) => { const p = railPoint(s); return p.z > RIVER.z0 - 2 && p.z < RIVER.z1 + 2; };
    const onRoad = (p) => ROADS_EW.some((e) => Math.abs(p.z - e.z) < e.w / 2) || ROADS_NS.some((n) => Math.abs(p.x - n.x) < n.w / 2);
    const step = 2.0;
    for (let s = sMin; s < sMax; s += step) {
      const p = railPoint(s + step / 2);
      if (!inBoard(p)) continue;
      const br = bridge(s + step / 2);
      if (br) { m.box(13, 1.6, step + 0.02, p.x, -0.4, p.z, 0xcfc8bb, ry); }
      else if (onRoad(p)) { m.box(11.5, 0.12, step + 0.02, p.x, 0.07, p.z, 0x9a958b, ry); }
      else { m.box(11, 0.5, step + 0.02, p.x, 0.25, p.z, C.ballast, ry); m.box(13.5, 0.06, step + 0.02, p.x, 0.03, p.z, 0x9c8f7c, ry); }
    }
    // 桥墩与护栏
    for (const s of [this.sAtZ(RIVER.z0 + 12), this.sAtZ(RIVER.z1 - 12)]) {
      const p = railPoint(s); m.box(9, 4.2, 3.2, p.x, -2.6, p.z, 0xb3ab9c, ry); m.box(10.5, 0.6, 4, p.x, -1.0, p.z, 0xc4bcae, ry);
    }
    // 轨枕（实例）
    const sleeperPos = [];
    for (let s = sMin; s < sMax; s += 0.75) { const p = railPoint(s); if (inBoard(p)) sleeperPos.push(s); }
    const sleepers = new Inst(this.scene, new THREE.BoxGeometry(2.6, 0.16, 0.26), new THREE.MeshPhongMaterial({ color: C.sleeper, shininess: 8 }), sleeperPos.length * 2, { shadow: false });
    for (const s of sleeperPos) for (const tr of [-1, 1]) {
      const p = railPoint(s, tr * RAIL.track); const y = bridge(s) ? 0.48 : (onRoad(p) ? 0.15 : 0.56);
      const i = sleepers.add(); sleepers.set(i, p.x, y, p.z, ry);
    }
    sleepers.done();
    // 钢轨（沿线分段）
    for (let s = sMin; s < sMax; s += 6) {
      const p0 = railPoint(s + 3);
      if (!inBoard(p0)) continue;
      const y = bridge(s + 3) ? 0.62 : (onRoad(p0) ? 0.2 : 0.7);
      for (const tr of [-1, 1]) for (const g of [-0.72, 0.72]) {
        const p = railPoint(s + 3, tr * RAIL.track + g); steel.box(0.12, 0.16, 6.02, p.x, y, p.z, C.steel, ry);
      }
    }
    this.addMerged(m, this.M.matte, { shadow: true });
    this.addMerged(steel, this.M.steel, { shadow: false });
    // 接触网：立柱 + 横臂 + 吊线（每 30 米）
    const poles = new Merger(); this.catenary = [];
    for (let s = -250; s < 400; s += 30) {
      const pz = railPoint(s, 0); if (!inBoard(pz)) continue;
      if (onRoad(railPoint(s, -7.2))) continue;
      const p = railPoint(s, -7.2); poles.box(0.45, 8.6, 0.45, p.x, 4.3, p.z, 0x8e9aa6, ry);
      const a = railPoint(s, -1.4); poles.box(11.8, 0.22, 0.22, a.x, 8.2, a.z, 0x8e9aa6, ry + Math.PI / 2);
      this.catenary.push(s);
    }
    this.addMerged(poles, this.M.steel, { shadow: true });
    // 接触线（两条，随时间微颤）
    this.wires = [];
    const wireMat = new THREE.MeshPhongMaterial({ color: 0x3a3f46, shininess: 54 });
    for (const tr of [-1, 1]) {
      const pts = []; for (let s = -250; s < 400; s += 5) { const p = railPoint(s, tr * RAIL.track); if (inBoard(p)) pts.push(s); }
      const geo = new THREE.BoxGeometry(0.09, 0.09, 1, 1, 1, 1);
      const inst = new Inst(this.scene, geo, wireMat, pts.length, { shadow: true, receive: false });
      this.wires.push({ inst, pts, tr, y: 7.4 });
    }
    // 道口：栏杆、闪灯、警示牌
    this.crossings = [];
    const crossRoads = [];
    for (const e of ROADS_EW) { const s = this.sAtZ(e.z); const p = railPoint(s); if (inBoard(p)) crossRoads.push({ s, axis: 'x', road: e }); }
    for (const n of ROADS_NS) { const s = (n.x - RAIL.p0.x) / RAIL.d.x; const p = railPoint(s); if (inBoard(p) && Math.abs(p.z) < 299) crossRoads.push({ s, axis: 'z', road: n }); }
    const armGeo = partsGeometry([
      { geo: new THREE.BoxGeometry(0.22, 0.22, 1), pos: [0, 0, 0.5], color: 0xffffff },
    ]);
    const arms = new Inst(this.scene, armGeo, this.M.plastic, 16, { colors: true });
    const stripes = new Inst(this.scene, new THREE.BoxGeometry(0.24, 0.24, 0.6), this.M.plastic, 16 * 4, { colors: true });
    const lamps = new Inst(this.scene, new THREE.SphereGeometry(0.28, 10, 8), this.M.glowI, 32, { shadow: false, colors: true });
    const posts = new Merger();
    for (const c of crossRoads) {
      // 栏杆在铁路两侧（沿线 ±9）、马路两半各一根
      const w = c.road.w;
      for (const side of [-1, 1]) {
        const base = railPoint(c.s + side * 0.0, side * 9.5);
        // 立柱放在路边
        const along = c.axis === 'x' ? V3(1, 0, 0) : V3(0, 0, 1);
        // 道口中心 = 铁路与道路中线交点
        const ctr = railPoint(c.s);
        const offRail = c.axis === 'x' ? V3(side * 9.5 / Math.abs(RAIL.d.x || 1e-3) * 0 + side * 10, 0, 0) : V3(0, 0, side * 10);
        const postPos = c.axis === 'x'
          ? V3(ctr.x + side * 10, 0, c.road.z + side * (w / 2 + 1.0))
          : V3(c.road.x - side * (w / 2 + 1.0), 0, ctr.z + side * 10);
        posts.box(0.5, 3.4, 0.5, postPos.x, 1.7, postPos.z, 0xf2f2f2);
        posts.box(1.2, 0.5, 1.2, postPos.x, 0.25, postPos.z, 0x333333);
        posts.box(1.6, 0.6, 0.3, postPos.x, 3.0, postPos.z, 0x1f2328, c.axis === 'x' ? 0 : Math.PI / 2);
        const ai = arms.add(); const li = [lamps.add(), lamps.add()];
        const si = [stripes.add(), stripes.add(), stripes.add(), stripes.add()];
        this.crossings.push({ c, side, postPos, ai, li, si, w, armLen: w / 2 + 0.4 });
      }
    }
    this.addMerged(posts, this.M.plastic);
    this.crossArms = arms; this.crossStripes = stripes; this.crossLamps = lamps;
    this.dyn.push((t) => this.updateCrossings(t));
    this.dyn.push((t, env) => this.updateWires(t, env));
  }

  sAtZ(z) { return (z - RAIL.p0.z) / RAIL.d.z; }

  gateState(t) { // 0 = 抬起，1 = 落下
    const E = this.ev;
    return smoother(win(t, E.gateDown, E.gateDown + 0.8)) * (1 - smoother(win(t, E.gateUp, E.gateUp + 0.9)));
  }
  crossingFlash(t) { const E = this.ev; return (t > E.gateDown - 0.3 && t < E.gateUp + 0.6); }

  updateCrossings(t) {
    const g = this.gateState(t), flash = this.crossingFlash(t);
    const beat = 60 / (this.cue.bpm || 120);
    const ph = Math.floor((t - this.ev.gateDown) / beat) % 2;
    for (const k of this.crossings) {
      const { c, side, postPos, ai, li, si, armLen } = k;
      const ang = (1 - g) * (Math.PI / 2 - 0.05); // 竖起 → 放平
      // 臂朝向：横跨道路的半边
      let ry, dirx, dirz;
      if (c.axis === 'x') { ry = side > 0 ? Math.PI : 0; dirx = 0; dirz = -side; }
      else { ry = side > 0 ? Math.PI / 2 : -Math.PI / 2; dirx = side; dirz = 0; }
      const len = armLen;
      this.crossArms.set(ai, postPos.x, 1.6, postPos.z, ry, 1, 1, len, -ang);
      this.crossArms.color(ai, 0xffffff);
      for (let j = 0; j < 4; j++) {
        const d = (j + 0.5) / 4 * len;
        const px = postPos.x + dirx * d * Math.cos(ang), pz = postPos.z + dirz * d * Math.cos(ang), py = 1.6 + d * Math.sin(ang);
        this.crossStripes.set(si[j], px, py, pz, ry, 1.01, 1.01, 1, -ang);
        this.crossStripes.color(si[j], j % 2 ? 0xffffff : 0xe23b2e);
      }
      for (let j = 0; j < 2; j++) {
        const on = flash && ((ph + j) % 2 === 0);
        const off = (j ? 0.45 : -0.45);
        const lx = postPos.x + (c.axis === 'x' ? off : 0), lz = postPos.z + (c.axis === 'z' ? off : 0);
        this.crossLamps.set(li[j], lx, 3.0, lz + (c.axis === 'x' ? side * 0.2 : 0), 0);
        this.crossLamps.color(li[j], on ? new THREE.Color(6, 0.5, 0.3) : new THREE.Color(0.25, 0.05, 0.05));
      }
    }
    this.crossArms.dirty(); this.crossStripes.dirty(); this.crossLamps.dirty();
  }

  updateWires(t, env) {
    const E = this.ev;
    for (const w of this.wires) {
      const n = w.pts.length;
      for (let i = 0; i < n; i++) {
        const s = w.pts[i];
        // 跨中下垂 + 蓄势时微颤 + 列车经过时振动
        const span = ((s % 30) + 30) % 30 / 30;
        const sag = 0.35 * Math.sin(Math.PI * span);
        const trem = 0.06 * pulse(t, E.buildup, E.buildup + 0.4, E.trainIn + 2.5, E.trainIn + 4) * Math.sin(t * 38 + s * 0.4);
        const trainNear = env.trainNear ? env.trainNear(s) : 0;
        const vib = 0.18 * trainNear * Math.sin(t * 55 + s * 0.9);
        const p = railPoint(s + 2.5, w.tr * RAIL.track);
        w.inst.set(i, p.x, w.y - sag + trem + vib, p.z, Math.atan2(RAIL.d.x, RAIL.d.z), 1, 1, 5.02);
      }
      w.inst.n = n; w.inst.done();
    }
  }

  // —— 建筑 ——
  buildBuildings() {
    const r = rng(77);
    const walls = [new Merger(), new Merger(), new Merger()], roofs = new Merger(), shops = new Merger();
    this.roofSpots = [];
    const blocked = (x, z, pad) => {
      if (z > RIVER.z0 - 6 - pad && z < RIVER.z1 + 6 + pad) return true;
      const so = Math.abs(railOff(x, z)), ss = railS(x, z);
      if (so < 13 + pad) return true;
      if (ss > STATION.s0 - 10 && ss < STATION.s1 + 10 && so < 20 + pad) return true;
      for (const rr of [PARK, PORT, SITE, WAREHOUSE]) if (inRect(x, z, rr, pad + 3)) return true;
      // 主路口东南角的早餐摊小广场、公交站
      if (inRect(x, z, { x0: -44, x1: -20, z0: 68, z1: 92 }, pad)) return true;
      if (Math.abs(x) > BOARD.x1 - 3 || Math.abs(z) > BOARD.z1 - 3) return true;
      return false;
    };
    // 街区网格
    const xs = [BOARD.x0, ...ROADS_NS.map((n) => n.x).sort((a, b) => a - b), BOARD.x1];
    const zs = [BOARD.z0, ...ROADS_EW.map((e) => e.z), RIVER.z0, RIVER.z1].sort((a, b) => a - b); zs.push(BOARD.z1);
    const halfW = (axis, v) => {
      if (axis === 'x') { const n = ROADS_NS.find((q) => q.x === v); return n ? n.w / 2 + (n.main ? 4.5 : 3.5) : 0; }
      const e = ROADS_EW.find((q) => q.z === v); if (e) return e.w / 2 + (e.main ? 4.5 : 3.5); if (v === RIVER.z0 || v === RIVER.z1) return 2; return 0;
    };
    const addBuilding = (cx, cz, w, d, h, ry, style, color) => {
      const uvWall = (x, y, z, nx, ny, nz) => {
        if (Math.abs(ny) > 0.5) return [0.02, 0.02];
        // 局部坐标：沿墙距离
        const along = Math.abs(nx) > 0.5 ? (z * Math.cos(ry) + x * Math.sin(ry)) : (x * Math.cos(ry) - z * Math.sin(ry));
        return [along / 3.2, (y - 0.2) / 3.4];
      };
      walls[style].box(w, h, d, cx, h / 2 + 0.1, cz, color, ry, uvWall);
      // 屋顶面：略深色压顶
      roofs.box(w + 0.5, 0.5, d + 0.5, cx, h + 0.35, cz, 0xd9d4c8, ry);
      roofs.box(w - 1.0, 0.1, d - 1.0, cx, h + 0.62, cz, ROOF_COLORS[Math.floor(r() * ROOF_COLORS.length)], ry);
      this.roofSpots.push({ x: cx, z: cz, w, d, h, ry });
    };
    for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < zs.length - 1; j++) {
      const x0 = xs[i] + halfW('x', xs[i]) + 0.8, x1 = xs[i + 1] - halfW('x', xs[i + 1]) - 0.8;
      const z0 = zs[j] + halfW('z', zs[j]) + 0.8, z1 = zs[j + 1] - halfW('z', zs[j + 1]) - 0.8;
      if (x1 - x0 < 8 || z1 - z0 < 8) continue;
      if (z0 >= RIVER.z0 - 1 && z1 <= RIVER.z1 + 1) continue;
      // 沿四边排楼，留出中庭
      const edges = [
        { ax: 'x', a: x0, b: x1, fixed: z0, inward: 1 }, { ax: 'x', a: x0, b: x1, fixed: z1, inward: -1 },
        { ax: 'z', a: z0 + 14, b: z1 - 14, fixed: x0, inward: 1 }, { ax: 'z', a: z0 + 14, b: z1 - 14, fixed: x1, inward: -1 },
      ];
      for (const ed of edges) {
        let p = ed.a;
        while (p < ed.b - 6) {
          const w = Math.min(ed.b - p, 8 + r() * 9);
          const d = 9 + r() * 6;
          const cx = ed.ax === 'x' ? p + w / 2 : ed.fixed + ed.inward * d / 2;
          const cz = ed.ax === 'x' ? ed.fixed + ed.inward * d / 2 : p + w / 2;
          const bw = ed.ax === 'x' ? w - 0.6 : d, bd = ed.ax === 'x' ? d : w - 0.6;
          p += w;
          if (blocked(cx, cz, Math.max(bw, bd) / 2 - 2)) continue;
          // 高度：北远处高、靠铁路低、主路口附近中等
          const far = clamp((-cz + 100) / 350);
          const nearRail = clamp(1 - (Math.abs(railOff(cx, cz)) - 13) / 40);
          let h = 6 + r() * 14 + far * 30 * r() + (r() < 0.08 ? 25 + far * 40 : 0);
          h *= 1 - 0.55 * nearRail;
          if (Math.hypot(cx - ZONE_A.x, cz - ZONE_A.z) < 45) h = Math.min(h, 18);
          if (cz > 120) h = Math.min(h, 22); // 前景（靠镜头）矮一些，避免挡住焦带
          h = Math.max(5, Math.round(h / 3.4) * 3.4 + 0.6);
          const style = h > 30 ? 1 : (r() < 0.45 ? 2 : 0);
          addBuilding(cx, cz, bw, bd, h, 0, style, BUILD_PALETTE[Math.floor(r() * BUILD_PALETTE.length)]);
          // 底层商铺：雨棚
          if (r() < 0.65) {
            const aw = [0xe23b2e, 0x2d6cdf, 0xf2c230, 0x3ddc97, 0xff6b4a, 0xffffff][Math.floor(r() * 6)];
            if (ed.ax === 'x') shops.box(bw * 0.86, 0.25, 1.4, cx, 3.2, ed.fixed - ed.inward * 0.4, aw);
            else shops.box(1.4, 0.25, bd * 0.86, ed.fixed - ed.inward * 0.4, 3.2, cz, aw);
          }
        }
      }
    }
    // 街区内部：按格子填楼、停车场或小绿地（尺度线索：大量重复的小车和树）
    const lots = new Merger(); this.extraTrees = []; const parked = [];
    for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < zs.length - 1; j++) {
      const x0 = xs[i] + halfW('x', xs[i]) + 17, x1 = xs[i + 1] - halfW('x', xs[i + 1]) - 17;
      const z0 = zs[j] + halfW('z', zs[j]) + 17, z1 = zs[j + 1] - halfW('z', zs[j + 1]) - 17;
      if (x1 - x0 < 10 || z1 - z0 < 10) continue;
      const nx = Math.max(1, Math.round((x1 - x0) / 22)), nz = Math.max(1, Math.round((z1 - z0) / 22));
      const cw = (x1 - x0) / nx, cd = (z1 - z0) / nz;
      for (let a = 0; a < nx; a++) for (let b = 0; b < nz; b++) {
        const cx = x0 + (a + 0.5) * cw, cz = z0 + (b + 0.5) * cd;
        if (blocked(cx, cz, Math.max(cw, cd) / 2 - 4)) continue;
        const pick = r();
        if (pick < 0.42) {
          let h = 8 + r() * 16 + clamp((-cz + 100) / 350) * 26 * r();
          if (cz > 120) h = Math.min(h, 20);
          if (Math.hypot(cx - ZONE_A.x, cz - ZONE_A.z) < 50) h = Math.min(h, 16);
          h = Math.max(5, Math.round(h / 3.4) * 3.4 + 0.6);
          addBuilding(cx, cz, cw - 3, cd - 3, h, 0, r() < 0.5 ? 0 : 2, BUILD_PALETTE[Math.floor(r() * BUILD_PALETTE.length)]);
        } else if (pick < 0.72) {
          lots.box(cw - 2, 0.04, cd - 2, cx, 0.03, cz, 0x5a5e66);
          const rows = Math.max(1, Math.floor((cd - 4) / 6.5));
          for (let rw = 0; rw < rows; rw++) {
            const zr = cz - (cd - 4) / 2 + 3.2 + rw * 6.5;
            for (let x = cx - (cw - 4) / 2 + 1.3; x < cx + (cw - 4) / 2 - 1; x += 2.7) {
              lots.box(0.12, 0.05, 5.0, x - 1.35, 0.055, zr, 0xeeeeee);
              if (r() < 0.78) parked.push({ x, z: zr, ry: rw % 2 ? 0 : Math.PI, c: CAR_COLORS[Math.floor(r() * CAR_COLORS.length)] });
            }
          }
        } else {
          lots.box(cw - 2, 0.05, cd - 2, cx, 0.035, cz, r() < 0.5 ? C.grass : C.grass2);
          lots.box(cw * 0.2, 0.06, cd - 2, cx, 0.04, cz, 0xd9cdb6);
          for (let k = 0; k < 5; k++) this.extraTrees.push({ x: cx + (r() - 0.5) * (cw - 6), z: cz + (r() - 0.5) * (cd - 6), s: 0.8 + r() * 0.5 });
        }
      }
    }
    this.addMerged(lots, this.M.ground, { shadow: false });
    const pg = partsGeometry([
      { geo: new THREE.BoxGeometry(1.85, 0.72, 4.5), pos: [0, 0.74, 0], color: 0xffffff },
      { geo: new THREE.BoxGeometry(1.6, 0.6, 2.3), pos: [0, 1.38, -0.2], color: 0xffffff },
      { geo: new THREE.BoxGeometry(1.64, 0.4, 2.1), pos: [0, 1.38, -0.2], color: 0x20303f },
      { geo: new THREE.BoxGeometry(1.9, 0.5, 0.75), pos: [0, 0.38, 1.4], color: 0x15171a }, { geo: new THREE.BoxGeometry(1.9, 0.5, 0.75), pos: [0, 0.38, -1.4], color: 0x15171a },
    ]);
    const pc = new Inst(this.scene, pg, this.M.gloss, parked.length + 1, { colors: true });
    for (const q of parked) { const i = pc.add(); pc.set(i, q.x, 0.05, q.z, q.ry); pc.color(i, q.c); }
    pc.done();
    walls.forEach((w, i) => this.addMerged(w, this.M.walls[i]));
    this.addMerged(roofs, this.M.matte);
    this.addMerged(shops, this.M.plastic);
    // 屋顶设备：空调外机、水箱、楼梯间、太阳能板
    const ac = new Inst(this.scene, new THREE.BoxGeometry(1.3, 0.9, 0.9), this.M.plastic, 3000, { colors: true });
    const tank = new Inst(this.scene, new THREE.CylinderGeometry(0.9, 0.9, 1.8, 12), this.M.plastic, 600, { colors: true });
    const stair = new Inst(this.scene, new THREE.BoxGeometry(3, 2.6, 3.4), this.M.matte, 600, { colors: true });
    const solar = new Inst(this.scene, new THREE.BoxGeometry(3.2, 0.12, 1.8), this.M.gloss, 1200, { colors: true });
    for (const b of this.roofSpots) {
      const top = b.h + 0.67;
      const n = Math.floor(2 + r() * Math.min(10, b.w * b.d / 25));
      for (let k = 0; k < n; k++) { const i = ac.add(); if (i < 0) break; ac.set(i, b.x + (r() - 0.5) * (b.w - 2.5), top + 0.45, b.z + (r() - 0.5) * (b.d - 2.5), Math.round(r()) * Math.PI / 2); ac.color(i, r() < 0.7 ? 0xeeeeee : 0xcfd4d9); }
      if (r() < 0.5) { const i = tank.add(); if (i >= 0) { tank.set(i, b.x + (r() - 0.5) * (b.w - 3), top + 1.2, b.z + (r() - 0.5) * (b.d - 3)); tank.color(i, [0x58a6ff, 0xf2f2f2, 0x7c8a96][Math.floor(r() * 3)]); } }
      if (r() < 0.6) { const i = stair.add(); if (i >= 0) { stair.set(i, b.x + (r() - 0.5) * (b.w - 4), top + 1.3, b.z + (r() - 0.5) * (b.d - 4)); stair.color(i, 0xe3ddd2); } }
      if (r() < 0.25) { for (let k = 0; k < 4; k++) { const i = solar.add(); if (i < 0) break; solar.set(i, b.x - b.w / 4 + (k % 2) * 3.6, top + 0.5, b.z - 1 + Math.floor(k / 2) * 2.4, 0, 1, 1, 1, -0.35); solar.color(i, 0x1f3b73); } }
    }
    [ac, tank, stair, solar].forEach((q) => q.done());
  }

  // —— 路灯、电线杆、行道树位置 ——
  buildStreetFurniture() {
    const poles = new Merger(); const r = rng(31);
    this.treeSpots = [];
    for (const e of ROADS_EW) {
      const off = e.w / 2 + (e.main ? 3.6 : 2.6);
      for (let x = BOARD.x0 + 6; x < BOARD.x1 - 4; x += e.main ? 9 : 11) {
        if (ROADS_NS.some((n) => Math.abs(x - n.x) < n.w / 2 + 6)) continue;
        if (Math.abs(railOff(x, e.z)) < 14) continue;
        for (const sg of [-1, 1]) {
          const z = e.z + sg * off;
          if (e.main && Math.floor((x + 300) / 9) % 4 === 0) { poles.box(0.25, 7, 0.25, x, 3.5, z, 0x6d7681); poles.box(0.2, 0.2, 2.2, x, 6.9, z - sg * 1.0, 0x6d7681); poles.box(0.6, 0.18, 0.9, x, 6.8, z - sg * 2.0, 0xf2f0e6); }
          else this.treeSpots.push({ x: x + 8 * (r() - 0.5) * 0.3, z, s: 0.85 + r() * 0.35 });
        }
      }
    }
    for (const n of ROADS_NS) {
      const off = n.w / 2 + (n.main ? 3.6 : 2.6);
      for (let z = BOARD.z0 + 6; z < BOARD.z1 - 4; z += n.main ? 9 : 11) {
        if (ROADS_EW.some((e) => Math.abs(z - e.z) < e.w / 2 + 6)) continue;
        if (z > RIVER.z0 - 4 && z < RIVER.z1 + 4) continue;
        if (Math.abs(railOff(n.x, z)) < 14) continue;
        for (const sg of [-1, 1]) this.treeSpots.push({ x: n.x + sg * off, z, s: 0.85 + r() * 0.35 });
      }
    }
    this.addMerged(poles, this.M.steel);
  }

  buildTrees() {
    const r = rng(41);
    // 公园与河岸
    for (let k = 0; k < 260; k++) {
      const x = lerp(PARK.x0 + 3, PARK.x1 - 3, r()), z = lerp(PARK.z0 + 3, PARK.z1 - 3, r());
      const dx = (x - (PARK.x0 + PARK.x1) / 2) / ((PARK.x1 - PARK.x0) / 2 - 10), dz = (z - (PARK.z0 + PARK.z1) / 2) / ((PARK.z1 - PARK.z0) / 2 - 10);
      const ell = dx * dx + dz * dz; if (Math.abs(ell - 1) < 0.18) continue; // 跑道
      if (z > PARK.z1 - 5) continue; // 滨河步道
      this.treeSpots.push({ x, z, s: 0.8 + r() * 0.7, park: true });
    }
    for (const q of this.extraTrees || []) this.treeSpots.push(q);
    for (let x = BOARD.x0 + 4; x < BOARD.x1 - 4; x += 9) {
      if (ROADS_NS.some((n) => Math.abs(x - n.x) < n.w / 2 + 4)) continue;
      if (Math.abs(railOff(x, RIVER.z1 + 3)) < 12) continue;
      if (x > PORT.x0 - 2 && x < SITE.x1 + 2) continue;
      this.treeSpots.push({ x, z: RIVER.z1 + 3.2, s: 0.9 + r() * 0.3 });
    }
    // 街区中庭
    for (const b of [[-120, -60, 120, 170], [-46, 30, 190, 290], [-120, -66, -230, -150], [-46, -10, -30, 48]]) {
      for (let k = 0; k < 14; k++) { const x = lerp(b[0], b[1], r()), z = lerp(b[2], b[3], r()); if (!this.isFreeGround(x, z)) continue; this.treeSpots.push({ x, z, s: 0.7 + r() * 0.5 }); }
    }
    const n = this.treeSpots.length;
    const canopyGeo = new THREE.IcosahedronGeometry(2.4, 1); canopyGeo.scale(1, 0.95, 1);
    const pineGeo = new THREE.ConeGeometry(2.0, 5.5, 8);
    this.canopy = new Inst(this.scene, canopyGeo, new THREE.MeshPhongMaterial({ shininess: 22, flatShading: true }), n, { colors: true });
    this.pines = new Inst(this.scene, pineGeo, new THREE.MeshPhongMaterial({ shininess: 22, flatShading: true }), n, { colors: true });
    this.trunks = new Inst(this.scene, new THREE.CylinderGeometry(0.22, 0.3, 3, 6), new THREE.MeshPhongMaterial({ color: 0x7a5636, shininess: 8 }), n);
    const greens = [0x5fae3e, 0x74c14a, 0x4e9a3a, 0x8acb56, 0x67b84a, 0x9ccf5e];
    this.trees = this.treeSpots.map((p, i) => {
      const pine = r() < 0.18 && !p.park ? false : r() < 0.15;
      const t = { ...p, pine, ph: r() * 6.28, ci: pine ? this.pines.add() : this.canopy.add(), ti: this.trunks.add() };
      const col = new THREE.Color(greens[Math.floor(r() * greens.length)]);
      (pine ? this.pines : this.canopy).color(t.ci, pine ? col.clone().multiplyScalar(0.8) : col);
      this.trunks.set(t.ti, p.x, 1.5 * p.s, p.z, 0, p.s, p.s, p.s);
      return t;
    });
    this.canopy.done(); this.pines.done(); this.trunks.done();
    this.dyn.push((t, env) => {
      for (const tr of this.trees) {
        const gust = env.gustAt ? env.gustAt(tr.x, tr.z, t) : 0;
        const a = 0.03 * Math.sin(t * 1.7 + tr.ph) + gust * 0.22 * Math.sin(t * 13 + tr.ph);
        const b = 0.02 * Math.cos(t * 1.3 + tr.ph * 1.7) + gust * 0.12;
        const s = tr.s, top = 3 * s;
        if (tr.pine) this.pines.set(tr.ci, tr.x + Math.sin(a) * 4 * s, top + 2.4 * s, tr.z + Math.sin(b) * 4 * s, tr.ph, s, s, s, b, -a);
        else this.canopy.set(tr.ci, tr.x + Math.sin(a) * 3 * s, top + 1.6 * s, tr.z + Math.sin(b) * 3 * s, tr.ph, s, s, s, b, -a);
      }
      this.canopy.dirty(); this.pines.dirty();
    });
  }

  isFreeGround(x, z) {
    if (z > RIVER.z0 - 6 && z < RIVER.z1 + 6) return false;
    if (Math.abs(railOff(x, z)) < 14) return false;
    if (ROADS_EW.some((e) => Math.abs(z - e.z) < e.w / 2 + 5)) return false;
    if (ROADS_NS.some((n) => Math.abs(x - n.x) < n.w / 2 + 5)) return false;
    for (const b of this.roofSpots || []) if (Math.abs(x - b.x) < b.w / 2 + 1.5 && Math.abs(z - b.z) < b.d / 2 + 1.5) return false;
    return true;
  }

  // —— 第一幕：发货街区（主路口、信号灯、公交站、早餐摊、TonyBook 仓）——
  buildZoneA() {
    const A = ZONE_A, m = new Merger(), plastic = new Merger(), signs = [];
    const E = ROADS_EW[0], N = ROADS_NS[0];
    // 信号灯：四角各一根，灯头朝向对应方向
    this.sigLamps = new Inst(this.scene, new THREE.SphereGeometry(0.22, 10, 8), this.M.glowI, 64, { shadow: false, colors: true });
    this.signals = [];
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const px = A.x + sx * (N.w / 2 + 1.2), pz = A.z + sz * (E.w / 2 + 1.2);
      m.box(0.3, 6.2, 0.3, px, 3.1, pz, 0x5a636e);
      // 横臂伸向路中
      m.box(0.25, 0.25, 7, px, 6.0, pz - sz * 3.5, 0x5a636e);
      m.box(0.25, 0.25, 7, px - sx * 3.5, 6.0, pz, 0x5a636e);
      // 灯箱：一个面向东西车流，一个面向南北车流
      const hx = px - sx * 6.5, hz = pz - sz * 6.5;
      m.box(0.7, 0.6, 1.9, hx, 5.6, pz, 0x22262b); // 东西向灯箱（沿 z 排列三灯）
      m.box(1.9, 0.6, 0.7, px, 5.6, hz, 0x22262b); // 南北向灯箱
      const ew = [0, 1, 2].map((k) => { const i = this.sigLamps.add(); this.sigLamps.set(i, hx + sx * 0.4, 5.6, pz + (k - 1) * 0.6); return i; });
      const ns = [0, 1, 2].map((k) => { const i = this.sigLamps.add(); this.sigLamps.set(i, px + (k - 1) * 0.6, 5.6, hz + sz * 0.4); return i; });
      // 人行灯
      m.box(0.2, 2.6, 0.2, px + sx * 1.2, 1.3, pz + sz * 1.2, 0x5a636e);
      const ped = [0, 1].map((k) => { const i = this.sigLamps.add(); this.sigLamps.set(i, px + sx * 1.2, 2.3 + k * 0.45, pz + sz * 1.2, 0, 0.8, 0.8, 0.8); return i; });
      this.signals.push({ ew, ns, ped, sx, sz });
    }
    this.sigLamps.done();
    // 公交站（东行方向，路口东侧南沿）
    const bx = A.x + 34, bz = A.z + E.w / 2 + 2.4;
    plastic.box(9, 0.15, 2.2, bx, 2.8, bz + 0.4, 0x2d6cdf);
    plastic.box(0.15, 2.8, 2.0, bx - 4.4, 1.4, bz + 0.4, 0xcfd8df); plastic.box(0.15, 2.8, 2.0, bx + 4.4, 1.4, bz + 0.4, 0xcfd8df);
    plastic.box(9, 2.6, 0.12, bx, 1.4, bz + 1.45, 0xdfe8ef);
    plastic.box(6, 0.4, 0.8, bx, 0.5, bz + 0.9, 0x8a8f98);
    signs.push({ tex: signTexture([{ text: '18 路 · 小商品城', size: 0.5 }], { bg: '#2d6cdf' }), w: 7, h: 1.1, pos: [bx, 3.5, bz + 0.4], ry: 0, face: 'z' });
    // 早餐摊（东南角小广场）
    const sx0 = A.x + 20, sz0 = A.z + 21;
    plastic.box(4.2, 1.2, 2.2, sx0, 0.7, sz0, 0xf2c230); plastic.box(4.4, 0.15, 2.4, sx0, 1.35, sz0, 0xe9e2d0);
    plastic.box(0.12, 2.2, 0.12, sx0, 2.3, sz0, 0xdddddd);
    m.box(1.0, 0.5, 1.0, sx0 - 1.2, 1.65, sz0, 0xcfcfcf); // 蒸笼
    m.box(1.0, 0.25, 1.0, sx0 - 1.2, 2.0, sz0, 0xbdb6a8);
    const umb = new THREE.Mesh(new THREE.ConeGeometry(3.2, 1.1, 12), new THREE.MeshPhongMaterial({ color: 0xff6b4a, shininess: 45 }));
    umb.position.set(sx0, 3.6, sz0); umb.castShadow = true; this.scene.add(umb);
    for (let k = 0; k < 4; k++) plastic.box(1.2, 0.5, 0.9, sx0 + 4 + k * 1.6, 0.25, sz0 + 3 + (k % 2) * 1.6, [0xe23b2e, 0x2d6cdf, 0xffffff, 0x3ddc97][k]);
    signs.push({ tex: signTexture([{ text: '早点 · 包子豆浆', size: 0.55 }], { bg: '#ff6b4a' }), w: 4.0, h: 0.8, pos: [sx0, 1.0, sz0 + 1.12], ry: 0, face: 'z' });
    this.steamOrigin = V3(sx0 - 1.2, 2.2, sz0);
    // 小广场铺装 + 花坛
    m.box(22, 0.08, 20, A.x + 22, 0.1, A.z + 26, 0xd9cdb6);
    for (let k = 0; k < 3; k++) plastic.box(2.6, 0.7, 2.6, A.x + 14 + k * 8, 0.35, A.z + 33, 0xa1876a);
    // TonyBook 仓（西南街区，货场朝东）
    const W = WAREHOUSE;
    m.box(W.x1 - W.x0, 9, W.z1 - W.z0, (W.x0 + W.x1) / 2, 4.6, (W.z0 + W.z1) / 2, 0xe9e5db);
    m.box(W.x1 - W.x0 + 0.6, 0.6, W.z1 - W.z0 + 0.6, (W.x0 + W.x1) / 2, 9.3, (W.z0 + W.z1) / 2, 0xff6b4a);
    for (let k = 0; k < 6; k++) m.box(W.x1 - W.x0 - 2, 0.25, 0.6, (W.x0 + W.x1) / 2, 9.65, W.z0 + 3 + k * 4.5, 0xb9c2cc);
    // 卷帘门（开着，内部暗）
    m.box(0.2, 5.5, 8, W.x1 + 0.05, 2.9, W.z0 + 10, 0x2a2d33);
    m.box(0.25, 0.8, 8.6, W.x1 + 0.1, 5.9, W.z0 + 10, 0x9aa3ad);
    m.box(0.2, 5.5, 8, W.x1 + 0.05, 2.9, W.z0 + 22, 0xb8bec6);
    signs.push({ tex: signTexture([{ text: 'TonyBook 仓', size: 0.6 }], { bg: '#ffffff', fg: '#ff6b4a', border: '#ff6b4a' }), w: 13, h: 2.6, pos: [W.x1 + 0.15, 7.4, (W.z0 + W.z1) / 2], ry: Math.PI / 2, face: 'x' });
    // 货场地面、箱子垛
    m.box(16, 0.08, W.z1 - W.z0 + 6, W.x1 + 8, 0.09, (W.z0 + W.z1) / 2, 0xbab3a6);
    for (let k = 0; k < 8; k++) m.box(0.15, 0.04, 2.6, W.x1 + 4 + k * 0.01, 0.13, W.z0 + 2 + k * 3.8, 0xf2c230);
    const boxes = new Inst(this.scene, new THREE.BoxGeometry(1, 1, 1), this.M.matte, 400, { colors: true });
    const r = rng(9);
    for (let st = 0; st < 5; st++) {
      const cx = W.x1 + 2.2 + (st % 2) * 2.4, cz = W.z0 + 4 + st * 2.0 + (st > 2 ? 12 : 0);
      for (let lx = 0; lx < 2; lx++) for (let lz = 0; lz < 2; lz++) for (let ly = 0; ly < 3; ly++) {
        const i = boxes.add(); boxes.set(i, cx + lx * 0.9, 0.5 + ly * 0.82, cz + lz * 0.9, (r() - 0.5) * 0.15, 0.82, 0.78, 0.82);
        boxes.color(i, new THREE.Color(0xc89a62).multiplyScalar(0.9 + r() * 0.2));
      }
    }
    // 托盘
    for (let k = 0; k < 6; k++) m.box(1.8, 0.2, 1.8, W.x1 + 12, 0.15, W.z0 + 3 + k * 2.2, 0xa07c55);
    boxes.done(); this.cargoBoxes = boxes;
    // 装车卡车（停在货场，车厢门朝北开）
    const tx = W.x1 + 11, tz = W.z0 + 18;
    m.box(2.6, 3.0, 7.2, tx, 2.0, tz + 1.0, 0xffffff); // 货厢
    m.box(2.5, 2.2, 2.4, tx, 1.6, tz + 5.9, 0xff6b4a); // 车头
    m.box(2.3, 0.9, 0.1, tx, 2.2, tz + 7.12, 0x2b3a4a);
    m.box(2.62, 0.9, 7.2, tx, 2.2, tz + 1.0, 0xff6b4a); // 涂装条
    for (const wz of [tz - 1.8, tz + 2.6, tz + 5.6]) for (const wx of [-1.2, 1.2]) m.box(0.5, 1.0, 1.0, tx + wx, 0.5, wz, 0x1f2328);
    this.truckA = { x: tx, z: tz };
    signs.push({ tex: signTexture([{ text: 'TB 跨境物流', size: 0.55 }], { bg: '#ffffff', fg: '#ff6b4a' }), w: 5.5, h: 1.2, pos: [tx + 1.32, 2.6, tz + 0.6], ry: Math.PI / 2, face: 'x' });
    // 快递驿站等店招（路口四周）
    const names = ['快递驿站', '义新小商品', '打包耗材', '跨境服务站', '面馆', '便利店'];
    const ncolors = ['#2d6cdf', '#e23b2e', '#3ddc97', '#ff6b4a', '#f2c230', '#1f2328'];
    for (let k = 0; k < 6; k++) {
      const b = this.roofSpots.filter((q) => Math.hypot(q.x - A.x, q.z - A.z) < 50 && Math.hypot(q.x - A.x, q.z - A.z) > 16)[k];
      if (!b) continue;
      const fz = b.z > A.z ? b.z - b.d / 2 - 0.08 : b.z + b.d / 2 + 0.08;
      signs.push({ tex: signTexture([{ text: names[k], size: 0.56 }], { bg: ncolors[k], fg: k === 4 ? '#1f2328' : '#ffffff' }), w: Math.min(8, b.w * 0.7), h: 1.4, pos: [b.x, 4.4, fz], ry: b.z > A.z ? Math.PI : 0, face: 'z' });
    }
    this.addMerged(m, this.M.matte); this.addMerged(plastic, this.M.plastic);
    this.placeSigns(signs);
    // 蒸汽粒子
    const steamTex = canvasTexture(64, 64, (g, w, h) => { const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32); grd.addColorStop(0, 'rgba(255,255,255,0.9)'); grd.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = grd; g.fillRect(0, 0, w, h); });
    this.steam = [];
    const steamMat = new THREE.SpriteMaterial({ map: steamTex, transparent: true, depthWrite: false, opacity: 0.6 });
    for (let k = 0; k < 26; k++) { const s = new THREE.Sprite(steamMat.clone()); this.scene.add(s); this.steam.push({ s, ph: k / 26, dx: (r() - 0.5) * 0.8 }); }
    this.dyn.push((t) => {
      for (const st of this.steam) {
        const life = 1.6, u = ((t / life + st.ph) % 1 + 1) % 1;
        const o = this.steamOrigin;
        st.s.position.set(o.x + st.dx + Math.sin(u * 4 + st.ph * 9) * 0.5 + u * 1.2, o.y + u * 6, o.z + st.dx * 0.5);
        const sc = 0.8 + u * 3.2; st.s.scale.set(sc, sc, sc);
        st.s.material.opacity = 0.55 * Math.sin(Math.PI * u);
      }
    });
    // 信号灯状态
    this.dyn.push((t) => this.updateSignals(t));
    // 远处高架反光（伏笔）
    const glintTex = canvasTexture(64, 64, (g) => { const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32); grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.25, 'rgba(255,244,220,0.8)'); grd.addColorStop(1, 'rgba(255,240,210,0)'); g.fillStyle = grd; g.fillRect(0, 0, 64, 64); });
    this.glint = new THREE.Sprite(new THREE.SpriteMaterial({ map: glintTex, color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.glint.material.toneMapped = false;
    this.scene.add(this.glint);
    this.dyn.push((t) => {
      const E = this.ev; const k = win(t, E.glint, E.glint + 0.55);
      const s = lerp(110, 175, k); const p = railPoint(s, 0, 8.5);
      this.glint.position.copy(p);
      const a = Math.sin(Math.PI * k);
      this.glint.material.opacity = (k > 0 && k < 1) ? a : 0;
      this.glint.material.color.setScalar(4 * a);
      const sc = 6 + 10 * a; this.glint.scale.set(sc * 2.2, sc, 1);
    });
  }

  signalPhase(t) {
    // 主路口：东西向绿 → 黄 → 红；南北向相反。时间取自节拍表。
    const E = this.ev;
    const ew = t < E.sigEwYellow ? 'g' : t < E.sigEwRed ? 'y' : t < E.sigEwGreen ? 'r' : 'g';
    const ns = t < E.sigNsGreen ? 'r' : t < E.sigNsYellow ? 'g' : t < E.sigNsRed ? 'y' : 'r';
    return { ew, ns };
  }

  updateSignals(t) {
    const { ew, ns } = this.signalPhase(t);
    const on = { r: new THREE.Color(5, 0.4, 0.25), y: new THREE.Color(5, 3.4, 0.4), g: new THREE.Color(0.3, 4.5, 1.6) };
    const off = new THREE.Color(0.08, 0.08, 0.08);
    for (const s of this.signals) {
      ['r', 'y', 'g'].forEach((c, k) => { this.sigLamps.color(s.ew[k], ew === c ? on[c] : off); this.sigLamps.color(s.ns[k], ns === c ? on[c] : off); });
      // 人行灯：跟随平行的车流
      const walk = (s.sx * s.sz > 0) ? ns : ew;
      this.sigLamps.color(s.ped[0], walk === 'r' || walk === 'y' ? on.r : off);
      this.sigLamps.color(s.ped[1], walk === 'g' ? on.g : off);
    }
    this.sigLamps.dirty();
  }

  placeSigns(signs) {
    for (const s of signs) {
      const mat = new THREE.MeshPhongMaterial({ map: s.tex, shininess: 49, emissive: 0xffffff, emissiveMap: s.tex, emissiveIntensity: 0.18 });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(s.w, s.h), mat);
      mesh.position.set(...s.pos); mesh.rotation.y = s.ry; mesh.castShadow = false; mesh.receiveShadow = true;
      this.scene.add(mesh);
      if (s.back) { const b = mesh.clone(); b.rotation.y += Math.PI; this.scene.add(b); }
    }
  }

  // —— 第二幕 A：河港（门式吊车、集装箱、驳船、小船）——
  buildPort() {
    const P = PORT, m = new Merger(), r = rng(13);
    m.box(P.x1 - P.x0, 0.08, P.z1 - P.z0, (P.x0 + P.x1) / 2, 0.09, (P.z0 + P.z1) / 2, 0xbfb7a8);
    for (let x = P.x0 + 2; x < P.x1; x += 6.4) m.box(0.15, 0.04, P.z1 - P.z0 - 4, x, 0.14, (P.z0 + P.z1) / 2, 0xf2c230);
    // 集装箱堆
    const cont = new Inst(this.scene, new THREE.BoxGeometry(6.1, 2.6, 2.44), this.M.plastic, 600, { colors: true });
    const ccols = [0xff6b4a, 0x3ddc97, 0x2d6cdf, 0xf2c230, 0xe23b2e, 0xffffff, 0x2aa198, 0x8b5cf6, 0xff8a3d];
    for (let row = 0; row < 7; row++) for (let col = 0; col < 7; col++) {
      const x = P.x0 + 5 + col * 6.8, z = P.z0 + 22 + row * 2.9;
      const hgt = 1 + Math.floor(r() * 4);
      for (let k = 0; k < hgt; k++) { const i = cont.add(); cont.set(i, x, 1.4 + k * 2.65, z); cont.color(i, ccols[Math.floor(r() * ccols.length)]); }
    }
    cont.done();
    // 集装箱侧面字（TBX）：做成几块贴片
    const tbx = signTexture([{ text: 'TBX', size: 0.7, weight: 900 }], { bg: 'rgba(0,0,0,0)', fg: '#ffffff', w: 256, h: 96 });
    // 门式吊车：两条腿跨在岸边与驳船之间
    const cx = P.x0 + 20;
    this.gantry = { x: cx };
    const gm = new Merger();
    for (const lx of [-9, 9]) { gm.box(1.0, 22, 1.0, cx + lx, 11, P.z0 + 6, 0xff6b4a); gm.box(1.0, 22, 1.0, cx + lx, 11, P.z0 + 18, 0xff6b4a); gm.box(1.2, 1.2, 13, cx + lx, 21.5, P.z0 + 12, 0xff6b4a); gm.box(1.4, 0.8, 14, cx + lx, 0.6, P.z0 + 12, 0x1f2328); }
    gm.box(2.2, 1.6, 52, cx - 9, 23, P.z0 - 2, 0xff6b4a); gm.box(2.2, 1.6, 52, cx + 9, 23, P.z0 - 2, 0xff6b4a);
    for (let k = 0; k < 9; k++) gm.box(18, 0.4, 0.4, cx, 23.6, P.z0 - 24 + k * 6, 0xe25a3a);
    gm.box(4, 3, 5, cx - 11.5, 19, P.z0 + 14, 0xffffff);
    this.addMerged(gm, this.M.plastic);
    this.trolley = new THREE.Group();
    const tr = new THREE.Mesh(new THREE.BoxGeometry(20, 1.6, 4), new THREE.MeshPhongMaterial({ color: 0xf2f2f2, shininess: 54 }));
    tr.castShadow = true; this.trolley.add(tr); this.scene.add(this.trolley);
    this.spreader = new THREE.Group();
    const sp = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.6, 2.6), new THREE.MeshPhongMaterial({ color: 0xf2c230, shininess: 54 })); sp.castShadow = true; this.spreader.add(sp);
    this.carried = new THREE.Mesh(new THREE.BoxGeometry(6.1, 2.6, 2.44), new THREE.MeshPhongMaterial({ color: 0xff6b4a, shininess: 55 })); this.carried.position.y = -1.6; this.carried.castShadow = true; this.spreader.add(this.carried);
    const tbxMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.2), new THREE.MeshBasicMaterial({ map: tbx, transparent: true })); tbxMesh.position.set(0, -1.6, 1.23); this.spreader.add(tbxMesh);
    this.scene.add(this.spreader);
    this.cables = [0, 1, 2, 3].map(() => { const c = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1, 0.08), this.M.steel); this.scene.add(c); return c; });
    // 驳船（停在吊车下）
    const bm = new Merger(); const bz = (RIVER.z0 + RIVER.z1) / 2 + 4;
    bm.box(44, 2.4, 11, cx + 6, RIVER.water + 0.6, bz, 0x2b3a4a); bm.box(44.4, 0.5, 11.4, cx + 6, RIVER.water + 1.9, bz, 0xe23b2e);
    bm.box(6, 4.5, 8, cx + 25, RIVER.water + 3.5, bz, 0xffffff); bm.box(6.2, 1.2, 8.2, cx + 25, RIVER.water + 5.2, bz, 0x2d6cdf);
    for (let k = 0; k < 5; k++) for (let h = 0; h < (k % 2) + 1; h++) bm.box(6.1, 2.6, 2.44, cx - 8 + k * 6.8, RIVER.water + 3.3 + h * 2.65, bz + (k % 2 ? 2 : -2), ccols[(k * 3 + h) % ccols.length]);
    this.addMerged(bm, this.M.plastic);
    this.dyn.push((t) => this.updatePort(t));
    // 河上小船
    this.boats = [];
    const boatGeo = partsGeometry([
      { geo: new THREE.BoxGeometry(7, 1.2, 2.6), pos: [0, 0.4, 0], color: 0xffffff },
      { geo: new THREE.ConeGeometry(1.3, 2.4, 4), pos: [4.4, 0.4, 0], rot: [0, 0, -Math.PI / 2], scale: [1, 1, 1], color: 0xffffff },
      { geo: new THREE.BoxGeometry(2.4, 1.4, 2.0), pos: [-1.2, 1.6, 0], color: 0xdfe8ef },
      { geo: new THREE.BoxGeometry(2.5, 0.5, 0.05), pos: [-1.2, 1.9, 1.01], color: 0x2b3a4a },
      { geo: new THREE.BoxGeometry(7.1, 0.3, 2.7), pos: [0, -0.05, 0], color: 0xe23b2e },
    ]);
    this.boatInst = new Inst(this.scene, boatGeo, this.M.gloss, 8, { colors: true });
    const wakeGeo = new THREE.PlaneGeometry(1, 1); wakeGeo.rotateX(-Math.PI / 2);
    this.wakeInst = new Inst(this.scene, wakeGeo, new THREE.MeshBasicMaterial({ color: 0xe8f6f7, transparent: true, opacity: 0.55, depthWrite: false }), 8 * 10, { shadow: false, receive: false });
    const bcol = [0xffffff, 0xf2c230, 0x3ddc97, 0xff6b4a, 0x58a6ff];
    for (let k = 0; k < 5; k++) { const i = this.boatInst.add(); this.boatInst.color(i, bcol[k]); this.boats.push({ i, lane: RIVER.z0 + 7 + (k % 2) * 6, v: (k % 2 ? -1 : 1) * (9 + k * 2), x0: -160 + k * 70, wakes: Array.from({ length: 10 }, () => this.wakeInst.add()) }); }
    this.boatInst.done(); this.wakeInst.done();
    this.dyn.push((t) => {
      for (const b of this.boats) {
        const span = 360; let x = ((b.x0 + b.v * t + 180) % span + span) % span - 180;
        const vis = Math.abs(x) < 158;
        if (vis) this.boatInst.set(b.i, x, RIVER.water + 0.25 + 0.08 * Math.sin(t * 3 + b.x0), b.lane, b.v > 0 ? 0 : Math.PI); else this.boatInst.hide(b.i);
        b.wakes.forEach((wi, k) => {
          const d = (k + 1) * 2.4, wx = x - Math.sign(b.v) * (d + 2);
          if (!vis || Math.abs(wx) > 158) { this.wakeInst.hide(wi); return; }
          const spread = 0.8 + k * 0.6;
          this.wakeInst.set(wi, wx, RIVER.water + 0.03, b.lane + (k % 2 ? spread : -spread) * 0.5, b.v > 0 ? 0.3 * (k % 2 ? 1 : -1) : -0.3 * (k % 2 ? 1 : -1), 2.4, 1, 0.5 + k * 0.08);
        });
      }
      this.boatInst.dirty(); this.wakeInst.dirty();
      // 水面颜色随时间轻微变化
    });
  }

  updatePort(t) {
    const E = this.ev, P = PORT, cx = this.gantry.x;
    // 起吊循环：堆场 → 驳船，周期 6 秒，与第二幕对齐
    const T0 = E.craneLift; const cyc = 6.0; const u = (((t - T0) % cyc) + cyc) % cyc / cyc;
    const zYard = P.z0 + 22, zShip = (RIVER.z0 + RIVER.z1) / 2 + 2;
    const hookTop = 19;
    let z, y, carry = true;
    if (u < 0.18) { z = zYard; y = lerp(3.2, hookTop, smoother(u / 0.18)); }
    else if (u < 0.55) { z = lerp(zYard, zShip, smoother((u - 0.18) / 0.37)); y = hookTop; }
    else if (u < 0.72) { z = zShip; y = lerp(hookTop, RIVER.water + 5.8, smoother((u - 0.55) / 0.17)); }
    else if (u < 0.8) { z = zShip; y = RIVER.water + 5.8; carry = u < 0.75; }
    else if (u < 0.9) { z = lerp(zShip, zYard, smoother((u - 0.8) / 0.1)); y = lerp(RIVER.water + 5.8, hookTop, smoother((u - 0.8) / 0.1)); carry = false; }
    else { z = zYard; y = lerp(hookTop, 3.2 + 1.6, smoother((u - 0.9) / 0.1)); carry = false; }
    const sway = 0.25 * Math.sin(t * 2.4) * (u > 0.18 && u < 0.6 ? 1 : 0.3);
    this.trolley.position.set(cx, 24.2, z);
    this.spreader.position.set(cx, y, z + sway);
    this.carried.visible = carry;
    const ropeLen = 24.2 - y;
    this.cables.forEach((c, k) => { c.position.set(cx + (k < 2 ? -2.6 : 2.6), y + ropeLen / 2, z + (k % 2 ? 1 : -1) + sway / 2); c.scale.y = ropeLen; });
  }

  // —— 第二幕 B：工地塔吊 ——
  buildSite() {
    const S = SITE, m = new Merger();
    m.box(S.x1 - S.x0, 0.08, S.z1 - S.z0, (S.x0 + S.x1) / 2, 0.1, (S.z0 + S.z1) / 2, 0xc2a37a);
    // 围挡
    for (const [x0, z0, x1, z1] of [[S.x0, S.z0, S.x1, S.z0], [S.x0, S.z1, S.x1, S.z1], [S.x0, S.z0, S.x0, S.z1], [S.x1, S.z0, S.x1, S.z1]]) {
      const len = Math.hypot(x1 - x0, z1 - z0); m.box(x1 === x0 ? 0.2 : len, 2.2, x1 === x0 ? len : 0.2, (x0 + x1) / 2, 1.1, (z0 + z1) / 2, 0x3ddc97);
    }
    // 在建楼：柱网 + 楼板（4 层）
    const bx = (S.x0 + S.x1) / 2 - 3, bz = (S.z0 + S.z1) / 2 + 6;
    for (let f = 0; f < 4; f++) {
      m.box(18, 0.4, 14, bx, 0.3 + f * 3.4, bz, 0xb8b2a6);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) if (f < 3) m.box(0.5, 3.4, 0.5, bx - 8 + i * 5.3, 2.0 + f * 3.4, bz - 6 + j * 6, 0xa49d90);
    }
    for (let i = 0; i < 4; i++) m.box(0.12, 4.0, 0.12, bx - 8 + i * 5.3, 12.4, bz - 6, 0xcf6f2a); // 钢筋
    m.box(6, 2.5, 3, S.x0 + 5, 1.3, S.z0 + 4, 0x2d6cdf); m.box(6, 2.5, 3, S.x0 + 5, 3.9, S.z0 + 4, 0x2d6cdf); // 板房
    m.box(3, 1.2, 6, S.x1 - 5, 0.7, S.z1 - 8, 0x8a7a5a); // 砂堆
    this.addMerged(m, this.M.matte);
    // 塔吊：塔身（格构用细杆）+ 旋转的吊臂
    const tx = S.x0 + 10, tz = S.z0 + 9, H = 40;
    const mast = new Merger();
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) mast.box(0.22, H, 0.22, tx + dx * 0.9, H / 2, tz + dz * 0.9, 0xf2c230);
    for (let y = 1.5; y < H; y += 2.2) { mast.box(2.0, 0.15, 0.15, tx, y, tz - 0.9, 0xf2c230); mast.box(2.0, 0.15, 0.15, tx, y + 1.1, tz + 0.9, 0xf2c230); mast.box(0.15, 0.15, 2.0, tx - 0.9, y + 0.55, tz, 0xf2c230); mast.box(0.15, 0.15, 2.0, tx + 0.9, y + 1.6, tz, 0xf2c230); }
    mast.box(3.4, 1, 3.4, tx, 0.5, tz, 0x777777);
    this.addMerged(mast, this.M.plastic);
    this.jib = new THREE.Group(); this.jib.position.set(tx, H, tz);
    const jm = new Merger();
    jm.box(36, 1.2, 1.2, 14, 0.6, 0, 0xf2c230); jm.box(12, 1.0, 1.0, -7, 0.5, 0, 0xf2c230);
    for (let x = -12; x < 32; x += 2) jm.box(0.12, 1.2, 1.25, x, 0.6, 0, 0xd9a81e);
    jm.box(3, 2.4, 2.4, -11, -0.6, 0, 0x8a8f98); jm.box(2.2, 2.2, 2.0, 1.6, -1.5, 0, 0xffffff); jm.box(0.4, 6, 0.4, 0, 3.8, 0, 0xf2c230);
    const jib = new THREE.Mesh(jm.geometry(), this.M.plastic); jib.castShadow = true; this.jib.add(jib);
    this.hook = new THREE.Group();
    const rope = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1, 0.07), this.M.steel); this.hook.add(rope); this.hookRope = rope;
    const load = new THREE.Mesh(new THREE.BoxGeometry(5, 0.7, 1.4), new THREE.MeshPhongMaterial({ color: 0xcf6f2a, shininess: 45 })); load.castShadow = true; this.hook.add(load); this.hookLoad = load;
    this.jib.add(this.hook);
    this.scene.add(this.jib);
    this.dyn.push((t) => {
      const E = this.ev;
      const yaw = -0.9 + 0.55 * Math.sin(0.42 * (t - E.craneLift) ) + 0.22 * (t - 5);
      this.jib.rotation.y = yaw;
      const hx = 22 + 6 * Math.sin(t * 0.6); const drop = 18 + 8 * Math.sin(t * 0.9 + 1);
      this.hook.position.set(hx, 0, 0);
      this.hookRope.scale.y = drop; this.hookRope.position.y = -drop / 2;
      this.hookLoad.position.y = -drop - 0.4;
    });
  }

  // —— 公园（跑道、跑步的人在人物系统里）——
  buildPark() {
    const P = PARK, m = new Merger();
    m.box(P.x1 - P.x0, 0.06, P.z1 - P.z0, (P.x0 + P.x1) / 2, 0.06, (P.z0 + P.z1) / 2, C.grass);
    const cx = (P.x0 + P.x1) / 2, cz = (P.z0 + P.z1) / 2, rx = (P.x1 - P.x0) / 2 - 10, rz = (P.z1 - P.z0) / 2 - 10;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 60) {
      const x = cx + Math.cos(a) * rx, z = cz + Math.sin(a) * rz;
      m.box(3.4, 0.05, 3.0, x, 0.1, z, 0xd65a3c, -a);
    }
    m.box(P.x1 - P.x0, 0.06, 4.5, cx, 0.1, P.z1 - 2.4, 0xd9cdb6); // 滨河步道
    // 草坪深浅格
    for (let i = 0; i < 6; i++) m.box(14, 0.03, 9, cx - 40 + i * 16, 0.1, cz + (i % 2 ? 4 : -4), C.grass2);
    // 小凉亭、长椅
    m.box(6, 0.4, 6, cx + 30, 3.5, cz - 6, 0xe23b2e); m.box(5, 3.2, 5, cx + 30, 1.7, cz - 6, 0xefe7d6);
    for (let k = 0; k < 8; k++) m.box(2, 0.5, 0.6, P.x0 + 12 + k * 18, 0.4, P.z1 - 5.2, 0x8b5a2b);
    this.addMerged(m, this.M.matte, { shadow: false });
    this.parkLoop = { cx, cz, rx, rz };
  }

  // —— 第二幕 C：快线站台 ——
  buildStation() {
    const m = new Merger(), plastic = new Merger(), signs = [];
    const ry = Math.atan2(RAIL.d.x, RAIL.d.z);
    const L = STATION.s1 - STATION.s0, sc = (STATION.s0 + STATION.s1) / 2;
    for (const side of [-1, 1]) {
      const c = railPoint(sc, side * STATION.off);
      m.box(4.4, 1.1, L, c.x, 0.55, c.z, 0xd4cec2, ry);
      const edge = railPoint(sc, side * (STATION.off - 2.0));
      m.box(0.5, 0.04, L, edge.x, 1.12, edge.z, 0xf2c230, ry);
      // 雨棚
      for (let k = 0; k < 6; k++) { const p = railPoint(STATION.s0 + 4 + k * (L - 8) / 5, side * (STATION.off + 0.8)); m.box(0.35, 3.6, 0.35, p.x, 2.9, p.z, 0x9aa3ad, ry); }
      const roof = railPoint(sc, side * (STATION.off + 0.2));
      plastic.box(5.2, 0.35, L - 6, roof.x, 4.85, roof.z, 0xff6b4a, ry);
      // 站名牌（面向铁路）
      const sp = railPoint(sc + 6, side * (STATION.off - 0.6));
      signs.push({ tex: signTexture([{ text: '跨境站', size: 0.42 }, { text: 'KUAJING', size: 0.24, weight: 700 }], { bg: '#ffffff', fg: '#1f2328', border: '#ff6b4a' }), w: 7, h: 2.4, pos: [sp.x, 3.0, sp.z], ry: ry + (side > 0 ? -Math.PI / 2 : Math.PI / 2), face: 'r' });
      for (let k = 0; k < 4; k++) { const b = railPoint(STATION.s0 + 8 + k * 11, side * (STATION.off + 0.9)); m.box(0.7, 0.5, 2.4, b.x, 1.35, b.z, 0x2d6cdf, ry); }
      // 旗子位置
    }
    // 天桥（跨两站台）
    const fb = railPoint(STATION.s0 + 3, 0);
    plastic.box(22, 1.2, 3.2, fb.x, 6.4, fb.z, 0xe9e5db, ry);
    for (const side of [-1, 1]) { const p = railPoint(STATION.s0 + 3, side * 10.6); m.box(3.2, 6.4, 3.2, p.x, 3.2, p.z, 0xd4cec2, ry); }
    this.addMerged(m, this.M.matte); this.addMerged(plastic, this.M.plastic);
    this.placeSigns(signs);
    // 旗杆和旗子（气浪会让旗子摆动）
    this.flags = [];
    const flagMat = new THREE.MeshPhongMaterial({ map: signTexture([{ text: 'TB', size: 0.6 }], { bg: '#ff6b4a', w: 128, h: 96 }), shininess: 36, side: THREE.DoubleSide });
    const poleM = new Merger();
    for (let k = 0; k < 4; k++) {
      const p = railPoint(STATION.s1 + 4 + k * 4, -15);
      poleM.box(0.15, 8, 0.15, p.x, 4, p.z, 0xdddddd);
      const f = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.6, 6, 1), flagMat); f.castShadow = true; this.scene.add(f);
      this.flags.push({ f, x: p.x, z: p.z, ph: k * 1.3, base: f.geometry.attributes.position.array.slice() });
    }
    this.addMerged(poleM, this.M.steel);
    this.dyn.push((t, env) => {
      for (const fl of this.flags) {
        const gust = env.gustAt ? env.gustAt(fl.x, fl.z, t) : 0;
        const dir = Math.atan2(RAIL.d.x, RAIL.d.z) + Math.PI / 2 + 0.5 + Math.sin(t * 0.7 + fl.ph) * 0.3 - gust * 0.6;
        fl.f.position.set(fl.x, 7.0, fl.z); fl.f.rotation.y = dir;
        const pos = fl.f.geometry.attributes.position; const b = fl.base;
        for (let i = 0; i < pos.count; i++) {
          const x = b[i * 3] + 1.2, w = x / 2.4;
          pos.array[i * 3] = b[i * 3] + 1.2; pos.array[i * 3 + 1] = b[i * 3 + 1] - w * 0.35 * (1 - gust);
          pos.array[i * 3 + 2] = Math.sin(t * (4 + gust * 10) - x * 1.8 + fl.ph) * w * (0.25 + gust * 0.5);
        }
        pos.needsUpdate = true; fl.f.geometry.computeVertexNormals();
      }
    });
    // 道路旁电线（鸟群停在上面）：沿 z=60 东西路北侧，路口西边
    const e = ROADS_EW[0];
    this.birdWire = { x0: railPoint(this.sAtZ(e.z)).x - 60, x1: railPoint(this.sAtZ(e.z)).x - 14, z: e.z - e.w / 2 - 2.2, y: 7.6 };
    const pm = new Merger();
    for (let x = this.birdWire.x0; x <= this.birdWire.x1 + 0.1; x += (this.birdWire.x1 - this.birdWire.x0) / 2) { pm.box(0.35, 8.4, 0.35, x, 4.2, this.birdWire.z, 0x7a5636); pm.box(2.4, 0.2, 0.2, x, 7.8, this.birdWire.z, 0x7a5636); }
    this.addMerged(pm, this.M.matte);
    this.birdWireInst = new Inst(this.scene, new THREE.BoxGeometry(1, 0.06, 0.06), new THREE.MeshPhongMaterial({ color: 0x23262b, shininess: 45 }), 3 * 24, { receive: false });
    this.dyn.push((t, env) => {
      const W = this.birdWire, E = this.ev; let n = 0;
      for (let line = 0; line < 3; line++) {
        const zz = W.z + (line - 1) * 0.7;
        for (let k = 0; k < 24; k++) {
          const u0 = k / 24, u1 = (k + 1) / 24, um = (u0 + u1) / 2;
          const x = lerp(W.x0, W.x1, um);
          const spanU = (um * 2) % 1;
          const tremA = 0.05 * pulse(t, E.buildup, E.buildup + 0.4, E.trainIn + 3, E.trainIn + 4.5) + 0.12 * (env.gustAt ? env.gustAt(x, zz, t) : 0);
          const y = W.y - 0.45 * Math.sin(Math.PI * spanU) + tremA * Math.sin(t * 31 + x * 0.6 + line) * Math.sin(Math.PI * spanU);
          this.birdWireInst.set(n++, x, y, zz, 0, (W.x1 - W.x0) / 24 + 0.02, 1, 1);
        }
      }
      this.birdWireInst.n = n; this.birdWireInst.done();
    });
  }

  wireY(x, line, t, env) {
    const W = this.birdWire, E = this.ev;
    const um = (x - W.x0) / (W.x1 - W.x0); const spanU = (um * 2) % 1;
    const zz = W.z + (line - 1) * 0.7;
    const tremA = 0.05 * pulse(t, E.buildup, E.buildup + 0.4, E.trainIn + 3, E.trainIn + 4.5) + 0.12 * (env.gustAt ? env.gustAt(x, zz, t) : 0);
    return W.y - 0.45 * Math.sin(Math.PI * spanU) + tremA * Math.sin(t * 31 + x * 0.6 + line) * Math.sin(Math.PI * spanU);
  }

  // —— 车流：每条车道离线模拟（固定步长，信号灯/道口决定停车），渲染时按 t 插值 ——
  buildTraffic() {
    const r = rng(101); const E = this.ev;
    const lanes = [];
    const laneOffs = (road) => road.main ? [{ o: 1.9, d: 1 }, { o: 5.4, d: 1 }, { o: -1.9, d: -1 }, { o: -5.4, d: -1 }] : [{ o: 2, d: 1 }, { o: -2, d: -1 }];
    // 东西向：d=1 向东（靠南半边，z 偏正），d=-1 向西
    for (const e of ROADS_EW) for (const l of laneOffs(e)) lanes.push({ axis: 'x', road: e, fixed: e.z + l.o, dir: l.d, curb: Math.abs(l.o) > 4 || !e.main, main: e.main });
    // 南北向：d=1 向南（+z，靠西半边 x 偏负），d=-1 向北（靠东半边）
    for (const n of ROADS_NS) for (const l of laneOffs(n)) lanes.push({ axis: 'z', road: n, fixed: n.x - l.o, dir: l.d, curb: Math.abs(l.o) > 4 || !n.main, main: n.main });
    // 每条车道的停车点（信号路口、道口）
    for (const L of lanes) {
      const len = L.axis === 'x' ? BOARD.x1 - BOARD.x0 : BOARD.z1 - BOARD.z0;
      const a0 = L.axis === 'x' ? BOARD.x0 : BOARD.z0;
      const toS = (coord) => L.dir > 0 ? coord - a0 : (a0 + len) - coord;
      L.len = len; L.toWorld = (s) => L.dir > 0 ? a0 + s : a0 + len - s;
      L.stops = [];
      const cross = L.axis === 'x' ? ROADS_NS : ROADS_EW;
      for (const c of cross) {
        const cc = L.axis === 'x' ? c.x : c.z;
        const stopS = toS(cc) - (c.w / 2 + 6.5);
        const isA = (L.axis === 'x' && L.road === ROADS_EW[0] && c === ROADS_NS[0]) || (L.axis === 'z' && L.road === ROADS_NS[0] && c === ROADS_EW[0]);
        if (isA) {
          const ax = L.axis === 'x' ? 'ew' : 'ns';
          L.stops.push({ s: stopS, red: (t) => { const ph = this.signalPhase(t)[ax]; return ph !== 'g'; } });
        } else {
          const ix = L.axis === 'x' ? cc : L.road.x, iz = L.axis === 'x' ? L.road.z : cc;
          const period = 14, off = ((ix * 0.37 + iz * 0.11) % period + period) % period, ax = L.axis;
          L.stops.push({ s: stopS, red: (t) => { const u = (((t + off) % period) + period) % period / period; return ax === 'x' ? !(u < 0.46) : !(u >= 0.5 && u < 0.96); } });
        }
      }
      // 道口
      if (L.axis === 'x') { const s = this.sAtZ(L.road.z); const p = railPoint(s); if (Math.abs(p.x) < 159) L.stops.push({ s: toS(p.x) - 11, red: (t) => this.gateState(t) > 0.02 || (t > E.gateDown - 0.6 && t < E.gateUp + 0.4) }); }
      else { const s = (L.road.x - RAIL.p0.x) / RAIL.d.x; const p = railPoint(s); if (Math.abs(p.z) < 299) L.stops.push({ s: toS(p.z) - 11, red: (t) => this.gateState(t) > 0.02 || (t > E.gateDown - 0.6 && t < E.gateUp + 0.4) }); }
      L.stops.sort((a, b) => a.s - b.s);
    }
    // 修正非主路口信号：东西向绿 [0,0.46)，南北向绿 [0.5,0.96)
    for (const L of lanes) for (const st of L.stops) if (!st.fixed) {}
    // 公交（脚本车辆）：主路东行靠路边车道
    const busLane = lanes.find((L) => L.axis === 'x' && L.road === ROADS_EW[0] && L.dir === 1 && L.curb);
    const busStopX = ZONE_A.x + 34;
    busLane.scripted = [{ len: 12, s: (t) => {
      const sStop = busStopX - BOARD.x0;
      if (t < E.busArrive) { const dt = E.busArrive - t; return sStop - 14 * dt - 0.0 * dt * dt + Math.max(0, 0) - Math.min(dt, 0.8) * 0 - 0 ; }
      if (t < E.busDepart) return sStop;
      const dt = t - E.busDepart; return sStop + 4 * dt * dt + (dt > 2 ? 0 : 0);
    } }];
    // 公交到站前要减速：重新定义为平滑减速曲线
    busLane.scripted[0].s = (t) => {
      const sStop = busStopX - BOARD.x0; const tb = E.busArrive, brake = 1.6;
      if (t < tb - brake) return sStop - 0.5 * 14 * brake - 14 * (tb - brake - t);
      if (t < tb) { const u = (t - (tb - brake)); return sStop - 0.5 * 14 * brake + 14 * u - 0.5 * (14 / brake) * u * u; }
      if (t < E.busDepart) return sStop;
      const dt = t - E.busDepart; return sStop + 3.5 * dt * dt;
    };
    // 模拟
    const dt = 1 / 60, tStart = -25, tEnd = 21.5, steps = Math.ceil((tEnd - tStart) / dt) + 1;
    this.simT0 = tStart; this.simDt = dt; this.simSteps = steps;
    const cars = [];
    const types = ['sedan', 'sedan', 'sedan', 'taxi', 'van', 'sedan', 'suv', 'truck', 'sedan', 'mini'];
    const dims = { sedan: 4.6, taxi: 4.6, van: 5.0, suv: 4.8, truck: 7.8, mini: 3.6, bus: 12 };
    for (const L of lanes) {
      const vmax = L.main ? 22 : 15;
      let nextSpawn = tStart + r() * 2;
      const list = []; // 活动车辆
      const all = [];
      for (let k = 0; k < steps; k++) {
        const t = tStart + k * dt;
        // 生成
        if (t >= nextSpawn) {
          const last = list[list.length - 1];
          const okGap = !last || last.s > 12;
          const sc = (L.scripted || []).map((q) => q.s(t)).filter((v) => v > -20 && v < 15);
          if (okGap && sc.length === 0) {
            const type = L.curb && r() < 0.15 ? 'truck' : types[Math.floor(r() * types.length)];
            const car = { s: 0, v: vmax * (0.7 + r() * 0.3), vmax: vmax * (0.8 + r() * 0.25), len: dims[type], type, color: type === 'taxi' ? 0x2aa198 : CAR_COLORS[Math.floor(r() * CAR_COLORS.length)], lane: L, track: new Float32Array(steps).fill(-1e4), born: k };
            list.push(car); all.push(car);
          }
          nextSpawn = t + (L.main ? 1.1 : 1.8) + r() * (L.main ? 2.2 : 3.5);
        }
        // 每辆车：找前车（含脚本车）与红灯停车点
        for (let i = 0; i < list.length; i++) {
          const c = list[i];
          let gap = 1e9;
          const lead = list[i - 1]; if (lead) gap = lead.s - lead.len / 2 - (c.s + c.len / 2);
          for (const q of (L.scripted || [])) { const qs = q.s(t); if (qs > c.s) gap = Math.min(gap, qs - q.len / 2 - (c.s + c.len / 2)); }
          for (const st of L.stops) {
            const dFront = st.s - (c.s + c.len / 2);
            if (dFront > -0.5 && dFront < 60 && st.red(t)) {
              // 如果已经停不下（距离太近且速度快）就通过
              const need = c.v * c.v / (2 * 7);
              if (dFront > need * 0.35 || c.v < 3) gap = Math.min(gap, dFront + 1.0);
            }
          }
          // 简化 IDM
          const s0 = 2.0, T = 0.9, a = 9, b = 10;
          const sStar = s0 + c.v * T;
          let acc = a * (1 - Math.pow(c.v / c.vmax, 4) - (gap < 1e8 ? Math.pow(sStar / Math.max(0.1, gap), 2) : 0));
          acc = Math.max(-b * 2, acc);
          c.v = Math.max(0, c.v + acc * dt); c.s += c.v * dt;
          if (gap < 0.3) { c.v = 0; }
          c.track[k] = c.s;
        }
        while (list.length && list[0].s > L.len + 10) list.shift();
      }
      for (const c of all) { c.L = L; cars.push(c); }
    }
    // 只保留在 0–21 秒内出现过的车
    const kA = Math.floor((-0.5 - tStart) / dt), kB = Math.min(steps - 1, Math.ceil((21 - tStart) / dt));
    this.cars = cars.filter((c) => { for (let k = kA; k <= kB; k += 6) if (c.track[k] > -1 && c.track[k] < c.L.len + 6) return true; return false; });
    // 几何体
    const body = (len, h, w, cabLen, cabH, cabOff, wheelR = 0.38) => partsGeometry([
      { geo: new THREE.BoxGeometry(w, h * 0.55, len), pos: [0, wheelR + h * 0.27, 0], color: 0xffffff },
      { geo: new THREE.BoxGeometry(w * 0.86, cabH, cabLen), pos: [0, wheelR + h * 0.55 + cabH / 2 - 0.02, cabOff], color: 0xffffff },
      { geo: new THREE.BoxGeometry(w * 0.88, cabH * 0.62, cabLen * 0.92), pos: [0, wheelR + h * 0.55 + cabH * 0.5, cabOff], color: 0x20303f },
      { geo: new THREE.BoxGeometry(w * 0.8, cabH * 0.6, 0.05), pos: [0, wheelR + h * 0.55 + cabH * 0.48, cabOff + cabLen / 2 + 0.01], color: 0x2b4257 },
      { geo: new THREE.BoxGeometry(w + 0.04, 0.5, 0.75), pos: [0, wheelR, len * 0.32], color: 0x15171a },
      { geo: new THREE.BoxGeometry(w + 0.04, 0.5, 0.75), pos: [0, wheelR, -len * 0.32], color: 0x15171a },
    ]);
    const G = {
      sedan: body(4.6, 1.3, 1.85, 2.3, 0.62, -0.2), taxi: body(4.6, 1.3, 1.85, 2.3, 0.62, -0.2), suv: body(4.8, 1.6, 1.95, 2.8, 0.75, -0.3),
      mini: body(3.6, 1.3, 1.65, 2.0, 0.7, -0.2), van: body(5.0, 1.6, 1.95, 3.8, 0.9, -0.4),
      truck: partsGeometry([
        { geo: new THREE.BoxGeometry(2.4, 2.8, 5.4), pos: [0, 2.0, -1.0], color: 0xf4f4f4 },
        { geo: new THREE.BoxGeometry(2.3, 2.1, 2.1), pos: [0, 1.5, 2.85], color: 0xffffff },
        { geo: new THREE.BoxGeometry(2.2, 0.8, 0.05), pos: [0, 2.0, 3.92], color: 0x2b4257 },
        { geo: new THREE.BoxGeometry(2.45, 0.6, 0.8), pos: [0, 0.4, 2.6], color: 0x15171a },
        { geo: new THREE.BoxGeometry(2.45, 0.6, 1.8), pos: [0, 0.4, -2.2], color: 0x15171a },
      ]),
      bus: partsGeometry([
        { geo: new THREE.BoxGeometry(2.5, 2.6, 12), pos: [0, 1.85, 0], color: 0xffffff },
        { geo: new THREE.BoxGeometry(2.52, 1.0, 11.4), pos: [0, 2.3, -0.1], color: 0x20303f },
        { geo: new THREE.BoxGeometry(2.4, 1.2, 0.05), pos: [0, 2.2, 6.01], color: 0x2b4257 },
        { geo: new THREE.BoxGeometry(2.52, 0.45, 12.02), pos: [0, 1.0, 0], color: 0x3ddc97 },
        { geo: new THREE.BoxGeometry(2.0, 0.3, 4), pos: [0, 3.25, 0], color: 0xdddddd },
        { geo: new THREE.BoxGeometry(2.55, 0.7, 0.9), pos: [0, 0.45, 3.8], color: 0x15171a },
        { geo: new THREE.BoxGeometry(2.55, 0.7, 0.9), pos: [0, 0.45, -3.8], color: 0x15171a },
      ]),
    };
    this.carInst = {};
    const counts = {}; for (const c of this.cars) counts[c.type] = (counts[c.type] || 0) + 1;
    for (const k of Object.keys(G)) this.carInst[k] = new Inst(this.scene, G[k], this.M.gloss, (counts[k] || 0) + 2, { colors: true });
    // 车灯：前白后红
    const lightGeo = partsGeometry([
      { geo: new THREE.BoxGeometry(0.4, 0.22, 0.06), pos: [-0.62, 0.8, 0.5], color: 0xfff3d6 }, { geo: new THREE.BoxGeometry(0.4, 0.22, 0.06), pos: [0.62, 0.8, 0.5], color: 0xfff3d6 },
      { geo: new THREE.BoxGeometry(0.4, 0.2, 0.06), pos: [-0.62, 0.85, -0.5], color: 0xff2a1a }, { geo: new THREE.BoxGeometry(0.4, 0.2, 0.06), pos: [0.62, 0.85, -0.5], color: 0xff2a1a },
    ]);
    this.carLights = new Inst(this.scene, lightGeo, new THREE.MeshBasicMaterial({ vertexColors: true }), this.cars.length + 4, { shadow: false, receive: false });
    this.taxiSign = new Inst(this.scene, new THREE.BoxGeometry(0.7, 0.25, 0.35), new THREE.MeshBasicMaterial({ color: 0xffe08a }), (counts.taxi || 0) + 2, { shadow: false });
    for (const c of this.cars) {
      c.ii = this.carInst[c.type].add(); this.carInst[c.type].color(c.ii, c.type === 'truck' ? (r() < 0.5 ? 0xff6b4a : 0x2d6cdf) : c.color);
      c.li = this.carLights.add(); if (c.type === 'taxi') c.ti = this.taxiSign.add();
    }
    // 公交
    this.bus = { ii: this.carInst.bus.add(), li: this.carLights.add(), lane: busLane };
    this.carInst.bus.color(this.bus.ii, 0xffffff);
    Object.values(this.carInst).forEach((q) => q.done()); this.carLights.done(); this.taxiSign.done();
    this.dyn.push((t) => this.updateTraffic(t));
  }

  carS(c, t) {
    const f = (t - this.simT0) / this.simDt; const k = Math.floor(f), u = f - k;
    const a = c.track[Math.max(0, Math.min(this.simSteps - 1, k))], b = c.track[Math.max(0, Math.min(this.simSteps - 1, k + 1))];
    if (a < -1000) return b < -1000 ? -1e4 : b; if (b < -1000) return a;
    return a + (b - a) * u;
  }

  updateTraffic(t) {
    const place = (inst, ii, L, s, lenScale = 1, extraLight) => {
      const w = L.toWorld(s);
      const x = L.axis === 'x' ? w : L.fixed, z = L.axis === 'x' ? L.fixed : w;
      const ry = L.axis === 'x' ? (L.dir > 0 ? Math.PI / 2 : -Math.PI / 2) : (L.dir > 0 ? 0 : Math.PI);
      if (s < -5 || s > L.len + 5) { inst.hide(ii); return null; }
      inst.set(ii, x, 0.06, z, ry); return { x, z, ry };
    };
    for (const c of this.cars) {
      const s = this.carS(c, t);
      const p = place(this.carInst[c.type], c.ii, c.L, s);
      if (!p) { this.carLights.hide(c.li); if (c.ti !== undefined) this.taxiSign.hide(c.ti); continue; }
      const half = c.len / 2;
      this.carLights.set(c.li, p.x, 0.06, p.z, p.ry, 1, 1, c.len * 1.0);
      if (c.ti !== undefined) this.taxiSign.set(c.ti, p.x, 2.15, p.z, p.ry);
    }
    // 公交
    const bs = this.bus.lane.scripted[0].s(t);
    const p = place(this.carInst.bus, this.bus.ii, this.bus.lane, bs);
    if (p) this.carLights.set(this.bus.li, p.x, 0.3, p.z, p.ry, 1.3, 1.2, 12); else this.carLights.hide(this.bus.li);
    Object.values(this.carInst).forEach((q) => q.dirty()); this.carLights.dirty(); this.taxiSign.dirty();
    this.busPos = p;
  }

  // —— 行人：人行道散步、路口过马路、装车工人、站台候车、公园跑步 ——
  buildPeople() {
    const r = rng(202), E = this.ev, A = ZONE_A, EW = ROADS_EW[0], NS = ROADS_NS[0];
    const people = [];
    const add = (o) => { o.shirt = o.shirt ?? SHIRTS[Math.floor(r() * SHIRTS.length)]; o.pants = o.pants ?? PANTS[Math.floor(r() * PANTS.length)]; o.skin = SKIN[Math.floor(r() * SKIN.length)]; o.ph = r() * 6.28; o.h = 0.92 + r() * 0.16; people.push(o); return o; };
    // 1) 人行道散步（全城），往返
    const walkLines = [];
    for (const e of ROADS_EW) for (const sg of [-1, 1]) walkLines.push({ axis: 'x', fixed: e.z + sg * (e.w / 2 + (e.main ? 2.2 : 1.6)), a: BOARD.x0 + 3, b: BOARD.x1 - 3 });
    for (const n of ROADS_NS) for (const sg of [-1, 1]) walkLines.push({ axis: 'z', fixed: n.x + sg * (n.w / 2 + (n.main ? 2.2 : 1.6)), a: BOARD.z0 + 3, b: BOARD.z1 - 3, river: true });
    for (const wl of walkLines) {
      const n = Math.floor((wl.b - wl.a) / (wl.axis === 'x' ? 9 : 12));
      for (let k = 0; k < n; k++) {
        const s0 = r() * (wl.b - wl.a), v = (1.3 + r() * 0.9) * (r() < 0.5 ? -1 : 1) * 1.6;
        const p = lerp(wl.a, wl.b, s0 / (wl.b - wl.a));
        // 避开铁路和河道
        const x = wl.axis === 'x' ? p : wl.fixed, z = wl.axis === 'x' ? wl.fixed : p;
        if (Math.abs(railOff(x, z)) < 12) continue;
        add({ kind: 'walk', wl, s0, v, lat: (r() - 0.5) * 1.6 });
      }
    }
    // 2) 主路口过马路：每个斑马线两端各一小群
    const ox = NS.w / 2 + 3, oz = EW.w / 2 + 3;
    // 横跨东西路（沿 z 走）的斑马线位于 x = A.x ± ox；这些人在南北向绿灯时走（东西向红）
    for (const sx of [-1, 1]) for (const from of [-1, 1]) {
      const n = 3 + Math.floor(r() * 3);
      for (let k = 0; k < n; k++) {
        const x = A.x + sx * ox + (r() - 0.5) * 3.2;
        const zA = A.z + from * (EW.w / 2 + 1.6 + r() * 1.5), zB = A.z - from * (EW.w / 2 + 2.2);
        const tGo = E.sigNsGreen + 0.15 + r() * 0.5, v = 2.6 + r() * 0.7;
        const tArr = tGo + Math.abs(zB - zA) / v;
        const away = (r() < 0.5 ? 1 : -1) * (8 + r() * 10);
        const path = [{ t: -10, x: x - away * 0.4, z: zA + from * 1.0 }, { t: tGo - 1.2 - r(), x, z: zA }, { t: tGo, x, z: zA }, { t: tArr, x, z: zB }, { t: tArr + Math.abs(away) / v, x: x + away, z: zB - from * 0.6 }, { t: 30, x: x + away * 3, z: zB - from * 0.6 }];
        add({ kind: 'path', path });
      }
    }
    // 横跨南北路（沿 x 走）：在东西向绿灯时走（0 秒前后、以及 sigEwGreen 之后）
    for (const sz of [-1, 1]) for (const from of [-1, 1]) {
      const n = 2 + Math.floor(r() * 3);
      for (let k = 0; k < n; k++) {
        const z = A.z + sz * oz + (r() - 0.5) * 3.2;
        const xA = A.x + from * (NS.w / 2 + 1.6 + r() * 1.5), xB = A.x - from * (NS.w / 2 + 2.2);
        const v = 2.6 + r() * 0.7;
        const tGo = k % 2 ? -0.6 + r() * 0.4 : E.sigEwGreen + 0.2 + r() * 0.4;
        const tArr = tGo + Math.abs(xB - xA) / v;
        const path = [{ t: -10, x: xA + from * 3, z }, { t: tGo - 0.8, x: xA, z }, { t: tGo, x: xA, z }, { t: tArr, x: xB, z }, { t: tArr + 4, x: xB - from * 10, z: z + sz * 0.5 }, { t: 30, x: xB - from * 40, z: z + sz * 0.5 }];
        add({ kind: 'path', path });
      }
    }
    // 3) 装车工人：仓库门 ↔ 卡车，搬箱子
    const W = WAREHOUSE, door = { x: W.x1 + 1.0, z: W.z0 + 10 }, truck = { x: this.truckA.x - 0.2, z: this.truckA.z - 2.6 };
    for (let k = 0; k < 5; k++) {
      const per = 3.4 + r() * 0.8, off = k * per / 5;
      const dz = (k - 2) * 0.9;
      add({ kind: 'loop', per, off, a: { x: door.x + 0.5, z: door.z + dz }, b: { x: truck.x - 0.4 + (k % 2) * 0.8, z: truck.z - 0.3 }, shirt: k % 2 ? 0xff6b4a : 0x2b3240, pants: 0x2b3240, carry: true });
    }
    // 早餐摊排队
    const st = this.steamOrigin;
    for (let k = 0; k < 4; k++) add({ kind: 'stand', x: st.x + 1.6 + k * 0.85, z: st.z + 2.4 + (k % 2) * 0.25, h0: Math.PI });
    add({ kind: 'stand', x: st.x + 0.6, z: st.z - 1.5, h0: 0, shirt: 0xffffff });
    // 一个买完早点离开的人
    add({ kind: 'path', path: [{ t: -1, x: st.x + 1.6, z: st.z + 2.4 }, { t: 2.2, x: st.x + 1.6, z: st.z + 2.4 }, { t: 6.5, x: st.x + 14, z: st.z + 14 }, { t: 30, x: st.x + 90, z: st.z + 14 }] });
    // 公交站：候车 → 上车；下车 → 走开
    const bx = A.x + 34, bz = A.z + EW.w / 2 + 2.6;
    for (let k = 0; k < 5; k++) {
      const x = bx - 3 + k * 1.4, z = bz + 0.4 + (k % 2) * 0.5;
      const tBoard = E.busArrive + 0.6 + k * 0.28;
      add({ kind: 'path', vanish: tBoard + 0.75, path: [{ t: -1, x, z, h: Math.PI }, { t: tBoard, x, z, h: Math.PI }, { t: tBoard + 0.75, x: bx + 3.5, z: bz - 1.8 }] });
    }
    for (let k = 0; k < 3; k++) {
      const tOut = E.busArrive + 0.4 + k * 0.35;
      add({ kind: 'path', appear: tOut, path: [{ t: tOut, x: bx + 3.5, z: bz - 1.8 }, { t: tOut + 0.7, x: bx + 3.5 - k, z: bz + 0.8 }, { t: tOut + 6, x: bx + 3.5 - k + (k - 1) * 14, z: bz + 1.2 }, { t: 30, x: bx + (k - 1) * 70, z: bz + 1.2 }] });
    }
    // 4) 站台候车
    for (const side of [-1, 1]) for (let k = 0; k < 16; k++) {
      const s = lerp(STATION.s0 + 4, STATION.s1 - 4, r()), off = side * (STATION.off + (r() - 0.3) * 1.6);
      const p = railPoint(s, off);
      const facing = Math.atan2(-RAIL.n.x * side, -RAIL.n.z * side);
      if (r() < 0.25) add({ kind: 'path', y: 1.1, path: [{ t: -5, x: p.x, z: p.z }, { t: 30, x: p.x + RAIL.d.x * (r() < 0.5 ? 1 : -1) * 40, z: p.z }].map((q, i) => i ? { ...q, z: p.z + RAIL.d.z * (q.x - p.x) / RAIL.d.x } : q) });
      else add({ kind: 'stand', x: p.x, z: p.z, y: 1.1, h0: facing + (r() - 0.5) * 0.8, platform: true, s });
    }
    // 5) 公园跑步、滨河步道
    const L = this.parkLoop;
    for (let k = 0; k < 14; k++) add({ kind: 'run', a0: r() * 6.28, w: (0.12 + r() * 0.05) * (k % 3 ? 1 : -1), ...L, shirt: [0xff6b4a, 0x3ddc97, 0xf2c230, 0x58a6ff, 0xffffff][k % 5] });
    for (let k = 0; k < 18; k++) add({ kind: 'walk', wl: { axis: 'x', fixed: PARK.z1 - 2.4, a: PARK.x0 + 2, b: PARK.x1 - 2 }, s0: r() * 170, v: (1.6 + r() * 2.8) * (r() < 0.5 ? -1 : 1) * (r() < 0.3 ? 2.2 : 1.2), lat: (r() - 0.5) * 2.4 });
    // 码头、工地工人
    for (let k = 0; k < 6; k++) add({ kind: 'stand', x: PORT.x0 + 4 + r() * 40, z: PORT.z0 + 4 + r() * 12, h0: r() * 6, shirt: 0xff8a3d });
    for (let k = 0; k < 6; k++) add({ kind: 'stand', x: SITE.x0 + 8 + r() * 16, z: SITE.z0 + 16 + r() * 18, y: 0.3 + 3.4 * Math.floor(r() * 3), h0: r() * 6, shirt: 0xf2c230 });

    // 几何：躯干（衬衫色）、头（肤色+深色头发）、两条腿（裤色）
    const torsoGeo = partsGeometry([
      { geo: new THREE.BoxGeometry(0.46, 0.62, 0.28), pos: [0, 1.12, 0], color: 0xffffff },
      { geo: new THREE.BoxGeometry(0.13, 0.55, 0.14), pos: [-0.3, 1.1, 0], color: 0xffffff },
      { geo: new THREE.BoxGeometry(0.13, 0.55, 0.14), pos: [0.3, 1.1, 0], color: 0xffffff },
    ]);
    const headGeo = partsGeometry([
      { geo: new THREE.SphereGeometry(0.14, 10, 8), pos: [0, 1.6, 0], color: 0xffffff },
      { geo: new THREE.SphereGeometry(0.15, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.45), pos: [0, 1.62, -0.01], color: 0x2a221c },
    ]);
    const legGeo = new THREE.BoxGeometry(0.17, 0.82, 0.19); legGeo.translate(0, -0.41, 0);
    const boxGeo = new THREE.BoxGeometry(0.5, 0.4, 0.45);
    const n = people.length;
    this.pTorso = new Inst(this.scene, torsoGeo, this.M.plastic, n, { colors: true });
    this.pHead = new Inst(this.scene, headGeo, this.M.plastic, n, { colors: true });
    this.pLegL = new Inst(this.scene, legGeo, this.M.plastic, n, { colors: true });
    this.pLegR = new Inst(this.scene, legGeo, this.M.plastic, n, { colors: true });
    this.pBox = new Inst(this.scene, boxGeo, this.M.matte, n, { colors: true });
    for (const p of people) {
      p.i = this.pTorso.add(); this.pHead.add(); this.pLegL.add(); this.pLegR.add(); this.pBox.add();
      this.pTorso.color(p.i, p.shirt); this.pHead.color(p.i, p.skin); this.pLegL.color(p.i, p.pants); this.pLegR.color(p.i, p.pants); this.pBox.color(p.i, 0xc89a62);
    }
    [this.pTorso, this.pHead, this.pLegL, this.pLegR, this.pBox].forEach((q) => q.done());
    this.people = people;
    this.dyn.push((t, env) => this.updatePeople(t, env));
  }

  updatePeople(t, env) {
    // 走路动作按 12 fps 定格（玩具感），位置连续
    const tStep = Math.floor(t * 12) / 12;
    const E = this.ev;
    for (const p of this.people) {
      let x, z, h, moving = false, y = p.y || 0.06, carry = false, speed = 1, vis = true;
      if (p.kind === 'walk') {
        const len = p.wl.b - p.wl.a; let s = p.s0 + p.v * t; s = ((s % (2 * len)) + 2 * len) % (2 * len);
        const back = s > len; const ss = back ? 2 * len - s : s;
        const c = p.wl.a + ss; const dir = (p.v > 0) !== back ? 1 : -1;
        if (p.wl.axis === 'x') { x = c; z = p.wl.fixed + p.lat; h = dir > 0 ? Math.PI / 2 : -Math.PI / 2; }
        else { x = p.wl.fixed + p.lat; z = c; h = dir > 0 ? 0 : Math.PI; }
        if (p.wl.river && z > RIVER.z0 - 2 && z < RIVER.z1 + 2) y = 0.1;
        if (Math.abs(railOff(x, z)) < 11) vis = false;
        moving = true; speed = Math.abs(p.v);
      } else if (p.kind === 'path') {
        const q = pathAt(p.path, t); x = q.x; z = q.z; h = q.h; moving = q.moving;
        if (p.vanish !== undefined && t > p.vanish) vis = false; if (p.appear !== undefined && t < p.appear) vis = false;
        speed = 2.4;
      } else if (p.kind === 'loop') {
        const u = (((t + p.off) % p.per) + p.per) % p.per / p.per;
        let k; if (u < 0.42) { k = smooth(u / 0.42); x = lerp(p.a.x, p.b.x, k); z = lerp(p.a.z, p.b.z, k); h = Math.atan2(p.b.x - p.a.x, p.b.z - p.a.z); carry = true; moving = true; }
        else if (u < 0.5) { x = p.b.x; z = p.b.z; h = Math.atan2(p.b.x - p.a.x, p.b.z - p.a.z); carry = u < 0.46; }
        else if (u < 0.92) { k = smooth((u - 0.5) / 0.42); x = lerp(p.b.x, p.a.x, k); z = lerp(p.b.z, p.a.z, k); h = Math.atan2(p.a.x - p.b.x, p.a.z - p.b.z); moving = true; }
        else { x = p.a.x; z = p.a.z; h = Math.atan2(p.b.x - p.a.x, p.b.z - p.a.z); carry = u > 0.96; }
        speed = 2.2;
      } else if (p.kind === 'stand') {
        x = p.x; z = p.z; h = p.h0 + 0.15 * Math.sin(t * 0.8 + p.ph);
        if (p.platform && env.trainPassS !== undefined) {
          // 列车经过时转头看
          const near = env.trainNearPerson ? env.trainNearPerson(p.s) : 0;
          h = p.h0 + near * 0.9 * Math.sin(p.ph);
        }
      } else if (p.kind === 'run') {
        const a = p.a0 + p.w * t * 6.28; x = p.cx + Math.cos(a) * p.rx; z = p.cz + Math.sin(a) * p.rz;
        h = Math.atan2(-Math.sin(a) * p.rx * p.w, Math.cos(a) * p.rz * p.w); moving = true; speed = 4.5;
      }
      const i = p.i;
      if (!vis) { this.pTorso.hide(i); this.pHead.hide(i); this.pLegL.hide(i); this.pLegR.hide(i); this.pBox.hide(i); continue; }
      const sc = p.h;
      const cyc = moving ? (tStep * speed * 3.2 + p.ph) : 0;
      const swing = moving ? Math.sin(cyc) * 0.55 : 0;
      const bob = moving ? Math.abs(Math.cos(cyc)) * 0.06 : 0;
      this.pTorso.set(i, x, y + bob, z, h, sc, sc, sc);
      this.pHead.set(i, x, y + bob, z, h, sc, sc, sc);
      const cx = Math.cos(h), sx = Math.sin(h);
      this.pLegL.set(i, x - 0.12 * cx * sc, y + 0.84 * sc + bob, z + 0.12 * sx * sc, h, sc, sc, sc, swing);
      this.pLegR.set(i, x + 0.12 * cx * sc, y + 0.84 * sc + bob, z - 0.12 * sx * sc, h, sc, sc, sc, -swing);
      if (carry) this.pBox.set(i, x + Math.sin(h) * 0.35 * sc, y + 1.25 * sc + bob, z + Math.cos(h) * 0.35 * sc, h, sc, sc, sc); else this.pBox.hide(i);
    }
    [this.pTorso, this.pHead, this.pLegL, this.pLegR, this.pBox].forEach((q) => q.dirty());
  }

  // —— 鸟群：停在电线上，列车经过时惊起，之后落回 ——
  buildBirds() {
    const r = rng(303); const W = this.birdWire;
    const body = partsGeometry([{ geo: new THREE.SphereGeometry(0.22, 8, 6), scale: [1, 0.8, 1.5], color: 0x2b2f36 }, { geo: new THREE.SphereGeometry(0.13, 8, 6), pos: [0, 0.14, 0.27], color: 0x2b2f36 }]);
    const wing = new THREE.BoxGeometry(0.6, 0.04, 0.3); wing.translate(0.3, 0, 0);
    const N = 22;
    this.bBody = new Inst(this.scene, body, this.M.matte, N); this.bWL = new Inst(this.scene, wing, this.M.matte, N); this.bWR = new Inst(this.scene, wing, this.M.matte, N);
    this.birds = [];
    for (let k = 0; k < N; k++) {
      this.bBody.add(); this.bWL.add(); this.bWR.add();
      this.birds.push({ x: lerp(W.x0 + 2, W.x1 - 2, (k + r() * 0.6) / N), line: k % 3, ph: r() * 6.28, dt: r() * 0.35, ang: r() * 6.28, rad: 8 + r() * 14, up: 10 + r() * 10, back: r() * 0.9 });
    }
    [this.bBody, this.bWL, this.bWR].forEach((q) => q.done());
    this.dyn.push((t, env) => {
      const E = this.ev; const W = this.birdWire;
      for (let k = 0; k < this.birds.length; k++) {
        const b = this.birds[k];
        const t0 = E.birdsUp + b.dt, t1 = E.birdsLand + b.back;
        const wz = W.z + (b.line - 1) * 0.7;
        const perch = { x: b.x, y: this.wireY(b.x, b.line, t, env) + 0.18, z: wz };
        let x = perch.x, y = perch.y, z = perch.z, flap = 0, h = Math.PI / 2 + (k % 2 ? 0 : Math.PI);
        if (t > t0 && t < t1 + 1.1) {
          const u = clamp((t - t0) / (t1 + 1.1 - t0));
          // 起飞 → 绕圈 → 落回
          const lift = Math.sin(Math.PI * Math.min(1, u * 1.05)) * b.up;
          const a = b.ang + u * 5.5;
          const R = b.rad * Math.sin(Math.PI * u);
          x = perch.x + Math.cos(a) * R; z = perch.z + Math.sin(a) * R * 0.6 - 6 * Math.sin(Math.PI * u);
          y = perch.y + lift;
          h = a + Math.PI / 2; flap = Math.sin(t * 38 + b.ph) * (u < 0.92 ? 1 : 0.4);
        } else if (t < t0) { h += 0.3 * Math.sin(t * 2 + b.ph) * (t > E.buildup ? 0.3 : 1); }
        this.bBody.set(k, x, y, z, h);
        this.bWL.set(k, x, y + 0.08, z, h, 1, 1, 1, 0, flap ? flap * 0.9 : -0.1);
        this.bWR.set(k, x, y + 0.08, z, h + Math.PI, 1, 1, 1, 0, flap ? flap * 0.9 : -0.1);
      }
      [this.bBody, this.bWL, this.bWR].forEach((q) => q.dirty());
    });
  }

  // —— 「TonyBook 快线」：自有涂装（白车身 + 珊瑚橙车头与腰线 + 薄荷绿细线）——
  buildTrain() {
    const cars = this.cue.train?.cars || 5, carLen = this.cue.train?.carLen || 18, gapL = 0.8;
    this.trainCars = []; this.trainLen = cars * carLen + (cars - 1) * gapL;
    const livery = (nose) => canvasTexture(1024, 128, (g, w, h) => {
      g.fillStyle = '#f7f7f4'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#ff6b4a'; g.fillRect(0, h * 0.70, w, h * 0.12);
      g.fillStyle = '#3ddc97'; g.fillRect(0, h * 0.84, w, h * 0.035);
      g.fillStyle = '#1d2733';
      // 窗带
      g.fillRect(nose ? w * 0.22 : w * 0.04, h * 0.32, nose ? w * 0.76 : w * 0.92, h * 0.22);
      g.fillStyle = 'rgba(160,200,230,0.35)'; for (let x = nose ? w * 0.24 : w * 0.06; x < w * 0.96; x += 46) g.fillRect(x, h * 0.34, 30, h * 0.07);
      // 车门
      g.fillStyle = '#d9dbe0'; g.fillRect(w * 0.12, h * 0.28, 22, h * 0.48); g.fillRect(w * 0.86, h * 0.28, 22, h * 0.48);
      if (!nose) {
        g.fillStyle = '#ff6b4a'; g.font = `900 ${h * 0.17}px "Noto Sans CJK SC"`; g.textAlign = 'left'; g.textBaseline = 'middle';
        g.fillText('TonyBook 快线', w * 0.2, h * 0.62);
      } else {
        g.fillStyle = '#ff6b4a'; g.beginPath(); g.moveTo(0, 0); g.lineTo(w * 0.26, 0); g.lineTo(w * 0.15, h * 0.7); g.lineTo(0, h * 0.7); g.fill();
        g.fillStyle = '#ffffff'; g.font = `900 ${h * 0.2}px "Noto Sans CJK SC"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('TB', w * 0.5, h * 0.62);
      }
    });
    const texCar = livery(false), texNose = livery(true);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.18, metalness: 0.05, envMapIntensity: 1.4 });
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xff6b4a, roughness: 0.18, envMapIntensity: 1.4 });
    this.envMats.push(bodyMat, noseMat);
    // 车身：分段盒子，车头沿长度方向收窄、压低
    const makeBody = (nose) => {
      const g = new THREE.BoxGeometry(3.3, 3.7, carLen, 1, 1, 24); const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
        const u = (z + carLen / 2) / carLen; // 0 后 → 1 前
        if (nose) {
          const k = smooth((u - 0.45) / 0.55); // 车头渐变
          x *= 1 - 0.42 * k * k; const top = 1.85 - 3.0 * k * k; if (y > 0) y = Math.min(y, top + (y - 1.85) * 0) * (1 - 0.0 * k);
          if (y > 0) y = lerp(y, top, 1); else y *= 1 - 0.25 * k * k;
          z = z + 0;
        }
        // 车顶圆角
        if (y > 1.5 && Math.abs(x) > 1.2) y -= 0.25;
        p.setXYZ(i, x, y + 2.25, z);
      }
      g.computeVertexNormals(); return g;
    };
    const geoCar = makeBody(false), geoNose = makeBody(true);
    const side = (tex, len) => { const g = new THREE.PlaneGeometry(len, 3.0); const m = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.2, envMapIntensity: 1.3, polygonOffset: true, polygonOffsetFactor: -2 }); this.envMats.push(m); return { g, m }; };
    const sideCar = side(texCar, carLen * 0.96), sideNose = side(texNose, carLen * 0.62);
    for (let k = 0; k < cars; k++) {
      const grp = new THREE.Group();
      const isNose = k === 0, isTail = k === cars - 1;
      const geo = isNose || isTail ? geoNose : geoCar;
      const body = new THREE.Mesh(geo, bodyMat); body.castShadow = true; body.receiveShadow = true;
      if (isTail) body.rotation.y = Math.PI;
      grp.add(body);
      if (isNose || isTail) {
        // 车头珊瑚橙罩 + 挡风玻璃
        const cap = new THREE.Mesh(geoNose, noseMat); cap.scale.set(1.004, 1.004, 1.004); cap.castShadow = false;
        const clipMat = new THREE.MeshStandardMaterial({ color: 0x14202c, roughness: 0.05, metalness: 0.3, envMapIntensity: 2 }); this.envMats.push(clipMat);
        const clip = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.0, 3.2), clipMat);
        clip.position.set(0, 3.15, carLen / 2 - 6.8); clip.rotation.x = 0.28;
        const nz = new THREE.Group(); nz.add(clip); if (isTail) nz.rotation.y = Math.PI; grp.add(nz);
        // 车灯
        const hl = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 0.4), new THREE.MeshBasicMaterial({ color: isNose ? new THREE.Color(4, 3.8, 3.4) : new THREE.Color(5, 0.3, 0.2), toneMapped: false }));
        hl.position.set(0, 1.4, (isTail ? -1 : 1) * (carLen / 2 - 0.4)); grp.add(hl);
        if (isTail) this.tailLight = hl; else this.headLight = hl;
      }
      for (const sg of [-1, 1]) {
        const sd = isNose || isTail ? sideNose : sideCar;
        const pl = new THREE.Mesh(sd.g, sd.m);
        pl.position.set(sg * 1.66, 3.05, isNose ? -carLen * 0.18 : isTail ? carLen * 0.18 : 0);
        pl.rotation.y = sg * Math.PI / 2; if (sg < 0) pl.rotation.y = -Math.PI / 2;
        if ((isNose && sg < 0) || (isTail && sg > 0) || (!isNose && !isTail && sg < 0)) pl.scale.x = -1; // 文字朝外不镜像
        if (sg < 0) { pl.rotation.y = -Math.PI / 2; pl.scale.x = (isTail) ? -1 : 1; } else { pl.rotation.y = Math.PI / 2; pl.scale.x = isTail ? -1 : 1; }
        grp.add(pl);
      }
      // 车顶：浅灰顶板 + 两条珊瑚橙饰带（俯拍时能看见涂装）
      const roofG = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.12, carLen * (isNose || isTail ? 0.55 : 0.94)), new THREE.MeshPhongMaterial({ color: 0xd9dde2, shininess: 70 }));
      roofG.position.set(0, 6.0, isNose ? -carLen * 0.2 : isTail ? carLen * 0.2 : 0); grp.add(roofG);
      for (const sg of [-1, 1]) { const st = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.14, carLen * (isNose || isTail ? 0.6 : 0.96)), new THREE.MeshPhongMaterial({ color: 0xff6b4a, shininess: 80 })); st.position.set(sg * 1.35, 5.92, isNose ? -carLen * 0.18 : isTail ? carLen * 0.18 : 0); grp.add(st); }
      // 转向架、车间连接、受电弓
      for (const bz of [-carLen * 0.33, carLen * 0.33]) { const b = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.9, 3.4), new THREE.MeshPhongMaterial({ color: 0x2b2f36, shininess: 36 })); b.position.set(0, 0.75, bz); grp.add(b); }
      if (k < cars - 1) { const g2 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.0, gapL + 0.3), new THREE.MeshPhongMaterial({ color: 0x3a3f46, shininess: 27 })); g2.position.set(0, 3.2, -carLen / 2 - gapL / 2); grp.add(g2); }
      if (k === 1 || k === cars - 2) {
        const pan = new THREE.Group();
        const base = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.25, 2.2), this.M.steel); base.position.y = 6.05; pan.add(base);
        const arm1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 1.9), this.M.steel); arm1.position.set(0, 6.5, -0.2); arm1.rotation.x = 0.55; pan.add(arm1);
        const arm2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 1.4), this.M.steel); arm2.position.set(0, 6.9, -0.4); arm2.rotation.x = -0.7; pan.add(arm2);
        const head = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 0.3), this.M.steel); head.position.set(0, 7.3, -0.6); pan.add(head);
        pan.children.forEach((c) => (c.castShadow = true));
        grp.add(pan);
      }
      grp.traverse((o) => { if (o.isMesh) { o.castShadow = true; } });
      this.scene.add(grp); this.trainCars.push({ grp, k, offset: k * (carLen + gapL) + carLen / 2 });
    }
    this.carLen = carLen;
  }

  trainFront(t) {
    const tr = this.cue.train; const E = this.ev;
    // 头车前端沿线位置：匀速，从画外驶入
    return tr.s0 + tr.speed * (t - E.trainIn);
  }

  updateTrain(t) {
    const front = this.trainFront(t);
    const ry = Math.atan2(RAIL.d.x, RAIL.d.z);
    for (const c of this.trainCars) {
      const s = front - c.offset;
      const p = railPoint(s, RAIL.track * this.cue.train.track);
      const bridge = p.z > RIVER.z0 - 2 && p.z < RIVER.z1 + 2;
      const visible = s > -280 && s < 420 && Math.abs(p.x) < 175 && Math.abs(p.z) < 320;
      c.grp.visible = visible;
      // 车厢在板边外时隐藏（像钻进隧道口）
      const inside = Math.abs(p.x) < BOARD.x1 - 1 && Math.abs(p.z) < BOARD.z1 - 1;
      c.grp.visible = visible && inside;
      c.grp.position.set(p.x, bridge ? 0.48 : 0.55, p.z); c.grp.rotation.y = ry;
    }
  }

  // —— 揭示：桌面、墙、沙盘边框、桌上小物（比例参照）——
  buildRoom() {
    const B = BOARD, m = new Merger();
    // 沙盘木框
    const fr = 3.0;
    m.box(B.x1 - B.x0 + fr * 2, B.thick + 1.2, fr, 0, -B.thick / 2 + 0.3, B.z0 - fr / 2, 0x4a3426);
    m.box(B.x1 - B.x0 + fr * 2, B.thick + 1.2, fr, 0, -B.thick / 2 + 0.3, B.z1 + fr / 2, 0x4a3426);
    m.box(fr, B.thick + 1.2, B.z1 - B.z0, B.x0 - fr / 2, -B.thick / 2 + 0.3, 0, 0x4a3426);
    m.box(fr, B.thick + 1.2, B.z1 - B.z0, B.x1 + fr / 2, -B.thick / 2 + 0.3, 0, 0x4a3426);
    this.addMerged(m, this.M.plastic);
    // 河道在边框处用透明亚克力封口（简化为浅色框条）
    // 桌面
    const table = new THREE.Mesh(new THREE.BoxGeometry(1700, 10, 1500), this.M.wood);
    this.M.wood.map.repeat.set(3, 3);
    table.position.set(0, -B.thick - 5, 120); table.receiveShadow = true; this.scene.add(table);
    // 绿色切割垫（模型师的桌面），网格线一眼看出「这是桌上的模型」
    const matTex = canvasTexture(2048, 2048, (g, w, h) => {
      g.fillStyle = '#2f6b57'; g.fillRect(0, 0, w, h);
      for (let k = 0; k <= 64; k++) { const x = k * w / 64; g.fillStyle = k % 8 === 0 ? 'rgba(220,240,230,0.55)' : 'rgba(220,240,230,0.18)'; g.fillRect(x - (k % 8 === 0 ? 1.5 : 0.6), 0, k % 8 === 0 ? 3 : 1.2, h); g.fillRect(0, x - (k % 8 === 0 ? 1.5 : 0.6), w, k % 8 === 0 ? 3 : 1.2); }
      g.strokeStyle = 'rgba(240,250,245,0.35)'; g.lineWidth = 2; for (let a = 1; a <= 3; a++) { g.beginPath(); g.moveTo(0, h * a / 4); g.lineTo(w * a / 4, 0); g.stroke(); }
      g.fillStyle = 'rgba(230,245,238,0.7)'; g.font = '700 28px "Noto Sans CJK SC"'; for (let k = 0; k <= 8; k++) g.fillText(String(k * 5), k * w / 8 + 6, 30);
    });
    const mat = new THREE.Mesh(new THREE.BoxGeometry(620, 0.6, 900), new THREE.MeshPhongMaterial({ map: matTex, shininess: 12 }));
    mat.position.set(0, -B.thick + 0.3, 60); mat.receiveShadow = true; this.scene.add(mat);
    // 墙（远处），带一块窗光
    const wallTex = canvasTexture(1024, 512, (g, w, h) => {
      const grd = g.createLinearGradient(0, 0, 0, h); grd.addColorStop(0, '#e9e2d6'); grd.addColorStop(1, '#d8cfc0'); g.fillStyle = grd; g.fillRect(0, 0, w, h);
      const rg = g.createRadialGradient(w * 0.68, h * 0.45, 10, w * 0.68, h * 0.45, h * 0.7); rg.addColorStop(0, 'rgba(255,246,226,0.9)'); rg.addColorStop(1, 'rgba(255,246,226,0)'); g.fillStyle = rg; g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(255,250,240,0.55)'; g.fillRect(w * 0.55, h * 0.2, w * 0.12, h * 0.5); g.fillRect(w * 0.69, h * 0.2, w * 0.12, h * 0.5);
    });
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(2400, 1100), new THREE.MeshBasicMaterial({ map: wallTex }));
    wall.position.set(0, 380, -640); this.scene.add(wall);
    // 马克杯（直径 ~13 米 ≈ 8.5 厘米）
    const mug = new THREE.Group();
    const mugMat = new THREE.MeshPhongMaterial({ color: 0xff6b4a, shininess: 62 });
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 6.5, 14, 32, 1, true), mugMat); cyl.position.y = 7; mug.add(cyl);
    const bottom = new THREE.Mesh(new THREE.CylinderGeometry(6.5, 6.5, 0.8, 32), mugMat); bottom.position.y = 0.4; mug.add(bottom);
    const coffee = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 6.2, 0.2, 32), new THREE.MeshPhongMaterial({ color: 0x3b2314, shininess: 81 })); coffee.position.y = 12.5; mug.add(coffee);
    const inner = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 6.2, 13.6, 32, 1, true), new THREE.MeshPhongMaterial({ color: 0xf6efe0, shininess: 54, side: THREE.BackSide })); inner.position.y = 7.1; mug.add(inner);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.9, 10, 20, Math.PI), mugMat); handle.position.set(6.6, 7.5, 0); handle.rotation.z = -Math.PI / 2; mug.add(handle);
    mug.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    mug.position.set(B.x1 + 34, -B.thick, 210); mug.rotation.y = -0.6; this.scene.add(mug);
    // 铅笔（~27 米 ≈ 18 厘米）、钢尺
    const pencil = new THREE.Group();
    const pbody = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 26, 6), new THREE.MeshPhongMaterial({ color: 0xf2c230, shininess: 54 })); pencil.add(pbody);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.55, 2.4, 6), new THREE.MeshPhongMaterial({ color: 0xe9c79a, shininess: 36 })); tip.position.y = 14.2; pencil.add(tip);
    const lead = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.8, 6), new THREE.MeshPhongMaterial({ color: 0x222222 })); lead.position.y = 15.4; pencil.add(lead);
    const eras = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 1.6, 6), new THREE.MeshPhongMaterial({ color: 0xf28cb1 })); eras.position.y = -13.8; pencil.add(eras);
    pencil.rotation.z = Math.PI / 2; pencil.rotation.y = 0.35; pencil.position.set(B.x0 - 40, -B.thick + 0.6, 250);
    pencil.traverse((o) => { if (o.isMesh) o.castShadow = true; }); this.scene.add(pencil);
    const rulerTex = canvasTexture(1024, 64, (g, w, h) => { g.fillStyle = '#d8dde2'; g.fillRect(0, 0, w, h); g.fillStyle = '#2b2f36'; for (let k = 0; k <= 150; k++) { const x = 12 + k * (w - 24) / 150; g.fillRect(x, 0, 1.5, k % 10 === 0 ? h * 0.55 : k % 5 === 0 ? h * 0.38 : h * 0.25); } g.font = '700 16px "Noto Sans CJK SC"'; for (let k = 0; k <= 15; k++) g.fillText(String(k), 8 + k * (w - 24) / 15, h * 0.85); });
    const ruler = new THREE.Mesh(new THREE.BoxGeometry(45, 0.3, 4.2), [this.M.steel, this.M.steel, new THREE.MeshPhongMaterial({ map: rulerTex, shininess: 62 }), this.M.steel, this.M.steel, this.M.steel]);
    ruler.position.set(B.x1 + 30, -B.thick + 0.2, 300); ruler.rotation.y = 0.25; ruler.receiveShadow = true; this.scene.add(ruler);
  }

  // —— 标题铭牌：立在沙盘前沿，跟随透视 ——
  buildTitle() {
    const T = this.cue.title;
    const tex = canvasTexture(2048, 640, (g, w, h) => {
      // 深色木底 + 黄铜描边
      const grd = g.createLinearGradient(0, 0, 0, h); grd.addColorStop(0, '#2a211b'); grd.addColorStop(1, '#1a1411'); g.fillStyle = grd; g.fillRect(0, 0, w, h);
      g.strokeStyle = '#c9a25a'; g.lineWidth = 10; g.strokeRect(22, 22, w - 44, h - 44);
      g.strokeStyle = 'rgba(201,162,90,0.5)'; g.lineWidth = 3; g.strokeRect(40, 40, w - 80, h - 80);
      g.textAlign = 'center'; g.textBaseline = 'alphabetic';
      const brass = g.createLinearGradient(0, 120, 0, 380); brass.addColorStop(0, '#f6dc9a'); brass.addColorStop(0.5, '#d9ad5c'); brass.addColorStop(1, '#b58a3e');
      g.fillStyle = brass; g.font = `900 250px "Noto Sans CJK SC"`; g.fillText(T.main, w / 2, 340);
      g.fillStyle = '#ffffff'; g.font = `500 112px "Noto Sans CJK SC"`; g.fillText(T.sub, w / 2, 510);
      g.fillStyle = '#c9a25a'; g.font = `700 44px "Noto Sans CJK SC"`; g.textAlign = 'right'; g.fillText(T.scale || '比例 1:150', w - 80, h - 70);
      g.textAlign = 'left'; g.fillStyle = '#ff6b4a'; g.fillRect(80, h - 104, 56, 56); g.fillStyle = '#3ddc97'; g.fillRect(146, h - 104, 56, 56);
    });
    tex.anisotropy = 16;
    const W = this.cue.title.width || 226, H = W * 640 / 2048;
    const plate = new THREE.Group();
    const face = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshPhongMaterial({ map: tex, shininess: 58, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.25 }));
    face.position.z = 1.01; plate.add(face);
    const back = new THREE.Mesh(new THREE.BoxGeometry(W + 3, H + 3, 2), new THREE.MeshPhongMaterial({ color: 0x2a211b, shininess: 54 })); plate.add(back);
    back.castShadow = true; face.receiveShadow = true;
    const stand = new THREE.Mesh(new THREE.BoxGeometry(W * 0.7, 2.4, 14), new THREE.MeshPhongMaterial({ color: 0x2a211b, shininess: 45 })); stand.position.set(0, -H / 2 - 0.4, -4); plate.add(stand);
    plate.rotation.x = -0.62; // 后仰，朝向斜上方的相机
    const tp = T.pos || [0, 0, BOARD.z1 + 34];
    plate.position.set(tp[0], -BOARD.thick + H / 2 * Math.cos(0.62) + 1.4, tp[2]);
    this.scene.add(plate); this.titlePlate = plate; this.titleH = H;
  }

  update(t, env) {
    this.updateTrain(t);
    for (const f of this.dyn) f(t, env);
  }
}
