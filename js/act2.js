/* El retrato borrado — Acto 2: tres ramas (imagen, música, verdad) */
'use strict';

/* ---------- utilidades ---------- */
function npc(id, name, x, y, sprite, color, more) { return Object.assign({ id, npc: true, name, x, y, sprite, color, h: 60, rect: [x - 11, y - 58, 22, 58], walk: [x - 26, y + 2], face: 1 }, more || {}); }
function prop(id, sy, fn) { return { id, x: 0, y: 0, sy, rect: [0, 0, 0, 0], sprite: (c, s) => fn(c, s.t) }; }
const S = (who, t) => say(who, t);
function ask(list) { // elegir entre opciones sin «Adiós»; devuelve el índice
  G.inDialog = true; $('#panel').classList.add('talk');
  return new Promise(res => {
    const el = $('#dialog'); el.innerHTML = '';
    list.forEach((t, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.id = 'ask-' + i; b.textContent = t; b.onclick = () => done(i); el.appendChild(b); });
    function done(i) { el.innerHTML = ''; G.inDialog = false; $('#panel').classList.remove('talk'); G.pickAsk = null; res(i); }
    G.pickAsk = done;
  });
}
const frase = k => !!G.flags['frase_' + k];

Object.assign(Items, {
  campero: { name: 'Campero', mirar: 'Un bocadillo redondo del tamaño de un volante. Lleva de todo. Lo dice la ley.', usar: 'Me lo comería, pero tengo un plan. Odio tener un plan.', con: { seta: async () => { lose('campero'); lose('seta'); give('supercampero'); await K('Seta dentro, pan encima. Un campero con sorpresa.'); await K('Que conste que el señor pidió que le abrieran la cabeza.'); } } },
  seta: { name: 'Seta', mirar: 'Psilocybe cubensis. Pequeña, marrón y con muy mala reputación en internet.', usar: 'No. Alguien tiene que conducir esta aventura.' },
  supercampero: { name: 'Súper-campero', mirar: 'Un campero con sorpresa. Que conste que el señor pidió que le abrieran la cabeza.', usar: 'Ni un bocado. Esto es material artístico.' },
  servilleta: { name: 'Servilleta de don Pablo', mirar: 'Una paloma vista desde todos los lados a la vez, en una servilleta de bar. Vale más que mi vuelo.', usar: 'Ni loca me limpio con esto. Es lo más caro que he tenido en la mano.' },
  entrada: { name: 'Entrada al Soho', mirar: 'Primera fila. Pone «cortesía del dueño». Del dueño de todo.' },
  salsa: { name: 'Salsa de «soha»', mirar: 'Negra y salada. Si mancha un mantel, mancha un papel.', con: { pinturas: 'Solo tendría un color. Y olería a restaurante.' } },
  poema: { name: 'Poema impreso', mirar: () => overlay('<div class="carta"><p>Traías la mar a cuestas,<br>plata viva en dos cenachos,<br>y yo, detrás de la reja,<br>aprendí a querer despacio.</p><p>Si un día me borra el tiempo<br>la cara, que no la voz,<br>búscame donde la sal<br>le pone nombre al amor.</p></div>', 'Guardar el poema') },
  pelota: { name: 'Pelota «No-vea»', mirar: 'Azul, con letras blancas. No veas la que he liado por una pelota.', usar: 'Bota. Podría quedarme a jugar. No: hay una niña llorando en re mayor.' },
  concha: { name: 'Concha', mirar: 'Cerrada. Suena por dentro, pero no es el mar.', usar: async () => { lose('concha'); give('perla'); flag('tiene_perla', 1); await K('¡Una perla! En mi país dentro de las conchas solo hay arrepentimiento.'); addNote('Dentro de la concha de Marisol había una perla.'); checkFin2(); } },
  perla: { name: 'Perla', mirar: 'Una perla. Redonda, perfecta y sin dueño conocido. Como un secreto.', con: { caja: 'Encaja. Las ruedas ya giran. Pero hay seis dibujos en cada una y yo no sé la combinación. Todavía.' } },
  posavasos: { name: 'Posavasos de Victoria', mirar: '«Malagueña y exquisita». Con buena fe y poca vista, parece una estampita.' },
  libro: { name: 'Libro de ángeles', mirar: async () => { await K('«El Ángel De Guarda Bajará Enseguida». Cuánta mayúscula.'); await K('Hay un ángel en cada página y ninguno hace nada práctico. Pero esas iniciales…'); } },
  sardinas: { name: 'Sardinas', mirar: 'Sardinas regaladas. Brillan. Me miran. Prefiero no encariñarme.', usar: 'Soy del norte, pero tengo límites.', con: { palo: async () => { lose('sardinas'); lose('palo'); give('espeto_crudo'); await K('Seis sardinas ensartadas en un palo de escoba.'); await K('En algún sitio, un inspector de sanidad acaba de sentir un escalofrío. Ahora falta fuego.'); } } },
  espeto_crudo: { name: 'Espeto crudo', mirar: 'Seis sardinas en un palo de escoba. Les falta fuego. Y permiso.' },
  espeto: { name: 'Espeto', mirar: 'Dorado, con sal gorda. Huele tan bien que me están siguiendo dos gatos.', usar: 'Uno solo… No. No, que es para la señora de la hamaca.' },
  cartojal: { name: 'Cartojal', mirar: 'Vino dulce. Aquí lo beben como agua. Yo no soy de aquí, y se me nota al segundo sorbo.', usar: 'Un sorbito… Vale. Ya entiendo por qué no sirven sangría.', con: { hielo: async () => { lose('cartojal'); lose('hielo'); give('vino'); await K('Cartojal con hielo de boquerón. Maridaje local.'); } } },
  hielo: { name: 'Hielo', mirar: 'Hielo de pescadería. Enfría igual y perfuma más.' },
  vino: { name: 'Vino dulce fresquito', mirar: 'Cartojal con hielo de boquerón. Dulce, frío y con un fondo marinero.' },
  whisky: { name: 'Whisky', mirar: 'Whisky. Dicen que a cierto señor le cambia el idioma.', usar: 'Es para el señor de los pasitos. Yo, de servicio, no bebo.' },
  cerveza: { name: 'Cerveza', mirar: 'Una Victoria bien fría. Bueno, fría: no hay hielo.', usar: 'Es para el señor de los pasitos. Yo, de servicio, no bebo.' },
  agua: { name: 'Agua', mirar: 'Agua. Lo más exótico que se puede pedir en esta taberna.' },
  cafe: { name: 'Café', mirar: () => K('Un ' + CAFES[G.flags.cafe_tipo || 0] + '. O eso creo. Hay nueve y no me he aprendido ninguno.') }
});
const CAFES = ['nube', 'sombra', 'corto', 'entrecorto', 'mitad', 'solo corto', 'semilargo', 'largo', 'solo', '«no me lo ponga»'];

/* ---------- oráculo de doña María por tema y fase ---------- */
async function oraculo(tema) {
  let f;
  if (flag('tiene_perla') && flag('tiene_letra') && flag('tiene_secreto')) f = 'Una cara no se recuerda: se reconoce.';
  else if (tema === 'retrato') f = flag('tiene_perla') || has('concha') ? 'Lo que el mar devuelve, encaja.' : flag('barco_zarpado') ? 'Lo que el mar se lleva, el mar lo devuelve.' : has('poema') ? 'Todo viejo necesita un mar, y todo mar, un final.' : (has('salsa') || flag('tintero_lleno')) ? 'Un tipo con carácter siempre encaja.' : has('servilleta') || flag('entrada') ? 'El arte no es morirte de frío.' : (has('supercampero') || flag('pablo_inspirado')) ? 'No vemos las cosas como son sino como somos.' : 'Tus pasos te llevarán a la Victoria.';
  else if (tema === 'caja') f = flag('tiene_letra') ? 'La música ya te lo ha dicho todo. Ahora te falta con qué abrir.' : !flag('mari_pide') ? 'La música abre el corazón.' : !flag('mari_lista') && !has('espeto') ? 'Con el palo alcazabas tu objetivo. Ya te lo dije.' : flag('tiene_acorde') ? 'Quien tiene el acorde y calla, desafina.' : has('libro') ? 'Para afinar el alma hay que saber cómo se llaman sus cuerdas.' : flag('tiene_nombre') ? 'Los ángeles viven en los libros; los demonios, en quien los escribe.' : flag('jesus_pide') ? 'Tus pasos te llevarán a la Victoria… también en la barra de un bar.' : flag('rafael_pide') ? 'Nadie conoce mejor al demonio que un pecador arrepentido.' : flag('pablo_pide') ? 'Los ángeles viven en los libros; los demonios, en quien los escribe.' : 'Para afinar el alma hay que saber cómo se llaman sus cuerdas.';
  else f = flag('tiene_secreto') ? 'Ya sabes dónde. Te falta saber cuál.' : !flag('sabe_remedio') ? 'La verdad sale de la boca de los más chiquitos.' : !(has('cartojal') || has('vino')) ? 'In vino veritas. Pero dulce, hija, y fresquito.' : !has('vino') ? 'Quien vende lo que da el mar, guarda el frío.' : 'Para entender a un pueblo, déjate querer por su camarero.';
  await S('maria', f); addNote('Doña María: «' + f + '»'); flag('oraculo_dicho', 1);
}

function checkFin2() { if (!flag('acto2_fin') && flag('tiene_perla') && flag('tiene_letra') && flag('tiene_secreto')) G.after = finActo2; }
async function finActo2() {
  flag('acto2_fin', 1); G.busy = true;
  await K('Una perla, una copla y un secreto. Y un abuelo vivo, entre el hielo y los boquerones.');
  await K('Abuela: creo que ya sé abrir tu corazón.');
  G.busy = false; save();
  await overlay('<h2>Fin del Acto 2</h2><p>Karen tiene las tres piezas:</p><ul class="notes"><li><b>La perla</b>, para el hueco de la caja.</li><li><b>La letra</b> de «Cuatro cosas»: jazmín, sardina, luna y barca.</li><li><b>El secreto</b>: el cenachero vive y vende en Atarazanas.</li></ul><p>Queda abrir el corazón… y encontrar, entre veinte pescaderos, al que falta en el cuadro.</p>', 'Seguir paseando');
}

/* =====================================================================
   RAMA A · LA IMAGEN
   ===================================================================== */
