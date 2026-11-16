/* El retrato borrado — arte provisional del Acto 2 (dibujado por código) */
'use strict';
Object.assign(GLY, {
  '0': ['111', '101', '101', '101', '111'], '1': ['010', '110', '010', '010', '111'], '2': ['111', '001', '111', '100', '111'], '6': ['111', '100', '111', '101', '111'], '8': ['111', '101', '111', '101', '111'], '9': ['111', '101', '111', '001', '111'], '!': ['010', '010', '010', '000', '010']
});

/* ---------- personaje genérico (pies en 0,0; mira a la derecha) ---------- */
function person(c, s, o) {
  const t = s.t || 0, skin = o.skin || '#e8b89a', skinD = o.skinD || '#cf9c7e', top = o.top || '#888', topD = o.topD || top, bot = o.bottom || '#444', botD = o.bottomD || bot;
  const tall = o.tall || 0, w = o.wide || 0, j = o.jitter ? Math.round(Math.sin(t / 90) * 1) : 0, jy = o.jitter ? (Math.floor(t / 120) % 2) : 0;
  c.save(); c.translate(j, -jy);
  c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(-8 - w, -1 + jy, 16 + 2 * w, 2);
  // piernas o falda
  if (o.robe) { R(c, -7 - w, -22, 14 + 2 * w, 21, o.robe); R(c, 3, -22, 4 + w, 21, o.robeD || o.robe); R(c, -5, -2, 4, 2, o.shoes || '#3a2a1c'); R(c, 1, -2, 4, 2, o.shoes || '#3a2a1c'); }
  else if (o.skirt) { R(c, -7, -22, 14, 12, bot); R(c, 3, -22, 4, 12, botD); R(c, -4, -10, 3, 9, skin); R(c, 1, -10, 3, 9, skinD); R(c, -5, -2, 4, 2, o.shoes || '#3a2a1c'); R(c, 1, -2, 4, 2, o.shoes || '#3a2a1c'); }
  else { R(c, -5 - w, -21, 5 + w, 20, bot); R(c, 0, -21, 5 + w, 20, botD); R(c, -6 - w, -2, 6 + w, 2, o.shoes || '#3a2a1c'); R(c, 0, -2, 6 + w, 2, o.shoes || '#2b1f15'); }
  // torso
  const ty = -41 - tall;
  R(c, -7 - w, ty, 14 + 2 * w, 21 + tall, top); R(c, 3, ty, 4 + w, 21 + tall, topD);
  if (o.stripes) for (let y = ty + 2; y < -21; y += 4) R(c, -7 - w, y, 14 + 2 * w, 2, o.stripes);
  if (o.shirt) { R(c, -2, ty, 4, 9, o.shirt); if (o.tie) R(c, -1, ty + 1, 2, 7, o.tie); }
  if (o.apron) { R(c, -5 - w, ty + 6, 10 + 2 * w, 22 + tall, o.apron); if (o.stains) o.stains.forEach(([x, y, k]) => R(c, x, ty + y, 2, 2, k)); }
  if (o.chest) o.chest(c, ty);
  // brazos
  R(c, -9 - w, ty + 1, 3, 13, top); R(c, -9 - w, ty + 14, 3, 3, skin);
  if (!o.armUp) { R(c, 6 + w, ty + 1, 3, 13, topD); R(c, 6 + w, ty + 14, 3, 3, skinD); } else { R(c, 6 + w, ty + 1, 3, 7, topD); R(c, 7 + w, ty + 6, 6, 3, topD); R(c, 12 + w, ty + 5, 3, 3, skin); }
  // cabeza
  const hy = ty - 12;
  R(c, -2, ty - 2, 4, 2, skinD);
  R(c, -5, hy, 10, 10, skin); R(c, 4, hy + 2, 1, 6, skinD);
  const hair = o.hair || '#3a2a1c';
  if (o.hairStyle === 'bald') { R(c, -5, hy + 2, 1, 4, hair); R(c, 4, hy + 1, 1, 3, hair); }
  else if (o.hairStyle === 'long') { R(c, -6, hy - 2, 12, 4, hair); R(c, -7, hy, 3, 15, hair); R(c, 4, hy, 2, 4, hair); }
  else if (o.hairStyle === 'bun') { R(c, -6, hy - 2, 11, 4, hair); R(c, -6, hy, 2, 6, hair); R(c, -9, hy - 1, 4, 5, hair); }
  else if (o.hairStyle === 'curly') { for (let x = -6; x < 6; x += 3) R(c, x, hy - 3 + (x & 1), 3, 4, hair); R(c, -6, hy, 2, 5, hair); }
  else if (o.hairStyle !== 'none') { R(c, -6, hy - 2, 12, 4, hair); R(c, -6, hy, 2, 4, hair); R(c, 4, hy, 2, 2, hair); }
  // ojos
  if (blink(t, o.blinkOff || 0)) { R(c, -3, hy + 4, 2, 1, '#2b2b2b'); R(c, 1, hy + 4, 2, 1, '#2b2b2b'); }
  else { R(c, -3, hy + 3, 2, 2, '#ffffff'); R(c, -2, hy + 4, 1, 1, '#2b2b2b'); R(c, 1, hy + 3, 2, 2, '#ffffff'); R(c, 2, hy + 4, 1, 1, '#2b2b2b'); }
  if (o.glasses) { R(c, -4, hy + 2, 4, 4, o.glasses); R(c, -3, hy + 3, 2, 2, '#dfefff'); R(c, 1, hy + 2, 4, 4, o.glasses); R(c, 2, hy + 3, 2, 2, '#dfefff'); R(c, 0, hy + 3, 1, 1, o.glasses); }
  R(c, 0, hy + 5, 1, 2, skinD);
  // barba, bigote, boca
  if (o.beard) { R(c, -5, hy + 6, 10, 5, o.beard); R(c, -4, hy + 11, 8, 2, o.beard); R(c, -6, hy + 3, 1, 5, o.beard); R(c, 5, hy + 3, 1, 4, o.beard); }
  if (o.moustache) R(c, -3, hy + 6, 7, 2, o.moustache);
  if (s.talking && Math.floor(t / 150) % 2) R(c, -1, hy + 8, 3, 2, '#7a2a22'); else if (!o.beard) R(c, -1, hy + 8, 3, 1, '#a23a30');
  // sombrero
  const h = o.hat;
  if (h === 'gorra') { R(c, -6, hy - 3, 12, 4, '#1f2f4a'); R(c, -6, hy - 4, 11, 1, '#2f456a'); R(c, 2, hy, 7, 2, '#15213a'); R(c, -2, hy - 2, 3, 2, '#d8b24a'); }
  else if (h === 'paja') { R(c, -10, hy - 1, 20, 2, '#e3c878'); R(c, -6, hy - 6, 12, 5, '#edd692'); R(c, -6, hy - 2, 12, 1, '#b3262e'); }
  else if (h === 'capucha') { R(c, -7, hy - 3, 14, 4, o.top); R(c, -7, hy, 2, 12, o.top); R(c, 5, hy, 2, 5, o.top); }
  else if (h === 'visera') { R(c, -6, hy - 3, 12, 3, '#b3262e'); R(c, 2, hy - 1, 8, 2, '#8c1b22'); }
  else if (h === 'lazos') { R(c, -8, hy - 1, 3, 3, '#e23a7a'); R(c, 5, hy - 1, 3, 3, '#e23a7a'); R(c, -7, hy + 2, 2, 7, hair); R(c, 5, hy + 2, 2, 7, hair); }
  if (o.extra) o.extra(c, s, ty, hy);
  c.restore();
}
function guitar(c, x, y) { R(c, x - 5, y - 4, 10, 8, '#c98a3c'); R(c, x - 4, y - 5, 8, 10, '#c98a3c'); R(c, x - 1, y - 1, 3, 3, '#3a2412'); line(c, x + 4, y - 2, x + 15, y - 9, '#5a3519'); line(c, x + 4, y - 1, x + 15, y - 8, '#7a4a25'); R(c, x + 14, y - 11, 3, 3, '#3a2412'); }

