/* El retrato borrado — motor point & click */
'use strict';
const $ = s => document.querySelector(s);
const SAVE_KEY = 'retrato-borrado-v3';

const G = {
  room: 'calle', flags: {}, inv: [], notes: [],
  k: { x: 84, y: 156, dir: 1, face: 'side', walking: false, talking: false, tx: 0, ty: 0, done: null },
  verb: null, item: null, busy: false, hover: null, fast: false, t: 0, talkingId: null, inDialog: false
};
const Rooms = {}, Items = {}, Actors = {}, OptPatch = {}, ExtraOpts = {}, MasOpts = {};
const VERBS = [['mirar', 'Mirar'], ['coger', 'Coger'], ['usar', 'Usar'], ['hablar', 'Hablar'], ['dar', 'Dar']];
const PREP = { usar: 'con', dar: 'a' };

const Gen = {
  mirar: ['Es típico. No sé de qué, pero es típico.', 'Lo fotografiaría, pero ya llevo cuatrocientas fotos de hoy.', 'Muy bonito. Y muy caliente, como todo aquí.'],
  coger: ['No cabe en la maleta, y la maleta ya chirría.', 'Eso tiene dueño. Aquí todo tiene dueño, primo o cofradía.', 'Me han dicho que aquí lo de uno es de todos, pero no creo que sea literal.'],
  usar: ['No se me ocurre cómo. Y vengo de un país donde nos montamos los muebles.', 'Lo he intentado. Con educación. Nada.', 'Eso no funciona ni con instrucciones.'],
  con: ['Eso junto no hace nada. Lo he comprobado mentalmente.', 'Ni en Feria.', 'En la guía no viene, y la guía es de 1998.'],
  hablar: ['No contesta. Es lo primero callado que encuentro en Málaga.'],
  cogerPersona: ['A la gente no se la coge. Creo. Aquí se abrazan tanto que no lo tengo claro.'],
  usarPersona: ['Sería de mala educación. Incluso aquí.'],
  darCosa: ['No creo que lo quiera. Es una cosa.'],
  cogerItem: ['Ya lo llevo encima. Y pesa.'],
  hablarItem: ['Hablarle a mi equipaje sería el principio del fin.']
};