Rooms.kent = {
  name: 'Camperos Kent · basílica de la Victoria', scale: 1, walk: { x1: 10, x2: 292, y1: 130, y2: 154 },
  npcs: [
    npc('victoria', 'Victoria', 258, 122, NPC.victoria, '#bcd4ff', { walk: [246, 134], h: 58,
      mirar: 'Una señora muy tiesa tras una plancha. Gafas de pasta. Debajo de la chaqueta asoma algo azul con una S.',
      hablar: () => dialog(() => [
        { id: 'v_campero', text: 'Un campero, por favor.', keep: true, run: async () => { if (has('campero') || has('supercampero')) return S('victoria', 'Ya lleva uno. El artículo tercero prohíbe el acaparamiento.'); if (!has('pesetas')) return S('victoria', 'Conforme al artículo primero de esta plancha, el campero lleva de todo. Y conforme al segundo, se paga. Sin fondos no hay campero.'); await S('victoria', '¿Pesetas? Señorita, yo he defendido causas más perdidas. Admitidas a trámite.'); await S('victoria', 'No caben enmiendas: lleva de todo.'); give('campero'); } },
        { id: 'v_camiseta', text: 'Bonita camiseta.', run: async () => { await S('victoria', '*(se cierra la chaqueta)* No sé de qué me habla. Yo solo soy una modesta camperera con gafas.'); flag('v_gafas', 1); } },
        { id: 'v_gafas2', text: '¿Y si se quita las gafas?', cond: () => flag('v_gafas'), run: () => S('victoria', 'Entonces no me reconocería nadie. Así funciona, por lo visto.') },
        { id: 'v_kent', text: '¿Por qué «Kent»?', run: () => S('victoria', 'Es un apellido como otro cualquiera. Y deje de mirar al cielo.') },
        { id: 'v_sangria', text: '¿Tiene sangría?', run: () => S('victoria', 'Esto es un establecimiento serio. Pregunte en un bar, y que Dios la ampare.') },
        { id: 'v_setas', text: '¿Sabe de setas?', run: () => S('victoria', 'Las del Paseo del Parque no constan en el expediente de este puesto. Yo no las he visto y usted no las ha cogido.') },
        { id: 'v_pintor', text: '¿Conoce a algún pintor?', run: () => S('victoria', 'Pintores conozco pocos. Clientes que pintan poco, muchos. No ha lugar.') }
      ]),
      dar: { pesetas: async () => { if (has('campero') || has('supercampero')) return S('victoria', 'Ya lleva uno. El artículo tercero prohíbe el acaparamiento.'); await S('victoria', '¿Pesetas? Admitidas a trámite. No caben enmiendas: lleva de todo.'); give('campero'); }, seta: () => S('victoria', 'Retire eso de mi plancha. Hay ordenanzas.'), _: () => S('victoria', 'No ha lugar.') } }),
    prop('_puesto', 123, c => P2.puestoKent(c))
  ],
  hot: [
    { id: 'k_toldo', name: 'toldo del puesto', rect: [210, 38, 90, 28], walk: [240, 134], mirar: '«Camperos Kent». Me suena de algo. De algo con capa.' },
    { id: 'k_plancha', name: 'plancha', rect: [218, 88, 34, 12], walk: [236, 134], mirar: 'Ahí dentro hay jamón, queso, lechuga, tomate, mayonesa y creo que un código civil.', coger: 'Quema. Y es prueba de un delito de gula.' },
    { id: 'k_cabina', name: 'cabina de teléfono', rect: [298, 62, 22, 62], walk: [288, 134], mirar: 'Una cabina junto al puesto. Qué raro que siga aquí. Y qué casualidad que la dueña entre cuando hay lío.', usar: 'No tiene teléfono dentro. Solo una percha.' },
    { id: 'k_cola', name: 'cola de feriantes', rect: [158, 76, 48, 60], walk: [150, 136], mirar: 'Gente con lunares esperando un bocadillo. Lo llaman cola, pero es una asamblea.', hablar: () => K('—¿Quién es el último? —Aquí nadie es el último, hija. Aquí se va llegando.') },
    { id: 'k_basilica', name: 'basílica', rect: [14, 0, 190, 122], walk: [110, 132], faceRow: 'up', mirar: 'La Victoria. Aquí todo se llama Victoria: la virgen, la cerveza, la del puesto. Qué manera de ganar.', usar: 'Está cerrada. Abre «por la tarde», que aquí empieza a las ocho.' }
  ]
};

Rooms.parque = {
  name: 'Paseo del Parque', scale: 1, walk: { x1: 60, x2: 280, y1: 122, y2: 155 },
  draw(c) { if (!flag('seta_cogida')) P2.seta(c); },
  npcs: [],
  hot: [
    { id: 'p_seta', name: 'setas', rect: [84, 128, 18, 12], walk: [108, 138], face: -1, when: () => !flag('seta_cogida'),
      mirar: async () => { flag('seta_vista', 1); await K('Unas setas pequeñas al pie del parterre. Mi app dice: Psilocybe cubensis. «Cubensis». ¿De cubo? ¿De Cuba?'); },
      coger: async () => { flag('seta_cogida', 1); give('seta'); await K('Cojo una. Por la ciencia.'); } },
    { id: 'p_estatua', name: 'estatua', rect: [246, 68, 26, 44], walk: [240, 126], mirar: 'Una estatua blanca que mira el paseo. Lleva aquí cien años y sigue sin sudar. La envidio.' },
    { id: 'p_palmeras', name: 'palmeras', rect: [100, 0, 200, 60], mirar: 'Palmeras de todos los continentes. En mi país esto solo crece en las tiendas de muebles.' },
    { id: 'p_flores', name: 'parterre', rect: [10, 60, 70, 60], walk: [86, 128], face: -1, mirar: 'Flores moradas, rosas y azules. Aquí la primavera dura once meses y el otro es Feria.', coger: 'Es un parque público. Y ya tengo antecedentes con un jazmín.' },
    { id: 'p_paseo', name: 'paseo', rect: [130, 70, 60, 40], mirar: 'Un paseo larguísimo de sombra. Lo más parecido a un aire acondicionado que he visto en la calle.' }
  ]
};

Rooms.alcazabilla = {
  name: 'Calle Alcazabilla', scale: 1, walk: { x1: 10, x2: 310, y1: 134, y2: 156 },
  npcs: [],
  hot: [
    { id: 'a_piramide', name: 'pirámide de cristal', rect: [124, 96, 96, 34], walk: [110, 146], mirar: 'Una pirámide de cristal en mitad de la calle. Debajo hay piletas romanas de salazón. Aquí ya vendían pescado hace dos mil años.' },
    { id: 'a_teatro', name: 'teatro romano', rect: [0, 92, 112, 44], walk: [70, 140], mirar: 'Un teatro romano. Lo encontraron al tirar un edificio. En esta ciudad, si rascas, sale otra ciudad.' },
    { id: 'a_alcazaba', name: 'alcazaba', rect: [10, 0, 110, 90], mirar: 'La Alcazaba. «Con el palo alcazabas tu objetivo». Sigo pensando que no es un verbo.' },
    { id: 'a_jacarandas', name: 'jacarandas', rect: [120, 20, 170, 74], mirar: 'Árboles morados. No tienen hojas, solo flores. Es como si el árbol hubiera elegido bien sus prioridades.' }
  ]
};

async function verRetrato() {
  if (!flag('pablo_inspirado')) return S('pablo', 'Así como estoy, solo vería una paloma. Tráeme antes algo que me cambie los ojos.');
  if (flag('fondo_restaurado')) { if (!has('servilleta') && !flag('entrada')) { await S('pablo', 'Toma otra servilleta, que la primera la habrás perdido. En París se cena gratis con una de estas.'); give('servilleta'); return; } return S('pablo', 'Ya te lo he dicho: la cara no se inventa. Se mira.'); }
  flag('fondo_restaurado', 1);
  await scene([['pablo', 'Aquí alguien pintó encima con miedo. El miedo se rasca.'], ['pablo', '*(rasca)* Mira: El Palo. La barca de los espetos. Dos cenachos.'], ['karen', '¿Y la cara?'], ['pablo', 'Una cara no se inventa, niña: se mira.'], ['pablo', 'Toma esta servilleta. Con una de estas, en París se cena gratis.']]);
  give('servilleta');
  addNote('El fondo del retrato es la playa de El Palo, con una barca de espetos y dos cenachos. El hombre era pescador.');
}
Rooms.merced = {
  name: 'Plaza de la Merced', scale: 1, walk: { x1: 44, x2: 300, y1: 124, y2: 155 },
  draw(c, t) { P2.palomas(c, t); },
  npcs: [
    prop('_caballete', 137, c => P2.caballete(c, flag('pablo_inspirado'))),
    npc('pablo', 'don Pablo', 222, 138, NPC.pablo, '#ffd9a8', { flip: true, walk: [168, 142], face: 1,
      mirar: () => K(flag('pablo_inspirado') ? 'Pinta la misma paloma vista desde siete sitios a la vez. Mejora.' : 'Un señor calvo con camiseta de rayas pintando una paloma. Otra paloma.'),
      hablar: () => dialog(() => [
        { id: 'pp_que', text: '¿Qué pinta?', cond: () => !flag('pablo_inspirado'), run: () => S('pablo', 'Una paloma. Ayer, una paloma. Mañana, me temo, una paloma.') },
        { id: 'pp_correcta', text: 'Es muy… correcta.', cond: () => !flag('pablo_inspirado'), run: async () => { await S('pablo', 'Correcta. Lo peor que se le puede decir a un cuadro. Necesito algo que me abra la cabeza.'); addNote('Don Pablo necesita «algo que le abra la cabeza».'); } },
        { id: 'pp_hambre', text: '¿Tiene hambre?', cond: () => !flag('pablo_inspirado'), run: () => S('pablo', 'Siempre. El hambre es lo único que no he sabido pintar. Y mira que la he tenido de modelo.') },
        { id: 'pp_retrato', text: '¿Puede mirar este retrato?', keep: true, cond: () => !flag('pablo_inspirado'), run: () => S('pablo', 'Así como estoy, solo vería una paloma. Tráeme antes algo que me cambie los ojos.') },
        { id: 'pp_retrato2', text: '¿Puede mirar ahora este retrato?', keep: true, cond: () => flag('pablo_inspirado') && !flag('fondo_restaurado'), run: () => verRetrato() },
        { id: 'pp_como', text: '¿Cómo se encuentra?', keep: true, cond: () => flag('pablo_inspirado'), run: () => S('pablo', '¡Niña! ¡Tienes los dos ojos en el mismo lado de la cara y te sienta divinamente!') },
        { id: 'pp_cara', text: '¿Y la cara del retrato?', keep: true, cond: () => flag('fondo_restaurado'), run: async () => { await S('pablo', 'Una cara no se inventa, niña: se mira. Búscale el dueño y píntala tú.'); flag('pp_cara2', 1); } },
        { id: 'pp_nose', text: 'Yo no sé pintar.', cond: () => flag('pp_cara2'), run: () => S('pablo', 'Nadie sabe. Se mira mucho y luego se miente lo justo.') },
        { id: 'pp_serv', text: '¿Quién querría una servilleta suya?', cond: () => flag('fondo_restaurado'), run: () => S('pablo', 'Cualquiera con una pared vacía y la cartera llena. Dile que es de mi época de servilleta.') }
      ]),
      dar: {
        campero: async () => { lose('campero'); await S('pablo', 'Riquísimo.'); await S('pablo', '*(pinta)* Mira: una paloma.'); await K('Le falta algo. Al campero, digo.'); },
        seta: () => S('pablo', 'Yo eso sin pan no me lo como.'),
        supercampero: async () => { lose('supercampero'); flag('pablo_inspirado', 1); await S('pablo', 'Mmm. Lleva de todo. Y algo más.'); await S('pablo', '…'); await S('pablo', '¡Niña! ¡Tienes los dos ojos en el mismo lado de la cara y te sienta divinamente!'); await K('Se le han dilatado hasta las rayas de la camiseta. Y está pintando cubos.'); await K('Ahora que ve distinto… ¿Puede mirar este retrato, don Pablo?'); await verRetrato(); },
        retrato: () => verRetrato(),
        biznaga: () => S('pablo', 'La pintaría, pero me saldría una paloma.'), _: () => S('pablo', 'No me inspira.')
      } })
  ],
  hot: [
    { id: 'm_cuadros', name: 'cuadro', rect: [186, 98, 22, 28], walk: [168, 142], mirar: () => K(flag('pablo_inspirado') ? 'Una paloma con el pico en la nuca y tres alas. Por fin tiene algo.' : 'Palomas. Doce cuadros de palomas. La número siete es igual que la tres.'), coger: 'No los vende ni él. No voy a robarlos yo.' },
    { id: 'm_palomas', name: 'palomas', rect: [146, 140, 30, 12], mirar: 'Las modelos. No cobran y se nota.', coger: 'Se han ido volando y han vuelto. Me están toreando.' },
    { id: 'm_obelisco', name: 'obelisco', rect: [76, 0, 34, 104], walk: [110, 128], mirar: 'Un obelisco. Hasta aquí llegaron los egipcios, o las ganas.' },
    { id: 'm_banco', name: 'banco', rect: [270, 118, 50, 36], walk: [262, 142], mirar: 'Un banco de piedra. Dicen que en otro hay un señor de bronce sentado que se parece al pintor, pero más callado.', usar: 'Me siento. Me levanto. La piedra está a la temperatura del sol.' },
    { id: 'm_casas', name: 'casas de la plaza', rect: [112, 50, 190, 46], mirar: '«Aquí nació un pintor», dice una placa. Qué casualidad: hay uno justo delante.' }
  ]
};