const NPC = {
  victoria: (c, s) => person(c, s, { top: '#5c6370', topD: '#474d58', bottom: '#3a3f48', skirt: true, hair: '#2b2b2b', hairStyle: 'bun', glasses: '#1b1b1b', blinkOff: 300, chest: (c, ty) => { R(c, -3, ty + 1, 6, 8, '#2f62d0'); R(c, -2, ty + 3, 4, 4, '#e8c12a'); R(c, -1, ty + 4, 2, 2, '#d8322f'); } }),
  pablo: (c, s) => person(c, s, { top: '#f4f4f4', stripes: '#27408b', bottom: '#d9cfb6', bottomD: '#c2b89e', hairStyle: 'bald', hair: '#d9d9d9', skin: '#e2ae8c', blinkOff: 700, armUp: true, extra: (c, s, ty) => { line(c, 14, ty + 6, 20, ty + 1, '#5a3519'); R(c, 20, ty, 2, 2, flag('pablo_inspirado') ? ['#e23a7a', '#2f62b0', '#f4c430'][Math.floor(s.t / 300) % 3] : '#bdbdbd'); } }),
  antonio: (c, s) => person(c, s, { top: '#1c1c22', topD: '#101015', bottom: '#1c1c22', shirt: '#ffffff', hair: '#1b1b1b', skin: '#d9a47e', skinD: '#c08a66', blinkOff: 1200, armUp: true }),
  manolo: (c, s) => person(c, s, { top: '#f1ead9', bottom: '#5a4a3a', apron: '#3d4b63', stains: [[-3, 10, '#111'], [2, 16, '#111'], [-1, 22, '#7a1f1f']], hair: '#6b6b6b', glasses: '#3a3a3a', blinkOff: 200 }),
  emilio: (c, s) => person(c, s, { top: '#e9e2cf', bottom: '#4a3f33', apron: '#5a3b2a', stains: [[1, 9, '#111'], [-4, 18, '#111']], hair: '#2b2b2b', hairStyle: 'curly', moustache: '#2b2b2b', blinkOff: 1500, tall: 2 }),
  ernesto: (c, s) => person(c, s, { top: '#e9e2cf', topD: '#cfc7b0', bottom: '#6f6558', hair: '#eeeeee', beard: '#f4f4f4', skin: '#e0a98a', wide: 1, blinkOff: 2100, extra: (c, s, ty) => { line(c, 8, ty + 14, 30, ty - 18, '#6b4426'); line(c, 30, ty - 18, 30, ty + 2, '#cfcfcf'); } }),
  marisol: (c, s) => { c.save(); c.scale(0.78, 0.78); person(c, s, { top: '#ffffff', bottom: '#e23a3a', skirt: true, hair: '#f1d36a', hat: 'lazos', skin: '#f4c9ad', blinkOff: 100, extra: (c, s, ty, hy) => { if (!flag('pelota_dada') && Math.floor(s.t / 500) % 2) R(c, 3, hy + 6, 1, 3, '#6fc3ff'); } }); c.restore(); },
  jesus: (c, s) => person(c, s, { top: '#6b4a2b', topD: '#573a20', robe: '#6b4a2b', robeD: '#573a20', hat: 'capucha', hairStyle: 'none', skin: '#e2a987', wide: 3, tall: 3, moustache: '#4a3a2a', blinkOff: 900, chest: (c, ty) => { R(c, -4, ty + 4, 9, 1, '#e8c12a'); R(c, -1, ty + 5, 3, 3, '#e8c12a'); R(c, -10, ty + 20, 20, 1, '#e9e2cf'); } }),
  rafael: (c, s) => person(c, s, { top: '#7a6a8a', topD: '#63557a', bottom: '#4a4058', shirt: '#ffffff', tie: flag('tiene_libro') ? '#2f62b0' : '#b3262e', hair: '#8a8a8a', glasses: '#5a4a2a', blinkOff: 500, jitter: !flag('tiene_libro'), extra: (c, s, ty, hy) => { if (!flag('tiene_libro')) { R(c, -5, hy - 5, 2, 3, '#b3262e'); R(c, 3, hy - 5, 2, 3, '#b3262e'); } } }),
  pablob: (c, s) => person(c, s, { top: '#ffffff', topD: '#e2e2e2', bottom: '#2b2b33', hair: '#3a2412', beard: null, skin: '#e2b08c', blinkOff: 1300, extra: (c, s, ty) => guitar(c, 2, ty + 16) }),
  kanka: (c, s) => person(c, s, { top: '#3f8f6a', topD: '#327556', bottom: '#d9cfb6', hair: '#2b2b2b', hat: 'visera', beard: '#3a2a1c', skin: '#d9a47e', blinkOff: 1800, extra: (c, s, ty) => guitar(c, 2, ty + 16) }),
  dani: (c, s) => person(c, s, { top: '#ffffff', topD: '#e2e2e2', bottom: '#1c1c22', apron: '#1c1c22', hair: '#3a2412', beard: '#4a3018', skin: '#e2b08c', blinkOff: 600, armUp: true, extra: (c, s, ty) => { R(c, 13, ty + 2, 4, 5, '#dfefff'); R(c, 12, ty + 4 + Math.floor(s.t / 200) % 2, 3, 3, '#f4f4f4'); } }),
  chiquito: (c, s) => { c.save(); c.scale(0.9, 0.9); person(c, s, { top: '#e8a12a', topD: '#c9841a', stripes: '#b3262e', bottom: '#f1ead9', bottomD: '#d9d2bd', hair: '#2b2b2b', skin: '#d9a47e', jitter: true, blinkOff: 250, armUp: true }); c.restore(); },
  chanquete: (c, s) => person(c, s, { top: '#27408b', topD: '#1f3370', stripes: '#f4f4f4', bottom: '#3a4a5a', apron: '#f1ead9', hat: 'gorra', hairStyle: 'none', beard: '#f4f4f4', skin: '#d99a72', skinD: '#c08560', wide: 1, blinkOff: 1100, extra: (c, s, ty) => { R(c, -9, ty + 13, 3, 3, '#1f3370'); R(c, -8, ty + 12, 1, 5, '#1f3370'); } }),
  /* La Mari, en su hamaca */
  mari(c, s) {
    const t = s.t, sw = Math.round(Math.sin(t / 900) * 1);
    line(c, -26, -30, -16, -12 + sw, '#8a6a3a'); line(c, 26, -30, 16, -12 + sw, '#8a6a3a'); R(c, -27, -32, 2, 32, '#6b4426'); R(c, 25, -32, 2, 32, '#6b4426');
    R(c, -17, -13 + sw, 34, 5, '#e23a7a'); R(c, -15, -8 + sw, 30, 2, '#b3265e'); for (let x = -16; x < 16; x += 6) R(c, x, -13 + sw, 3, 5, '#f4c430');
    R(c, -12, -17 + sw, 18, 5, '#3fb6a8'); R(c, 6, -16 + sw, 8, 3, '#e2b08c'); R(c, 13, -17 + sw, 3, 3, '#e2b08c');
    R(c, -19, -22 + sw, 8, 8, '#e2b08c'); R(c, -21, -21 + sw, 3, 10, '#2b1a12'); R(c, -24, -24 + sw, 14, 2, '#e3c878'); R(c, -21, -27 + sw, 8, 3, '#edd692');
    if (blink(t, 2000)) R(c, -15, -19 + sw, 2, 1, '#2b2b2b'); else R(c, -15, -20 + sw, 2, 2, '#2b2b2b');
    if (s.talking && Math.floor(t / 150) % 2) R(c, -14, -16 + sw, 2, 2, '#7a2a22'); else R(c, -14, -16 + sw, 2, 1, '#a23a30');
  }
};

