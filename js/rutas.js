/* El retrato borrado — pasos de una pantalla a otra, de oeste a este como en el plano de Málaga */
'use strict';
(function () {
  const drop = (room, ids) => { Rooms[room].hot = Rooms[room].hot.filter(h => !ids.includes(h.id)); };
  drop('calle', ['callejon', 'a_ciudad']); drop('perchel', ['a_casa', 'p_ciudad']);
  const mid = r => { const w = Rooms[r].walk; return Math.round((w.y1 + w.y2) / 2); };
  function paso(a, side, b, label, opt) { // side: 'izq' | 'der'; opt: {rect, walk, entry:[x,y,dir], look}
    opt = opt || {}; const wa = Rooms[a].walk, wb = Rooms[b].walk, top = Math.max(0, wa.y1 - 8);
    const rect = opt.rect || (side === 'der' ? [306, top, 14, H - top] : [0, top, 14, H - top]);
    const walk = opt.walk || [side === 'der' ? wa.x2 : wa.x1, mid(a)];
    const entry = opt.entry || (side === 'der' ? [wb.x1 + 6, mid(b), 1] : [wb.x2 - 6, mid(b), -1]);
    Rooms[a].hot.unshift({ id: 'ir_' + b, name: label, rect, walk, flecha: (side === 'izq' || side === 'der') ? side : (opt.marca || 'arriba'), when: () => flag('casa_abierta') || (opt.siempre), exit: () => goRoom(b, entry[0], entry[1], entry[2]), mirar: opt.look || 'Por ahí se va. Diez minutos, dicen. De los de aquí.' });
  }
  // eje oeste → este
  paso('calle', 'der', 'perchel', 'calle del Perchel', { siempre: true, look: 'La calle del Perchel. Se oyen pregones, una persiana y a alguien opinando desde un balcón.' });
  paso('perchel', 'izq', 'calle', 'casa de la abuela', { siempre: true, look: 'Por ahí se vuelve a la casa de mi abuela. Se ve la buganvilla desde aquí.' });
  paso('perchel', 'der', 'mercado', 'mercado de Atarazanas');
  paso('mercado', 'izq', 'perchel', 'calle del Perchel');
  paso('mercado', 'der', 'larios', 'calle Larios');
  paso('larios', 'izq', 'mercado', 'mercado de Atarazanas');
  paso('larios', 'der', 'parque', 'Paseo del Parque');
  paso('parque', 'izq', 'larios', 'calle Larios');
  paso('parque', 'der', 'puerto', 'puerto');
  paso('puerto', 'izq', 'parque', 'Paseo del Parque');
  paso('puerto', 'der', 'caleta', 'playa de La Caleta');
  paso('caleta', 'izq', 'puerto', 'puerto');
  paso('caleta', 'der', 'chiringuito', 'El Palo');
  paso('chiringuito', 'izq', 'caleta', 'playa de La Caleta');
  // centro, como lo ha fijado Rafa: Merced → Alcazabilla → catedral → Larios → Parque → puerto
  paso('merced', 'der', 'alcazabilla', 'calle Alcazabilla');
  paso('alcazabilla', 'izq', 'merced', 'plaza de la Merced');
  paso('alcazabilla', 'der', 'catedral', 'catedral');
  paso('catedral', 'izq', 'alcazabilla', 'calle Alcazabilla');
  paso('catedral', 'der', 'larios', 'calle del fondo, a calle Larios', { entry: [192, 126, -1], look: 'Por la derecha, al fondo, la calle baja hacia Larios.' });
  paso('larios', 'fondo', 'catedral', 'calle arriba, a la catedral', { rect: [176, 30, 26, 70], walk: [192, 124], entry: [302, 152, -1], look: 'Al fondo asoma una torre. Solo una.' });
  // la Victoria y el Botánico, al otro lado de la Merced; el Pirimpi, por la calle Granada
  paso('merced', 'izq', 'kent', 'basílica de la Victoria');
  paso('kent', 'der', 'merced', 'plaza de la Merced');
  paso('kent', 'izq', 'botanico', 'autobús al Jardín Botánico', { look: 'La parada del autobús al Botánico. Está en el norte. Diez minutos de los de aquí, o sea, cuarenta.' });
  paso('botanico', 'der', 'kent', 'autobús de vuelta a la Victoria');
  paso('merced', 'fondo', 'pirimpi', 'calle Granada, al Pirimpi', { rect: [112, 72, 56, 24], walk: [140, 126], entry: [24, 144, 1], look: 'Una calle estrecha que huele a vino dulce y a barril. Por ahí se va al Pirimpi.' });
  paso('pirimpi', 'izq', 'merced', 'plaza de la Merced', { entry: [140, 130, 1] });
  // ramal del sur: mercado → Soho → imprenta
  paso('mercado', 'fondo', 'soho', 'puerta sur, hacia el Soho', { marca: 'abajo', rect: [96, 150, 128, 10], walk: [160, 155], entry: [36, 154, 1], look: 'La puerta sur del mercado. Da a la Alameda y, cruzando, al Soho.' });
  paso('soho', 'izq', 'mercado', 'mercado de Atarazanas', { entry: [160, 150, 1] });
  paso('soho', 'der', 'imprenta', 'imprenta vieja', { entry: [292, 142, -1] });
  paso('imprenta', 'der', 'soho', 'calle, al teatro del Soho', { entry: [296, 154, -1] });

  // flechas en los bordes para que se vea por dónde se sale
  window.drawFlechas = function (c, t) {
    const r = Rooms[G.room]; (r.hot || []).forEach(h => { if (!h.flecha || (h.when && !h.when())) return; const y = Math.round((r.walk.y1 + r.walk.y2) / 2) - 4, k = Math.floor(t / 400) % 2, col = '#f4c430';
      if (h.flecha === 'arriba' || h.flecha === 'abajo') { const cx = Math.round(h.rect[0] + h.rect[2] / 2), cy = h.flecha === 'abajo' ? 150 : Math.round(h.rect[1] + h.rect[3] - 14) - k; c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(cx - 6, cy - 1, 13, 9); c.fillStyle = col; for (let i = 0; i < 5; i++) { const w = h.flecha === 'abajo' ? 9 - i * 2 : 1 + i * 2; c.fillRect(cx - (w >> 1), cy + i + (h.flecha === 'abajo' ? k : 0), w, 1); } return; }
      c.fillStyle = 'rgba(0,0,0,.45)'; if (h.flecha === 'der') { c.fillRect(309, y - 1, 10, 11); c.fillStyle = col; for (let i = 0; i < 5; i++) c.fillRect(311 + k + i, y + i, 1, 9 - i * 2); } else { c.fillRect(1, y - 1, 10, 11); c.fillStyle = col; for (let i = 0; i < 5; i++) c.fillRect(8 - k - i, y + i, 1, 9 - i * 2); } });
  };
})();

['cuaderno', 'carta', 'concha', 'caja'].forEach(id => { Items[id].directo = true; });