Rooms.soho = {
  name: 'Teatro del Soho', scale: 1, walk: { x1: 12, x2: 306, y1: 130, y2: 155 },
  npcs: [npc('antonio', 'Antonio', 208, 132, NPC.antonio, '#ffcf9e', { flip: true, walk: [174, 136], face: 1,
    mirar: 'Guapo, moreno y con prisa. Saluda a alguien cada cuatro segundos.',
    hablar: () => dialog(() => [
      { id: 'an_suyo', text: '¿Este teatro es suyo?', run: () => S('antonio', 'Bienvenida a mi teatro. Y a mi calle. Y esa nube de ahí, casi.') },
      { id: 'an_entrar', text: '¿Puedo entrar?', keep: true, cond: () => !flag('entrada'), run: async () => { await S('antonio', 'Hoy es estreno y está todo vendido. Aunque al vestíbulo le falta algo. Arte. Del que lleva firma y sale en los libros.'); addNote('Antonio dice que a su vestíbulo le falta arte «del que lleva firma».'); } },
      { id: 'an_obra', text: '¿Qué estrenan?', run: () => S('antonio', 'Un musical sobre un malagueño que se va a Hollywood y vuelve. Es ficción.') },
      { id: 'an_aqui', text: '¿Usted es de aquí?', run: () => S('antonio', 'De toda la vida. Me fui treinta años, pero eso son diez minutos de Málaga.') },
      { id: 'an_coctel', text: '¿Qué hay en el cóctel?', cond: () => flag('entrada'), run: () => S('antonio', 'Sushi. Lo he traído yo, con su salsa de soja del Soho: la soha. En Málaga lo crudo era solo el verano, hasta que llegué.') },
      { id: 'an_pirimpi', text: '¿También es suyo el Pirimpi?', run: () => S('antonio', 'No. Hay cosas sagradas.') }
    ]),
    dar: {
      servilleta: async () => { lose('servilleta'); flag('entrada', 1); await S('antonio', '¿Un don Pablo en servilleta? Lo más malagueño que he visto desde que me fui.'); await S('antonio', 'Toma, primera fila. Y prueba el cóctel, que el sushi lo he traído yo.'); give('entrada'); },
      pesetas: () => S('antonio', 'Eso también era mío.'), campero: () => S('antonio', 'Estoy a dieta de estreno.'), supercampero: () => S('antonio', 'Estoy a dieta de estreno. Y eso huele a rodaje complicado.'), retrato: () => S('antonio', 'Le falta el protagonista. Conozco la sensación, de los castings.'), _: () => S('antonio', 'Precioso. Déjalo en el vestíbulo. No, mejor no.')
    } })],
  hot: [
    { id: 's_puerta', name: 'puerta del teatro', rect: [134, 56, 62, 66], walk: [164, 131], faceRow: 'up',
      exit: async () => { if (flag('entrada')) await goRoom('vestibulo', 44, 140, 1); else await K('Sin entrada no paso. Y mi cara de pena aquí no funciona: la tienen muy vista.'); },
      mirar: 'Puertas de teatro con tiradores dorados. Dentro se oye un piano y a alguien afinando la voz.' },
    { id: 's_cartel', name: 'cartel del estreno', rect: [116, 58, 16, 44], walk: [128, 132], mirar: '«El musical». No dice de qué. Con ese señor en la puerta, no hace falta.' },
    { id: 's_taquilla', name: 'taquilla', rect: [198, 70, 16, 24], walk: [200, 132], mirar: '«No hay entradas». La frase más internacional después de «rebajas».' },
    { id: 's_alfombra', name: 'alfombra roja', rect: [124, 136, 80, 24], mirar: 'Una alfombra roja. La piso con respeto: debe de ser también suya.', coger: 'Está pegada. Y vigilada. Y es suya.' },
    { id: 's_mural', name: 'mural', rect: [222, 18, 98, 100], mirar: 'Un grafiti de diez pisos. En mi país es vandalismo; aquí es un barrio de moda.' }
  ]
};
Rooms.vestibulo = {
  name: 'Vestíbulo del teatro', scale: 1, walk: { x1: 30, x2: 250, y1: 134, y2: 155 },
  draw(c) { P2.servilletaMarco(c); if (flag('salsa_cogida')) R(c, 132, 92, 10, 12, '#f4f4f4'); else { R(c, 135, 94, 4, 9, '#1b1b1b'); R(c, 135, 92, 4, 2, '#b3262e'); } },
  npcs: [],
  hot: [
    { id: 've_salsa', name: 'botellita de salsa', rect: [130, 90, 14, 15], walk: [136, 136], faceRow: 'up', when: () => !flag('salsa_cogida'),
      mirar: 'Salsa de soja. La etiqueta dice «SoHa». Aquí hasta la soja tiene barrio.',
      coger: async () => { flag('salsa_cogida', 1); give('salsa'); await K('Negra, líquida y mancha. Como todo lo interesante.'); } },
    { id: 've_sushi', name: 'bandeja de sushi', rect: [68, 94, 40, 12], walk: [90, 136], faceRow: 'up', mirar: 'Sushi en Málaga. He venido del norte a comer pescado crudo del este en el sur.', coger: 'Solo me interesa la botellita. Soy una mujer de salsas.' },
    { id: 've_marco', name: 'servilleta enmarcada', rect: [186, 40, 30, 34], walk: [200, 136], faceRow: 'up', mirar: 'Mi servilleta, con marco dorado y un foco. Hace una hora limpiaba una barra.' },
    { id: 've_lampara', name: 'lámpara', rect: [138, 0, 44, 30], mirar: 'Una lámpara enorme. Quedaría bien con un don Pablo debajo. Ah, ya lo tiene.' },
    { id: 've_salida', name: 'salida a la calle', rect: [0, 0, 26, 160], walk: [32, 142], exit: () => goRoom('soho', 167, 152, 1), mirar: 'La cortina de la entrada. Fuera sigue haciendo cuarenta grados.' }
  ]
};

/* ----- imprenta y minijuego de tipos ----- */
const VERSOS = { 1: 'Traías la mar a cuestas,', 2: 'plata viva en dos cenachos,', 3: 'y yo, detrás de la reja,', 4: 'aprendí a querer despacio.', 5: 'Si un día me borra el tiempo', 6: 'la cara, que no la voz,', 7: 'búscame donde la sal', 8: 'le pone nombre al amor.' };
const duo = async (...ls) => { for (let i = 0; i < ls.length; i++) await S(i % 2 ? 'emilio' : 'manolo', ls[i]); };
async function reconocerVersos() {
  if (flag('versos_reconocidos')) return duo('Ya te lo dijimos…', '…el pliego del 62.');
  flag('versos_reconocidos', 1);
  await S('emilio', '«Plata viva en dos cenachos». ¡Manolo, el pliego del 62!'); await S('manolo', 'El del muchacho del cenacho. Pagó en boquerones.');
  await S('emilio', 'Yo me lo sé entero: «y yo, detrás de la reja…»'); await S('manolo', 'Ese verso va después.'); await S('emilio', 'Va antes.');
  await K('Tendré que ordenarlo yo.');
  addNote('El poema lo encargó en 1962 «un muchacho del cenacho» para una señorita de reja.');
  addNote('Versos sueltos, como los recitó Emilio: «búscame donde la sal» · «y yo, detrás de la reja,» · «la cara, que no la voz,» · «le pone nombre al amor.» · «Si un día me borra el tiempo» · «aprendí a querer despacio.»');
}
async function llenarTintero() { lose('salsa'); flag('tintero_lleno', 1); await duo('Huele a…', '…restaurante.', 'Pero tiñe.'); }
async function jugarTipos() {
  if (flag('poema_impreso')) return K('Ya está impreso. No voy a tentar a la suerte ni a la soja.');
  if (!flag('tintero_lleno') || !flag('versos_reconocidos')) return duo('¿Y qué imprimimos?', '¿Y con qué?');
  const st = G.flags.tipos || (G.flags.tipos = { slots: [null, null, null, null, null, null], tries: 0, fixed: [] });
  const ok = await panelOverlay((el, close) => {
    let sel = null, msg = 'Seis versos de plomo, al revés. Toca un verso y luego su hueco.';
    const draw = () => {
      const used = st.slots.filter(Boolean), tray = [7, 3, 6, 8, 5, 4].filter(n => !used.includes(n));
      el.innerHTML = '<h2>La caja de componer</h2><div class="mg-col" id="mg-slots">' + [1, 2, 3, 4, 5, 6, 7, 8].map(n => { if (n < 3) return '<div class="mg-slot fixed">' + n + '. ' + VERSOS[n] + '</div>'; const v = st.slots[n - 3], bad = st.bad && st.bad.includes(n) && v; return '<button type="button" class="mg-slot' + (st.fixed.includes(n) ? ' fixed' : '') + (bad ? ' bad' : '') + '" id="slot-' + n + '">' + n + '. ' + (v ? VERSOS[v] : '&nbsp;') + '</button>' + (n === 4 ? '<div>&nbsp;</div>' : ''); }).join('') + '</div><p class="mg-say" id="mg-say">' + msg + '</p><div class="mg-col" id="mg-tray">' + tray.map(n => '<button type="button" class="mg-line mirror' + (sel === n ? ' sel' : '') + '" id="line-' + n + '" title="' + VERSOS[n] + '">' + VERSOS[n] + '</button>').join('') + '</div><div class="mg-row"><button type="button" class="verb" id="mg-pull">Tirar de la palanca</button><button type="button" class="verb" id="mg-back">Volver</button></div>';
      tray.forEach(n => { el.querySelector('#line-' + n).onclick = () => { sel = sel === n ? null : n; msg = 'Karen lee, del derecho: «' + VERSOS[n] + '»'; draw(); }; });
      [3, 4, 5, 6, 7, 8].forEach(n => { el.querySelector('#slot-' + n).onclick = () => { if (st.fixed.includes(n)) return; if (sel) { st.slots[n - 3] = sel; sel = null; } else st.slots[n - 3] = null; st.bad = null; draw(); }; });
      el.querySelector('#mg-back').onclick = () => close(false);
      el.querySelector('#mg-pull').onclick = () => {
        if (st.slots.some(v => !v)) { msg = 'MANOLO: Faltan versos. — EMILIO: Un poema con huecos es un telegrama.'; return draw(); }
        const wrong = [3, 4, 5, 6, 7, 8].filter(n => st.slots[n - 3] !== n);
        if (!wrong.length) return close(true);
        st.tries++; const good = 6 - wrong.length; let extra = '';
        const seq = st.slots.join('');
        if (/74/.test(seq)) extra = ' KAREN: «búscame donde la sal / aprendí a querer despacio». Suena a receta de cocina.';
        else if (/36/.test(seq)) extra = ' KAREN: «y yo, detrás de la reja, / la cara, que no la voz». Parece una ficha policial.';
        else if (st.slots[5] === 5) extra = ' KAREN: Acaba en suspense. En mi país harían una serie.';
        if (st.tries <= 2) msg = 'MANOLO: ' + good + ' en su sitio… — EMILIO: …y ' + wrong.length + ' de visita.' + extra;
        else if (st.tries <= 4) { st.bad = wrong; msg = 'MANOLO: Lo que sale sucio… — EMILIO: …está mal puesto.' + extra; }
        else { const n = wrong[0]; const from = st.slots.indexOf(n); if (from >= 0) st.slots[from] = st.slots[n - 3]; st.slots[n - 3] = n; st.fixed.push(n); st.bad = null; msg = 'EMILIO: Este iba aquí. — MANOLO: Lo he dicho yo. — EMILIO: Lo he puesto yo.'; }
        draw();
      };
    };
    draw();
  });
  if (!ok) return;
  flag('poema_impreso', 1); give('poema');
  await duo('¡El pliego del 62!', 'Huele a restaurante…', '…pero rima.');
  await K('«Búscame donde la sal le pone nombre al amor». El hombre del cuadro era un romántico con pescado.');
  addNote('Poema completo impreso. Los cenachos y la sal dicen que él era pescador.');
}
const impDar = {
  salsa: () => llenarTintero(), caja: () => reconocerVersos(), aceite: () => duo('Eso engrasa…', '…no imprime.'), cartojal: () => duo('De eso ya…', '…nos bebimos el nuestro.'),
  poema: () => duo('Ese es nuestro.', 'Llévaselo a quien le falte un final.'), _: () => duo('No es de…', '…nuestro tipo.')
};
const impHablar = () => dialog(() => [
  { id: 'i_que', text: '¿Qué imprimen?', run: () => duo('Carteles de…', '…Feria, versos…', '…y esquelas, que también riman.') },
  { id: 'i_parada', text: '¿Por qué está parada la máquina?', keep: true, cond: () => !flag('tintero_lleno'), run: async () => { await duo('Sin tinta no hay…', '…poesía. Se la ha bebido la Feria.'); addNote('Los impresores necesitan tinta.'); } },
  { id: 'i_versos', text: '¿Les suenan estos versos?', cond: () => has('caja') && !flag('versos_reconocidos'), run: () => reconocerVersos() },
  { id: 'i_quien', text: '¿Quién era ese muchacho?', cond: () => flag('versos_reconocidos'), run: () => duo('Uno que olía a mar…', '…y a colonia encima del mar.', 'No dijo nombre. Dijo que era para una señorita de reja.') },
  { id: 'i_sigue', text: '¿Cómo sigue el poema?', keep: true, cond: () => flag('versos_reconocidos') && !flag('poema_impreso'), run: () => duo('«Búscame donde la sal…»', '«…y yo, detrás de la reja…»', 'Ese va después.', 'Va antes. Compónlo tú en la caja, niña.') },
  { id: 'i_tipo', text: 'Un tipo con carácter siempre encaja.', cond: () => frase('x') || G.notes.some(n => n.includes('carácter')), run: () => duo('¡Eso lo decimos nosotros!', 'Lo dije yo.', 'Lo dije yo antes.') },
  { id: 'i_poema', text: '¿Quién querría un poema?', cond: () => flag('poema_impreso'), run: () => duo('Cualquiera al que le falte…', '…un final. Todo el mundo, vamos.') }
]);
Rooms.imprenta = {
  name: 'Imprenta vieja', scale: 1, walk: { x1: 14, x2: 300, y1: 128, y2: 155 },
  draw(c) { if (flag('tintero_lleno')) R(c, 38, 91, 6, 2, '#1b1b1b'); },
  npcs: [
    npc('manolo', 'Manolo', 62, 130, NPC.manolo, '#c9d6f2', { walk: [96, 134], face: -1, mirar: 'Dos señores manchados hasta las cejas que se pisan las frases. Imposible saber dónde acaba uno.', hablar: impHablar, dar: impDar }),
    npc('emilio', 'Emilio', 160, 130, NPC.emilio, '#f2d9c9', { flip: true, walk: [126, 134], face: 1, mirar: 'El otro. O el mismo. Termina las frases que empieza su socio y empieza las que no le tocan.', hablar: impHablar, dar: impDar })
  ],
  hot: [
    { id: 'i_caja', name: 'caja de componer', rect: [78, 70, 70, 52], walk: [112, 130], faceRow: 'up', mirar: 'Cientos de letritas de plomo, al revés. Aquí se escribe mirando por el retrovisor.', coger: 'Si me llevo una eñe se les cae el idioma.', usar: () => jugarTipos() },
    { id: 'i_prensa', name: 'prensa', rect: [172, 30, 76, 94], walk: [200, 130], faceRow: 'up', mirar: 'Una máquina de hierro que imprime a golpes. Internet, pero con brazos.', usar: () => jugarTipos() },
    { id: 'i_tintero', name: 'tintero', rect: [32, 88, 16, 14], walk: [44, 130], faceRow: 'up', mirar: () => K(flag('tintero_lleno') ? 'Lleno de salsa de soja. Tinta con denominación de origen.' : 'Seco. Dicen que se lo ha bebido la Feria. Empiezo a creer que la Feria es una persona.'), con: { salsa: () => llenarTintero(), aceite: 'Eso engrasa, no imprime. Me lo han dicho a dúo.' } },
    { id: 'i_carteles', name: 'carteles a medias', rect: [80, 18, 150, 38], mirar: '«Feria de Ma». A medio imprimir. Ya dice bastante.', coger: 'Está húmedo. De ganas, no de tinta.' }
  ]
};

