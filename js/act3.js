/* El retrato borrado — Acto 3: «El corazón» */
'use strict';
Object.assign(Icons, {
  foto(c) { R(c, 2, 2, 12, 12, '#f1ead9'); R(c, 3, 3, 10, 8, '#9fb8c4'); R(c, 3, 8, 10, 3, '#d9c184'); R(c, 7, 4, 3, 3, '#d99a72'); R(c, 6, 7, 5, 4, '#f4f4f4'); R(c, 4, 8, 2, 2, '#8a5c36'); R(c, 11, 8, 2, 2, '#8a5c36'); },
  anillo(c) { R(c, 4, 5, 8, 8, '#d8b24a'); R(c, 6, 7, 4, 4, '#2a2445'); R(c, 5, 4, 6, 1, '#f4e08a'); R(c, 7, 2, 2, 3, '#f6f6fb'); }
});
Object.assign(Items, {
  foto: { name: 'Foto del cenachero', mirar: 'Un muchacho con dos cenachos y un ancla en el antebrazo, en la playa del cuadro. Sonríe como quien no sabe lo que viene.' },
  anillo: { name: 'Anillo grabado', mirar: '«Vuelve. Tu cenachero». Dos palabras y una firma. Y sesenta años esperando respuesta.' }
});

/* ---------- abrir la caja ---------- */
const SIMB = ['Sol', 'Jazmín', 'Ancla', 'Sardina', 'Barca', 'Luna'], CLAVE = [1, 3, 5, 4];
Items.perla.con = { caja: async () => { lose('perla'); flag('perla_puesta', 1); await K('Encaja. Algo hace clic por dentro y las ruedas ya giran.'); if (!flag('tiene_letra')) await K('Pero hay seis dibujos en cada una y yo no sé la combinación. Todavía.'); } };
Items.caja.usar = () => abrirCaja();
async function abrirCaja() {
  if (flag('caja_abierta')) return K('Vacía y abierta. Como me he quedado yo.');
  if (!flag('perla_puesta')) return K(has('perla') ? 'El hueco redondo. Y yo con una perla en el bolsillo.' : 'No se abre. Le falta algo en el hueco, y a mí me falta saber qué. Las ruedas giran en falso.');
  const st = G.flags.ruedas || (G.flags.ruedas = [0, 0, 0, 0]);
  const ok = await panelOverlay((el, close) => {
    let msg = 'Cuatro ruedecitas, seis dibujos en cada una.';
    const draw = () => {
      el.innerHTML = '<h2>La caja-corazón</h2><p>«Cuatro cosas»</p><div class="mg-row">' + st.map((v, i) => '<button type="button" class="mg-peg" style="width:6em" id="rueda-' + i + '">' + SIMB[v] + '</button>').join('') + '</div><p class="mg-say">' + msg + '</p><div class="mg-row"><button type="button" class="verb" id="mg-open">Abrir</button><button type="button" class="verb" id="mg-back">Volver</button></div>';
      st.forEach((v, i) => { el.querySelector('#rueda-' + i).onclick = () => { st[i] = (st[i] + 1) % 6; draw(); }; });
      el.querySelector('#mg-back').onclick = () => close(false);
      el.querySelector('#mg-open').onclick = () => { if (st.every((v, i) => v === CLAVE[i])) return close(true); msg = flag('tiene_letra') ? 'No cede. La copla las decía en orden: un jazmín, una sardina, la luna y una barca.' : 'No cede. Mil doscientas noventa y seis combinaciones: lo he calculado y no pienso probarlas. Mi abuela lo dejó dicho en una canción.'; draw(); };
    };
    draw();
  });
  if (!ok) return;
  flag('caja_abierta', 1);
  await K('Jazmín, sardina, luna, barca… Se abre. Y suena: es la copla.');
  give('foto'); give('anillo');
  await K('Dentro hay una foto: un cenachero joven en la playa del cuadro, con un ancla tatuada en el antebrazo.');
  await K('Y un anillo grabado: «Vuelve. Tu cenachero».');
  addNote('La caja está abierta: una foto de un cenachero joven con un ancla tatuada en el antebrazo, y un anillo: «Vuelve. Tu cenachero».');
}