/* ---------- utilidades de estado ---------- */
const has = id => G.inv.includes(id);
const flag = (k, v) => v === undefined ? !!G.flags[k] : (G.flags[k] = v);
function give(id) { if (!has(id)) { G.inv.push(id); renderInv(); toast('+ ' + Items[id].name); } }
function lose(id) { G.inv = G.inv.filter(i => i !== id); if (G.item === id) G.item = null; renderInv(); }
function addNote(t) { if (!G.notes.includes(t)) { G.notes.push(t); toast('Apuntado en el cuaderno'); } }
function rot(key, arr) { const k = 'rot_' + key, i = (G.flags[k] || 0) % arr.length; G.flags[k] = i + 1; return arr[i]; }
/* ---------- partidas guardadas ---------- */
const SLOTS_KEY = 'retrato-borrado-partidas', NSLOTS = 6;
function snapshot() { return { room: G.room, flags: G.flags, inv: G.inv, notes: G.notes, x: Math.round(G.k.x), y: Math.round(G.k.y) }; }
function applySnapshot(s) {
  if (!s || !Rooms[s.room]) return false;
  G.room = s.room; G.flags = JSON.parse(JSON.stringify(s.flags || {})); G.inv = (s.inv || []).filter(i => Items[i]); G.notes = (s.notes || []).slice();
  const w = Rooms[G.room].walk; G.k.x = Math.max(w.x1, Math.min(w.x2, s.x || w.x1)); G.k.y = Math.max(w.y1, Math.min(w.y2, s.y || w.y1));
  G.k.walking = false; G.k.face = 'side'; G.verb = null; G.item = null; G.after = null;
  renderVerbs(); renderInv(); updateSentence(); $('#roomname').textContent = Rooms[G.room].name; save(); return true;
}
function progreso(f) { return f.final ? 'Fin' : f.acto2_fin ? 'Acto 3' : f.casa_abierta ? 'Acto 2' : 'Acto 1'; }
function readSlots() { try { const a = JSON.parse(localStorage.getItem(SLOTS_KEY) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
function writeSlots(a) { try { localStorage.setItem(SLOTS_KEY, JSON.stringify(a)); return true; } catch (e) { return false; } }
function encodeSave(o) { return btoa(unescape(encodeURIComponent(JSON.stringify(o)))); }
function decodeSave(t) { try { return JSON.parse(decodeURIComponent(escape(atob(t.trim())))); } catch (e) { return null; } }
function openSaves(msg) {
  if (G.busy || G.inDialog) return;
  const el = $('#overlay'), slots = readSlots(), esc = t => String(t).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  let rows = '';
  for (let i = 0; i < NSLOTS; i++) {
    const s = slots[i];
    rows += '<div class="slot"><span class="slot-n">' + (i + 1) + '</span><span class="slot-d">' + (s ? esc(s.desc) : 'Vacía') + '</span>'
      + '<button type="button" class="place" id="sv-save-' + i + '">' + (s ? 'Sobrescribir' : 'Guardar aquí') + '</button>'
      + (s ? '<button type="button" class="place" id="sv-load-' + i + '">Cargar</button><button type="button" class="place" id="sv-del-' + i + '">Borrar</button>' : '') + '</div>';
  }
  el.innerHTML = '<div class="sheet game-sheet"><h2>Partidas</h2><p class="mg-say" id="sv-msg">' + (msg || 'El juego se guarda solo al avanzar. Aquí puedes guardar puntos concretos y volver a ellos.') + '</p><div class="mg-col">' + rows + '</div>'
    + '<h2>Llevar la partida a otro dispositivo</h2><p>Copia el código de esta partida, o pega uno para cargarlo.</p><textarea id="sv-code" rows="3" spellcheck="false" aria-label="Código de partida"></textarea>'
    + '<div class="mg-row"><button type="button" class="place" id="sv-copy">Copiar código de la partida actual</button><button type="button" class="place" id="sv-paste">Cargar el código pegado</button></div>'
    + '<button type="button" class="verb" id="ov-close">Volver al juego</button></div>';
  el.hidden = false; $('#ov-close').onclick = () => { el.hidden = true; };
  const say2 = t => { $('#sv-msg').textContent = t; };
  for (let i = 0; i < NSLOTS; i++) {
    $('#sv-save-' + i).onclick = () => { const a = readSlots(), d = new Date(); a[i] = { desc: progreso(G.flags) + ' · ' + Rooms[G.room].name + ' · ' + G.inv.length + ' objetos · ' + d.toLocaleDateString('es-ES') + ' ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }), data: snapshot() }; openSaves(writeSlots(a) ? 'Guardada en el hueco ' + (i + 1) + '.' : 'Este navegador no deja guardar aquí. Usa el código de abajo.'); };
    const l = $('#sv-load-' + i); if (l) l.onclick = () => { const a = readSlots(); if (a[i] && applySnapshot(a[i].data)) { el.hidden = true; toast('Partida ' + (i + 1) + ' cargada'); } else say2('Esa partida no se puede cargar.'); };
    const dl = $('#sv-del-' + i); if (dl) dl.onclick = () => { const a = readSlots(); a[i] = null; writeSlots(a); openSaves('Hueco ' + (i + 1) + ' vaciado.'); };
  }
  $('#sv-copy').onclick = () => { const code = encodeSave(snapshot()); $('#sv-code').value = code; $('#sv-code').select(); try { navigator.clipboard.writeText(code).then(() => say2('Código copiado. Pégalo en el otro dispositivo.'), () => say2('Código listo en el recuadro: cópialo a mano.')); } catch (e) { say2('Código listo en el recuadro: cópialo a mano.'); } };
  $('#sv-paste').onclick = () => { const o = decodeSave($('#sv-code').value); if (o && applySnapshot(o)) { el.hidden = true; toast('Partida cargada desde el código'); } else say2('Ese código no es de una partida válida.'); };
}

function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify({ room: G.room, flags: G.flags, inv: G.inv, notes: G.notes, x: G.k.x, y: G.k.y })); } catch (e) { /* sin guardado */ } }
function load() { try { const s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); if (!s) return false; G.room = s.room; G.flags = s.flags || {}; G.inv = s.inv || []; G.notes = s.notes || []; G.k.x = s.x; G.k.y = s.y; return true; } catch (e) { return false; } }
function wipe() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* nada */ } }
const wait = ms => new Promise(r => setTimeout(r, G.fast ? 0 : ms));