Rooms.puerto = {
  name: 'Puerto', scale: 1, walk: { x1: 10, x2: 310, y1: 124, y2: 155 },
  draw(c, t) { P2.melillero(c, t, flag('barco_zarpado')); if (!flag('barco_zarpado')) P2.pelota(c, 126, 112, t, true); },
  npcs: [npc('ernesto', 'don Ernesto', 150, 128, NPC.ernesto, '#e6e6d2', { when: () => !flag('barco_zarpado'), walk: [122, 132],
    mirar: 'Barba blanca, jersey de cuello alto en agosto y una caña de pescar sin anzuelo. Tapa la pasarela del barco.',
    hablar: () => dialog(() => [
      { id: 'e_embarca', text: '¿No embarca?', keep: true, run: async () => { await S('ernesto', 'No. Un hombre no sube a un barco sin la última frase.'); addNote('Don Ernesto no embarca hasta tener un final para su libro.'); } },
      { id: 'e_escribe', text: '¿Qué escribe?', run: () => S('ernesto', 'Un viejo. Un mar. Un pez. Lo corto todo. Queda poco. Falta cómo acaba.') },
      { id: 'e_pesca', text: '¿Qué pesca sin anzuelo?', run: () => S('ernesto', 'Frases. Pican menos que los peces.') },
      { id: 'e_retraso', text: 'El barco lleva retraso.', run: async () => { await K('Un marinero grita desde cubierta: «¡Tres semanas, don Ernesto!»'); await S('ernesto', 'La verdad no tiene horario.'); } },
      { id: 'e_pirimpi', text: '¿Conoce el Pirimpi?', run: () => S('ernesto', 'Íntimamente. Hay allí un hombre que habla un inglés excelente cuando bebe whisky. Nunca supe por qué.') },
      { id: 'e_pelota', text: '¿Ha visto una pelota en el agua?', cond: () => flag('marisol_vista'), run: () => S('ernesto', 'Flota junto al casco. El mar la devolverá cuando quiera. El mar siempre devuelve; lo que no dice es cuándo.') }
    ]),
    dar: {
      poema: async () => { lose('poema'); await S('ernesto', '«Donde la sal le pone nombre al amor».'); await S('ernesto', 'Ya tengo mi final. Y no es mío, que es como mejor saben.'); flag('barco_zarpado', 1); await K('Sube la pasarela, suena la sirena… ¡y el melillero zarpa! Tres semanas tarde, pero zarpa.'); await K('Menuda ola ha levantado. En mi país a eso lo llamamos marejada; aquí, puntualidad.'); addNote('El melillero ha zarpado, con una buena ola.'); },
      campero: () => S('ernesto', 'Comí uno. Era bueno. Era verdadero.'), cartojal: () => S('ernesto', 'Dulce. Yo bebo cosas que duelen.'), whisky: async () => { lose('whisky'); await S('ernesto', 'Esto sí. Esto es una frase corta.'); }, sardinas: () => S('ernesto', 'Un pez pequeño. Mi viejo merece uno grande.'), _: () => S('ernesto', 'No es una frase.')
    } })],
  hot: [
    { id: 'pu_pelota', name: 'pelota en el agua', rect: [119, 103, 14, 12], walk: [128, 126], faceRow: 'up', when: () => !flag('barco_zarpado'), mirar: 'Una pelota azul flotando. Pone «No-vea». No veas lo lejos que está.', coger: 'No llego. Y con este color de piel no nado: me confundirían con una boya.', con: { palo: 'Me faltan ocho metros de palo.' } },
    { id: 'pu_barco', name: 'melillero', rect: [132, 34, 188, 78], walk: [200, 128], faceRow: 'up', when: () => !flag('barco_zarpado'), mirar: 'Un barco grande que va a Melilla. Cuando va. Hoy no va.', usar: 'No subo. Hay un Nobel en medio, y a un Nobel no se le adelanta.' },
    { id: 'pu_mar', name: 'mar', rect: [120, 60, 200, 52], when: () => flag('barco_zarpado'), mirar: 'El melillero ya es un punto blanco. La pasarela está libre. Queda una caña sin anzuelo en el muelle.' },
    { id: 'pu_academia', name: 'Academia Aliquindoi', rect: [0, 36, 96, 76], walk: [50, 128], faceRow: 'up',
      mirar: async () => { if (!flag('aliquindoi')) { flag('aliquindoi', 1); await K('Academia Aliquindoi. Inglés, oposiciones y estar al loro.'); await K('«Aliquindoi». Suena a inglés mal aparcado.'); addNote('Aliquindoi = estar atento. Dicen que viene del inglés de los barcos, «a look and do it».'); } else await K('Clases de inglés para marineros desde 1890. Eso explica cosas.'); }, usar: 'Cerrado por Feria. Hasta el inglés descansa.' },
    { id: 'pu_farola', name: 'La Farola', rect: [102, 8, 18, 104], walk: [112, 126], faceRow: 'up', mirar: 'Un faro, pero en femenino. Solo hay dos en España, me han dicho ya tres personas.' },
    { id: 'pu_noria', name: 'noria', rect: [276, 36, 32, 38], mirar: 'Una noria. Desde arriba se verá África. O el atasco.' }
  ]
};

Rooms.caleta = {
  name: 'Playa de La Caleta', scale: 1, walk: { x1: 10, x2: 310, y1: 114, y2: 155 },
  draw(c, t) { if (flag('barco_zarpado') && !flag('pelota_cogida')) P2.pelota(c, 204, 116, t, false); },
  npcs: [npc('marisol', 'Marisol', 150, 132, NPC.marisol, '#ffe0f0', { h: 48, rect: [140, 88, 20, 46], walk: [124, 134],
    mirar: 'Una niña rubia con lazos que llora afinando.',
    hablar: async () => { flag('marisol_vista', 1); await dialog(() => [
      { id: 'ma_lloras', text: '¿Por qué lloras?', cond: () => !flag('pelota_dada'), run: async () => { await S('marisol', '¡Mi pelota de No-vea! Se la ha llevado la mar hasta ese barco gordo.'); addNote('La pelota de Marisol flota junto al melillero, en el puerto.'); } },
      { id: 'ma_otra', text: '¿Te compro otra?', cond: () => !flag('pelota_dada'), run: () => S('marisol', 'No. Esa era la mía. Las cosas no se cambian por otras iguales.') },
      { id: 'ma_como', text: '¿Cómo la recupero?', keep: true, cond: () => !flag('barco_zarpado'), run: () => S('marisol', 'No sé. Mi abuelo dice que la mar lo devuelve todo, pero cuando a ella le da la gana.') },
      { id: 'ma_cantar', text: '¿Puedes llorar sin cantar?', run: () => S('marisol', 'No sé hacerlo por separado.') },
      { id: 'ma_cenachero', text: '¿Sabes algo de un cenachero?', run: async () => { await S('marisol', 'Yo soy chiquita, pero no tanto. De cosas de viejos saben los viejos. Y los viejos están en los bares.'); } },
      { id: 'ma_concha', text: '¿De dónde sacaste la concha?', cond: () => flag('pelota_dada'), run: () => S('marisol', 'Me la dio la mar un día que no lloraba.') }
    ]); },
    dar: {
      pelota: async () => { lose('pelota'); flag('pelota_dada', 1); await S('marisol', '¡Mi No-vea!'); await S('marisol', 'Toma esta concha. Suena por dentro, pero no es el mar.'); give('concha'); },
      espeto: () => S('marisol', 'A mí dame un helado.'), biznaga: async () => { await K('Se la pone en el pelo y sigue llorando, más guapa. Me la devuelve.'); }, _: () => S('marisol', 'Eso no bota.')
    } })],
  hot: [
    { id: 'c_pelota', name: 'pelota', rect: [197, 107, 14, 12], walk: [190, 118], when: () => flag('barco_zarpado') && !flag('pelota_cogida'), mirar: '¡La No-vea! El mar la ha traído, como dijo la niña.', coger: async () => { flag('pelota_cogida', 1); give('pelota'); await K('Viene con arena de regalo.'); } },
    { id: 'c_vendedor', name: 'vendedor ambulante', rect: [284, 72, 24, 56], walk: [270, 128], mirar: 'Un señor grita «¡Almendras, cocos!». No sé si vende o avisa.', hablar: () => K('—¿Tiene sangría? —Tengo coco, niña. Que es más sano y no hace el ridículo.') },
    { id: 'c_sombrillas', name: 'sombrillas', rect: [24, 100, 90, 36], mirar: 'Ninguna libre. Hay quien las planta al amanecer, como banderas.', coger: 'Tienen dueño, nevera y abuela debajo.' },
    { id: 'c_mar', name: 'mar', rect: [0, 62, 320, 40], mirar: 'El Mediterráneo. Está caliente. En mi país el mar se usa para conservar alimentos.', usar: 'Luego. Primero el abuelo, después el baño.' }
  ]
};