/* ---------- utilidades de fondo ---------- */
function sky(c, h, cols) { const n = cols.length; cols.forEach((k, i) => R(c, 0, Math.floor(i * h / n), W, Math.ceil(h / n) + 1, k)); }
const SKY = ['#2f8fe0', '#3a9be6', '#49a8ec', '#5cb5f1', '#72c2f5', '#8bcff8', '#a3daf9'];
function clouds(c, list) { list.forEach(([x, y, w]) => { R(c, x, y, w, 3, '#eaf6fd'); R(c, x + 4, y - 2, w - 10, 2, '#ffffff'); }); }
function seaBand(c, y0, y1, seed) { const r = rng(seed || 4); for (let y = y0; y < y1; y++) { const k = (y - y0) / (y1 - y0); R(c, 0, y, W, 1, k < .3 ? '#1f6fb5' : k < .7 ? '#2a86c9' : '#3fa3d9'); } for (let i = 0; i < 90; i++) { const y = y0 + r() * (y1 - y0); R(c, r() * W, y, 3 + r() * 8, 1, r() > .5 ? '#7cc6ee' : '#d6f0fb'); } }
function sand(c, y0, col, seed) { const r = rng(seed || 8); R(c, 0, y0, W, H - y0, col || '#e8d29a'); for (let i = 0; i < 260; i++) R(c, r() * W, y0 + r() * (H - y0), 2, 1, r() > .5 ? '#d9c184' : '#f3e2b4'); R(c, 0, y0, W, 2, '#f6ecc9'); }
function tilesFloor(c, y0, a, b, seed) { const r = rng(seed || 3); R(c, 0, y0, W, H - y0, a); for (let y = y0, k = 0; y < H; y += 5 + k, k++) R(c, 0, y, W, 1, b); for (let i = -10; i < 30; i++) line(c, 160 + i * 10, y0, 160 + i * 24, H, b); for (let i = 0; i < 80; i++) R(c, r() * W, y0 + r() * (H - y0), 2, 1, b); }
function palm(c, x, y, h) { for (let i = 0; i < h; i += 3) R(c, x - 1 + ((i / 3) & 1), y - i - 3, 3, 3, i % 6 ? '#7a5a36' : '#8f6c44'); const top = y - h; [[-12, -2], [-9, -7], [-3, -10], [4, -10], [10, -6], [13, -1], [-13, 4], [13, 5]].forEach(([dx, dy]) => { line(c, x, top, x + dx, top + dy, '#2f7a3c'); line(c, x, top + 1, x + dx, top + dy + 1, '#3f9349'); }); }
function sombrilla(c, x, y, a, b) { R(c, x, y - 22, 1, 22, '#e9e2cf'); for (let i = 0; i < 6; i++) R(c, x - 14 + i * 5, y - 26 + Math.abs(i - 2.5) * 1.4, 5, 5, i % 2 ? a : b); R(c, x - 12, y - 28, 25, 2, a); R(c, x - 6, y - 30, 13, 2, b); }
function sign(c, txt, x, y, bg, fg, pad) { pad = pad === undefined ? 2 : pad; R(c, x, y, txt.length * 4 + pad * 2 - 1, 5 + pad * 2, bg); text35(c, txt, x + pad, y + pad, fg); }
function barrel(c, x, y, seed) { const r = rng(seed); R(c, x - 9, y - 22, 18, 22, '#5a3519'); R(c, x - 10, y - 18, 20, 14, '#6b4426'); R(c, x - 10, y - 19, 20, 1, '#2b2b2b'); R(c, x - 10, y - 5, 20, 1, '#2b2b2b'); R(c, x - 7, y - 21, 4, 20, '#7f5330'); for (let i = 0; i < 5; i++) line(c, x - 6 + r() * 4, y - 15 + i * 2, x + 2 + r() * 5, y - 16 + i * 2 + r() * 2, '#f1ead9'); }
function crowd(c, list) { list.forEach(([x, y, o]) => { c.save(); c.translate(x, y); if (o.flip) c.scale(-1, 1); person(c, { t: 9999 }, o); c.restore(); }); }

