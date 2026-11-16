/* El retrato borrado — fondos de Rafa para el Soho, la Victoria, el Botánico y el chiringuito */
'use strict';
(function () {
  const hot = (room, id) => Rooms[room].hot.find(h => h.id === id);
  const who = (room, id) => Rooms[room].npcs.find(n => n.id === id);
  const keep = (room, ids) => { Rooms[room].hot = Rooms[room].hot.filter(h => ids.includes(h.id)); };
  const place = (p, x, y) => { const m = MapPlaces.find(m => m.id === p); m.x = x; m.y = y; };

  /* ----- Teatro del Soho ----- */
  const so = Rooms.soho; so.walk = { x1: 30, x2: 300, y1: 150, y2: 158 };
  Object.assign(who('soho', 'antonio'), { x: 226, y: 153, rect: [215, 95, 22, 58], walk: [196, 155] });
  so.draw = c => { c.fillStyle = '#b3262e'; c.beginPath(); c.moveTo(154, 140); c.lineTo(180, 140); c.lineTo(190, 160); c.lineTo(144, 160); c.closePath(); c.fill(); R(c, 154, 140, 26, 1, '#8c1b22'); [[146, 150], [188, 150]].forEach(([x, y]) => { R(c, x, y - 10, 1, 10, '#e8c12a'); R(c, x - 1, y - 12, 3, 2, '#e8c12a'); }); };
  Object.assign(hot('soho', 's_puerta'), { rect: [98, 98, 136, 44], walk: [167, 151], mirar: 'Puertas de cristal de lado a lado. Dentro se oye un piano y a alguien afinando la voz.' });
  Object.assign(hot('soho', 's_taquilla'), { rect: [32, 117, 28, 19], walk: [50, 152] });
  Object.assign(hot('soho', 's_cartel'), { name: 'letrero', rect: [128, 54, 84, 28], walk: [167, 152], mirar: '«SOHO», en letras de colores como pintadas a brochazos. Debajo: teatro, música, danza, Málaga. Y un patrocinador, que el arte no es morirte de frío.' });
  Object.assign(hot('soho', 's_alfombra'), { rect: [146, 141, 42, 19] });
  Object.assign(hot('soho', 's_mural'), { name: 'fachada', rect: [70, 0, 180, 52], mirar: 'Tres pisos de cristal con luz morada. En mi país esto sería un ayuntamiento. Aquí es de un señor.' });
  so.hot.push({ id: 's_arboles', name: 'árbol', rect: [0, 0, 34, 150], mirar: 'Un árbol en mitad de la acera. Da sombra de noche, que ya es dar.' });
  place('soho', 60, 154);

  /* ----- Camperos Kent, en la escalinata de la Victoria ----- */
  const ke = Rooms.kent; ke.walk = { x1: 20, x2: 300, y1: 152, y2: 158 };
  Object.assign(who('kent', 'victoria'), { x: 262, y: 148, rect: [251, 92, 22, 56], walk: [246, 154] });
  const pu = who('kent', '_puesto'); pu.sy = 149; pu.sprite = c => { c.save(); c.translate(4, 26); P2.puestoKent(c); c.restore(); };
  ke.draw = c => {
    R(c, 22, 92, 20, 60, '#c2262b'); R(c, 24, 96, 16, 36, '#9fd0ea'); R(c, 24, 113, 16, 1, '#c2262b'); R(c, 31, 96, 1, 36, '#c2262b'); R(c, 22, 88, 20, 5, '#a01d22'); R(c, 34, 124, 2, 3, '#e8c12a');
    crowd(c, [[200, 156, { top: '#e23a7a', bottom: '#f4f4f4', skirt: true, hairStyle: 'bun', hair: '#2b1a12' }], [186, 157, { top: '#f4f4f4', bottom: '#2b2b33', hat: 'paja', hair: '#3a2412' }], [172, 156, { top: '#35a852', bottom: '#f4c430', skirt: true, hairStyle: 'long', hair: '#6a3d1e' }]]);
  };
  Object.assign(hot('kent', 'k_toldo'), { rect: [214, 64, 92, 28], walk: [246, 154] });
  Object.assign(hot('kent', 'k_plancha'), { rect: [222, 114, 36, 12], walk: [246, 154] });
  Object.assign(hot('kent', 'k_cabina'), { rect: [22, 88, 20, 64], walk: [48, 154], face: -1 });
  Object.assign(hot('kent', 'k_cola'), { rect: [162, 100, 48, 58], walk: [152, 156] });
  Object.assign(hot('kent', 'k_basilica'), { rect: [52, 0, 166, 116], walk: [130, 152], mirar: 'La basílica de la Victoria, con su torre y sus arcos. Aquí todo se llama Victoria: la virgen, la cerveza, la del puesto. Qué manera de ganar.' });
  ke.hot.push({ id: 'k_escalinata', name: 'escalinata', rect: [56, 117, 150, 24], mirar: 'Una escalinata enorme. La Victoria está arriba, como todas las victorias: después de las escaleras.', usar: 'Subo tres escalones. Hace más calor arriba. Bajo.' });
  place('kent', 90, 155);

  /* ----- Jardín Botánico: la boda junto a la cascada ----- */
  const bo = Rooms.botanico; bo.walk = { x1: 10, x2: 310, y1: 142, y2: 157 };
  Object.assign(who('botanico', 'pablob'), { x: 206, y: 150, rect: [195, 92, 22, 58], walk: [178, 152] });
  bo.draw = c => {
    R(c, 6, 136, 34, 3, '#f4f4f4'); R(c, 6, 139, 34, 12, '#e9e2d2'); R(c, 12, 130, 16, 5, '#8a3a26'); R(c, 26, 127, 5, 5, '#70301f'); R(c, 10, 135, 20, 2, '#3a2416');
    crowd(c, [[24, 147, { top: '#f4f4f4', bottom: '#1c1c22', apron: '#1c1c22', hair: '#2b2b2b' }], [62, 149, { top: '#e23a7a', bottom: '#e23a7a', skirt: true, hairStyle: 'bun', hair: '#6a3d1e' }], [76, 151, { top: '#2b2b33', bottom: '#2b2b33', shirt: '#fff', hair: '#2b2b2b' }], [266, 149, { top: '#3a7bd5', bottom: '#3a7bd5', skirt: true, hairStyle: 'long', hair: '#f1d36a', flip: true }], [280, 151, { top: '#6b6b6b', bottom: '#6b6b6b', shirt: '#fff', tie: '#b3262e', hairStyle: 'bald', hair: '#aaa', flip: true }]]);
  };
  Object.assign(hot('botanico', 'b_cenador'), { name: 'cascada', rect: [138, 28, 46, 92], walk: [160, 144], faceRow: 'up', mirar: 'Una cascada entre helechos. Lo más fresco que he visto en Málaga. La boda se celebra aquí por algo.', usar: 'Meto la mano. Fría. Me quedaría a vivir en este metro cuadrado.' });
  Object.assign(hot('botanico', 'b_invitados'), { rect: [50, 92, 36, 60], walk: [100, 152], face: -1 });
  Object.assign(hot('botanico', 'b_invitados2'), { rect: [256, 92, 36, 60], walk: [240, 152] });
  Object.assign(hot('botanico', 'b_jamon'), { rect: [4, 92, 40, 60], walk: [50, 152], face: -1 });
  Object.assign(hot('botanico', 'b_estanque'), { rect: [112, 120, 92, 14], walk: [160, 144], faceRow: 'up', mirar: 'El agua cae a una charca verde. Hay una rana. La rana tampoco afina.' });
  Object.assign(hot('botanico', 'b_plantas'), { name: 'helechos', rect: [200, 0, 120, 90], mirar: 'Helechos del tamaño de un paraguas. Es un jardín histórico, y yo ya tengo antecedentes con un olivo.' });
  bo.hot.push({ id: 'b_pasarela', name: 'pasarela', rect: [0, 136, 320, 6], mirar: 'Una pasarela de madera sobre la humedad. Cien invitados con tacones encima. Valentía.' });
  place('botanico', 110, 152);

  /* ----- Chiringuito de El Palo ----- */
  const ch = Rooms.chiringuito; ch.walk = { x1: 6, x2: 300, y1: 148, y2: 157 };
  ch.npcs = ch.npcs.filter(n => n.id !== '_barca');
  Object.assign(who('chiringuito', 'kanka'), { x: 150, y: 155, rect: [139, 97, 22, 58], walk: [124, 156] });
  Object.assign(who('chiringuito', 'mari'), { x: 262, y: 157, rect: [234, 122, 56, 36], walk: [226, 157] });
  ch.draw = (c, t) => {
    for (let i = 0; i < 11; i++) { const fx = 64 + i * 4, h = 2 + ((Math.floor(t / 120) + i * 3) % 4); R(c, fx, 111 - h, 3, h, i % 2 ? '#f08a24' : '#f4c430'); R(c, fx + 1, 110 - h, 1, 1, '#e23a3a'); }
    R(c, 80 + (Math.floor(t / 400) % 3), 100 - (Math.floor(t / 300) % 4), 4, 3, 'rgba(210,210,210,.45)');
    if (flag('espeto_asando')) { line(c, 100, 111, 112, 93, '#c9a15a'); for (let i = 0; i < 4; i++) R(c, 102 + i * 3, 106 - i * 4, 4, 2, '#c7d6e2'); }
  };
  Object.assign(hot('chiringuito', 'ch_barca'), { rect: [46, 86, 82, 50], walk: [92, 150], mirar: 'Una barca varada, llena de arena y de brasas. Navegar no navega, pero huele que alimenta.' });
  Object.assign(hot('chiringuito', 'ch_pizarra'), { name: 'chiringuito', rect: [130, 40, 150, 86], walk: [204, 150], faceRow: 'up', mirar: 'Un chiringuito con techo de paja. En la pizarra pone: «Hay espetos. NO HAY PAELLA». Las mayúsculas son de alguien muy cansado.', hablar: () => K('—¿Tienen sangría? —Tenemos espetos, niña. Y tinto de verano, que es lo mismo pero sin hacer el ridículo.') });
  Object.assign(hot('chiringuito', 'ch_bote'), { name: 'cajas de las cañas', rect: [58, 139, 28, 13], walk: [92, 152], face: -1, mirar: 'Las cajas de las cañas, vacías. En Feria vuela to, dicen. Hasta los palos.' });
  Object.assign(hot('chiringuito', 'ch_playa'), { rect: [0, 84, 46, 32] });
  ch.hot = ch.hot.filter(h => h.id !== 'ch_jabegas');
  ch.hot.push({ id: 'ch_palmeras', name: 'palmeras', rect: [0, 0, 320, 40], mirar: 'Palmeras despeinadas por el levante. O el poniente. Aquí el viento tiene nombre y opinión.' });
  place('chiringuito', 24, 154);

  ['soho', 'kent', 'botanico', 'chiringuito'].forEach(k => window.ExtraAssets.push(['assets/' + k + '.png', im => { Rooms[k].bg = im; }, () => {}]));
})();