/* =====================================================================
   RAMA B · LA MÚSICA
   ===================================================================== */
async function tryCopla() {
  if (flag('tiene_letra') || !flag('mari_lista') || !flag('acorde_dado')) return;
  flag('tiene_letra', 1);
  await S('mari', 'Venga, Kanka, dale.'); await S('kanka', 'Sol sostenido. Como el de agosto.');
  await overlay('<h2>«Cuatro cosas»</h2><div class="carta"><p>Cuatro cosas te pedí<br>la noche que te embarcabas:<br>un jazmín para el ojal,<br>una sardina en la brasa,<br>la luna pa ver tu cara<br>y una barca pa volver.<br>Cuatro cosas te pedí;<br>ninguna pude tener.</p></div>', 'Apuntar la letra');
  await K('Jazmín, sardina, luna y barca. Cuatro cosas, cuatro ruedecitas.');
  addNote('Letra de «Cuatro cosas»: un jazmín, una sardina, la luna y una barca. En ese orden.');
  checkFin2();
}
Rooms.chiringuito = {
  name: 'Chiringuito de El Palo', scale: 1, walk: { x1: 10, x2: 300, y1: 122, y2: 155 },
  npcs: [
    prop('_barca', 128, (c, t) => P2.barcaEspetos(c, t)),
    npc('kanka', 'el Kanka', 204, 142, NPC.kanka, '#b8f0c8', { walk: [178, 146],
      mirar: 'Un tipo con guitarra y media sonrisa. Mira el chiringuito como si lo estuviera narrando.',
      hablar: () => dialog(() => [
        { id: 'ka_toca', text: '¿Usted toca?', run: () => S('kanka', 'Toco, canto y comento. Sobre todo comento.') },
        { id: 'ka_mari', text: '¿Acompañaría a la Mari?', cond: () => flag('mari_pide') && !flag('acorde_dado'), run: async () => { await S('kanka', 'Tocaría, pero el acorde se me fue. Era uno con mucho sol.'); await S('kanka', 'Aquí todo es con mucho sol, así que no ayuda. Lo sabrá alguien que viva de tocar lo que le piden.'); flag('kanka_pide', 1); addNote('Al Kanka le falta el acorde de la copla: «uno con mucho sol».'); } },
        { id: 'ka_donde', text: '¿Dónde está ese Pablo?', cond: () => flag('kanka_pide'), run: () => S('kanka', 'En el Botánico. En Feria se casa media Málaga y la otra media va de invitada.') },
        { id: 'ka_barca', text: '¿Puedo usar la barca?', run: () => S('kanka', 'La brasa es de todos. Lo que pongas encima, tuyo. Y lo que se te queme, también.') },
        { id: 'ka_turistas', text: '¿Qué opina de los turistas?', run: () => S('kanka', 'Que vienen buscando lo auténtico, y lo auténtico se esconde. Tú por lo menos preguntas.') },
        { id: 'ka_acorde', text: 'El acorde es Sol sostenido.', cond: () => flag('tiene_acorde') && !flag('acorde_dado'), run: async () => { flag('acorde_dado', 1); await S('kanka', '¡Sol sostenido! Claro. Como el de agosto.'); if (!flag('mari_lista')) await S('kanka', 'Ahora la que falta es la Mari, que en ayunas no canta.'); await tryCopla(); } }
      ]),
      dar: { espeto: () => S('kanka', 'Dáselo a ella, que yo ya he comido. Dos veces.'), _: () => S('kanka', 'Eso da para una letra, pero no hoy.') } }),
    npc('mari', 'La Mari', 262, 140, NPC.mari, '#ffc2e0', { h: 34, rect: [234, 106, 56, 36], walk: [226, 148],
      mirar: 'Tumbada en una hamaca, con sombrero y cero prisa.',
      hablar: () => dialog(() => [
        { id: 'mr_copla', text: '¿Conoce la canción «Cuatro cosas»?', cond: () => has('caja'), run: async () => { await S('mari', 'Esa me la cantaba mi abuela. Pero yo en ayunas no afino, corazón.'); await S('mari', 'Y a pelo tampoco: que toque el Kanka.'); flag('mari_pide', 1); addNote('La Mari conoce «Cuatro cosas», pero en ayunas no canta y sin guitarra tampoco.'); } },
        { id: 'mr_apetece', text: '¿Qué le apetece?', keep: true, cond: () => flag('mari_pide') && !flag('mari_lista'), run: () => S('mari', 'Un espetito. Pero el espetero se ha quedado sin cañas y sin sardinas, que en Feria vuela to. Así que aquí me tienes, a dieta de paisaje.') },
        { id: 'mr_va', text: '¿De qué va la canción?', cond: () => flag('mari_pide'), run: () => S('mari', 'De uno que pide cuatro cosas y se queda sin ninguna. Como to las buenas.') },
        { id: 'mr_ya', text: '¿Me la canta ya?', keep: true, cond: () => flag('mari_lista') && !flag('tiene_letra'), run: () => S('mari', 'Yo estoy. Al que le falta algo es a este.') },
        { id: 'mr_tranquila', text: '¿Siempre está tan tranquila?', run: () => S('mari', 'Yo no estoy tranquila, yo estoy en El Palo. Es otra cosa.') },
        { id: 'mr_repite', text: '¿Puede repetirla?', keep: true, cond: () => flag('tiene_letra'), run: () => overlay('<h2>«Cuatro cosas»</h2><div class="carta"><p>Cuatro cosas te pedí<br>la noche que te embarcabas:<br>un jazmín para el ojal,<br>una sardina en la brasa,<br>la luna pa ver tu cara<br>y una barca pa volver.<br>Cuatro cosas te pedí;<br>ninguna pude tener.</p></div>') }
      ]),
      dar: {
        espeto: async () => { lose('espeto'); flag('mari_lista', 1); if (flag('mari_pide')) await S('mari', '¿En un palo de escoba? Esto no lo he visto yo ni en El Tintero. Pero está en su punto.'); else { await S('mari', 'Gracias, corazón. ¿Y esto a santo de qué?'); flag('mari_pide', 1); } await tryCopla(); },
        espeto_crudo: () => S('mari', 'Eso pásalo por la barca, que yo sushi no.'), sardinas: () => S('mari', 'Eso pásalo por la barca, que yo sushi no.'), _: () => S('mari', 'Guárdalo, corazón.')
      } })
  ],
  hot: [
    { id: 'ch_barca', name: 'barca con brasas', rect: [110, 100, 58, 30], walk: [150, 134], faceRow: 'up',
      mirar: 'Una barca llena de arena y fuego. Navegar no navega, pero huele que alimenta.', coger: 'Es una barca. Ardiendo. No.', usar: 'Necesito algo que asar. Meter la mano no cuenta.',
      con: { espeto_crudo: async () => { lose('espeto_crudo'); flag('espeto_asando', 1); await K('Lo clavo inclinado, como he visto en las postales.'); await wait(900); flag('espeto_asando', 0); give('espeto'); await K('¡Huele a agosto! Dorado, con su sal gorda.'); }, sardinas: 'Sueltas se me caen a las brasas. Y una sardina a la brasa sin nada es un sacrificio, no una receta.', palo: 'Un palo solo, al fuego, es leña. Le falta el pescado.' } },
    { id: 'ch_pizarra', name: 'pizarra', rect: [262, 24, 46, 20], mirar: '«Hay espetos. NO HAY PAELLA». Las mayúsculas son de alguien muy cansado.' },
    { id: 'ch_bote', name: 'bote de las cañas', rect: [184, 106, 12, 15], walk: [176, 126], mirar: 'El bote de las cañas está vacío. En Feria vuela to, dicen. Hasta los palos.', coger: 'No queda ni una. Menos mal que yo viajo con escoba.' },
    { id: 'ch_jabegas', name: 'jábegas', rect: [8, 98, 90, 24], walk: [60, 126], mirar: 'Barcas con un ojo pintado en la proa. Para ver los peces, supongo. O a los guiris.' },
    { id: 'ch_playa', name: 'playa', rect: [0, 60, 216, 38], mirar: () => K(flag('fondo_restaurado') ? 'Es la playa del cuadro. La barca, la orilla. Mi abuela estuvo justo aquí, y sonreía.' : 'Una playa de barrio, con más abuelos que turistas. Me gusta.') }
  ]
};

Rooms.catedral = {
  name: 'Catedral · la Manquita', scale: 1, walk: { x1: 10, x2: 310, y1: 147, y2: 157 },
  npcs: [npc('jesus', 'fray Jesús', 118, 153, NPC.jesus, '#f2c28a', { h: 66, rect: [104, 86, 30, 68], walk: [84, 154],
    mirar: 'Un fraile enorme, con una cadena de oro que asoma bajo el hábito. Bendice a gritos.',
    hablar: () => dialog(() => [
      { id: 'j_fraile', text: '¿Usted es fraile?', run: () => S('jesus', '¡Desde hace poco, hermana! Antes construía. Mucho. Donde ve usted ese monte había otro monte.') },
      { id: 'j_torre', text: '¿Por qué le falta una torre a la catedral?', run: () => S('jesus', '¡Eso no fui yo! Es de lo poco. Si me dejan, la termino en seis meses y con ático.') },
      { id: 'j_pecados', text: '¿Qué pecados cometió?', run: () => S('jesus', 'Todos los que caben en un plan parcial.') },
      { id: 'j_nombre', text: 'Necesito el nombre de un demonio.', keep: true, cond: () => (flag('rafael_pide') || flag('estampita_dada')) && !flag('tiene_nombre'), run: async () => { if (flag('estampita_dada')) return darNombre('Por la estampita de antes, apúntelo.'); await S('jesus', 'Eso es secreto de confesión. Otra cosa sería si me trajera una estampita de la Victoria, que le tengo devoción.'); flag('jesus_pide', 1); addNote('Fray Jesús da el nombre del demonio a cambio de una estampita de la Victoria.'); } },
      { id: 'j_donde', text: '¿Dónde consigo una estampita?', keep: true, cond: () => flag('jesus_pide') && !flag('tiene_nombre'), run: () => S('jesus', '¡La Victoria está en todas partes, hermana! Lo que pasa es que la gente mira sin fe.') },
      { id: 'j_como', text: '¿Cómo se sabía el nombre?', cond: () => flag('tiene_nombre'), run: () => S('jesus', 'Porque lo llevé puesto veinte años. Pecador de la pradera. De la pradera recalificada.') }
    ]),
    dar: {
      posavasos: async () => { lose('posavasos'); await S('jesus', '¡La Victoria! ¡Y pone «malagueña y exquisita», como tiene que ser una virgen!'); flag('estampita_dada', 1); await S('jesus', 'A cambio le confieso lo peor que llevo dentro: el nombre de un demonio. Por si un día le hace falta.'); await darNombre('Apúntelo.'); },
      pesetas: () => S('jesus', '¡Dinero no, hermana, que recaigo!'), campero: async () => { lose('campero'); await S('jesus', 'La gula la conservo.'); }, libro: () => S('jesus', 'De ángeles sé poco. Pregúnteme por lo otro.'), _: () => S('jesus', '¡Bendito sea! *(lo bendice a gritos y lo devuelve)*')
    } })],
  hot: [
    { id: 'ca_torre', name: 'catedral', rect: [196, 0, 100, 112], mirar: 'Le falta una torre. La llaman la Manquita. En mi país lo llamaríamos «obra pendiente desde 1782».' },
    { id: 'ca_naranjos', name: 'naranjos', rect: [0, 0, 110, 60], walk: [40, 148], faceRow: 'up', mirar: 'Naranjos con naranjas. En la calle. Gratis. Sospechoso.', coger: 'Amarga. AMARGA. Ya sé por qué nadie las coge.', con: { palo: 'Ya he vareado un árbol hoy. Tengo un cupo.' } },
    { id: 'ca_jardin', name: 'jardín', rect: [20, 86, 82, 50], mirar: 'Rosas, setos recortados y una farola con palomas. Aquí hasta la sombra huele bien.' }
  ]
};
async function darNombre(pre) { flag('tiene_nombre', 1); await S('jesus', pre + ' Fistro Pecador de la Pradera.'); await S('jesus', 'Me lo sé porque fui yo.'); addNote('Nombre del demonio: Fistro Pecador de la Pradera.'); }