/* ---------- FONDOS ---------- */
const BG2 = {
  kent() {
    const [cv, c] = mk(W, H); sky(c, 60, SKY); clouds(c, [[220, 10, 30], [130, 18, 20]]);
    // basílica
    R(c, 14, 30, 190, 92, '#f3ead6'); R(c, 14, 30, 190, 3, '#b3462e'); [14, 60, 150, 200].forEach(x => R(c, x, 30, 5, 92, '#c1553a'));
    R(c, 70, 14, 80, 18, '#f3ead6'); R(c, 66, 12, 88, 3, '#b3462e'); line(c, 70, 14, 110, 2, '#b3462e'); line(c, 150, 14, 110, 2, '#b3462e'); R(c, 108, 0, 4, 8, '#3a3a3a'); R(c, 106, 2, 8, 2, '#3a3a3a');
    R(c, 100, 38, 20, 20, '#33414f'); R(c, 104, 36, 12, 2, '#33414f'); R(c, 109, 38, 2, 20, '#c1553a'); R(c, 100, 47, 20, 2, '#c1553a');
    R(c, 92, 76, 36, 46, '#c1553a'); R(c, 96, 80, 28, 42, '#3a2416'); R(c, 100, 76, 20, 4, '#3a2416'); R(c, 109, 80, 2, 42, '#5a3819'); R(c, 96, 70, 28, 4, '#f3ead6');
    R(c, 20, 0, 34, 32, '#f3ead6'); R(c, 18, 0, 38, 3, '#b3462e'); R(c, 28, 8, 8, 14, '#33414f'); R(c, 40, 8, 8, 14, '#33414f'); R(c, 31, 12, 2, 5, '#d8b24a');
    [[30, 60], [170, 60]].forEach(([x, y]) => { R(c, x, y, 12, 26, '#33414f'); R(c, x + 2, y - 2, 8, 2, '#33414f'); });
    // jardincillo
    R(c, 0, 112, 90, 10, '#3f7a3c'); for (let i = 0; i < 40; i++) R(c, (i * 37) % 88, 112 + (i * 13) % 9, 2, 2, i % 3 ? '#4f9349' : '#2f6a30'); palm(c, 6, 122, 60);
    tilesFloor(c, 122, '#cfc1a0', '#b3a482', 5);
    // cabina
    R(c, 298, 66, 20, 58, '#c2262b'); R(c, 300, 70, 16, 34, '#9fd0ea'); R(c, 300, 86, 16, 1, '#c2262b'); R(c, 307, 70, 1, 34, '#c2262b'); R(c, 298, 62, 20, 5, '#a01d22'); R(c, 310, 96, 2, 3, '#e8c12a');
    crowd(c, [[196, 132, { top: '#e23a7a', bottom: '#f4f4f4', skirt: true, hairStyle: 'bun', hair: '#2b1a12' }], [182, 134, { top: '#f4f4f4', bottom: '#2b2b33', hat: 'paja', hair: '#3a2412' }], [168, 133, { top: '#35a852', bottom: '#f4c430', skirt: true, hairStyle: 'long', hair: '#6a3d1e' }]]);
    noise(c, 0, 0, W, H, 8, 2); return cv;
  },
  soho() {
    const [cv, c] = mk(W, H); sky(c, 40, SKY);
    R(c, 0, 10, 110, 112, '#e9e2d2'); R(c, 110, 0, 110, 122, '#2a2a33'); R(c, 220, 16, 100, 106, '#d9cdb4');
    // mural
    [['#e23a7a', 226, 22, 40, 30], ['#2f62b0', 262, 30, 50, 44], ['#f4c430', 232, 56, 34, 40], ['#35a852', 274, 78, 40, 30], ['#f08a24', 240, 92, 30, 22]].forEach(([k, x, y, w, h]) => R(c, x, y, w, h, k)); for (let i = 0; i < 30; i++) R(c, 224 + (i * 31) % 90, 20 + (i * 17) % 96, 6, 3, ['#fff', '#1b1b1b', '#6fc3ff'][i % 3]);
    // fachada del teatro
    R(c, 114, 36, 102, 16, '#b3262e'); for (let x = 116; x < 214; x += 5) R(c, x, 37, 2, 2, x % 10 ? '#fff3a8' : '#f4c430'); for (let x = 116; x < 214; x += 5) R(c, x, 49, 2, 2, '#fff3a8');
    text35(c, 'TEATRO DEL SOHO', 135, 42, '#fff7d6');
    R(c, 134, 56, 62, 66, '#15151c'); R(c, 138, 60, 26, 62, '#3a2a22'); R(c, 166, 60, 26, 62, '#3a2a22'); R(c, 140, 64, 22, 30, '#6f8fa8'); R(c, 168, 64, 22, 30, '#6f8fa8'); R(c, 162, 92, 2, 6, '#e8c12a'); R(c, 166, 92, 2, 6, '#e8c12a');
    R(c, 118, 60, 12, 40, '#f1ead9'); R(c, 119, 61, 10, 22, '#b3262e'); text35(c, 'EL', 121, 86, '#1b1b1b'); R(c, 119, 93, 10, 1, '#1b1b1b'); R(c, 119, 96, 10, 1, '#1b1b1b');
    R(c, 198, 70, 16, 22, '#3a3a44'); R(c, 200, 72, 12, 10, '#9fd0ea'); sign(c, 'NO', 201, 84, '#f4c430', '#1b1b1b', 1);
    // ventanas edificio izq
    for (let y = 20; y < 100; y += 26) for (let x = 12; x < 100; x += 30) { R(c, x, y, 16, 18, '#4a5a6a'); R(c, x - 1, y + 18, 18, 2, '#bdb39c'); }
    R(c, 0, 122, W, 38, '#8f8a86'); for (let y = 126; y < 160; y += 6) R(c, 0, y, W, 1, '#7a7572');
    c.fillStyle = '#b3262e'; c.beginPath(); c.moveTo(140, 122); c.lineTo(190, 122); c.lineTo(214, 160); c.lineTo(116, 160); c.closePath(); c.fill(); line(c, 140, 122, 116, 160, '#8c1b22'); line(c, 190, 122, 214, 160, '#8c1b22');
    [[126, 138], [204, 138]].forEach(([x, y]) => { R(c, x, y - 14, 2, 14, '#e8c12a'); R(c, x - 1, y - 16, 4, 3, '#e8c12a'); R(c, x - 2, y, 6, 2, '#b8892e'); });
    noise(c, 0, 0, W, H, 8, 6); return cv;
  },
  vestibulo() {
    const [cv, c] = mk(W, H); R(c, 0, 0, W, 116, '#7a1f2b'); for (let x = 0; x < W; x += 16) R(c, x, 0, 1, 116, '#641823'); R(c, 0, 100, W, 16, '#3a2416'); R(c, 0, 100, W, 1, '#e8c12a');
    tilesFloor(c, 116, '#2a2a33', '#3a3a46', 12); for (let y = 116; y < 160; y += 11) for (let x = (y % 22 ? 0 : 12); x < W; x += 24) R(c, x, y, 12, 6, '#d9d2c4');
    // lámpara
    R(c, 159, 0, 2, 14, '#e8c12a'); for (let i = 0; i < 5; i++) { R(c, 140 + i * 9, 14 + Math.abs(i - 2) * 3, 4, 10 - Math.abs(i - 2) * 2, '#fff3a8'); R(c, 141 + i * 9, 24, 2, 3, '#dfefff'); } R(c, 138, 12, 44, 2, '#e8c12a');
    // mesa del cóctel
    R(c, 60, 104, 96, 5, '#f4f4f4'); R(c, 60, 109, 96, 22, '#e9e2d2'); R(c, 60, 109, 96, 1, '#cfc7b0'); R(c, 70, 100, 36, 4, '#1b1b1b'); for (let x = 72; x < 104; x += 6) { R(c, x, 98, 4, 2, '#f4f4f4'); R(c, x + 1, 97, 2, 1, '#f08a5a'); } R(c, 132, 96, 10, 8, '#dfefff'); R(c, 134, 92, 6, 4, '#dfefff');
    // escalera y cortina
    for (let i = 0; i < 8; i++) R(c, 232 + i * 6, 116 - i * 6, 90, 6, i % 2 ? '#b3262e' : '#8c1b22'); R(c, 0, 0, 24, 116, '#b3262e'); for (let x = 2; x < 24; x += 5) R(c, x, 0, 2, 116, '#8c1b22');
    // marco para el arte
    R(c, 186, 40, 30, 34, '#e8c12a'); R(c, 189, 43, 24, 28, '#f6efd9');
    noise(c, 0, 0, W, H, 7, 13); return cv;
  },
  imprenta() {
    const [cv, c] = mk(W, H), r = rng(41); R(c, 0, 0, W, 114, '#cdbf9f'); for (let i = 0; i < 60; i++) R(c, r() * W, r() * 110, 4 + r() * 10, 2, r() > .5 ? '#c2b391' : '#d9ccb0');
    for (let y = 60; y < 114; y += 6) for (let x = (y % 12 ? 0 : 6); x < 70; x += 12) R(c, x, y, 11, 5, '#a8553a'); R(c, 0, 0, W, 8, '#4a3020');
    tilesFloor(c, 114, '#7a6a55', '#665846', 9);
    // ventana
    R(c, 250, 20, 50, 46, '#4a3020'); R(c, 253, 23, 44, 40, '#cfeaff'); R(c, 274, 23, 2, 40, '#4a3020'); R(c, 253, 42, 44, 2, '#4a3020');
    // cuerda con carteles
    line(c, 70, 18, 240, 24, '#3a3a3a'); [[84, '#f4c430'], [122, '#e23a7a'], [160, '#f1ead9'], [198, '#6fc3ff']].forEach(([x, k], i) => { R(c, x, 20 + i, 26, 32, k); R(c, x + 12, 18 + i, 2, 3, '#7a5a36'); text35(c, 'FERIA', x + 3, 26 + i, '#1b1b1b'); text35(c, i === 2 ? 'DE MA' : 'DE', x + 3, 33 + i, '#1b1b1b'); });
    // prensa
    R(c, 176, 62, 60, 60, '#1f1f24'); R(c, 182, 52, 48, 12, '#2b2b33'); R(c, 200, 34, 12, 20, '#2b2b33'); R(c, 180, 84, 52, 6, '#3a3a44'); R(c, 186, 90, 40, 20, '#15151a'); line(c, 212, 38, 244, 24, '#3a3a44'); R(c, 243, 21, 5, 6, '#b3262e'); R(c, 170, 120, 72, 4, '#15151a'); R(c, 190, 76, 32, 8, '#f6efd9');
    // caja de tipos
    R(c, 78, 70, 70, 52, '#6b4426'); R(c, 78, 70, 70, 2, '#8a5c36'); for (let y = 74; y < 120; y += 7) for (let x = 81; x < 146; x += 8) { R(c, x, y, 7, 6, '#4b2c15'); R(c, x + 2, y + 2, 3, 2, '#9a9a9a'); }
    // mesa y tintero
    R(c, 20, 100, 44, 4, '#6b4426'); R(c, 22, 104, 3, 20, '#553419'); R(c, 59, 104, 3, 20, '#553419'); R(c, 36, 93, 10, 7, '#2b2b33'); R(c, 38, 91, 6, 2, '#3a3a44'); R(c, 24, 98, 10, 2, '#f6efd9');
    noise(c, 0, 0, W, H, 8, 15); return cv;
  },
  puerto() {
    const [cv, c] = mk(W, H); sky(c, 72, SKY); clouds(c, [[30, 12, 30], [260, 8, 26], [170, 22, 18]]); seaBand(c, 72, 112, 17);
    // noria lejana
    c.strokeStyle = '#d9d9d9'; c.lineWidth = 1; c.beginPath(); c.arc(292, 52, 14, 0, 7); c.stroke(); for (let a = 0; a < 6.28; a += 0.78) { line(c, 292, 52, 292 + Math.cos(a) * 14, 52 + Math.sin(a) * 14, '#d9d9d9'); R(c, 291 + Math.cos(a) * 14, 51 + Math.sin(a) * 14, 3, 3, ['#e23a3a', '#f4c430', '#3a7bd5'][Math.round(a) % 3]); } R(c, 288, 66, 9, 6, '#bdbdbd');
    // academia
    R(c, 0, 40, 96, 72, '#f2d58c'); R(c, 0, 36, 96, 5, '#c1603a'); R(c, 92, 40, 4, 72, '#d9bb6f'); sign(c, 'ACADEMIA ALIQUINDOI', 9, 48, '#27408b', '#fff7d6', 2); for (let x = 10; x < 80; x += 24) { R(c, x, 64, 14, 18, '#4a5a6a'); R(c, x - 1, 82, 16, 2, '#bdb39c'); } R(c, 38, 88, 16, 24, '#3a2416'); text35(c, 'ENGLISH', 30, 58, '#27408b');
    // farola
    R(c, 106, 30, 10, 82, '#f4f4f4'); R(c, 114, 30, 2, 82, '#d9d9d9'); R(c, 103, 26, 16, 5, '#f4f4f4'); R(c, 107, 16, 8, 10, '#dfefff'); R(c, 106, 12, 10, 4, '#3a3a44'); R(c, 110, 8, 2, 4, '#3a3a44'); R(c, 109, 19, 4, 4, '#fff3a8');
    // muelle
    R(c, 0, 112, W, 48, '#a8a39a'); for (let y = 118; y < 160; y += 7) R(c, 0, y, W, 1, '#8f8a82'); for (let x = 0; x < W; x += 28) R(c, x, 112, 1, 48, '#8f8a82'); R(c, 0, 112, W, 3, '#d9d5cc');
    [[150, 118], [230, 118], [300, 118]].forEach(([x, y]) => { R(c, x, y - 6, 6, 6, '#2b2b33'); R(c, x - 1, y - 7, 8, 2, '#3a3a44'); });
    noise(c, 0, 0, W, H, 8, 16); return cv;
  },
  caleta() {
    const [cv, c] = mk(W, H); sky(c, 62, SKY); clouds(c, [[60, 10, 34], [230, 16, 24]]);
    R(c, 0, 44, 70, 20, '#d9cdb4'); for (let x = 2; x < 70; x += 8) R(c, x, 34 + (x % 3) * 4, 7, 30, x % 16 ? '#e9e2d2' : '#cfc1a0'); R(c, 70, 56, 60, 8, '#6f8f5a');
    seaBand(c, 62, 104, 19); for (let x = 0; x < W; x += 3) R(c, x, 102 + Math.round(Math.sin(x / 14) * 1.5), 3, 3, '#f4fbff');
    sand(c, 104, '#e8d29a', 20);
    sombrilla(c, 40, 132, '#e23a3a', '#f4f4f4'); sombrilla(c, 92, 124, '#3a7bd5', '#f4c430'); sombrilla(c, 262, 128, '#35a852', '#f4f4f4'); sombrilla(c, 304, 140, '#f08a24', '#f4f4f4');
    [[30, 136, '#3a7bd5'], [84, 128, '#e23a7a'], [254, 132, '#f4c430']].forEach(([x, y, k]) => { R(c, x, y, 18, 4, k); R(c, x, y + 4, 2, 3, '#bdbdbd'); R(c, x + 16, y + 4, 2, 3, '#bdbdbd'); });
    crowd(c, [[296, 126, { top: '#f4f4f4', bottom: '#f4f4f4', hat: 'paja', hair: '#2b2b2b', skin: '#b5714a', skinD: '#9a5c3a', flip: true }]]); R(c, 280, 106, 12, 5, '#8a5c36'); R(c, 282, 103, 3, 3, '#f4f4f4'); R(c, 286, 103, 3, 3, '#c98a3c');
    noise(c, 0, 0, W, H, 8, 21); return cv;
  },
  chiringuito() {
    const [cv, c] = mk(W, H); sky(c, 60, SKY); clouds(c, [[100, 12, 30]]); seaBand(c, 60, 100, 23); for (let x = 0; x < W; x += 3) R(c, x, 98 + Math.round(Math.sin(x / 11) * 1.5), 3, 3, '#f4fbff');
    sand(c, 100, '#e3cc92', 24);
    // jábegas
    [[30, 118, '#2f62b0'], [74, 112, '#35a852']].forEach(([x, y, k]) => { R(c, x - 20, y - 8, 40, 8, k); R(c, x - 22, y - 10, 44, 3, '#f4f4f4'); R(c, x - 17, y, 34, 2, '#1b1b1b'); R(c, x + 14, y - 7, 5, 4, '#fff'); R(c, x + 16, y - 6, 2, 2, '#1b1b1b'); R(c, x - 23, y - 14, 3, 6, k); });
    // chiringuito
    R(c, 226, 46, 94, 70, '#f1ead9'); for (let i = 0; i < 12; i++) R(c, 216 + i * 2, 44 - i * 2, 104 - i * 2, 3, i % 2 ? '#c9a15a' : '#b38a44'); R(c, 232, 70, 60, 26, '#3a2a22'); R(c, 230, 96, 66, 5, '#6b4426'); R(c, 300, 66, 20, 50, '#3a6a8a');
    R(c, 262, 24, 46, 20, '#1f2a24'); R(c, 261, 23, 48, 1, '#8a5c36'); text35(c, 'HAY ESPETOS', 264, 26, '#f4f4f4'); text35(c, 'NO HAY', 264, 32, '#f4f4f4'); text35(c, 'PAELLA', 284, 38, '#f4c430');
    // bote de cañas vacío
    R(c, 186, 108, 8, 12, '#8a8a8a'); R(c, 185, 107, 10, 2, '#a8a8a8');
    palm(c, 208, 118, 64);
    noise(c, 0, 0, W, H, 8, 25); return cv;
  },
  botanico() {
    const [cv, c] = mk(W, H), r = rng(51); R(c, 0, 0, W, 120, '#2f6a30'); for (let i = 0; i < 420; i++) R(c, r() * W, r() * 118, 3 + r() * 6, 2 + r() * 3, ['#3f8f3c', '#2a5a2a', '#58a84a', '#1f4a24', '#7ac05a'][i % 5]);
    R(c, 110, 0, 100, 30, '#8bcff8'); for (let i = 0; i < 60; i++) R(c, 108 + r() * 104, r() * 34, 4, 3, i % 2 ? '#3f8f3c' : '#2a5a2a');
    palm(c, 30, 120, 90); palm(c, 290, 120, 96); palm(c, 70, 118, 60);
    // cenador
    for (let i = 0; i < 7; i++) R(c, 116 + i * 14, 40, 3, 80, '#e9e2d2'); c.strokeStyle = '#e9e2d2'; c.lineWidth = 2; c.beginPath(); c.arc(159, 44, 44, Math.PI, 0); c.stroke();
    for (let i = 0; i < 230; i++) { const a = Math.PI + r() * Math.PI, d = 30 + r() * 20; R(c, 159 + Math.cos(a) * d, 44 + Math.sin(a) * d * 0.9 + r() * 14, 3, 3, ['#9a6fd0', '#b48ae6', '#7a52b8', '#c9a8f0'][i % 4]); }
    tilesFloor(c, 120, '#d9cdb4', '#c2b59a', 14); for (let i = 0; i < 40; i++) R(c, r() * W, 122 + r() * 36, 2, 2, '#b48ae6');
    // mesa del jamón
    R(c, 18, 110, 50, 4, '#f4f4f4'); R(c, 18, 114, 50, 18, '#e9e2d2'); R(c, 30, 100, 22, 6, '#8a3a26'); R(c, 50, 96, 6, 6, '#70301f'); R(c, 28, 106, 26, 3, '#3a2416'); R(c, 58, 104, 6, 6, '#f4f4f4');
    // estanque
    R(c, 250, 132, 64, 18, '#3a7a9a'); R(c, 252, 134, 60, 14, '#4f9ab8'); [[262, 138], [284, 142], [300, 137]].forEach(([x, y]) => { R(c, x, y, 7, 3, '#3f8f3c'); R(c, x + 2, y - 1, 2, 2, '#f4b8d8'); });
    crowd(c, [[92, 126, { top: '#e23a7a', bottom: '#e23a7a', skirt: true, hairStyle: 'bun', hair: '#6a3d1e' }], [104, 128, { top: '#2b2b33', bottom: '#2b2b33', shirt: '#fff', hair: '#2b2b2b' }], [222, 126, { top: '#3a7bd5', bottom: '#3a7bd5', skirt: true, hairStyle: 'long', hair: '#f1d36a', flip: true }], [234, 128, { top: '#6b6b6b', bottom: '#6b6b6b', shirt: '#fff', tie: '#b3262e', hairStyle: 'bald', hair: '#aaa', flip: true }], [44, 124, { top: '#f4f4f4', bottom: '#1c1c22', apron: '#1c1c22', hair: '#2b2b2b' }]]);
    noise(c, 0, 0, W, H, 8, 26); return cv;
  },
  pirimpi() {
    const [cv, c] = mk(W, H), r = rng(61); R(c, 0, 0, W, 118, '#4a3020'); for (let x = 0; x < W; x += 14) R(c, x, 0, 1, 118, '#3a2416'); R(c, 0, 0, W, 10, '#2a1a10');
    tilesFloor(c, 118, '#8a5a3a', '#70482c', 18);
    // barriles
    [[20, 118], [42, 118], [64, 118], [31, 96], [53, 96]].forEach(([x, y], i) => barrel(c, x, y, 70 + i));
    // fotos
    for (let i = 0; i < 7; i++) { const x = 84 + i * 13, y = 18 + (i % 2) * 14; R(c, x, y, 10, 10, '#e9e2d2'); R(c, x + 1, y + 1, 8, 8, i % 3 ? '#8a8a8a' : '#6b5a4a'); R(c, x + 3, y + 5, 2, 3, '#e9e2d2'); R(c, x + 6, y + 5, 2, 3, '#e9e2d2'); }
    // azulejo de los nueve cafés
    R(c, 100, 50, 60, 46, '#f1f1ea'); R(c, 100, 50, 60, 1, '#2f62b0'); R(c, 100, 95, 60, 1, '#2f62b0'); R(c, 100, 50, 1, 46, '#2f62b0'); R(c, 159, 50, 1, 46, '#2f62b0');
    for (let i = 0; i < 10; i++) { const x = 105 + (i % 5) * 11, y = 56 + Math.floor(i / 5) * 20, lv = Math.round(i * 0.9); R(c, x, y, 7, 12, '#dfefff'); R(c, x, y + 12, 7, 1, '#9a9a9a'); if (i < 9) { R(c, x + 1, y + 1 + lv, 5, 11 - lv, '#3a2412'); R(c, x + 1, y + 1 + Math.min(lv, 10), 5, Math.max(0, 10 - lv - (9 - i)), '#f4ead6'); } else { line(c, x, y, x + 6, y + 11, '#b3262e'); line(c, x + 6, y, x, y + 11, '#b3262e'); } }
    // barra
    R(c, 196, 30, 124, 60, '#2a1a10'); for (let y = 36; y < 86; y += 16) { R(c, 198, y + 12, 120, 2, '#6b4426'); for (let x = 202; x < 316; x += 7) R(c, x, y + 2 + (x % 3), 4, 10 - (x % 3), ['#3f6a3a', '#7a2a22', '#d6a12a', '#3a2412', '#dfefff'][(x + y) % 5]); }
    R(c, 190, 96, 130, 6, '#93623a'); R(c, 190, 102, 130, 26, '#6f4526'); for (let x = 196; x < 320; x += 18) R(c, x, 104, 14, 20, '#7f5330'); R(c, 190, 96, 130, 1, '#b98a5a');
    sign(c, 'NO HAY HIELO', 226, 12, '#f1ead9', '#b3262e', 3);
    // mesa
    R(c, 128, 112, 38, 4, '#93623a'); R(c, 145, 116, 4, 18, '#553419'); R(c, 138, 134, 18, 2, '#553419');
    noise(c, 0, 0, W, H, 8, 27); return cv;
  },
  mercado() {
    const [cv, c] = mk(W, H), r = rng(71); R(c, 0, 0, W, 120, '#d9d2c4');
    // vidriera
    c.save(); c.beginPath(); c.arc(160, 62, 70, Math.PI, 0); c.lineTo(230, 62); c.lineTo(90, 62); c.closePath(); c.clip(); for (let y = -8; y < 62; y += 6) for (let x = 90; x < 230; x += 6) R(c, x, y, 6, 6, y > 40 ? ['#2a86c9', '#3fa3d9', '#1f6fb5'][(x + y) % 3] : ['#f4c430', '#8bcff8', '#e23a3a', '#35a852', '#f6efd9', '#8bcff8'][Math.floor(r() * 6)]); R(c, 140, 26, 34, 10, '#6b4426'); R(c, 150, 8, 2, 20, '#3a2416'); R(c, 152, 10, 14, 12, '#f6efd9'); c.restore();
    c.strokeStyle = '#3a3a44'; c.lineWidth = 2; c.beginPath(); c.arc(160, 62, 70, Math.PI, 0); c.stroke(); for (let a = Math.PI; a < 6.3; a += 0.39) line(c, 160, 62, 160 + Math.cos(a) * 70, 62 + Math.sin(a) * 70, '#3a3a44'); R(c, 90, 61, 141, 3, '#3a3a44');
    [40, 280].forEach(x => { R(c, x, 0, 6, 120, '#2f5a4a'); R(c, x - 3, 0, 12, 6, '#2f5a4a'); R(c, x - 2, 114, 10, 6, '#2f5a4a'); }); R(c, 0, 0, W, 4, '#2f5a4a');
    tilesFloor(c, 120, '#bdb6a8', '#a39c8e', 22);
    // puesto de fruta
    R(c, 0, 86, 60, 36, '#6b4426'); for (let i = 0; i < 22; i++) R(c, 2 + (i * 13) % 54, 78 + (i * 7) % 10, 6, 6, ['#f08a24', '#e23a3a', '#35a852', '#f4c430'][i % 4]); R(c, 0, 66, 60, 6, '#35a852'); for (let x = 0; x < 60; x += 8) R(c, x, 66, 4, 6, '#f4f4f4');
    // puesto de aceitunas
    R(c, 262, 86, 58, 36, '#6b4426'); for (let i = 0; i < 6; i++) { R(c, 266 + i * 9, 78, 8, 9, '#8a5c36'); R(c, 267 + i * 9, 79, 6, 4, i % 2 ? '#3a4a2a' : '#5a7a3a'); } R(c, 262, 66, 58, 6, '#b3262e'); for (let x = 262; x < 320; x += 8) R(c, x, 66, 4, 6, '#f4f4f4');
    // báscula
    R(c, 236, 92, 12, 30, '#8a8a8a'); R(c, 232, 84, 20, 10, '#d9d9d9'); R(c, 241, 86, 2, 6, '#b3262e');
    noise(c, 0, 0, W, H, 7, 28); return cv;
  }
};