/* ---------- habla ---------- */
let speechSkip = null;
function actorPos(who) {
  if (who === 'karen') return [G.k.x, G.k.y - 58 * (Rooms[G.room].scale || 0.9)];
  const n = (Rooms[G.room].npcs || []).find(n => n.id === who); if (n) return [n.x, n.y - (n.h || 58)];
  const a = Actors[who]; return a ? [a.x, a.y - a.h] : [160, 40];
}
async function say(who, text) {
  const el = $('#speech'), a = who === 'karen' ? { color: '#ffe08a' } : ((Rooms[G.room].npcs || []).find(n => n.id === who && n.color) || Actors[who] || { color: '#fff' });
  text = text.replace(/\*/g, '');
  G.talkingId = who; G.lastSaid = { who, text }; (G.log = G.log || []).push(who + ': ' + text);
  if (G.fast) { G.talkingId = null; return; }
  el.textContent = text; el.style.color = a.color; el.hidden = false;
  const st = $('#stage'), s = st.clientWidth / W, [x, y] = actorPos(who);
  const w = el.offsetWidth, h = el.offsetHeight;
  let left = x * s - w / 2; left = Math.max(6, Math.min(st.clientWidth - w - 6, left));
  let top = y * s - h - 6; if (top < 4) top = 4;
  el.style.left = left + 'px'; el.style.top = top + 'px';
  await new Promise(res => { const tm = setTimeout(done, 1300 + text.length * 55); function done() { clearTimeout(tm); speechSkip = null; res(); } setTimeout(() => { speechSkip = done; }, 180); });
  el.hidden = true; G.talkingId = null;
}
const K = t => say('karen', t);
/* guion: lista de [quién, texto] */
async function scene(lines) { for (const [w, t] of lines) await say(w, t); }

/* ---------- movimiento ---------- */
function clampWalk(x, y) { const w = Rooms[G.room].walk; return [Math.max(w.x1, Math.min(w.x2, x)), Math.max(w.y1, Math.min(w.y2, y))]; }
function walkTo(x, y) {
  [x, y] = clampWalk(x, y);
  const k = G.k;
  if (G.fast) { k.x = x; k.y = y; return Promise.resolve(); }
  if (Math.abs(k.x - x) < 1 && Math.abs(k.y - y) < 1) return Promise.resolve();
  return new Promise(res => { if (k.done) k.done(); k.tx = x; k.ty = y; k.walking = true; const ax = Math.abs(x - k.x), ay = Math.abs(y - k.y); k.face = ay > ax * 1.3 ? (y < k.y ? 'up' : 'down') : 'side'; if (ax > 1) k.dir = x > k.x ? 1 : -1; k.done = () => { k.walking = false; k.done = null; res(); }; });
}
function stepWalk(dt) {
  const k = G.k; if (!k.walking) return;
  const dx = k.tx - k.x, dy = k.ty - k.y, d = Math.hypot(dx, dy), sp = 74 * dt;
  if (d <= sp) { k.x = k.tx; k.y = k.ty; k.done && k.done(); } else { k.x += dx / d * sp; k.y += dy / d * sp * 0.8 + 0; }
}
async function goRoom(id, x, y, dir, face) {
  const cv = $('#cv'); if (!G.fast) { cv.style.opacity = 0; await wait(170); }
  G.room = id; G.k.x = x; G.k.y = y; if (dir) G.k.dir = dir; G.k.walking = false; G.k.face = face || 'side'; G.flags['vis_' + id] = 1;
  cv.style.opacity = 1; $('#roomname').textContent = Rooms[id].name;
  if (Rooms[id].enter) await Rooms[id].enter();
}