Rooms.larios = {
  name: 'Calle Larios', scale: 1, walk: { x1: 10, x2: 300, y1: 122, y2: 155 },
  npcs: [npc('rafael', 'don Rafael', 150, 136, NPC.rafael, '#e0c8ff', { walk: [122, 140],
    mirar: () => K(flag('tiene_libro') ? 'Un señor elegante y, por fin, solo. Se le ve más ligero y peor puntuado.' : 'Un señor elegante que discute consigo mismo. Va perdiendo.'),
    hablar: () => dialog(() => [
      { id: 'r_bien', text: '¿Se encuentra bien?', cond: () => !flag('tiene_libro'), run: async () => { await S('rafael', 'Perfectamente, señorita. Solo tengo un ángel en el bolsillo y un demonio en la…'); await S('rafael', '*(otra voz)* …en la sintaxis. Ese adjetivo sobra.'); } },
      { id: 'r_quien', text: '¿Quién habla?', cond: () => !flag('tiene_libro'), run: async () => { await S('rafael', '*(otra voz)* Su editor. Con cuernos.'); await S('rafael', 'Se me metió con un endecasílabo y no sale.'); } },
      { id: 'r_libro', text: '¿Qué libro lleva ahí?', cond: () => !flag('tiene_libro') && !flag('rafael_pide'), run: async () => { await S('rafael', 'El mío, uno de ángeles. Lo llevo aquí, pero…'); await S('rafael', '*(otra voz)* …pero es mío hasta que alguien me llame por mi nombre. Y nadie se lo sabe.'); flag('rafael_pide', 1); addNote('El demonio de don Rafael no suelta el libro hasta que alguien lo llame por su nombre.'); } },
      { id: 'r_llamas', text: '¿Cómo te llamas, demonio?', keep: true, cond: () => flag('rafael_pide') && !flag('tiene_nombre'), run: () => S('rafael', '*(otra voz)* ' + rot('r_llamas', ['Frío.', 'Belcebú no. Demasiado visto.', 'Tibio. Me conocen los que pecaron conmigo, y esos no presumen.'])) },
      { id: 'r_sal', text: '¡Sal de ahí, Fistro Pecador de la Pradera!', cond: () => flag('tiene_nombre') && !flag('tiene_libro'), run: async () => { await S('rafael', '*(otra voz)* ¿Quién se ha chivado? ¿El fraile? Me voy, pero que conste que el libro mejoraba conmigo.'); flag('tiene_libro', 1); await S('rafael', 'Quédese el libro. Ahora que estoy solo, me sobra el de guarda.'); give('libro'); addNote('Libro: «El Ángel De Guarda Bajará Enseguida». Las mayúsculas del título eran música, decía el demonio.'); } },
      { id: 'r_mayus', text: '¿Por qué el título lleva tantas mayúsculas?', cond: () => flag('tiene_libro'), run: () => S('rafael', 'Capricho del demonio. Decía que las mayúsculas eran música.') },
      { id: 'r_menos', text: '¿Echa de menos al demonio?', cond: () => flag('tiene_libro'), run: () => S('rafael', 'Un poco. Corregía bien.') }
    ]),
    dar: { posavasos: () => S('rafael', '*(otra voz)* Diseño correcto, texto pobre.'), biznaga: async () => { await S('rafael', '*(otra voz)* Cursi.'); await S('rafael', 'Preciosa.'); }, poema: async () => { await S('rafael', '*(otra voz)* Asonante. Qué valor.'); await S('rafael', 'A mí me ha gustado.'); }, _: async () => { await S('rafael', '*(otra voz)* Sobra.'); await S('rafael', 'Perdónelo.'); } } })],
  hot: [
    { id: 'l_toldos', name: 'toldos', rect: [0, 0, 60, 30], mirar: 'Toldos de lado a lado. Han techado una calle entera. La idea más sensata que he visto en agosto.' },
    { id: 'l_gente', name: 'gente paseando', rect: [170, 96, 80, 34], mirar: 'Aquí la gente pasea para ser vista paseando. El suelo brilla a propósito.', hablar: () => K('—Qué calor, ¿verdad? —¿Calor? Esto es fresquito. Calor, el del terral.') },
    { id: 'l_esquina', name: 'tienda de la esquina', rect: [50, 60, 120, 42], walk: [110, 124], faceRow: 'up', mirar: 'Toldos rosas y una terraza llena. Aquí sentarse es ir al teatro: todas las sillas miran a la calle.' },
    { id: 'l_escaparates', name: 'escaparate', rect: [272, 62, 48, 56], walk: [280, 126], mirar: 'Trajes de lunares. Me probaría uno, pero ya voy de rojo.' },
    { id: 'l_cartel', name: 'cartel de Feria', rect: [78, 86, 20, 40], walk: [100, 128], mirar: 'Un cartel con un señor muy serio. Anuncia la Feria. No parece contento con el encargo.' }
  ]
};

/* ----- Botánico y minijuego de clavijas ----- */
async function jugarClavijas() {
  if (flag('tiene_acorde')) return S('pablob', 'Ya suena a gloria. No la toques, que es de buena familia.');
  if (!has('libro')) return K('Giro una clavija al azar. Ha sonado un gato. Mejor no.');
  const st = G.flags.clav || (G.flags.clav = { n: [5, 2, 6, 0, 3, 1], tries: 0 }), L = 'ABCDEFG', SOL = [4, 0, 3, 6, 1, 4];
  const ok = await panelOverlay((el, close) => {
    let msg = 'PABLO: De la gorda a la fina, como se lee un libro: de arriba abajo.', okSet = [];
    const draw = () => {
      el.innerHTML = '<h2>Las seis clavijas</h2><p>Libro: <b>«El Ángel De Guarda Bajará Enseguida»</b></p><div class="mg-col">' + st.n.map((v, i) => '<div class="mg-row"><span style="width:7.5em">' + (6 - i) + '.ª cuerda' + (i === 0 ? ' (gorda)' : i === 5 ? ' (fina)' : '') + '</span><button type="button" class="mg-peg' + (okSet.includes(i) ? ' ok' : '') + '" id="peg-' + i + '">' + L[v] + '</button><span style="flex:1;border-top:' + (6 - i) + 'px solid #8a7a55"></span></div>').join('') + '</div><p class="mg-say">' + msg + '</p><div class="mg-row"><button type="button" class="verb" id="mg-try">Que pruebe Pablo</button><button type="button" class="verb" id="mg-back">Volver</button></div>';
      st.n.forEach((v, i) => { el.querySelector('#peg-' + i).onclick = () => { st.n[i] = (st.n[i] + 1) % 7; okSet = []; draw(); }; });
      el.querySelector('#mg-back').onclick = () => close(false);
      el.querySelector('#mg-try').onclick = () => {
        const word = st.n.map(v => L[v]).join(''), good = st.n.filter((v, i) => v === SOL[i]).length;
        if (good === 6) return close(true);
        st.tries++;
        if (word === 'DECADA') msg = 'PABLO: Década. Lo que llevo sin afinar.';
        else if (word === 'CEBADA') msg = 'PABLO: Cebada. Eso es para la cerveza, no para la guitarra.';
        else if (new Set(st.n).size === 1) msg = 'PABLO: Eso no es una guitarra, es una sirena de barco.';
        else if (word === 'EBGDAE') msg = 'PABLO: Casi. La tienes afinada para zurdos.';
        else if (st.tries <= 3) msg = 'Suena fatal. Un invitado se tapa los oídos. PABLO: ' + good + ' cuerdas me suenan a gloria y ' + (6 - good) + ' a gato.';
        else if (st.tries <= 5) { okSet = st.n.map((v, i) => v === SOL[i] ? i : -1).filter(i => i >= 0); msg = 'PABLO: Las mayúsculas, decía el poeta. Solo las mayúsculas.'; }
        else msg = 'KAREN: El. Ángel. De. Guarda. Bajará. Enseguida. E, A, D, G, B, E. De arriba abajo.';
        draw();
      };
    };
    draw();
  });
  if (!ok) return;
  flag('tiene_acorde', 1);
  await K('Acorde limpio. Los invitados aplauden. La novia llora.');
  await S('pablob', '¡Eso es! Te debo una. ¿El acorde de la copla? Sol sostenido.'); await S('pablob', 'Sostenido como el sol de agosto, que no hay quien lo baje.');
  addNote('Acorde de «Cuatro cosas»: Sol sostenido.');
}
Rooms.botanico = {
  name: 'Jardín Botánico', scale: 1, walk: { x1: 70, x2: 250, y1: 126, y2: 155 },
  npcs: [npc('pablob', 'Pablo, el de las bodas', 162, 130, NPC.pablob, '#cfe8ff', { walk: [134, 134],
    mirar: 'Un chico con cara de pedir perdón y una guitarra. Detrás, cien invitados esperando el vals.',
    hablar: () => dialog(() => [
      { id: 'pb_pasa', text: '¿Qué le pasa?', cond: () => !flag('tiene_acorde'), run: () => S('pablob', 'Que tengo la guitarra como mi corazón en febrero: desafinada. Y el afinador, sin pilas.') },
      { id: 'pb_notas', text: '¿No se sabe las notas de las cuerdas?', keep: true, cond: () => !flag('tiene_acorde') && !has('libro'), run: async () => { await S('pablob', 'De oído canto, pero las cuerdas no me las sé ni de memoria. Las notas venían en el título de un libro. Uno de ángeles.'); await S('pablob', 'Me lo regaló un poeta en una boda. Lo perdí en el convite. Como casi todo.'); flag('pablo_pide', 1); addNote('Pablo no se sabe las notas de las cuerdas. Venían en el título de un libro de ángeles que perdió.'); } },
      { id: 'pb_acorde', text: 'Busco un acorde con mucho sol.', cond: () => flag('kanka_pide') && !flag('tiene_acorde'), run: () => S('pablob', '¿El de «Cuatro cosas»? Me lo sé. Pero sin afinar no te lo puedo ni tocar ni apuntar, que me sale otro.') },
      { id: 'pb_afinar', text: 'Tengo el libro. Vamos a afinar.', keep: true, end: true, cond: () => has('libro') && !flag('tiene_acorde'), run: () => jugarClavijas() },
      { id: 'pb_casa', text: '¿Quién se casa?', run: () => S('pablob', 'No lo sé. Yo llego, canto bajito y lloran. Es un oficio.') },
      { id: 'pb_sol', text: '¿Por qué Sol sostenido?', cond: () => flag('tiene_acorde'), run: () => S('pablob', 'Porque aquí el sol no baja ni con bemoles.') }
    ]),
    usar: () => jugarClavijas(),
    dar: { libro: () => jugarClavijas(), cartojal: () => S('pablob', 'No puedo, que luego canto alegre y me despiden.'), _: () => S('pablob', 'Qué bonito. Me ha dado para una balada.') } })],
  hot: [
    { id: 'b_cenador', name: 'cenador de glicinias', rect: [112, 0, 96, 66], mirar: 'Una cúpula de flores moradas. Debajo, una boda. Encima, abejas invitadas.' },
    { id: 'b_invitados', name: 'invitados', rect: [82, 68, 34, 60], walk: [120, 132], face: -1, mirar: 'Cien personas con tacones sobre grava. Valentía.', hablar: () => K('—¿Viene por la novia o por el novio? —Yo vengo por el jamón, hija.') },
    { id: 'b_invitados2', name: 'invitados', rect: [212, 68, 34, 60], walk: [204, 132], mirar: 'Trajes de boda a cuarenta grados. El amor aquí se mide en litros de sudor.' },
    { id: 'b_jamon', name: 'cortador de jamón', rect: [18, 66, 52, 66], walk: [74, 132], face: -1, mirar: 'Un señor corta jamón con la concentración de un cirujano.', coger: 'Me ha dado una loncha con unas pinzas. Me siento condecorada.' },
    { id: 'b_estanque', name: 'estanque', rect: [250, 130, 66, 22], walk: [246, 146], mirar: 'Nenúfares y una rana. La rana tampoco afina.' },
    { id: 'b_plantas', name: 'plantas tropicales', rect: [260, 10, 60, 100], mirar: 'Palmeras, bambú, hojas del tamaño de un paraguas. Es un jardín histórico, y yo ya tengo antecedentes con un olivo.' }
  ]
};