/* ---------- objetos animados del Acto 2 ---------- */
const P2 = {
  puestoKent(c) { // toldo, postes y mostrador (delante de Victoria)
    R(c, 216, 62, 2, 62, '#bdbdbd'); R(c, 292, 62, 2, 62, '#bdbdbd');
    for (let x = 210; x < 298; x += 8) { R(c, x, 52, 4, 12, '#2f62d0'); R(c, x + 4, 52, 4, 12, '#d8322f'); } R(c, 210, 64, 88, 2, '#e8c12a');
    sign(c, 'CAMPEROS KENT', 225, 40, '#e8c12a', '#b3262e', 3);
    R(c, 212, 98, 86, 5, '#d9d9d9'); R(c, 212, 103, 86, 22, '#9aa0a8'); R(c, 212, 103, 86, 1, '#6f747c'); R(c, 220, 92, 30, 6, '#3a3a44'); R(c, 222, 90, 8, 3, '#e3b56a'); R(c, 234, 90, 8, 3, '#e3b56a'); text35(c, 'DE TODO', 240, 110, '#f4f4f4');
  },
  barraDani(c) { },
  puestoChanquete(c) {
    R(c, 112, 96, 112, 6, '#f4f4f4'); R(c, 112, 102, 112, 24, '#27408b'); R(c, 112, 102, 112, 1, '#1f3370'); for (let x = 114; x < 222; x += 4) R(c, x, 92 + (x % 3), 3, 4, x % 8 ? '#dff3fb' : '#bfe3f2');
    for (let i = 0; i < 9; i++) { const x = 118 + i * 11; R(c, x, 90, 8, 3, i % 3 ? '#9fb3c4' : '#c7d6e2'); R(c, x + 7, 89, 2, 5, '#8a9cae'); R(c, x + 1, 91, 1, 1, '#1b1b1b'); }
    text35(c, 'CHANQUETE', 150, 111, '#fff7d6');
  },
  melillero(c, t, zarpado) {
    if (zarpado) { R(c, 200, 66, 26, 5, '#f4f4f4'); R(c, 204, 62, 14, 4, '#f4f4f4'); R(c, 210, 58, 4, 4, '#27408b'); return; }
    R(c, 132, 78, 200, 34, '#27408b'); R(c, 132, 78, 200, 3, '#f4f4f4'); R(c, 124, 78, 10, 8, '#27408b'); R(c, 150, 54, 170, 24, '#f4f4f4'); R(c, 150, 54, 170, 2, '#d9d9d9'); for (let x = 158; x < 316; x += 10) R(c, x, 62, 6, 5, '#3a6a8a'); R(c, 200, 34, 14, 20, '#b3262e'); R(c, 200, 34, 14, 4, '#1b1b1b'); R(c, 250, 40, 10, 14, '#f4f4f4'); text35(c, 'MELILLERO', 240, 92, '#f4f4f4');
    const k = Math.floor(t / 300) % 4; R(c, 204 - k, 26 - k * 2, 5, 4, 'rgba(120,120,120,.6)'); R(c, 198 - k * 2, 18 - k * 2, 6, 4, 'rgba(150,150,150,.4)');
    line(c, 176, 112, 150, 124, '#6b4426'); line(c, 184, 112, 158, 124, '#6b4426'); for (let i = 0; i < 5; i++) line(c, 174 - i * 5, 113 + i * 2.4, 182 - i * 5, 113 + i * 2.4, '#8a5c36');
  },
  pelota(c, x, y, t, bob) { const b = bob ? Math.round(Math.sin(t / 400) * 1) : 0; R(c, x - 3, y - 6 + b, 7, 6, '#27408b'); R(c, x - 2, y - 7 + b, 5, 8, '#27408b'); R(c, x - 2, y - 4 + b, 5, 2, '#f4f4f4'); R(c, x - 2, y - 6 + b, 2, 1, '#6f8fd0'); },
  barcaEspetos(c, t) {
    const x = 138, y = 128; R(c, x - 26, y - 10, 52, 10, '#8c2b22'); R(c, x - 28, y - 12, 56, 3, '#f4f4f4'); R(c, x - 22, y, 44, 2, '#3a2416'); R(c, x - 22, y - 13, 44, 3, '#d9c184');
    for (let i = 0; i < 9; i++) { const fx = x - 18 + i * 4, h = 3 + ((Math.floor(t / 120) + i * 3) % 4); R(c, fx, y - 13 - h, 3, h, i % 2 ? '#f08a24' : '#f4c430'); R(c, fx + 1, y - 14 - h, 1, 1, '#e23a3a'); }
    R(c, x - 10 + (Math.floor(t / 400) % 3), y - 24 - (Math.floor(t / 300) % 4), 4, 3, 'rgba(200,200,200,.5)');
    if (flag('espeto_asando')) { line(c, x + 8, y - 12, x + 20, y - 30, '#c9a15a'); for (let i = 0; i < 4; i++) R(c, x + 10 + i * 3, y - 17 - i * 4, 4, 2, '#c7d6e2'); }
  },
  posavasos(c) { R(c, 136, 110, 7, 2, '#f4f4f4'); R(c, 138, 110, 3, 2, '#b3262e'); },
  servilletaMarco(c) { R(c, 193, 48, 16, 14, '#fff'); R(c, 196, 51, 4, 3, '#2b2b2b'); R(c, 201, 54, 5, 4, '#2b2b2b'); R(c, 198, 56, 2, 2, '#e23a7a'); },
  caballete(c, insp) { const x = 196, y = 138; line(c, x - 8, y, x - 2, y - 40, '#5a3519'); line(c, x + 10, y, x + 3, y - 40, '#5a3519'); R(c, x - 9, y - 38, 20, 24, '#f6efd9'); R(c, x - 9, y - 14, 20, 2, '#5a3519'); if (insp) { R(c, x - 6, y - 35, 6, 6, '#2f62b0'); R(c, x, y - 30, 7, 5, '#e23a7a'); R(c, x - 4, y - 24, 6, 6, '#f4c430'); R(c, x + 3, y - 34, 4, 4, '#1b1b1b'); } else { R(c, x - 4, y - 30, 8, 5, '#bdbdbd'); R(c, x + 3, y - 31, 3, 2, '#bdbdbd'); R(c, x - 5, y - 28, 2, 2, '#f08a24'); } },
  palomas(c, t) { [[150, 146], [164, 150], [236, 144]].forEach(([x, y], i) => { const p = Math.floor(t / 500 + i) % 3 === 0 ? 1 : 0; R(c, x, y - 3, 5, 3, '#9aa0a8'); R(c, x + 4, y - 5 + p, 2, 3, '#7c828a'); R(c, x + 6, y - 4 + p, 1, 1, '#f08a24'); R(c, x + 1, y, 1, 1, '#b3462e'); }); },
  seta(c) { [[92, 134], [97, 137], [88, 138]].forEach(([x, y]) => { R(c, x, y - 2, 1, 3, '#f1ead9'); R(c, x - 1, y - 4, 3, 2, '#b98a5a'); }); },
  hermandad(c) { R(c, 252, 96, 26, 44, '#5a3519'); R(c, 254, 98, 10, 40, '#6b4426'); R(c, 266, 98, 10, 40, '#6b4426'); R(c, 250, 84, 30, 10, '#f1f1ea'); for (let y = 86; y < 93; y += 2) R(c, 252, y, 26, 1, '#2f62b0'); R(c, 263, 114, 4, 4, '#e8c12a'); }
};