/* ---------- objetivos en pantalla ---------- */
function targetsOf(room) {
  const r = Rooms[room], out = [];
  (r.npcs || []).forEach(n => { if (!n.when || n.when()) out.push(n); });
  (r.hot || []).forEach(h => { if (!h.when || h.when()) out.push(h); });
  return out;
}
function targetAt(x, y) { return targetsOf(G.room).find(t => { const [a, b, w, h] = t.rect; return x >= a && x < a + w && y >= b && y < b + h; }) || null; }
function findTarget(id) { const here = targetsOf(G.room).find(t => t.id === id); if (here) return here; for (const rid in Rooms) { const t = [...(Rooms[rid].npcs || []), ...(Rooms[rid].hot || [])].find(t => t.id === id); if (t) return t; } return null; }

async function resolve(val, key, fallback) {
  if (val === undefined || val === null) { await K(rot('gen_' + fallback, Gen[fallback])); return; }
  if (typeof val === 'function') { const r = await val(); if (typeof r === 'string') await K(r); return; }
  if (Array.isArray(val)) { const i = Math.min(G.flags['seq_' + key] || 0, val.length - 1); G.flags['seq_' + key] = i + 1; await K(val[i]); return; }
  await K(val);
}

/* ---------- ejecutar acciones ---------- */
async function act(verb, target, item) {
  if (G.busy) return; G.busy = true; G.hover = null; updateSentence(verb, item, target && target.name);
  try {
    if (target) {
      if (target.walk) await walkTo(target.walk[0], target.walk[1]);
      G.k.face = target.faceRow || 'side';
      if (target.face) G.k.dir = target.face; else if (target.rect) { const cx = target.rect[0] + target.rect[2] / 2; if (Math.abs(cx - G.k.x) > 4) G.k.dir = cx > G.k.x ? 1 : -1; }
    }
    const key = (target ? target.id : 'inv') + '_' + verb + (item ? '_' + item : '');
    if (!verb) { if (target && target.exit) await target.exit(); }
    else if (verb === 'usar' && item) {
      let v = target.con && (target.con[item] !== undefined ? target.con[item] : target.con._);
      if (v === undefined && target.npc && target.dar) v = target.dar[item] !== undefined ? target.dar[item] : target.dar._;
      await resolve(v, key, target.npc ? 'usarPersona' : 'con');
    } else if (verb === 'dar' && item) {
      if (!target.npc) await resolve(null, key, 'darCosa');
      else { const v = target.dar && (target.dar[item] !== undefined ? target.dar[item] : target.dar._); await resolve(v, key, 'usarPersona'); }
    } else if (verb === 'dar') { await K('¿Dar el qué? Primero tengo que elegir algo de lo que llevo.'); }
    else {
      let fb = verb; if (target.npc && verb === 'coger') fb = 'cogerPersona'; if (target.npc && verb === 'usar') fb = 'usarPersona';
      if (verb === 'usar' && target.exit && target.usar === undefined) await target.exit(); else await resolve(target[verb], key, fb);
    }
  } catch (e) { console.error(e); }
  G.busy = false; G.verb = null; G.item = null; renderVerbs(); renderInv(); updateSentence(); save();
  if (G.after) { const f = G.after; G.after = null; await f(); }
}
async function actItem(verb, id, other) {
  if (G.busy) return; G.busy = true;
  const it = Items[id];
  try {
    if (other) { const v = (it.con && it.con[other]) || (Items[other].con && Items[other].con[id]); await resolve(v, 'inv_' + id + '_' + other, 'con'); }
    else if (verb === 'mirar') await resolve(it.mirar, 'inv_m_' + id, 'mirar');
    else if (verb === 'usar') await resolve(it.usar, 'inv_u_' + id, 'usar');
    else if (verb === 'coger') await resolve(null, 'x', 'cogerItem');
    else if (verb === 'hablar') await resolve(null, 'x', 'hablarItem');
  } catch (e) { console.error(e); }
  G.busy = false; G.verb = null; G.item = null; renderVerbs(); renderInv(); updateSentence(); save();
  if (G.after) { const f = G.after; G.after = null; await f(); }
}

