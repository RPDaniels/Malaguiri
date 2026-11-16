/* El retrato borrado — arte dibujado por código (320x160) */
'use strict';
const W = 320, H = 160;

function R(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function mk(w, h) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const c = cv.getContext('2d'); c.imageSmoothingEnabled = false; return [cv, c]; }
function line(c, x0, y0, x1, y1, col) { // bresenham
  x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0; c.fillStyle = col;
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1; let e = dx + dy;
  for (;;) { c.fillRect(x0, y0, 1, 1); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } }
}
function noise(c, x, y, w, h, amt, seed) {
  const id = c.getImageData(x, y, w, h), d = id.data, r = rng(seed || 7);
  for (let i = 0; i < d.length; i += 4) { const n = (r() - 0.5) * amt; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  c.putImageData(id, x, y);
}

/* ---------- fuente 3x5 para rótulos ---------- */
const F35 = { A: '757', B: '', };
const GLY = {
  A: ['010', '101', '111', '101', '101'], B: ['110', '101', '110', '101', '110'], C: ['011', '100', '100', '100', '011'],
  D: ['110', '101', '101', '101', '110'], E: ['111', '100', '110', '100', '111'], F: ['111', '100', '110', '100', '100'],
  G: ['011', '100', '101', '101', '011'], H: ['101', '101', '111', '101', '101'], I: ['111', '010', '010', '010', '111'],
  J: ['001', '001', '001', '101', '010'], K: ['101', '101', '110', '101', '101'], L: ['100', '100', '100', '100', '111'],
  M: ['101', '111', '111', '101', '101'], N: ['110', '101', '101', '101', '101'], O: ['010', '101', '101', '101', '010'],
  P: ['110', '101', '110', '100', '100'], Q: ['010', '101', '101', '110', '011'], R: ['110', '101', '110', '101', '101'],
  S: ['011', '100', '010', '001', '110'], T: ['111', '010', '010', '010', '010'], U: ['101', '101', '101', '101', '111'],
  V: ['101', '101', '101', '101', '010'], W: ['101', '101', '111', '111', '101'], X: ['101', '101', '010', '101', '101'],
  Y: ['101', '101', '010', '010', '010'], Z: ['111', '001', '010', '100', '111'], ' ': ['000', '000', '000', '000', '000'],
  '7': ['111', '001', '010', '010', '010'], '.': ['000', '000', '000', '000', '010'], '-': ['000', '000', '111', '000', '000']
};
function text35(c, s, x, y, col) {
  c.fillStyle = col;
  for (const ch of s) { const g = GLY[ch] || GLY[' ']; for (let r = 0; r < 5; r++) for (let k = 0; k < 3; k++) if (g[r][k] === '1') c.fillRect(x + k, y + r, 1, 1); x += 4; }
}

/* ---------- FONDO: calle de la casa (Perchel) ---------- */
function drawCalle(opt) {
  const [cv, c] = mk(W, H), r = rng(11);
  // cielo
  const sky = ['#2f8fe0', '#3a9be6', '#49a8ec', '#5cb5f1', '#72c2f5', '#8bcff8'];
  sky.forEach((col, i) => R(c, 0, i * 6, W, 6, col));
  R(c, 0, 36, W, 10, '#a3daf9');
  // nubes
  [[40, 8, 26], [210, 5, 34], [150, 14, 18]].forEach(([x, y, w]) => { R(c, x, y, w, 3, '#eaf6fd'); R(c, x + 4, y - 2, w - 10, 2, '#ffffff'); });
  // --- edificio izquierdo: carnicería ---
  R(c, 0, 16, 98, 104, '#f1eadb'); R(c, 0, 12, 98, 5, '#c1603a'); for (let x = 0; x < 98; x += 4) R(c, x, 12, 2, 5, '#a84d2c');
  R(c, 94, 16, 4, 104, '#d9d0bc');
  // ventana alta con persiana
  R(c, 14, 22, 20, 18, '#3d6b4f'); for (let y = 23; y < 40; y += 2) R(c, 14, y, 20, 1, '#2f5540'); R(c, 13, 40, 22, 2, '#bdb39c');
  R(c, 60, 22, 20, 18, '#3d6b4f'); for (let y = 23; y < 40; y += 2) R(c, 60, y, 20, 1, '#2f5540'); R(c, 59, 40, 22, 2, '#bdb39c');
  // rótulo
  R(c, 4, 46, 90, 15, '#6e1717'); R(c, 4, 46, 90, 1, '#8f2a2a'); R(c, 4, 60, 90, 1, '#4a0f0f');
  text35(c, 'CARNICERIA', 29, 48, '#f6d776'); text35(c, 'CRISTO DE LA EPIDEMIA', 7, 54, '#fff3c4');
  // toldo
  for (let x = 2; x < 96; x += 6) { R(c, x, 62, 3, 7, '#d8322f'); R(c, x + 3, 62, 3, 7, '#f7f2e8'); }
  for (let x = 2; x < 96; x += 6) { R(c, x, 69, 3, 2, '#b12522'); R(c, x + 3, 69, 3, 2, '#d9d2c4'); }
  // escaparate
  R(c, 8, 73, 54, 38, '#2b1f1b'); R(c, 9, 74, 52, 36, '#3a2a25');
  R(c, 9, 76, 52, 1, '#8a8a8a');
  [[14, 78], [24, 78], [34, 78], [44, 78], [53, 78]].forEach(([x, y], i) => { R(c, x + 1, y - 1, 1, 3, '#c9c9c9'); R(c, x, y + 2, 4, 9, i % 2 ? '#8a3a26' : '#a04a30'); R(c, x + 1, y + 11, 2, 3, '#70301f'); R(c, x, y + 2, 1, 6, '#c2664a'); });
  R(c, 12, 98, 46, 10, '#e9e4d8'); for (let x = 14; x < 56; x += 7) { R(c, x, 100, 5, 3, '#c0392b'); R(c, x + 1, 104, 4, 2, '#e8b7a8'); }
  R(c, 9, 96, 52, 1, '#1a1210');
  // puerta carnicería
  R(c, 68, 73, 22, 46, '#27433a'); R(c, 70, 76, 18, 20, '#5e8f86'); R(c, 70, 76, 18, 2, '#89b8b0'); R(c, 86, 98, 2, 4, '#d8c26a');
  R(c, 0, 112, 98, 8, '#8f8672');
  // --- casa de Trini ---
  R(c, 98, 14, 132, 106, '#fbf7ec'); R(c, 98, 10, 132, 5, '#c1603a'); for (let x = 98; x < 230; x += 4) R(c, x, 10, 2, 5, '#a84d2c');
  // desconchones
  for (let i = 0; i < 26; i++) R(c, 100 + r() * 126, 18 + r() * 78, 2 + r() * 5, 1 + r() * 2, r() > .5 ? '#ece5d3' : '#f3ecda');
  R(c, 98, 100, 132, 20, '#d39a38'); R(c, 98, 100, 132, 2, '#e6b455'); R(c, 98, 117, 132, 3, '#a87424');
  // ventana alta
  R(c, 146, 22, 22, 20, '#33414f'); R(c, 145, 21, 24, 1, '#cfc6ae'); R(c, 145, 42, 24, 2, '#cfc6ae'); R(c, 156, 22, 1, 20, '#cfc6ae');
  R(c, 143, 44, 28, 2, '#2b2b2b'); for (let x = 144; x < 171; x += 3) R(c, x, 36, 1, 8, '#2b2b2b'); R(c, 143, 36, 28, 1, '#2b2b2b');
  // hueco de la puerta (la hoja se dibuja encima)
  R(c, 136, 54, 40, 66, '#5a3c22'); R(c, 138, 56, 36, 64, '#1c1611');
  R(c, 136, 50, 40, 5, '#7a5530'); R(c, 140, 46, 32, 5, '#7a5530'); R(c, 143, 49, 26, 5, '#2a323a'); for (let x = 145; x < 168; x += 4) R(c, x, 49, 1, 5, '#7a5530');
  // azulejo número
  R(c, 180, 52, 9, 9, '#f3f6fb'); R(c, 180, 52, 9, 1, '#2f62b0'); R(c, 180, 60, 9, 1, '#2f62b0'); R(c, 180, 52, 1, 9, '#2f62b0'); R(c, 188, 52, 1, 9, '#2f62b0'); text35(c, '7', 183, 54, '#2f62b0');
  // reja
  R(c, 192, 58, 26, 38, '#28323c'); R(c, 193, 59, 24, 36, '#36434f');
  R(c, 195, 62, 9, 30, '#e8e0cc'); R(c, 206, 62, 9, 30, '#ddd4bd'); // visillos
  R(c, 190, 56, 30, 2, '#1b1b1b'); R(c, 190, 96, 30, 2, '#1b1b1b'); for (let x = 191; x < 220; x += 3) R(c, x, 56, 1, 42, '#1b1b1b'); R(c, 190, 70, 30, 1, '#1b1b1b'); R(c, 190, 84, 30, 1, '#1b1b1b');
  R(c, 189, 98, 32, 3, '#cfc6ae');
  // jazmín trepando
  const jz = rng(5);
  for (let i = 0; i < 150; i++) { const x = 186 + jz() * 40, y = 44 + jz() * 62; if (x > 193 && x < 217 && y > 60 && y < 94 && jz() > .25) continue; R(c, x, y, 2 + jz() * 2, 2, jz() > .5 ? '#2f7a3c' : '#3f9349'); }
  for (let i = 0; i < 60; i++) { const x = 186 + jz() * 40, y = 44 + jz() * 62; if (x > 194 && x < 216 && y > 61 && y < 93 && jz() > .2) continue; R(c, x, y, 1, 1, '#ffffff'); if (jz() > .6) R(c, x + 1, y, 1, 1, '#fff7c9'); }
  // --- arco al patio ---
  R(c, 230, 14, 34, 106, '#f8f3e6'); R(c, 230, 10, 34, 5, '#c1603a'); for (let x = 230; x < 264; x += 4) R(c, x, 10, 2, 5, '#a84d2c');
  R(c, 230, 100, 34, 20, '#d39a38'); R(c, 230, 100, 34, 2, '#e6b455');
  R(c, 236, 66, 22, 54, '#1f3a28'); R(c, 238, 62, 18, 4, '#1f3a28'); R(c, 241, 60, 12, 2, '#1f3a28');
  R(c, 240, 84, 14, 36, '#3c7a45'); R(c, 242, 78, 10, 6, '#3c7a45'); R(c, 243, 96, 8, 24, '#e7c98a'); R(c, 244, 108, 6, 12, '#f1dca6');
  [[241, 82], [250, 88], [244, 92], [252, 80], [240, 100], [253, 99]].forEach(([x, y]) => R(c, x, y, 2, 2, '#e23a7a'));
  R(c, 234, 62, 2, 58, '#d9cfb6'); R(c, 258, 62, 2, 58, '#d9cfb6');
  R(c, 236, 50, 22, 8, '#f3f6fb'); R(c, 236, 50, 22, 1, '#2f62b0'); R(c, 236, 57, 22, 1, '#2f62b0'); text35(c, 'PATIO', 238, 52, '#2f62b0');
  // --- edificio derecho con balcón ---
  R(c, 264, 20, 56, 100, '#f2d58c'); R(c, 264, 16, 56, 5, '#c1603a'); for (let x = 264; x < 320; x += 4) R(c, x, 16, 2, 5, '#a84d2c');
  R(c, 264, 20, 3, 100, '#d9bb6f'); R(c, 264, 104, 56, 16, '#b98a3a');
  R(c, 278, 26, 32, 34, '#3a2d28'); R(c, 280, 28, 28, 32, '#4b3a33'); R(c, 277, 25, 34, 1, '#fff6dc');
  R(c, 274, 60, 40, 3, '#8a8a8a'); R(c, 274, 46, 40, 1, '#1b1b1b'); for (let x = 275; x < 314; x += 3) R(c, x, 46, 1, 14, '#1b1b1b');
  [[276, 56], [308, 56]].forEach(([x, y]) => { R(c, x, y, 5, 4, '#b5562f'); R(c, x - 1, y - 4, 7, 4, '#2f7a3c'); R(c, x, y - 5, 2, 2, '#e02828'); R(c, x + 3, y - 4, 2, 2, '#e02828'); });
  R(c, 282, 72, 22, 48, '#2f5a3a'); R(c, 284, 75, 8, 18, '#3c7049'); R(c, 294, 75, 8, 18, '#3c7049'); R(c, 284, 97, 8, 18, '#3c7049'); R(c, 294, 97, 8, 18, '#3c7049'); R(c, 302, 96, 1, 3, '#d8c26a');
  // --- calle ---
  R(c, 0, 120, W, 40, '#b7a78c'); R(c, 0, 120, W, 3, '#d8ccb4'); R(c, 0, 123, W, 1, '#8e8068');
  const st = rng(21);
  for (let y = 125; y < 160; y += 5) for (let x = -4 + ((y / 5) % 2) * 4; x < W; x += 9) { const s = st(); R(c, x, y, 8, 4, s > .66 ? '#c4b59a' : s > .33 ? '#ab9b80' : '#b9a98d'); R(c, x, y + 3, 8, 1, '#9a8b72'); }
  // sombra de las casas
  c.fillStyle = 'rgba(40,30,60,.22)'; c.fillRect(0, 120, W, 6);
  // farolillos
  const lan = ['#e23b3b', '#f4c430', '#35a852', '#3a7bd5', '#ee6fa3', '#f08a24'];
  let px = 0, py = 18;
  for (let x = 0; x <= W; x += 2) { const y = 16 + Math.round(5 * Math.sin((x / W) * Math.PI) + 2 * Math.sin((x / 53) * Math.PI)); line(c, px, py, x, y, '#3a3a3a'); px = x; py = y; if (x % 20 === 10) { const col = lan[(x / 20 | 0) % lan.length]; R(c, x - 2, y + 1, 5, 6, col); R(c, x - 1, y + 2, 1, 4, 'rgba(255,255,255,.45)'); R(c, x - 1, y + 7, 3, 1, '#2b2b2b'); R(c, x, y + 8, 1, 2, col); } }
  // maleta de Karen
  if (!(opt && opt.sinMaleta)) R(c, 40, 118, 13, 13, '#2c5aa0'); if (!(opt && opt.sinMaleta)) { R(c, 40, 118, 13, 2, '#4f7fc8'); R(c, 45, 114, 3, 4, '#1c1c1c'); R(c, 42, 123, 9, 1, '#1f437a'); R(c, 41, 131, 2, 2, '#1c1c1c'); R(c, 50, 131, 2, 2, '#1c1c1c'); R(c, 47, 120, 4, 3, '#f1e8c8'); }
  noise(c, 0, 0, W, H, 9, 3);
  return cv;
}

/* ---------- FONDO: casa de Trini ---------- */
function drawCasa() {
  const [cv, c] = mk(W, H), r = rng(31);
  R(c, 0, 0, W, 114, '#d6b377');
  for (let i = 0; i < 90; i++) R(c, r() * W, 8 + r() * 86, 3 + r() * 14, 1 + r() * 3, r() > .5 ? '#cfa96b' : '#dfc08a');
  for (let i = 0; i < 9; i++) { const x = r() * W, y = 10 + r() * 60; R(c, x, y, 6 + r() * 10, 4 + r() * 6, '#c79d5e'); R(c, x + 1, y + 1, 4, 2, '#e8d3a6'); }
  // vigas
  R(c, 0, 0, W, 9, '#4a3020'); for (let x = 12; x < W; x += 46) { R(c, x, 0, 9, 12, '#3a2416'); R(c, x, 11, 9, 1, '#2a1a10'); }
  // zócalo de azulejos
  R(c, 0, 96, W, 18, '#f1f1ea'); for (let x = 0; x < W; x += 9) { R(c, x, 96, 1, 18, '#b9c4d6'); R(c, x + 3, 100, 3, 3, '#2f62b0'); R(c, x + 4, 106, 1, 4, '#d6a12a'); R(c, x + 2, 108, 5, 1, '#2f62b0'); }
  R(c, 0, 96, W, 1, '#2f62b0'); R(c, 0, 113, W, 1, '#2f62b0');
  // suelo
  R(c, 0, 114, W, 46, '#b0603a');
  for (let y = 114, k = 0; y < 160; y += 6 + k, k++) { R(c, 0, y, W, 1, '#8c4a2b'); }
  for (let i = -8; i < 26; i++) line(c, 160 + i * 9, 114, 160 + i * 22, 160, '#96512f');
  for (let i = 0; i < 120; i++) R(c, r() * W, 116 + r() * 44, 2, 1, r() > .5 ? '#c07a52' : '#9d5532');
  // ventana con reja y luz
  R(c, 16, 28, 44, 58, '#4a3020'); R(c, 19, 31, 38, 52, '#cfeaff'); R(c, 19, 31, 38, 18, '#a6d8ff'); R(c, 19, 62, 38, 21, '#f6f0d4');
  for (let x = 22; x < 57; x += 5) R(c, x, 31, 1, 52, '#1b1b1b'); R(c, 19, 44, 38, 1, '#1b1b1b'); R(c, 19, 66, 38, 1, '#1b1b1b');
  R(c, 14, 86, 48, 3, '#3a2416');
  c.fillStyle = 'rgba(255,240,170,.16)'; c.beginPath(); c.moveTo(19, 31); c.lineTo(57, 31); c.lineTo(150, 160); c.lineTo(60, 160); c.closePath(); c.fill();
  // espejo
  R(c, 96, 34, 22, 46, '#b8892e'); R(c, 98, 36, 18, 42, '#8fa9b6'); R(c, 100, 38, 4, 16, '#c4d8e0'); R(c, 106, 60, 6, 2, '#7c95a1'); R(c, 96, 34, 22, 1, '#e3c05e');
  // clavo y marca del retrato (el cuadro se dibuja encima)
  R(c, 136, 22, 52, 60, '#e2c690'); R(c, 161, 19, 2, 3, '#3a3a3a');
  // mesita de la hucha
  R(c, 110, 98, 22, 3, '#6b4426'); R(c, 112, 101, 2, 17, '#553419'); R(c, 128, 101, 2, 17, '#553419'); R(c, 110, 98, 22, 1, '#8a5c36');
  // cómoda
  R(c, 198, 80, 66, 38, '#6f4526'); R(c, 198, 80, 66, 2, '#93623a'); R(c, 196, 78, 70, 3, '#5a3519');
  [84, 95, 106].forEach(y => { R(c, 201, y, 60, 9, '#7f5330'); R(c, 201, y + 8, 60, 1, '#4b2c15'); R(c, 214, y + 3, 3, 2, '#d8b24a'); R(c, 245, y + 3, 3, 2, '#d8b24a'); });
  R(c, 200, 118, 3, 3, '#3d2412'); R(c, 259, 118, 3, 3, '#3d2412');
  // tapete de ganchillo sobre la cómoda
  R(c, 212, 77, 40, 2, '#f4efe0'); for (let x = 212; x < 252; x += 3) R(c, x, 79, 2, 1, '#f4efe0');
  // balda y radio
  R(c, 262, 60, 34, 2, '#5a3519'); R(c, 264, 62, 2, 5, '#5a3519'); R(c, 292, 62, 2, 5, '#5a3519');
  R(c, 266, 46, 26, 14, '#7a4a25'); R(c, 266, 46, 26, 2, '#9c6a3c'); R(c, 268, 49, 12, 8, '#d9c79a'); for (let y = 50; y < 57; y += 2) R(c, 268, y, 12, 1, '#a8956a'); R(c, 283, 50, 6, 6, '#2b2b2b'); R(c, 285, 52, 2, 2, '#d8b24a');
  // caballete
  line(c, 282, 62, 274, 120, '#5a3519'); line(c, 296, 62, 306, 120, '#5a3519'); line(c, 289, 60, 289, 112, '#5a3519'); R(c, 276, 96, 28, 2, '#5a3519');
  R(c, 278, 66, 22, 30, '#ece4cf'); R(c, 278, 66, 22, 1, '#fff'); R(c, 299, 66, 1, 30, '#c9bfa5');
  // taburete de las pinturas
  R(c, 240, 122, 18, 3, '#6b4426'); R(c, 242, 125, 2, 12, '#553419'); R(c, 254, 125, 2, 12, '#553419');
  // cama
  R(c, 4, 84, 3, 44, '#2b2b2b'); R(c, 4, 84, 84, 2, '#2b2b2b'); for (let x = 12; x < 86; x += 9) R(c, x, 86, 1, 14, '#2b2b2b'); R(c, 86, 84, 3, 44, '#2b2b2b'); R(c, 44, 80, 4, 4, '#d8b24a');
  R(c, 6, 100, 82, 24, '#f6f1e2'); R(c, 6, 122, 82, 4, '#d9d2bd'); R(c, 10, 96, 26, 8, '#ffffff'); R(c, 10, 103, 26, 1, '#d9d2bd');
  for (let y = 106; y < 122; y += 4) for (let x = 8 + ((y / 4) % 2) * 3; x < 86; x += 6) { R(c, x, y, 2, 2, '#e6dcc0'); R(c, x + 1, y + 1, 1, 1, '#c9b98f'); }
  for (let x = 6; x < 88; x += 4) R(c, x, 126, 2, 2, '#f6f1e2');
  // puerta a la calle
  R(c, 304, 44, 16, 76, '#4a3020'); R(c, 307, 47, 13, 73, '#f3e7b8'); R(c, 307, 47, 13, 30, '#bfe3fb'); R(c, 307, 110, 13, 10, '#b7a78c');
  // telarañas y polvo
  line(c, 0, 9, 16, 9, '#e9e2cf'); line(c, 0, 9, 10, 22, '#e9e2cf'); line(c, 4, 9, 6, 16, '#e9e2cf'); line(c, 9, 9, 3, 18, '#e9e2cf');
  line(c, 303, 9, 288, 9, '#e9e2cf'); line(c, 303, 9, 296, 22, '#e9e2cf'); line(c, 296, 9, 300, 17, '#e9e2cf');
  for (let i = 0; i < 70; i++) R(c, r() * W, 114 + r() * 46, 1, 1, '#d9c7a4');
  noise(c, 0, 0, W, H, 9, 9);
  return cv;
}

/* ---------- OBJETOS de escena ---------- */
const Props = {
  puerta(c, abierta) {
    if (abierta) { R(c, 138, 56, 9, 64, '#6b4424'); R(c, 146, 56, 1, 64, '#3d2412'); R(c, 148, 60, 26, 60, '#2a2018'); R(c, 152, 96, 18, 24, '#b0603a'); R(c, 150, 70, 22, 24, '#d6b377'); return; }
    R(c, 138, 56, 36, 64, '#7d5129'); R(c, 138, 56, 36, 1, '#a06c3a'); R(c, 155, 56, 2, 64, '#4d2f15');
    [[140, 60], [158, 60], [140, 84], [158, 84]].forEach(([x, y]) => { R(c, x, y, 14, 20, '#8e5e32'); R(c, x, y, 14, 1, '#a9753f'); R(c, x, y + 19, 14, 1, '#5a3819'); });
    R(c, 140, 108, 14, 10, '#8e5e32'); R(c, 158, 108, 14, 10, '#8e5e32');
    for (let y = 58; y < 118; y += 12) { R(c, 139, y, 1, 1, '#2b2b2b'); R(c, 172, y, 1, 1, '#2b2b2b'); }
    R(c, 151, 88, 3, 6, '#c9a53f'); R(c, 152, 91, 1, 2, '#1b1b1b'); R(c, 158, 86, 3, 3, '#c9a53f');
  },
  escoba(c) { line(c, 128, 119, 133, 82, '#c9a15a'); line(c, 129, 119, 134, 82, '#a8823f'); R(c, 124, 116, 8, 5, '#b7994c'); for (let x = 124; x < 132; x += 2) R(c, x, 119, 1, 3, '#8a702f'); },
  nerdo(c) { const b = [[224, 119], [226, 112], [222, 110], [229, 108], [225, 104], [220, 114], [230, 114]]; b.forEach(([x, y]) => line(c, 225, 120, x, y, '#a8905a')); [[226, 111], [222, 109], [229, 107], [225, 103]].forEach(([x, y]) => { R(c, x - 1, y - 1, 3, 3, '#c2ab73'); R(c, x, y, 1, 1, '#7d6a3c'); }); },
  olivo(c, conAceitunas) {
    const x = 252, y = 138; // base del macetón
    R(c, x - 11, y - 16, 22, 16, '#b5562f'); R(c, x - 13, y - 18, 26, 4, '#c96a3d'); R(c, x - 11, y - 3, 22, 3, '#8f3f20'); R(c, x - 9, y - 12, 2, 8, '#d98558');
    R(c, x - 2, y - 44, 4, 27, '#6b5a45'); R(c, x - 1, y - 44, 1, 27, '#8a7860'); line(c, x, y - 34, x - 8, y - 46, '#6b5a45'); line(c, x + 1, y - 36, x + 9, y - 48, '#6b5a45');
    const g = rng(77); for (let i = 0; i < 130; i++) { const a = g() * 6.28, d = g() * 19; R(c, x + Math.cos(a) * d * 1.25 - 1, y - 56 + Math.sin(a) * d * .75, 3, 2, ['#6f8f5a', '#8aa772', '#5a7a4a', '#a4bb8b'][i % 4]); }
    if (conAceitunas) { const o = rng(9); for (let i = 0; i < 16; i++) { const a = o() * 6.28, d = o() * 16; R(c, x + Math.cos(a) * d * 1.2, y - 55 + Math.sin(a) * d * .7, 2, 2, '#2c2a3a'); } }
  },
  botijo(c) { const x = 104, y = 134; R(c, x - 5, y - 10, 10, 10, '#c9774a'); R(c, x - 4, y - 12, 8, 2, '#c9774a'); R(c, x - 6, y - 8, 12, 6, '#d98b5c'); R(c, x - 2, y - 15, 4, 3, '#b5653a'); R(c, x - 6, y - 13, 2, 3, '#b5653a'); R(c, x + 4, y - 13, 3, 2, '#b5653a'); R(c, x - 3, y - 8, 2, 4, '#eaa77d'); R(c, x - 4, y, 8, 1, '#8c4a2b'); },
  cenicero(c) { const x = 53, y = 119; R(c, x - 5, y - 5, 10, 5, '#9a9a94'); R(c, x - 6, y - 6, 12, 2, '#bdbdb6'); R(c, x - 4, y - 1, 8, 1, '#6e6e68'); R(c, x - 2, y - 8, 1, 3, '#f1f1f1'); R(c, x + 1, y - 9, 1, 4, '#f1f1f1'); R(c, x + 1, y - 10, 1, 1, '#e2632a'); },
  retrato(c) {
    R(c, 134, 20, 56, 64, '#a87a26'); R(c, 134, 20, 56, 2, '#e3c05e'); R(c, 134, 82, 56, 2, '#7a5718'); R(c, 137, 23, 50, 58, '#c9a13f'); R(c, 139, 25, 46, 54, '#76837d');
    R(c, 139, 25, 46, 22, '#8a9690'); R(c, 139, 60, 46, 19, '#6a7570'); for (let i = 0; i < 12; i++) R(c, 141 + i * 3.6, 30 + (i * 7) % 26, 3, 1, '#7f8c86');
    // Trini
    R(c, 146, 52, 14, 27, '#f3efe6'); R(c, 148, 48, 10, 6, '#f3efe6'); R(c, 149, 38, 8, 10, '#e8b89a'); R(c, 147, 35, 12, 6, '#2a1d17'); R(c, 147, 39, 2, 12, '#2a1d17'); R(c, 157, 39, 2, 10, '#2a1d17'); R(c, 151, 42, 1, 1, '#2a1d17'); R(c, 154, 42, 1, 1, '#2a1d17'); R(c, 151, 45, 4, 1, '#b0463c'); R(c, 158, 37, 3, 3, '#ffffff');
    // el hombre sin cara
    R(c, 164, 52, 15, 27, '#3b4352'); R(c, 166, 48, 11, 6, '#3b4352'); R(c, 169, 49, 5, 5, '#e9e4d4'); R(c, 167, 37, 9, 11, '#cfc8b4'); R(c, 166, 34, 11, 4, '#2f3644');
    line(c, 168, 39, 174, 46, '#b3ab95'); line(c, 174, 38, 168, 45, '#b3ab95'); line(c, 167, 42, 175, 43, '#e0dac8'); R(c, 160, 62, 5, 3, '#e8b89a');
  },
  caja(c) { const x = 232, y = 77; R(c, x - 7, y - 9, 6, 5, '#b3262e'); R(c, x + 1, y - 9, 6, 5, '#b3262e'); R(c, x - 8, y - 7, 16, 4, '#b3262e'); R(c, x - 6, y - 3, 12, 2, '#b3262e'); R(c, x - 3, y - 1, 6, 1, '#8c1b22'); R(c, x - 6, y - 8, 3, 2, '#e05a60'); R(c, x - 1, y - 6, 2, 2, '#1b1b1b'); for (let i = 0; i < 4; i++) R(c, x - 5 + i * 3, y - 3, 2, 1, '#e3c05e'); },
  pinturas(c) { const x = 249, y = 122; R(c, x - 7, y - 3, 14, 3, '#9c7a4c'); R(c, x - 7, y - 3, 14, 1, '#c09a66'); ['#b3262e', '#2f62b0', '#d6a12a', '#2f7a3c'].forEach((k, i) => R(c, x - 6 + i * 3, y - 2, 2, 1, k)); line(c, x + 2, y - 4, x + 9, y - 9, '#5a3519'); R(c, x + 1, y - 4, 2, 2, '#cfcfcf'); },
  hucha(c) { const x = 121, y = 98; R(c, x - 6, y - 8, 12, 7, '#d98b6a'); R(c, x - 5, y - 9, 10, 1, '#d98b6a'); R(c, x + 5, y - 6, 3, 3, '#e8a688'); R(c, x + 7, y - 5, 1, 1, '#7a3b28'); R(c, x - 5, y - 10, 2, 2, '#c97452'); R(c, x + 3, y - 7, 1, 1, '#1b1b1b'); R(c, x - 5, y - 1, 2, 1, '#b5653a'); R(c, x + 3, y - 1, 2, 1, '#b5653a'); R(c, x - 2, y - 9, 4, 1, '#3a1f15'); R(c, x - 7, y - 6, 1, 2, '#c97452'); }
};


/* ---------- objetos sobre el fondo de la casa (dibujo de Rafa) ---------- */
Props.puertaAbierta = function (c) { R(c, 190, 86, 33, 61, '#17110c'); R(c, 190, 86, 8, 61, '#5d3d22'); R(c, 197, 86, 1, 61, '#2f1d0e'); R(c, 201, 104, 20, 22, '#b89a62'); R(c, 201, 126, 20, 21, '#8a4d2e'); R(c, 201, 100, 20, 4, '#3a2a1c'); };
Props.maleta = function (c) { c.save(); c.translate(18, 24); R(c, 40, 118, 13, 13, '#2c5aa0'); R(c, 40, 118, 13, 2, '#4f7fc8'); R(c, 45, 114, 3, 4, '#1c1c1c'); R(c, 42, 123, 9, 1, '#1f437a'); R(c, 41, 131, 2, 2, '#1c1c1c'); R(c, 50, 131, 2, 2, '#1c1c1c'); R(c, 47, 120, 4, 3, '#f1e8c8'); c.restore(); };
Props.farolillos = function (c) {
  const lan = ['#e23b3b', '#f4c430', '#35a852', '#3a7bd5', '#ee6fa3', '#f08a24']; let px = 0, py = 3;
  for (let x = 0; x <= W; x += 2) { const y = 2 + Math.round(4 * Math.sin((x / W) * Math.PI) + 1.5 * Math.sin((x / 53) * Math.PI)); line(c, px, py, x, y, '#2e2e2e'); px = x; py = y; if (x % 20 === 10) { const col = lan[(x / 20 | 0) % lan.length]; R(c, x - 2, y + 1, 5, 6, col); R(c, x - 1, y + 2, 1, 4, 'rgba(255,255,255,.45)'); R(c, x - 1, y + 7, 3, 1, '#2b2b2b'); R(c, x, y + 8, 1, 2, col); } }
};
Props.escobaEn = function (c, dx, dy) { c.save(); c.translate(dx, dy); Props.escoba(c); c.restore(); };
Props.nerdoEn = function (c, dx, dy) { c.save(); c.translate(dx, dy); Props.nerdo(c); c.restore(); };

/* ---------- Karen: hoja de sprites de Rafa (68x68, 6 columnas) ---------- */
const KarenSheet = { img: null, fw: 68, fh: 68, cx: 34, feet: 64 };
function drawKarenSheet(c, k, t, scale, talking) {
  const S = KarenSheet; let row, col, flip = false;
  if (k.walking) { col = Math.floor(t / 115) % 6; if (k.face === 'up') row = 1; else if (k.face === 'down') row = 2; else { row = 0; flip = k.dir < 0; } }
  else { row = 3; if (k.face === 'up') col = 2; else if (k.face === 'down') col = 0; else { col = 1; flip = k.dir < 0; } }
  const bob = talking && Math.floor(t / 170) % 2 ? -1 : 0;
  c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(-8, -1, 16, 2);
  c.save(); if (flip) c.scale(-1, 1);
  c.drawImage(S.img, col * S.fw, row * S.fh, S.fw, S.fh, Math.round(-S.cx * scale), Math.round(-S.feet * scale) + bob, Math.round(S.fw * scale), Math.round(S.fh * scale));
  c.restore();
}

/* ---------- PERSONAJES ---------- */
function blink(t, off) { return ((t + (off || 0)) % 3400) < 130; }

const Sprites = {
  /* Karen: provisional hasta tener el sprite de Rafa. Pies en (0,0), mira a la derecha. */
  karen(c, s) {
    const t = s.t, ph = s.walking ? Math.floor(t / 110) % 4 : -1, bob = (ph === 1 || ph === 3) ? -1 : 0;
    const skin = '#f08f76', skinD = '#d86e58', hair = '#6a3d1e', hairD = '#4d2a12', dress = '#3f7fd0', dressD = '#2c5fa8';
    // sombra
    c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(-7, -1, 14, 2);
    // piernas
    const la = ph === 0 ? 2 : ph === 2 ? -2 : 0, lb = -la;
    R(c, -4 + la, -12, 3, 11 - (ph === 0 ? 1 : 0), skin); R(c, -5 + la, -2 - (ph === 0 ? 1 : 0), 5, 2, '#f4f4f4');
    R(c, 1 + lb, -12, 3, 11 - (ph === 2 ? 1 : 0), skinD); R(c, 0 + lb, -2 - (ph === 2 ? 1 : 0), 5, 2, '#e2e2e2');
    // mochila
    R(c, -9, -29 + bob, 4, 11, '#9a5a2c'); R(c, -9, -29 + bob, 4, 1, '#b97740'); R(c, -8, -21 + bob, 2, 2, '#6f3d1b');
    // vestido
    R(c, -6, -30 + bob, 12, 12, dress); R(c, -7, -19 + bob, 14, 8, dress); R(c, 3, -30 + bob, 3, 19, dressD); R(c, -7, -12 + bob, 14, 1, dressD); R(c, -5, -24 + bob, 10, 1, '#f4f4f4');
    // brazos
    const sw = ph === 0 ? 1 : ph === 2 ? -1 : 0;
    R(c, -7 - sw, -29 + bob, 2, 11, skin); R(c, 5 + sw, -29 + bob, 2, 11, skinD); R(c, -6, -30 + bob, 2, 3, dress); R(c, 4, -30 + bob, 2, 3, dressD);
    // cuello y cabeza
    R(c, -2, -32 + bob, 4, 2, skinD);
    R(c, -5, -41 + bob, 10, 10, skin); R(c, 4, -39 + bob, 1, 6, skinD);
    // pelo
    R(c, -6, -44 + bob, 12, 4, hair); R(c, -7, -42 + bob, 3, 15, hair); R(c, -7, -30 + bob, 2, 3, hairD); R(c, -4, -41 + bob, 6, 1, hair); R(c, 4, -42 + bob, 2, 3, hair); R(c, -5, -44 + bob, 8, 1, '#8a5630');
    // gafas, ojos, quemadura
    if (blink(t)) { R(c, -2, -37 + bob, 3, 1, '#2b2b2b'); R(c, 2, -37 + bob, 3, 1, '#2b2b2b'); }
    else { R(c, -3, -38 + bob, 4, 3, '#2b2b2b'); R(c, -2, -37 + bob, 2, 1, '#ffffff'); R(c, -1, -37 + bob, 1, 1, '#2a4a7a'); R(c, 2, -38 + bob, 3, 3, '#2b2b2b'); R(c, 3, -37 + bob, 1, 1, '#ffffff'); R(c, 1, -37 + bob, 1, 1, '#2b2b2b'); }
    R(c, 1, -35 + bob, 2, 1, '#e2513c'); R(c, -3, -34 + bob, 2, 1, '#e2513c');
    // boca
    if (s.talking && Math.floor(t / 140) % 2) R(c, 0, -33 + bob, 3, 2, '#7a2a22'); else R(c, 0, -33 + bob, 3, 1, '#a23a30');
  },
  geraldo(c, s) {
    const t = s.t, suit = '#ece3c8', suitD = '#cfc4a3', skin = '#f0c4ae';
    c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(-8, -1, 16, 2);
    R(c, -5, -18, 4, 17, suit); R(c, 1, -18, 4, 17, suitD); R(c, -6, -2, 6, 2, '#6b4426'); R(c, 0, -2, 6, 2, '#553419');
    R(c, -7, -38, 14, 21, suit); R(c, 3, -38, 4, 21, suitD); R(c, -2, -38, 4, 10, '#ffffff'); R(c, -1, -36, 2, 8, '#7a1f2b'); R(c, -7, -19, 14, 1, suitD);
    R(c, -9, -37, 3, 13, suit); // brazo izq
    // brazo con la taza
    R(c, 6, -37, 3, 8, suitD); R(c, 4, -30, 5, 3, suitD); R(c, 9, -31, 3, 3, skin);
    R(c, 10, -28, 7, 1, '#ffffff'); R(c, 11, -32, 5, 4, '#ffffff'); R(c, 16, -31, 1, 2, '#ffffff'); R(c, 12, -32, 3, 1, '#9a5a2c');
    const k = Math.floor(t / 260) % 4; R(c, 12 + (k % 2), -35 - k, 1, 2, 'rgba(255,255,255,.75)'); R(c, 14 - (k % 2), -37 - k, 1, 2, 'rgba(255,255,255,.5)');
    R(c, -2, -40, 4, 2, skin);
    R(c, -5, -49, 10, 10, skin); R(c, 4, -47, 1, 6, '#d9a48c');
    R(c, -8, -51, 16, 2, '#e9dfbd'); R(c, -5, -56, 10, 5, '#f4ecd0'); R(c, -5, -52, 10, 1, '#2b2b2b'); R(c, -5, -56, 10, 1, '#fff9e3');
    if (blink(t, 900)) { R(c, -3, -46, 2, 1, '#2b2b2b'); R(c, 1, -46, 2, 1, '#2b2b2b'); } else { R(c, -3, -47, 2, 2, '#ffffff'); R(c, -2, -46, 1, 1, '#2b4a6b'); R(c, 1, -47, 2, 2, '#ffffff'); R(c, 2, -46, 1, 1, '#2b4a6b'); }
    R(c, -1, -45, 2, 2, '#e3a58c'); R(c, -4, -43, 8, 2, '#ffffff'); R(c, -5, -42, 1, 1, '#ffffff'); R(c, 4, -42, 1, 1, '#ffffff');
    if (s.talking && Math.floor(t / 150) % 2) R(c, -1, -41, 3, 1, '#7a2a22');
    R(c, -5, -49, 1, 4, '#e8e8e8'); R(c, 4, -49, 1, 3, '#e8e8e8');
  },
  /* Doña María, sentada en el banco */
  maria(c, s) {
    const t = s.t, skin = '#e9c0a4';
    R(c, -8, -4, 18, 4, '#1c1c22'); R(c, 6, -4, 4, 6, '#1c1c22'); R(c, 6, 2, 5, 2, '#2b2b2b'); R(c, 0, -3, 5, 5, '#24242c'); R(c, 0, 2, 5, 2, '#2b2b2b');
    R(c, -8, -22, 13, 19, '#1c1c22'); R(c, -9, -20, 15, 9, '#6f6a78'); R(c, -9, -20, 15, 1, '#8a8594'); for (let x = -9; x < 6; x += 3) R(c, x, -11, 2, 2, '#6f6a78');
    // brazo con cigarrillo
    R(c, 4, -17, 6, 3, '#1c1c22'); R(c, 9, -19, 3, 3, skin); R(c, 12, -20, 4, 1, '#ffffff'); R(c, 16, -20, 1, 1, '#e2632a');
    const k = Math.floor(t / 200) % 6; for (let i = 0; i < 4; i++) R(c, 16 + Math.round(Math.sin((k + i) * 1.3) * 2), -23 - i * 3 - (k % 3), 1, 2, 'rgba(230,230,230,' + (0.7 - i * 0.15) + ')');
    R(c, -3, -24, 4, 2, skin);
    R(c, -6, -33, 10, 10, skin); R(c, 3, -31, 1, 6, '#cfa189');
    R(c, -7, -35, 12, 4, '#d9d9d9'); R(c, -7, -33, 2, 6, '#d9d9d9'); R(c, -10, -34, 4, 5, '#c4c4c4'); R(c, -9, -33, 2, 2, '#e6e6e6'); R(c, -6, -35, 9, 1, '#f1f1f1');
    if (blink(t, 1700)) { R(c, -3, -29, 2, 1, '#2b2b2b'); R(c, 1, -29, 2, 1, '#2b2b2b'); } else { R(c, -4, -30, 4, 3, '#3a3a3a'); R(c, -3, -29, 2, 1, '#f6f6f6'); R(c, -2, -29, 1, 1, '#2b2b2b'); R(c, 1, -30, 3, 3, '#3a3a3a'); R(c, 2, -29, 1, 1, '#f6f6f6'); }
    R(c, 0, -28, 1, 1, '#3a3a3a');
    if (s.talking && Math.floor(t / 160) % 2) R(c, -1, -25, 3, 2, '#7a2a22'); else R(c, -1, -25, 3, 1, '#9a4a40');
  },
  /* La vecina, de medio cuerpo tras la baranda */
  vecina(c, s) {
    const t = s.t, skin = '#e8b89a';
    R(c, -6, -10, 12, 10, '#d95a8a'); [[-4, -8], [1, -6], [-2, -3], [3, -9]].forEach(([x, y]) => R(c, x, y, 2, 2, '#ffe36e'));
    R(c, -5, -19, 10, 9, skin); R(c, -6, -22, 12, 4, '#7a6a5a'); [[-5, -23], [-2, -24], [1, -23], [4, -24]].forEach(([x, y]) => { R(c, x, y, 3, 3, '#ee8fb8'); R(c, x + 1, y + 1, 1, 1, '#fff'); });
    if (blink(t, 400)) { R(c, -3, -16, 2, 1, '#2b2b2b'); R(c, 1, -16, 2, 1, '#2b2b2b'); } else { R(c, -3, -17, 2, 2, '#2b2b2b'); R(c, 1, -17, 2, 2, '#2b2b2b'); }
    if (s.talking && Math.floor(t / 150) % 2) R(c, -1, -13, 3, 2, '#7a2a22'); else R(c, -1, -13, 3, 1, '#b0463c');
    R(c, -8, -8, 3, 6, skin); R(c, 5, -8, 3, 6, skin);
  },
  gato(c, s) {
    const t = s.t, k = Math.floor(t / 400) % 5;
    c.fillStyle = 'rgba(0,0,0,.2)'; c.fillRect(-8, 0, 17, 1);
    R(c, -7, -5, 13, 5, '#e08a2e'); R(c, -6, -6, 10, 1, '#e08a2e'); R(c, 4, -7, 5, 6, '#e59a44'); R(c, 4, -9, 2, 2, '#e08a2e'); R(c, 7, -9, 2, 2, '#e08a2e');
    R(c, 5, -5, 1, 1, '#2b2b2b'); R(c, 7, -5, 1, 1, '#2b2b2b'); R(c, -5, -5, 2, 4, '#c9741f'); R(c, -1, -5, 2, 4, '#c9741f');
    R(c, -9 - (k === 1 ? 1 : 0), -3 - (k === 2 ? 1 : 0), 3, 2, '#c9741f'); if (k === 2) R(c, -10, -5, 2, 2, '#c9741f');
    if (Math.floor(t / 900) % 4 === 0) { R(c, 10, -11 - (Math.floor(t / 300) % 3), 2, 1, '#fff'); }
  }
};

/* ---------- ICONOS de inventario 16x16 ---------- */
const Icons = {
  cuaderno(c) { R(c, 3, 2, 10, 12, '#2f62b0'); R(c, 3, 2, 2, 12, '#1f437a'); R(c, 6, 4, 6, 3, '#f4efe0'); for (let y = 3; y < 14; y += 2) R(c, 2, y, 2, 1, '#cfcfcf'); R(c, 12, 5, 1, 9, '#f4c430'); },
  llave(c) { R(c, 2, 5, 5, 5, '#c9a53f'); R(c, 3, 6, 3, 3, '#1b1b1b'); R(c, 7, 7, 7, 2, '#c9a53f'); R(c, 11, 9, 1, 3, '#c9a53f'); R(c, 13, 9, 1, 2, '#c9a53f'); R(c, 2, 5, 5, 1, '#e8cf74'); },
  carta(c) { R(c, 2, 4, 12, 9, '#f4efe0'); line(c, 2, 4, 8, 9, '#b9ae92'); line(c, 13, 4, 8, 9, '#b9ae92'); R(c, 7, 8, 2, 2, '#b3262e'); R(c, 2, 12, 12, 1, '#cfc6ae'); },
  jazmines(c) { [[4, 5], [9, 4], [6, 9], [11, 9], [8, 12]].forEach(([x, y]) => { R(c, x - 1, y, 3, 1, '#fff'); R(c, x, y - 1, 1, 3, '#fff'); R(c, x, y, 1, 1, '#f4c430'); }); R(c, 3, 12, 2, 2, '#3f9349'); R(c, 12, 5, 2, 2, '#3f9349'); },
  nerdo(c) { line(c, 8, 15, 8, 5, '#a8905a'); line(c, 8, 9, 3, 4, '#a8905a'); line(c, 8, 8, 13, 3, '#a8905a'); line(c, 8, 11, 4, 9, '#a8905a'); [[3, 3], [13, 2], [8, 3]].forEach(([x, y]) => R(c, x - 1, y - 1, 3, 3, '#c2ab73')); },
  biznaga(c) { line(c, 8, 15, 8, 9, '#a8905a'); for (let i = 0; i < 26; i++) { const a = i * 2.4, d = 1 + (i % 4) * 1.3; R(c, 8 + Math.cos(a) * d - 0.5, 5 + Math.sin(a) * d * .9, 2, 2, i % 3 ? '#ffffff' : '#fdf3c4'); } R(c, 7, 5, 2, 1, '#f4c430'); },
  mortero(c) { R(c, 3, 7, 10, 6, '#9a9a94'); R(c, 2, 6, 12, 2, '#bdbdb6'); R(c, 4, 13, 8, 1, '#6e6e68'); line(c, 9, 7, 13, 1, '#8a8a84'); R(c, 12, 1, 2, 2, '#bdbdb6'); },
  palo(c) { line(c, 2, 14, 13, 2, '#c9a15a'); line(c, 3, 14, 14, 2, '#a8823f'); },
  aceitunas(c) { [[4, 6], [9, 5], [6, 10], [11, 10], [8, 8]].forEach(([x, y]) => { R(c, x - 1, y - 1, 3, 3, '#3a3a4a'); R(c, x - 1, y - 1, 1, 1, '#7a7a8a'); }); R(c, 11, 3, 3, 1, '#5a7a4a'); R(c, 3, 3, 3, 1, '#5a7a4a'); },
  aceite(c) { R(c, 3, 8, 10, 5, '#9a9a94'); R(c, 2, 7, 12, 2, '#bdbdb6'); R(c, 4, 7, 8, 2, '#d6b02a'); R(c, 5, 7, 3, 1, '#f1d76a'); R(c, 4, 13, 8, 1, '#6e6e68'); R(c, 7, 2, 2, 2, '#d6b02a'); R(c, 8, 4, 1, 2, '#d6b02a'); },
  retrato(c) { R(c, 2, 5, 12, 7, '#c9bfa5'); R(c, 2, 5, 2, 7, '#a89e84'); R(c, 12, 5, 2, 7, '#e2d9c0'); R(c, 13, 6, 1, 5, '#76837d'); R(c, 7, 4, 2, 9, '#b3262e'); },
  caja(c) { R(c, 2, 4, 5, 4, '#b3262e'); R(c, 9, 4, 5, 4, '#b3262e'); R(c, 1, 6, 14, 4, '#b3262e'); R(c, 3, 10, 10, 2, '#b3262e'); R(c, 5, 12, 6, 1, '#b3262e'); R(c, 7, 13, 2, 1, '#8c1b22'); R(c, 3, 5, 2, 1, '#e05a60'); R(c, 7, 7, 2, 2, '#1b1b1b'); for (let i = 0; i < 4; i++) R(c, 4 + i * 2, 10, 1, 1, '#e3c05e'); },
  pinturas(c) { R(c, 2, 7, 11, 6, '#9c7a4c'); R(c, 2, 7, 11, 1, '#c09a66'); ['#b3262e', '#2f62b0', '#d6a12a', '#2f7a3c'].forEach((k, i) => R(c, 3 + i * 2 + (i > 1 ? 1 : 0), 9, 2, 2, k)); line(c, 6, 6, 14, 1, '#5a3519'); R(c, 5, 6, 2, 2, '#cfcfcf'); },
  hucha(c) { R(c, 3, 6, 10, 6, '#d98b6a'); R(c, 4, 5, 8, 1, '#d98b6a'); R(c, 12, 8, 2, 2, '#e8a688'); R(c, 4, 12, 2, 2, '#b5653a'); R(c, 10, 12, 2, 2, '#b5653a'); R(c, 11, 7, 1, 1, '#1b1b1b'); R(c, 6, 5, 4, 1, '#3a1f15'); R(c, 4, 3, 2, 2, '#c97452'); },
  pesetas(c) { [[5, 10], [10, 9], [7, 5]].forEach(([x, y]) => { R(c, x - 3, y - 2, 6, 5, '#d8b24a'); R(c, x - 2, y - 3, 4, 7, '#d8b24a'); R(c, x - 1, y - 1, 2, 3, '#a8822a'); R(c, x - 2, y - 2, 1, 1, '#f4e08a'); }); }
};
function iconURL(id) { const [cv, c] = mk(16, 16); (Icons[id] || (() => R(c, 4, 4, 8, 8, '#888')))(c); return cv.toDataURL(); }