/* ---------- el reencuentro ---------- */
Props.retratoFinal = function (c) {
  Props.retrato(c);
  R(c, 139, 25, 46, 20, '#8bcff8'); R(c, 139, 45, 46, 8, '#2a86c9'); R(c, 139, 53, 46, 26, '#e3cc92'); R(c, 141, 56, 12, 4, '#8c2b22'); R(c, 140, 55, 14, 1, '#f4f4f4'); R(c, 143, 51, 2, 4, '#f08a24');
  R(c, 146, 52, 14, 27, '#f3efe6'); R(c, 148, 48, 10, 6, '#f3efe6'); R(c, 149, 38, 8, 10, '#e8b89a'); R(c, 147, 35, 12, 6, '#2a1d17'); R(c, 147, 39, 2, 12, '#2a1d17'); R(c, 157, 39, 2, 10, '#2a1d17'); R(c, 151, 42, 1, 1, '#2a1d17'); R(c, 154, 42, 1, 1, '#2a1d17'); R(c, 151, 45, 4, 1, '#b0463c'); R(c, 158, 37, 3, 3, '#ffffff');
  R(c, 164, 52, 15, 27, '#27408b'); R(c, 164, 55, 15, 2, '#f4f4f4'); R(c, 164, 60, 15, 2, '#f4f4f4'); R(c, 166, 48, 11, 6, '#27408b'); R(c, 160, 62, 5, 3, '#e8b89a');
  R(c, 167, 38, 9, 10, '#d99a72'); R(c, 166, 34, 11, 4, '#1f2f4a'); R(c, 172, 37, 6, 1, '#15213a'); R(c, 167, 44, 9, 5, '#f4f4f4'); R(c, 169, 41, 1, 1, '#2b2b2b'); R(c, 173, 41, 1, 1, '#2b2b2b'); R(c, 170, 45, 3, 1, '#b0463c'); R(c, 171, 42, 1, 2, '#c08560');
};
async function reencuentro(con) {
  G.busy = true;
  await scene([
    ['karen', '¿Usted conoció a Trini del Perchel?'],
    ['chanquete', '*(deja de limpiar)* Ese nombre lleva sesenta años sin decirse en este puesto. ¿Quién te lo ha dicho?'],
    ['karen', con === 'foto' ? 'Esta foto. Estaba en una caja con forma de corazón.' : 'Este anillo. Estaba en una caja con forma de corazón.'],
    ['chanquete', con === 'foto' ? 'Ese era yo. Antes de saber lo que era esperar.' : 'Tres meses de cenacho me costó. «Vuelve», le puse. Y no volvió.'],
    ['karen', 'No la dejaron volver. Se fue embarazada. Yo soy su nieta.'],
    ['chanquete', '…'],
    ['karen', 'Y esto es lo que hicieron con usted.'],
    ['chanquete', 'Mira tú. A mí me borraron ahí, y aquí he seguido, to los días.'],
    ['chanquete', '*(la mira)* Los ojos. Son los de ella.'],
    ['karen', 'Un pintor me dijo que una cara no se inventa: que se mira. Déjeme mirarle esta tarde, abuelo. Tengo pinceles, y aceite de un olivo que conozco.'],
    ['chanquete', 'Abuelo… Dilo otra vez, que llevo sesenta años de retraso.']
  ]);
  flag('reconocido', 1); flag('final', 1);
  await overlay('<h2>Esa noche, en la casa del Perchel</h2><p>Karen despertó las pinturas secas con el aceite del patio y pintó hasta que encendieron los farolillos. No inventó nada: miró.</p>', 'Seguir');
  await goRoom('casa', 128, 138, 1); G.k.face = 'side';
  await scene([
    ['karen', 'Ya está. Sesenta años tarde, pero ya está.'],
    ['chanquete', '*(se frota un ojo)* Es el aceite, que pica.'],
    ['chanquete', 'Me has pintao viejo.'],
    ['karen', 'Le he pintado como está. Ha tardado sesenta años en llegar al cuadro.'],
    ['chanquete', 'Pues ya estoy. *(al retrato)* Ya estoy, Trini.'],
    ['chanquete', 'Y ahora come algo, niña, que estás muy flaca.']
  ]);
  G.busy = false; save();
  await overlay('<h2>Fin</h2><p><b>El retrato borrado</b>, una aventura gráfica malagueña.</p><p>Fuera suenan los fuegos de la Feria. En la casa de Trini hay, por primera vez en sesenta años, dos platos en la mesa.</p><p>Guion y arte de Rafa. Con el palo alcazabaste tu objetivo.</p>', 'Quedarme en la casa');
}
(function () {
  const ch = Rooms.mercado.npcs.find(n => n.id === 'chanquete');
  const sin = async () => { await S('chanquete', 'Guapo el muchacho. A saber quién era.'); await K('Hay veinte pescaderos en este mercado. No tengo por qué pensar que es este.'); };
  ch.dar.foto = () => flag('tiene_secreto') ? reencuentro('foto') : sin();
  ch.dar.anillo = () => flag('tiene_secreto') ? reencuentro('anillo') : S('chanquete', '*(se le va la mano al dedo)* Bonito anillo. ¿Te pongo boquerones?');
  const oldMirar = ch.mirar;
  ch.mirar = () => (flag('tiene_secreto') && flag('caja_abierta') && !flag('reconocido')) ? K('Al despachar se le sube la manga. En el antebrazo, un ancla. La misma de la foto.') : oldMirar();
  const oldHablar = ch.hablar;
  ch.hablar = async () => { if (flag('tiene_secreto') && flag('caja_abierta') && !flag('reconocido')) { const r = await ask(['¿Usted conoció a Trini del Perchel?', 'Nada. Solo miraba el pescado.']); if (r === 0) return reencuentro('anillo'); return K('Todavía no. Necesito un segundo. O sesenta años.'); } return oldHablar(); };
  ch.when = () => !flag('final');
  const cq = Rooms.pirimpi.npcs.find(n => n.id === 'chiquito');
  cq.dar.foto = () => S('chiquito', flag('tiene_secreto') ? '¡Ese! ¡Ese es! Con el ancla, que se la hizo en Melilla.' : '¡Fistro! ¡Pecador de la pradera!');
  cq.dar.anillo = () => S('chiquito', flag('tiene_secreto') ? 'Tres meses de cenacho. Me pidió cinco duros para acabar de pagarlo. Jarl.' : '¡Jarl!');
  // escena final en la casa
  Rooms.casa.npcs.push(npc('chanquete', 'Chanquete', 196, 138, NPC.chanquete, '#b8e0ff', { flip: true, when: () => flag('final'), walk: [160, 140], mirar: 'Mi abuelo. Mira el cuadro como quien cuenta barcas.', hablar: () => S('chanquete', rot('ch_fin', ['Dilo otra vez, niña.', 'Come algo, que estás muy flaca.', 'Tu abuela se habría reído. Y luego habría llorado. Y luego nos habría puesto de comer.'])), dar: { _: () => S('chanquete', 'Guárdalo, niña. Hoy ya me lo has dado todo.') } }));
  const oldDraw = Rooms.casa.draw; Rooms.casa.draw = (c, t) => { oldDraw(c, t); if (flag('final')) Props.retratoFinal(c); };
  Rooms.casa.hot.unshift({ id: 'retrato_final', name: 'retrato acabado', rect: [134, 20, 56, 64], walk: [150, 132], faceRow: 'up', when: () => flag('final'), mirar: 'Trini con veinte años y él con ochenta, por fin en el mismo cuadro. Ella sonríe, y ahora se sabe a quién.' });
  const clavo = Rooms.casa.hot.find(h => h.id === 'clavo'); clavo.when = () => flag('retrato_cogido') && !flag('final');
})();