/* =====================================================================
   RAMA C · LA VERDAD
   ===================================================================== */
const GLOS = { perita: 'estupendo', pecha: 'un montón', chorraera: 'tobogán', espurrear: 'salpicar, desperdigar' };
function glos(w, label) { if (!flag('glos_' + w)) { flag('glos_' + w, 1); addNote('«' + label + '» = ' + GLOS[w] + '.'); } }
async function ligoteo() {
  let st = G.flags.lig || 1;
  if (st === 1) { if (await ask(['¿Siempre ligas así?', 'Solo quiero beber.']) === 1) { await K('Solo quiero beber.'); await S('dani', 'Vale, vale. Profesional.'); return; } await K('¿Siempre ligas así?'); await S('dani', 'Solo en Feria, que hay una pechá de gente y entre tanta alguna pica.'); glos('pecha', 'pechá'); st = G.flags.lig = 2; }
  if (st === 2) { if (await ask(['¿Y si no pico?', 'No pico.']) === 1) { await K('No pico.'); await S('dani', 'Me lo apunto. Con lápiz.'); return; } await K('¿Y si no pico?'); await S('dani', 'Pues me tiro por la chorraera del parque, del disgusto. Y no te rías, que me espurreas el vino.'); glos('chorraera', 'chorraera'); glos('espurrear', 'espurrear'); st = G.flags.lig = 3; }
  if (st === 3) { const r = await ask(['Me caes bien, Dani.', 'Me río de ti, no contigo.']); if (r === 0) { await K('Me caes bien, Dani.'); await S('dani', 'Eso en mi pueblo es casi una boda.'); } else { await K('Me río de ti, no contigo.'); await S('dani', 'También me vale.'); } G.flags.lig = 4; }
}
async function pedirBebida() {
  if (!has('pesetas')) return S('dani', 'Aquí se fía, pero a los de aquí.');
  if (!flag('dani_pesetas')) { flag('dani_pesetas', 1); await S('dani', '¿Pesetas? La caja registradora es del 78; se va a poner más contenta que yo.'); }
  const r = await ask(['Un Cartojal.', 'Un whisky.', 'Una cerveza.', 'Un agua.', 'Un café.', 'Nada, gracias.']);
  const id = ['cartojal', 'whisky', 'cerveza', 'agua', 'cafe'][r]; if (!id) return;
  if (has(id) || (id === 'cartojal' && has('vino'))) return S('dani', 'Ya llevas uno. Aquí se bebe despacio, que si no no cunde.');
  if (id === 'cafe') { const t = await ask(CAFES.map(n => n[0].toUpperCase() + n.slice(1))); G.flags.cafe_tipo = t; if (t === 9) { await S('dani', '«No me lo ponga». Marchando un vaso vacío, con su platito.'); } else await S('dani', 'Un ' + CAFES[t] + '. Se nota que has mirado el azulejo.'); }
  else if (id === 'cartojal') await S('dani', 'Un Cartojal. Del tiempo, que no hay hielo. Y el tiempo es agosto.');
  else if (id === 'agua') await S('dani', 'Agua. Voy a mirar si queda. Es que no rota mucho.');
  else await S('dani', 'Marchando.');
  give(id);
}
const daniOpts = () => [
  { id: 'd_sangria', text: 'Una sangría, por favor.', run: async () => { await S('dani', 'Aquí a las guiris guapas no se les pone sangría, se les pone Cartojal. Te va a quedar el día perita.'); glos('perita', 'perita'); G.flags.lig = G.flags.lig || 1; await ligoteo(); } },
  { id: 'd_ligar', text: '¿Qué decías de las guiris guapas?', keep: true, cond: () => G.flags.lig && G.flags.lig < 4, run: () => ligoteo() },
  { id: 'd_chiquito', text: '¿Qué le pasa a ese señor?', run: async () => { await S('dani', '¿Chiquito? Lleva así desde el 92. Solo se le entiende con un vino dulce delante. Pero fresquito, que si no lo escupe.'); await S('dani', 'Y nos hemos quedado sin hielo, con la pechá de gente.'); if (!flag('glos_pecha')) { await K('¿Pechá?'); await S('dani', 'Eso te lo explico si te quedas un rato.'); } flag('sabe_remedio', 1); flag('sin_hielo', 1); addNote('A Chiquito solo se le entiende con un vino dulce fresquito. En el Pirimpi no queda hielo.'); } },
  { id: 'd_hielo', text: '¿Dónde consigo hielo?', cond: () => flag('sin_hielo') && !has('hielo') && !has('vino'), run: () => S('dani', 'En Feria, ni en el Polo. Ahora mismo un cubito vale más que el vino que enfría.') },
  { id: 'd_pon', text: 'Ponme algo de beber.', keep: true, run: () => pedirBebida() },
  { id: 'd_posa', text: '¿Puedo llevarme un posavasos?', cond: () => !flag('posavasos_cogido'), run: () => S('dani', 'Los que quieras. Son de la Victoria, que es de aquí.') },
  { id: 'd_barriles', text: '¿Por qué están firmados los barriles?', run: () => S('dani', 'Firma la gente importante. Cuando lo seas, te dejo uno pequeñito.') },
  { id: 'd_todo', text: 'Chiquito me lo ha contado todo.', cond: () => flag('tiene_secreto'), run: () => S('dani', '¿Y lo has entendido? Entonces ya eres de aquí. Y te lo digo sin ligar.') }
];
const CONF = [
  ['La Trini y el del cenacho estaban peritas juntos, ¿te das cuen?', 'perita', 'Se querían y les iba de maravilla.', ['Vendían peras juntos.', 'Estaban peleados.']],
  ['Pero la familia de ella lo tiró por la chorraera.', 'chorraera', 'Lo echaron cuesta abajo, sin miramientos.', ['Lo invitaron a la Feria.', 'Le dieron trabajo en la casa.']],
  ['Y a ella la mandaron al norte con una pechá de maletas y una barriguita.', 'pecha', 'Se fue con muchísimo equipaje, y embarazada.', ['Se fue con una sola maleta, enferma.', 'Se fue de vacaciones.']],
  ['Y él no se espurreó por ahí, no. Sigue donde siempre, entre el hielo y los boquerones, cada mañana.', 'espurrear', 'No se marchó: sigue vendiendo pescado en el mercado.', ['Se arruinó y desapareció.', 'Murió hace años.']]
];
async function confesion() {
  for (let i = G.flags.conf || 0; i < 4; i++) {
    const [fr, w, bien, mal] = CONF[i];
    for (;;) {
      await S('chiquito', fr);
      const sabe = flag('glos_' + w), pos = [1, 0, 2, 1][i], ops = sabe ? [mal[0], mal[1]] : [mal[0], mal[1], 'No lo he entendido.'];
      if (sabe) ops.splice(pos, 0, bien);
      const r = await ask(ops.map((o, k) => (!sabe && k === 2) ? o : 'Entiendo que… ' + o[0].toLowerCase() + o.slice(1)));
      if (sabe && r === pos) { await K(bien); break; }
      if (!sabe && r === 2) { await K('Me falta vocabulario. Esto no viene en mi guía de 1998.'); addNote('Para entender a Chiquito me faltan palabras malagueñas.'); return; }
      await K(ops[r]); await S('chiquito', '¡No, pecadora, no! Te lo repito con las manos.');
    }
    G.flags.conf = i + 1;
  }
  flag('tiene_secreto', 1);
  await scene([['karen', 'Entonces mi abuelo está vivo. En Atarazanas.'], ['chiquito', '¿Tu abuelo?'], ['chiquito', '*(la mira, por primera vez sin moverse)* Por la gloria de la Trini. Tienes sus ojos, pecadora.']]);
  addNote('EL SECRETO: Trini y el cenachero se querían. A ella la mandaron al norte embarazada. Él sigue vivo, vendiendo pescado en el mercado de Atarazanas.');
  checkFin2();
}
Rooms.pirimpi = {
  name: 'Taberna Pirimpi', scale: 1, walk: { x1: 12, x2: 300, y1: 132, y2: 155 },
  draw(c) { if (!flag('posavasos_cogido')) P2.posavasos(c); },
  npcs: [
    npc('dani', 'Dani', 252, 124, NPC.dani, '#fff2b8', { walk: [226, 136], mirar: 'Un camarero con barba y sonrisa de anuncio. Seca el mismo vaso desde que has entrado.', hablar: () => dialog(daniOpts),
      dar: { hielo: async () => { await S('dani', '¡Hielo! ¿De dónde…? Huele a boquerón. Mejor no pregunto.'); if (has('cartojal')) { lose('cartojal'); lose('hielo'); give('vino'); await S('dani', 'Trae ese Cartojal, que te lo enfrío.'); } else await S('dani', 'Quédatelo tú, que aquí se me derrite en la mano.'); }, biznaga: async () => { await S('dani', '*(se la pone en la oreja)* Ya estoy para la portada de la Feria.'); }, campero: () => S('dani', '¿De Camperos Kent? Esa mujer es de acero.'), pesetas: () => pedirBebida(), _: () => S('dani', 'Eso no lo sirvo yo.') } }),
    prop('_barra', 127, c => { R(c, 190, 96, 130, 6, '#93623a'); R(c, 190, 102, 130, 26, '#6f4526'); for (let x = 196; x < 320; x += 18) R(c, x, 104, 14, 20, '#7f5330'); R(c, 190, 96, 130, 1, '#b98a5a'); }),
    npc('chiquito', 'Chiquito', 96, 140, NPC.chiquito, '#ffb86b', { h: 56, walk: [68, 144],
      mirar: 'Un hombrecillo que no para quieto: da pasitos, se agarra los riñones y mira al techo.',
      hablar: async () => {
        if (flag('tiene_secreto')) return dialog(() => [
          { id: 'cq_como', text: '¿Cómo era él?', run: () => S('chiquito', 'Guapo no era, pero olía a mar y andaba derecho, con sus dos cenachos. No como yo, ¿te das cuen?') },
          { id: 'cq_nadie', text: '¿Por qué nadie se lo contó?', run: () => S('chiquito', 'Porque nadie lo supo, pecadora. La barriguita se fue en el tren.') },
          { id: 'cq_puesto', text: '¿Cuál es su puesto?', keep: true, run: async () => { await S('chiquito', 'Eso no te lo digo yo, que se me escapa la gracia. Tú mírale los brazos a to los pescaderos.'); addNote('Chiquito: «Mírale los brazos a todos los pescaderos».'); } }
        ]);
        if (flag('vino_dado')) return confesion();
        await dialog(() => [
          { id: 'cq_abuelo', text: '¿Usted conoció a mi abuelo?', run: () => S('chiquito', '¡Fistro! ¡Pecadora! ¡Jarl!') },
          { id: 'cq_es', text: '¿Es usted Chiquito?', run: () => S('chiquito', '¡No puedor, no puedor!') },
          { id: 'cq_noent', text: 'No le entiendo.', keep: true, run: async () => { await S('chiquito', '*(da una vuelta sobre sí mismo)* ¿Te das cuen?'); await K('No.'); } }
        ]);
      },
      dar: {
        vino: async () => { lose('vino'); flag('vino_dado', 1); await S('chiquito', '*(bebe)* …Aaah. Fresquito. Ahora sí, pecadora. Siéntate, que esto es largo.'); await confesion(); },
        cartojal: async () => { await S('chiquito', '*(lo prueba y lo escupe)* ¡Caldo de fistro!'); await K('Me lo devuelve. Templado no le vale.'); },
        whisky: async () => { lose('whisky'); await S('chiquito', 'I say, dear girl, frightfully sorry, but one simply cannot discuss family matters on Scotch.'); await K('Inglés perfecto. De lord. Y sigo sin enterarme de nada útil.'); },
        cerveza: async () => { lose('cerveza'); await S('chiquito', 'Ach, Fräulein! Noch ein Bier und zwei Würstchen, bitte!'); await K('Ahora habla alemán y pide salchichas. Esto no ayuda.'); },
        agua: async () => { lose('agua'); await S('chiquito', '¿Agua? ¡No puedor! *(se va ofendido, de puntillas, y vuelve)*'); },
        cafe: async () => { lose('cafe'); const t = G.flags.cafe_tipo || 0; if (t === 9) { await S('chiquito', '…'); await K('Silencio absoluto. Es la primera vez que lo veo quieto.'); } else if (t <= 2) { await S('chiquito', 'Fiiiiiiiistrooooo… pecadoooooora… de la praaaaadeeeeera…'); await K('Con tanta leche habla a cámara lenta. Se entiende igual de poco, pero con más calma.'); } else if (t >= 6) { await S('chiquito', '¡Fistropecadoradelapraderajarlnopuedornopuedorporlagloriademimadre!'); await K('Demasiado café. El cuaderno echa humo.'); } else { await S('chiquito', 'Fistro. Pecadora. Jarl.'); await K('A velocidad de crucero. Sigue siendo fistro.'); } },
        poema: async () => { await S('chiquito', '«Traías la fistro a cuestas, pecadora en dos cenachos…»'); await K('Lo lee en fistro. Rima igual.'); },
        _: async () => { await K('Lo mira, lo huele y me lo devuelve de puntillas.'); }
      } })
  ],
  hot: [
    { id: 'pi_posa', name: 'posavasos', rect: [133, 106, 13, 8], walk: [146, 138], faceRow: 'up', when: () => !flag('posavasos_cogido'), mirar: 'Un posavasos de Cerveza Victoria. «Malagueña y exquisita». Sale un señor alemán con sombrero. No entiendo nada y me encanta.', coger: async () => { flag('posavasos_cogido', 1); give('posavasos'); await K('Gratis. Lo único gratis sin sermón.'); } },
    { id: 'pi_azulejo', name: 'azulejo de los cafés', rect: [100, 50, 60, 46], walk: [130, 134], faceRow: 'up', mirar: async () => { await K('Solo, largo, semilargo, solo corto, mitad, entrecorto, corto, sombra, nube. Y «no me lo ponga».'); await K(flag('cafes_vistos') ? 'Esta ciudad se toma en serio lo importante.' : 'Nueve maneras de pedir un café y una de no pedirlo.'); if (!flag('cafes_vistos')) { flag('cafes_vistos', 1); addNote('Los nueve cafés, de más a menos leche: nube, sombra, corto, entrecorto, mitad, solo corto, semilargo, largo, solo. Y «no me lo ponga».'); } } },
    { id: 'pi_barriles', name: 'barriles firmados', rect: [8, 70, 70, 50], walk: [70, 136], face: -1, mirar: 'Barriles firmados por gente famosa. Reconozco una firma. Es el del teatro; ha firmado tres.', coger: 'Pesan doscientos litros de historia cada uno.' },
    { id: 'pi_cartel', name: 'cartel', rect: [224, 10, 58, 13], mirar: '«No hay hielo». Debajo, a boli: «No insista. Tampoco queda paciencia».' },
    { id: 'pi_fotos', name: 'fotos de la pared', rect: [84, 16, 92, 28], mirar: 'Gente brindando desde 1840. Nadie mira a la cámara; todos miran la copa.' },
    { id: 'pi_botellas', name: 'botellas', rect: [196, 30, 124, 60], mirar: 'Vino dulce de todos los grados de dulce. Empiezo a entender que pedir sangría aquí es una ofensa.', coger: 'Hay un camarero entre las botellas y yo. Sonriendo.' }
  ]
};
Rooms.pirimpi.npcs[0].con = Rooms.pirimpi.npcs[0].dar;