/* ---------- interfaz ---------- */
function updateSentence(verb, item, name) {
  const mb = $('#btn-map'); if (mb) mb.hidden = !flag('casa_abierta');
  verb = verb === undefined ? G.verb : verb; item = item === undefined ? G.item : item; name = name === undefined ? (G.hover || '') : name;
  let s = verb ? VERBS.find(v => v[0] === verb)[1] : 'Ir a';
  if (item) s += ' ' + Items[item].name.toLowerCase() + ' ' + PREP[verb || 'usar'];
  if (item && (!name || name === Items[item].name.toLowerCase())) s += '…';
  else if (name) s += (verb === 'hablar' ? ' con ' : ' ') + name; else if (!verb && !item) s = '';
  $('#sentence').textContent = s || ' ';
}
function renderVerbs() {
  const el = $('#verbs'); el.innerHTML = '';
  VERBS.forEach(([id, label]) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'verb' + (G.verb === id ? ' on' : ''); b.textContent = label; b.id = 'verb-' + id; b.onclick = () => { if (G.busy) return; G.verb = G.verb === id ? null : id; G.item = null; renderVerbs(); renderInv(); updateSentence(); }; el.appendChild(b); });
}
const iconCache = {};
function renderInv() {
  const el = $('#inv'); el.innerHTML = '';
  G.inv.forEach(id => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'item' + (G.item === id ? ' on' : ''); b.title = Items[id].name; b.setAttribute('aria-label', Items[id].name);
    const im = document.createElement('img'); im.src = iconCache[id] || (iconCache[id] = iconURL(id)); im.alt = ''; b.appendChild(im);
    b.onmouseenter = () => { G.hover = Items[id].name.toLowerCase(); updateSentence(); }; b.onmouseleave = () => { G.hover = null; updateSentence(); };
    b.onclick = () => clickItem(id); b.oncontextmenu = e => { e.preventDefault(); actItem('mirar', id); };
    el.appendChild(b);
  });
  for (let i = G.inv.length; i < 16; i++) { const d = document.createElement('div'); d.className = 'item empty'; el.appendChild(d); }
}
function clickItem(id) {
  if (G.busy) return;
  if (G.item && G.item !== id && (G.verb === 'usar' || !G.verb)) return actItem('usar', G.item, id);
  if (G.verb === 'mirar' || G.verb === 'coger' || G.verb === 'hablar') return actItem(G.verb, id);
  if (G.verb === 'dar') { G.item = id; renderInv(); updateSentence(); return; }
  if (Items[id].directo && G.verb === 'usar') return actItem('usar', id);
  if (G.item === id) return actItem('usar', id); // segundo clic en el mismo objeto: usarlo solo
  G.item = id; G.verb = 'usar';
  renderVerbs(); renderInv(); updateSentence();
}
let toastT = null;
function toast(t) { if (G.fast) return; const el = $('#toast'); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { el.hidden = true; }, 1900); }

function evtPos(e) { const r = $('#cv').getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; }
function onStageClick(e, right) {
  if (speechSkip) { speechSkip(); return; }
  if (G.busy || G.inDialog) return;
  const [x, y] = evtPos(e), t = targetAt(x, y);
  if (right) { if (t) act('mirar', t); return; }
  if (!t) { if (!G.verb && !G.item) { G.busy = true; walkTo(x, y).then(() => { G.busy = false; save(); }); } else { G.verb = null; G.item = null; renderVerbs(); renderInv(); updateSentence(); } return; }
  if (G.item && !G.verb) G.verb = 'usar';
  if (!G.verb) { if (t.exit) return act(null, t); G.busy = true; const p = t.walk || [x, y]; walkTo(p[0], p[1]).then(() => { G.busy = false; save(); }); return; }
  act(G.verb, t, G.item);
}