/* ---------- iconos del Acto 2 ---------- */
Object.assign(Icons, {
  campero(c) { R(c, 2, 5, 12, 3, '#e3b56a'); R(c, 2, 8, 12, 2, '#3f9349'); R(c, 2, 9, 12, 1, '#d8322f'); R(c, 3, 10, 10, 1, '#f4d76a'); R(c, 2, 11, 12, 3, '#d9a45a'); R(c, 3, 4, 10, 1, '#e3b56a'); },
  seta(c) { R(c, 7, 8, 2, 6, '#f1ead9'); R(c, 4, 5, 8, 3, '#b98a5a'); R(c, 5, 4, 6, 1, '#b98a5a'); R(c, 5, 5, 2, 1, '#d9b78a'); },
  supercampero(c) { Icons.campero(c); R(c, 9, 2, 4, 2, '#b98a5a'); R(c, 10, 4, 2, 2, '#f1ead9'); R(c, 1, 2, 2, 2, '#f4c430'); R(c, 13, 12, 2, 2, '#e23a7a'); },
  servilleta(c) { R(c, 2, 3, 12, 10, '#fff'); R(c, 2, 12, 12, 1, '#d9d9d9'); R(c, 4, 5, 3, 3, '#2b2b2b'); R(c, 8, 7, 4, 3, '#2b2b2b'); R(c, 6, 9, 2, 2, '#e23a7a'); R(c, 10, 5, 2, 1, '#2f62b0'); },
  entrada(c) { R(c, 1, 5, 14, 7, '#f4c430'); R(c, 4, 5, 1, 7, '#b8892e'); R(c, 6, 7, 7, 1, '#7a1f2b'); R(c, 6, 9, 5, 1, '#7a1f2b'); },
  salsa(c) { R(c, 6, 2, 4, 3, '#b3262e'); R(c, 5, 5, 6, 9, '#1b1b1b'); R(c, 6, 7, 4, 4, '#f4f4f4'); R(c, 7, 8, 2, 2, '#b3262e'); },
  poema(c) { R(c, 3, 2, 10, 13, '#f6efd9'); for (let y = 4; y < 13; y += 2) R(c, 5, y, (y % 4 ? 6 : 5), 1, '#3a2412'); R(c, 3, 14, 10, 1, '#cfc6ae'); },
  pelota(c) { R(c, 4, 3, 8, 10, '#27408b'); R(c, 3, 5, 10, 6, '#27408b'); R(c, 3, 7, 10, 2, '#f4f4f4'); R(c, 5, 4, 2, 1, '#6f8fd0'); },
  concha(c) { R(c, 3, 7, 10, 5, '#f4d9c4'); R(c, 4, 5, 8, 2, '#f4d9c4'); R(c, 6, 12, 4, 1, '#d9b79e'); for (let x = 4; x < 12; x += 2) R(c, x, 6, 1, 6, '#e3b79a'); },
  perla(c) { R(c, 5, 5, 6, 6, '#f6f6fb'); R(c, 6, 4, 4, 8, '#f6f6fb'); R(c, 6, 6, 2, 2, '#ffffff'); R(c, 8, 9, 2, 2, '#c9cfe0'); },
  posavasos(c) { R(c, 3, 3, 10, 10, '#f4f4f4'); R(c, 3, 3, 10, 1, '#b3262e'); R(c, 3, 12, 10, 1, '#b3262e'); R(c, 6, 5, 4, 3, '#e2b08c'); R(c, 5, 8, 6, 3, '#b3262e'); R(c, 6, 4, 4, 1, '#3a2412'); },
  libro(c) { R(c, 3, 2, 10, 12, '#7a52b8'); R(c, 3, 2, 2, 12, '#5a3a8a'); R(c, 6, 4, 6, 1, '#f4c430'); R(c, 7, 7, 4, 4, '#f6f6fb'); R(c, 6, 8, 1, 2, '#f6f6fb'); R(c, 11, 8, 1, 2, '#f6f6fb'); R(c, 12, 3, 1, 11, '#f6efd9'); },
  sardinas(c) { [[3, 5], [4, 9], [3, 12]].forEach(([x, y]) => { R(c, x, y - 1, 8, 3, '#9fb3c4'); R(c, x + 8, y - 2, 2, 5, '#8a9cae'); R(c, x + 1, y, 1, 1, '#1b1b1b'); R(c, x + 2, y - 1, 5, 1, '#d6e2ec'); }); },
  espeto_crudo(c) { line(c, 2, 14, 14, 2, '#c9a15a'); [[5, 9], [8, 6], [11, 3]].forEach(([x, y]) => { R(c, x - 2, y, 5, 2, '#9fb3c4'); R(c, x - 2, y, 1, 1, '#1b1b1b'); }); },
  espeto(c) { line(c, 2, 14, 14, 2, '#c9a15a'); [[5, 9], [8, 6], [11, 3]].forEach(([x, y]) => { R(c, x - 2, y, 5, 2, '#c9843a'); R(c, x - 1, y, 2, 1, '#f4d76a'); }); },
  cartojal(c) { R(c, 7, 1, 2, 4, '#3f6a3a'); R(c, 5, 5, 6, 9, '#3f6a3a'); R(c, 6, 8, 4, 3, '#f1ead9'); R(c, 6, 5, 1, 8, '#5f8f5a'); },
  hielo(c) { R(c, 3, 6, 5, 5, '#dff3fb'); R(c, 8, 4, 5, 5, '#bfe3f2'); R(c, 6, 9, 5, 5, '#cfeaf6'); R(c, 4, 7, 1, 1, '#fff'); R(c, 9, 5, 1, 1, '#fff'); },
  vino(c) { R(c, 4, 3, 8, 7, '#dfefff'); R(c, 5, 5, 6, 4, '#d6a12a'); R(c, 6, 4, 2, 2, '#dff3fb'); R(c, 7, 10, 2, 3, '#dfefff'); R(c, 5, 13, 6, 1, '#dfefff'); },
  whisky(c) { R(c, 4, 6, 8, 7, '#dfefff'); R(c, 5, 8, 6, 4, '#c9841a'); },
  cerveza(c) { R(c, 4, 4, 7, 9, '#f4c430'); R(c, 4, 3, 7, 2, '#ffffff'); R(c, 11, 6, 2, 5, '#dfefff'); },
  agua(c) { R(c, 5, 4, 6, 9, '#dfefff'); R(c, 6, 7, 4, 5, '#9fd0ea'); },
  cafe(c) { R(c, 4, 6, 7, 6, '#f4f4f4'); R(c, 5, 7, 5, 2, '#3a2412'); R(c, 11, 7, 2, 3, '#f4f4f4'); R(c, 3, 12, 9, 1, '#d9d9d9'); R(c, 6, 3, 1, 2, '#bdbdbd'); R(c, 8, 2, 1, 3, '#bdbdbd'); }
});