const darSardinas = async () => { if (has('sardinas') || has('espeto_crudo') || has('espeto')) return S('chanquete', 'Ya llevas, niña. Cuando se te acaben, vuelves.'); await S('chanquete', 'Llévate el doble. No, no me pagues; me recuerdas a alguien.'); give('sardinas'); flag('pidio_sardinas', 1); };
const darHielo = async () => { if (has('hielo') || has('vino')) return S('chanquete', 'Ya llevas hielo, niña. Que se te derrite.'); await S('chanquete', 'El que quieras. Pero huele a boquerón, te aviso.'); give('hielo'); };
Rooms.mercado = {
  name: 'Mercado de Atarazanas', scale: 1, walk: { x1: 12, x2: 300, y1: 132, y2: 155 },
  npcs: [
    npc('chanquete', 'Chanquete', 168, 124, NPC.chanquete, '#b8e0ff', { walk: [140, 136],
      mirar: () => K(flag('tiene_secreto') ? 'Un pescadero viejo, con gorra de marinero. Hay veinte pescaderos en este mercado. Necesito algo más que una historia: necesito una cara.' : 'Un pescadero viejo, con gorra de marinero y brazos de haber cargado media bahía.'),
      hablar: () => dialog(() => [
        { id: 'c_bueno', text: '¿Qué tiene de bueno hoy?', run: () => S('chanquete', 'To, niña. Pero tú lo que necesitas es comer, que estás muy flaca.') },
        { id: 'c_sardinas', text: '¿Me da unas sardinas?', keep: true, run: darSardinas },
        { id: 'c_hielo', text: '¿Me da un poco de hielo?', keep: true, cond: () => !flag('vino_dado'), run: darHielo },
        { id: 'c_quien', text: '¿A quién le recuerdo?', cond: () => flag('pidio_sardinas'), run: () => S('chanquete', 'A nadie. A una de hace mucho. Cosas de viejo. ¿Te pongo boquerones?') },
        { id: 'c_lleva', text: '¿Lleva mucho aquí?', run: async () => { await S('chanquete', 'En el puesto, cuarenta años. Antes lo vendía por la calle, con dos cenachos y sin camiseta. Otros tiempos.'); flag('c_cenacho', 1); } },
        { id: 'c_cenachero', text: '¿Qué es un cenachero?', cond: () => flag('c_cenacho'), run: async () => { await S('chanquete', 'El que lleva el mar colgando de los brazos y lo va pregonando. Ya no quedamos. Queda la estatua.'); addNote('Cenachero: el que vendía pescado por la calle, con dos cenachos colgando de los brazos.'); } },
        { id: 'c_casado', text: '¿Estuvo casado?', run: () => S('chanquete', 'Con el mar, que no pregunta. Come, niña.') },
        { id: 'c_palo', text: '¿Conoce El Palo?', cond: () => flag('fondo_restaurado'), run: () => S('chanquete', '*(tarda)* De joven iba mucho. A la barca de los espetos. Ya no voy.') },
        { id: 'c_copla', text: '¿Conoce la copla «Cuatro cosas»?', cond: () => flag('mari_pide'), run: () => S('chanquete', '*(se le cae el cuchillo)* La he oído. Hace mucho. Toma, más sardinas.') },
        { id: 'c_busco', text: 'Busco a un cenachero de hace sesenta años.', cond: () => flag('tiene_secreto'), run: async () => { await S('chanquete', 'Cenacheros hubo muchos. Y sesenta años son muchos años.'); await K('Limpia el mismo pescado dos veces. Necesito algo más que una historia. Necesito una cara.'); } }
      ]),
      dar: { retrato: () => S('chanquete', '*(lo mira mucho)* Bonito sitio, El Palo. ¿Te pongo algo más?'), espeto: () => S('chanquete', '¿En un palo de escoba? Así los hacía yo cuando no había cañas.'), espeto_crudo: () => S('chanquete', 'Eso pide brasa, niña. La de El Palo es la buena.'), biznaga: () => S('chanquete', 'A ella le gustaban. A alguien, digo.'), cartojal: () => S('chanquete', 'En horas de puesto, no. Guárdamelo para la noche.'), poema: async () => { await K('Lo lee moviendo los labios.'); await S('chanquete', 'Esto… esto está bien escrito. Toma, boquerones.'); }, caja: () => S('chanquete', '*(se queda quieto)* Bonita caja. Cierra eso, niña, que se llena de escamas.'), _: () => S('chanquete', 'Eso no se come, niña.') } }),
    prop('_puestoCh', 127, c => P2.puestoChanquete(c))
  ],
  hot: [
    { id: 'me_pescado', name: 'pescado', rect: [114, 86, 60, 12], walk: [140, 136], faceRow: 'up', mirar: 'Sardinas, boquerones, jureles y algo con muchos ojos que me devuelve la mirada.', coger: darSardinas },
    { id: 'me_hielo', name: 'hielo', rect: [176, 86, 48, 12], walk: [196, 136], faceRow: 'up', mirar: 'Hielo picado. Lo más frío de Málaga, y huele a boquerón.', coger: () => darHielo() },
    { id: 'me_vidriera', name: 'vidriera', rect: [90, 0, 140, 62], mirar: 'Una vidriera enorme con barcos y escudos. Es una catedral, pero de boquerones.' },
    { id: 'me_aceitunas', name: 'puesto de aceitunas', rect: [262, 66, 58, 56], walk: [258, 136], mirar: 'Cuarenta tipos de aceitunas. Yo las mías las he machacado a mano, gracias.', coger: 'Me dan una a probar. Y otra. Y otra. Esto es un secuestro amable.' },
    { id: 'me_fruta', name: 'frutería', rect: [0, 66, 60, 56], walk: [64, 136], face: -1, mirar: 'Uno grita que sus melones son los mejores. El de enfrente grita lo mismo. No pueden tener razón los dos, pero les da igual.', hablar: () => K('—¿Me pone un kilo? —Te pongo dos, reina, que uno no es na.') },
    { id: 'me_bascula', name: 'báscula', rect: [232, 84, 20, 38], walk: [240, 134], mirar: 'Una báscula antigua. Pesa de más o de menos según le caigas.', usar: 'Me subo. Marca «guiri y media».' }
  ]
};
Rooms.mercado.npcs[0].con = Rooms.mercado.npcs[0].dar;

/* ---------- mapa y recursos ---------- */
MapPlaces.push(
  { id: 'calle', name: 'Casa de la abuela', x: 150, y: 156 }, { id: 'perchel', name: 'Calle del Perchel', x: 200, y: 140 }, { id: 'patio', name: 'Patio de doña María', x: 160, y: 116, face: 'down' },
  { id: 'kent', name: 'Camperos Kent', x: 60, y: 140 }, { id: 'parque', name: 'Paseo del Parque', x: 170, y: 148 }, { id: 'merced', name: 'Plaza de la Merced', x: 80, y: 146 },
  { id: 'soho', name: 'Teatro del Soho', x: 60, y: 142 }, { id: 'imprenta', name: 'Imprenta vieja', x: 270, y: 144 }, { id: 'puerto', name: 'Puerto', x: 40, y: 140 }, { id: 'caleta', name: 'Playa de La Caleta', x: 40, y: 140 },
  { id: 'alcazabilla', name: 'Calle Alcazabilla', x: 280, y: 148, dir: -1 }, { id: 'catedral', name: 'Catedral', x: 30, y: 153 }, { id: 'larios', name: 'Calle Larios', x: 40, y: 142 }, { id: 'botanico', name: 'Jardín Botánico', x: 90, y: 146 },
  { id: 'chiringuito', name: 'Chiringuito de El Palo', x: 40, y: 142 }, { id: 'pirimpi', name: 'Taberna Pirimpi', x: 180, y: 148 }, { id: 'mercado', name: 'Mercado de Atarazanas', x: 60, y: 146 }
);
window.buildAct2Art = function () { ['kent', 'soho', 'vestibulo', 'imprenta', 'puerto', 'caleta', 'chiringuito', 'botanico', 'pirimpi', 'mercado'].forEach(k => { Rooms[k].bg = BG2[k](); }); };
window.ExtraAssets = ['parque', 'alcazabilla', 'merced', 'catedral', 'larios'].map(k => ['assets/' + k + '.png', im => { Rooms[k].bg = im; }, () => { const [cv, c] = mk(W, H); R(c, 0, 0, W, H, '#8bcff8'); R(c, 0, 110, W, 50, '#cfc1a0'); Rooms[k].bg = cv; }]);

Items.retrato.mirar = () => K(flag('fondo_restaurado') ? 'Ahora tiene playa, barca y cenachos. Solo falta él.' : 'Mi abuela de joven, enrollada bajo el brazo. Y a su lado, un hueco con forma de persona.');