/* ---------- diálogos ---------- */
async function dialog(optsFn) {
  for (;;) {
    G.inDialog = true; $('#panel').classList.add('talk');
    const opts = optsFn().map(o => Object.assign(o, OptPatch[o.id] || {})).filter(o => !o.drop && (!o.cond || o.cond()) && (!o.req || o.req()) && (o.keep || !G.flags['opt_' + o.id]));
    (G.dialogWho && MasOpts[G.dialogWho] || []).forEach(o => { if ((!o.cond || o.cond()) && !G.flags['opt_' + o.id]) opts.push(o); });
    const ex = G.dialogWho && ExtraOpts[G.dialogWho]; if (ex) opts.push({ id: 'nec_' + G.dialogWho, text: ex.text, keep: true, run: ex.run });
    const pick = await new Promise(res => {
      const el = $('#dialog'); el.innerHTML = '';
      [...opts, { id: '_bye', text: 'Adiós.' }].forEach((o, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.id = 'opt-' + o.id; b.textContent = o.text; b.onclick = () => res(o); el.appendChild(b); });
      G.pickOption = id => { const o = opts.find(o => o.id === id) || { id: '_bye' }; res(o); };
    });
    $('#dialog').innerHTML = '';
    if (pick.id === '_bye') break;
    G.flags['opt_' + pick.id] = 1;
    if (!pick.silent) await K(pick.say || pick.text);
    await pick.run();
    if (pick.after) await pick.after();
    save();
    if (pick.end) break;
  }
  G.inDialog = false; $('#panel').classList.remove('talk');
}

/* ---------- capas (carta, cuaderno, fin) ---------- */
function overlay(html, btn) {
  if (G.fast) return Promise.resolve();
  return new Promise(res => { const el = $('#overlay'); el.innerHTML = '<div class="sheet">' + html + '<button type="button" class="verb" id="ov-close">' + (btn || 'Cerrar') + '</button></div>'; el.hidden = false; $('#ov-close').onclick = () => { el.hidden = true; res(); }; $('#ov-close').focus(); });
}
function panelOverlay(build) { // build(el, close) → promesa con el resultado
  return new Promise(res => { const el = $('#overlay'); el.innerHTML = '<div class="sheet game-sheet"></div>'; el.hidden = false; build(el.firstChild, v => { el.hidden = true; res(v); }); });
}
function showNotebook() {
  const li = G.notes.length ? G.notes.map(n => '<li>' + n + '</li>').join('') : '<li>Todavía en blanco. Como mi bronceado el primer día.</li>';
  return overlay('<h2>Cuaderno de Karen</h2><ul class="notes">' + li + '</ul>');
}

/* ---------- mapa ---------- */
const MapPlaces = [];
function openMap() {
  if (G.busy || G.inDialog || !flag('casa_abierta')) return;
  const el = $('#overlay');
  el.innerHTML = '<div class="sheet mapa"><h2>Mapa de Málaga</h2><p>Todo está a diez minutos. De los de aquí.</p><div class="places">' + MapPlaces.map(p => '<button type="button" class="place' + (p.id === G.room ? ' here' : '') + '" id="go-' + p.id + '">' + p.name + '</button>').join('') + '</div><button type="button" class="verb" id="ov-close">Quedarme aquí</button></div>';
  el.hidden = false; $('#ov-close').onclick = () => { el.hidden = true; };
  MapPlaces.forEach(p => { $('#go-' + p.id).onclick = () => { el.hidden = true; travel(p.id); }; });
}
const PASEO = ['Diez minutos, decían. Llevo veinte y ya he saludado a seis desconocidos.', 'Cuarenta grados a la sombra. Y la sombra está ocupada.', 'Me han dicho «ahora después». No sé si es ahora o es después.', 'Un señor me ha dicho «illa» tres veces. Creo que es mi nombre aquí.', 'He pedido la hora y me han contado su vida. Sigo sin saber la hora.'];
async function travel(id) {
  if (id === G.room) return; const p = MapPlaces.find(p => p.id === id); G.busy = true;
  await goRoom(id, p.x, p.y, p.dir || 1, p.face);
  G.flags.viajes = (G.flags.viajes || 0) + 1; if (G.flags.viajes % 5 === 0) await K(rot('paseo', PASEO));
  G.busy = false; save();
}

/* ---------- dibujo ---------- */
let ctx, last = 0;
function frame(ts) {
  const dt = Math.min(0.05, (ts - last) / 1000 || 0); last = ts; G.t = ts;
  stepWalk(dt);
  const r = Rooms[G.room];
  ctx.drawImage(r.bg, 0, 0);
  if (r.draw) r.draw(ctx, ts);
  const list = (r.npcs || []).filter(n => n.sprite && (!n.when || n.when())).map(n => ({ y: n.back ? -1 : (n.sy || n.y), f: () => { ctx.save(); ctx.translate(Math.round(n.x), Math.round(n.y)); if (n.flip) ctx.scale(-1, 1); n.sprite(ctx, { t: ts, talking: G.talkingId === n.id }); ctx.restore(); } }));
  const k = G.k; list.push({ y: k.y, f: () => { ctx.save(); ctx.translate(Math.round(k.x), Math.round(k.y)); if (KarenSheet.img) drawKarenSheet(ctx, k, ts, r.scale || 0.9, G.talkingId === 'karen'); else { if (k.dir < 0) ctx.scale(-1, 1); Sprites.karen(ctx, { t: ts, walking: k.walking, talking: G.talkingId === 'karen' }); } ctx.restore(); } });
  list.sort((a, b) => a.y - b.y).forEach(o => o.f());
  if (r.front) r.front(ctx, ts);
  if (window.drawFlechas) window.drawFlechas(ctx, ts);
  requestAnimationFrame(frame);
}

function boot() {
  const cv = $('#cv'); ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false;
  cv.addEventListener('click', e => onStageClick(e, false));
  cv.addEventListener('contextmenu', e => { e.preventDefault(); onStageClick(e, true); });
  $('#speech').addEventListener('click', () => { if (speechSkip) speechSkip(); });
  cv.addEventListener('mousemove', e => { if (G.busy || G.inDialog) return; const [x, y] = evtPos(e), t = targetAt(x, y); const n = t ? t.name : null; if (n !== G.hover) { G.hover = n; updateSentence(); } cv.style.cursor = t ? 'pointer' : 'crosshair'; });
  cv.addEventListener('mouseleave', () => { G.hover = null; if (!G.busy) updateSentence(); });
  $('#btn-map').onclick = openMap;
  $('#btn-saves').onclick = () => openSaves();
  document.addEventListener('keydown', e => { if ((e.key === 'm' || e.key === 'M') && $('#overlay').hidden) openMap(); });
  $('#btn-reset').onclick = () => { wipe(); location.reload(); };
  $('#btn-help').onclick = () => overlay('<h2>Cómo se juega</h2><ul class="notes"><li><b>Clic</b> en el escenario: Karen camina.</li><li><b>Verbo + clic</b>: mirar, coger, usar, hablar o dar.</li><li><b>Clic derecho</b>: mirar, sin elegir verbo.</li><li><b>Usar o Dar + objeto del inventario + destino</b>: «Usar palo con olivo».</li><li>Un clic sobre un objeto del inventario lo deja listo para usarlo con otra cosa.</li><li>Clic mientras alguien habla: pasa a la frase siguiente.</li></ul>');
  const fresh = !load();
  renderVerbs(); renderInv(); updateSentence();
  $('#roomname').textContent = Rooms[G.room].name;
  requestAnimationFrame(frame);
  if (window.startGame) window.startGame(fresh);
}
