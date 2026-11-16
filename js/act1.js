/* El retrato borrado — Acto 1: «La guiri» */
'use strict';

/* ---------- actores (para colocar y colorear lo que dicen) ---------- */
Actors.geraldo = { x: 248, y: 156, h: 60, color: '#f1e9cf' };
Actors.maria = { x: 40, y: 128, h: 40, color: '#d7c4f5' };
Actors.vecina = { x: 300, y: 72, h: 28, color: '#ffa9cf' };

/* ---------- objetos de inventario ---------- */
Object.assign(Items, {
  cuaderno: { name: 'Cuaderno', mirar: () => showNotebook(), usar: () => showNotebook() },
  llave: { name: 'Llave antigua', mirar: 'Una llave del tamaño de mi mano. Las puertas de antes no se andaban con bromas.', con: { aceite: 'La llave no es la que está oxidada. Es la cerradura.' } },
  carta: { name: 'Carta de Trini', mirar: () => leerCarta(), usar: () => leerCarta() },
  jazmines: { name: 'Jazmines', mirar: 'Un puñado de jazmines. Duran una noche, me han dicho. Como las mejores cosas de aquí.', con: { nerdo: () => montarBiznaga() } },
  nerdo: { name: 'Nerdo seco', mirar: 'Un tallo seco con pinchos. Parece un esqueleto de paraguas.' },
  biznaga: { name: 'Biznaga', mirar: 'Una bola de jazmines clavados en un tallo. La he hecho yo. Ha quedado torcida y estoy orgullosísima.' },
  mortero: { name: 'Mortero', mirar: 'Un mortero de piedra. Hace cinco minutos era un cenicero filosófico.', con: { aceitunas: () => hacerAceite(), hucha: () => romperHucha(), caja: 'Con el cerdito ya tengo bastante cargo de conciencia.' } },
  palo: { name: 'Palo de escoba', mirar: 'Un palo. Me dijeron que con él alcazabaría mi objetivo. Sigo sin saber si es un verbo.', con: { aceitunas: 'Ya las he vareado. Pegarles más es ensañamiento.', caja: 'A golpes no. Es de mi abuela, y además es un corazón. Queda feo.', hucha: 'Con un palo se me escapa rodando. Tiene instinto de supervivencia.' } },
  aceitunas: { name: 'Aceitunas', mirar: 'Aceitunas recién vareadas. He probado una. No se comen así. Nadie me avisó.', usar: 'Amargas como una despedida. Nadie me avisó.' },
  aceite: { name: 'Aceite', mirar: 'Aceite hecho a mano, en un patio, con un palo. En mi país esto costaría cuarenta euros y llevaría lazo.', con: { pinturas: 'No tengo a quién pintar. Y no se pinta por pintar: eso es de señores con palomas.' } },
  retrato: { name: 'Retrato enrollado', mirar: 'Mi abuela de joven, enrollada bajo el brazo. Y a su lado, un hueco con forma de persona.' },
  caja: { name: 'Caja-corazón', mirar: () => mirarCaja(), usar: 'No se abre. Le falta algo en el hueco, y a mí me falta saber qué.' },
  pinturas: { name: 'Pincel y pinturas', mirar: 'Secas. Llevan esperando sesenta años a que alguien termine algo.', con: { retrato: 'Una cara no se inventa. Primero tendré que saber de quién es.' } },
  hucha: { name: 'Hucha', mirar: 'Un cerdito de barro con cara de saber lo que le espera.', usar: 'No tiene tapón. Los cerdos de aquí son de un solo uso.' },
  pesetas: { name: 'Pesetas', mirar: 'Monedas con un señor que ya no manda. Aquí, por lo visto, todavía valen. En Feria vale todo.' }
});

const CARTA = '<p>Karen, niña mía:</p><p>Si lees esto es que ya no estoy y que don Geraldo ha cumplido. Te dejo la casa del Perchel, que lleva cerrada desde que me fui en el 62. Dentro está lo único que no me dejaron llevarme.</p><p>Nunca os hablé de Málaga porque me dolía. Quisiera que hubieras conocido a tu abuelo. Le conocí de Chiquito.</p><p>Abre el corazón. Él sabría cómo.</p><p class="firma">Tu abuela, Trini</p>';
async function leerCarta() {
  await overlay('<div class="carta">' + CARTA + '</div>', 'Doblar la carta');
  if (!flag('carta_leida')) { flag('carta_leida', 1); addNote('La carta dice: «Le conocí de Chiquito», con mayúscula. Y «Abre el corazón».'); await K('La letra de mi abuela. Inclinada, con prisa. Como alguien que escribe antes de arrepentirse.'); await K('«Le conocí de Chiquito». ¿De pequeño? ¿Y por qué con mayúscula?'); }
}
async function mirarCaja() {
  await K('Cuatro ruedecitas con dibujos, un hueco redondo y dos grabados.');
  await K('Un título: «Cuatro cosas». Y dos versos: «Traías la mar a cuestas, / plata viva en dos cenachos».');
  await K('Mi abuela no dejaba nada fácil.');
  addNote('Caja-corazón: título «Cuatro cosas» y dos versos: «Traías la mar a cuestas, / plata viva en dos cenachos». Le falta algo en un hueco redondo.');
}
async function montarBiznaga() {
  lose('jazmines'); lose('nerdo'); give('biznaga');
  if (flag('pidio_biznaga')) await K('Una flor en cada pincho. Jazmín con disciplina, dijo. Ha quedado torcida y estoy orgullosísima.');
  else await K('He clavado las flores en los pinchos. No sé qué he hecho, pero huele a que alguien se acuerda de mí.');
}
async function hacerAceite() {
  lose('aceitunas'); give('aceite');
  await K('Machaco, machaco, machaco… ¡Aceite! Hecho a mano, en un patio.');
  await K('En mi país esto costaría cuarenta euros y llevaría lazo.');
}
async function romperHucha() {
  lose('hucha'); give('pesetas');
  await K('Perdón, cerdito.'); await K('¡Pesetas! Dinero de museo. Somos ricas, abuela. En 1962.');
  checkFin();
}

/* ---------- fin del acto ---------- */
function checkFin() { if (!flag('acto1_fin') && ['retrato', 'caja', 'pinturas', 'pesetas'].every(has)) G.after = finActo1; }
async function finActo1() {
  flag('acto1_fin', 1); G.busy = true;
  await K('Un retrato sin cara, un corazón cerrado, pinturas secas y un puñado de pesetas.');
  await K('Menuda herencia, abuela. Voy a tener que preguntar por toda Málaga.');
  G.busy = false; save();
}

/* ---------- SALA: calle de la casa (fondo de Rafa) ---------- */
Rooms.calle = {
  name: 'Casa de la abuela · El Perchel', bg: null, scale: 1, walk: { x1: 24, x2: 312, y1: 152, y2: 158 },
  draw(c) { Props.farolillos(c); if (flag('casa_abierta')) Props.puertaAbierta(c); if (!flag('palo_cogido')) Props.escobaEn(c, 12, 31); if (!flag('nerdo_cogido')) Props.nerdoEn(c, -124, 31); Props.maleta(c); },
  npcs: [
    { id: 'geraldo', npc: true, name: 'don Geraldo', x: 248, y: 156, sprite: Sprites.geraldo, rect: [238, 97, 24, 60], walk: [224, 156], face: 1,
      mirar: 'Un inglés con traje de lino y una taza humeante. A cuarenta grados. No suda.',
      hablar: () => hablarGeraldo(),
      dar: {
        biznaga: () => say('geraldo', 'Muy amable, pero me la pondría mal.'),
        carta: () => say('geraldo', 'La leí al sellarla. Deformación profesional.'),
        llave: () => say('geraldo', 'No, no. Es suya. Yo ya la he guardado bastante.'),
        _: () => say('geraldo', 'No sabría qué hacer con eso, y soy notario.')
      } }
  ],
  hot: [
    { id: 'escoba', name: 'escoba vieja', rect: [133, 110, 15, 44], walk: [152, 155], face: -1, when: () => !flag('palo_cogido'),
      mirar: 'Una escoba jubilada. El cepillo se rindió hace años; el palo aguanta.',
      coger: async () => { flag('palo_cogido', 1); give('palo'); await K('Me quedo el palo. Lo demás, que descanse.'); },
      usar: '¿Barrer? Estoy de vacaciones. Más o menos.' },
    { id: 'nerdo', name: 'cardo seco', rect: [93, 131, 16, 22], walk: [116, 155], face: -1, when: () => !flag('nerdo_cogido'),
      mirar: 'Un cardo seco al pie del muro. En mi país es basura. Aquí seguro que tiene nombre y cofradía.',
      coger: async () => { flag('nerdo_cogido', 1); give('nerdo'); await K('Pincha. Todo lo auténtico pincha.'); } },
    { id: 'maleta', name: 'maleta', rect: [56, 136, 17, 22], walk: [84, 156], face: -1,
      mirar: 'Mi maleta. Chirría desde el aeropuerto; ya la conoce todo el barrio.',
      coger: 'Pesa. Llevo tres jerséis. No sé en qué estaba pensando.',
      usar: 'No pienso abrirla en la calle. Dentro hay cosas dobladas con método.' },
    { id: 'puerta', name: 'puerta de la casa', rect: [186, 82, 40, 66], walk: [206, 153], faceRow: 'up',
      exit: async () => { if (flag('casa_abierta')) await goRoom('casa', 294, 136, -1); else { flag('puerta_probada', 1); await K('Cerrada. Meto la llave… y no gira.'); } },
      mirar: () => K(flag('casa_abierta') ? 'Abierta, por primera vez en sesenta años. Huele a cerrado y a jazmín seco.' : 'Madera vieja, clavos de hierro y una cerradura con sesenta años de salitre. Mi herencia empieza por no abrirse.'),
      coger: 'Es una puerta. Viene con la casa.',
      usar: async () => { if (flag('casa_abierta')) await goRoom('casa', 294, 136, -1); else if (flag('puerta_engrasada')) await K('Ya está engrasada. Ahora, la llave.'); else { flag('puerta_probada', 1); await K('La llave entra, pero no gira. Como yo en una sevillana.'); } },
      con: {
        llave: async () => {
          if (flag('casa_abierta')) return 'Ya está abierta. No pienso cerrarla otros sesenta años.';
          if (!flag('puerta_engrasada')) { flag('puerta_probada', 1); return 'Entra, pero no gira. Sesenta años de salitre no se arreglan con buena voluntad.'; }
          flag('casa_abierta', 1);
          await K('Ahora sí. Gira… cruje… ¡y se abre!');
          await say('geraldo', 'Enhorabuena. Sesenta años cerrada y la abre una guiri con aceite casero. Trini se habría reído.');
          addNote('La casa de Trini está abierta.');
          G.after = async () => { toast('Nuevo: botón Mapa, arriba a la derecha'); };
        },
        aceite: async () => {
          if (flag('puerta_engrasada')) return 'Ya está más engrasada que un churro.';
          flag('puerta_engrasada', 1);
          await K('Unas gotas en la cerradura. Chirría, se queja… y cede.'); await K('En mi país a esto lo llamamos mantenimiento. Aquí, milagro.');
        },
        aceitunas: 'Enteras no. La cerradura no tiene muelas.',
        palo: 'A golpes no. Es mi herencia. Y es de roble.',
        mortero: 'No pienso aporrear mi propia puerta con un cenicero.'
      } },
    { id: 'reja', name: 'jazmín', rect: [232, 18, 84, 104], walk: [270, 155], faceRow: 'up',
      mirar: 'Un jazmín que trepa hasta el tejado. Huele como si la calle se acabara de duchar.',
      coger: async () => { if (flag('jazmines_cogidos')) return 'Ya tengo. No voy a pelar el jazmín.'; flag('jazmines_cogidos', 1); give('jazmines'); await K('Cojo unos pocos. Si alguien pregunta, es herencia.'); },
      usar: 'Trepar por un jazmín. No. Tengo una llave y una dignidad.' },
    { id: 'callejon', name: 'callejón a la calle del Perchel', rect: [0, 56, 20, 104], walk: [26, 156],
      exit: () => goRoom('perchel', 298, 140, -1),
      mirar: 'Un callejón estrecho que sale a la calle del Perchel. Se oyen pregones, una persiana y a alguien opinando desde un balcón.' },
    { id: 'a_ciudad', name: 'salir a la ciudad (mapa)', rect: [306, 60, 14, 100], walk: [310, 156], when: () => flag('casa_abierta'),
      exit: async () => { G.after = async () => openMap(); }, mirar: 'Por ahí se sale al resto de Málaga. Todo a diez minutos, dicen.' },
    { id: 'ventana', name: 'reja', rect: [80, 76, 54, 58], walk: [108, 153], faceRow: 'up',
      mirar: 'Una reja de hierro con sus postigos. Detrás, visillos amarillos de tiempo. Aquí se esperaba mirando la calle.',
      usar: 'La reja no se abre. Está para mirar desde dentro y para suspirar desde fuera.', coger: 'Hierro forjado, empotrado desde antes de que naciera mi madre. No.' },
    { id: 'geranios', name: 'macetas', rect: [148, 118, 36, 36], walk: [166, 155], faceRow: 'up',
      mirar: 'Geranios regados. La casa lleva sesenta años cerrada, pero en este barrio las plantas ajenas son cosa de todos.',
      coger: 'Tienen dueña moral: todo el vecindario.' },
    { id: 'tinaja', name: 'tinaja azul', rect: [28, 118, 30, 36], walk: [62, 156], face: -1,
      mirar: 'Una tinaja de cerámica azul con una buganvilla dentro. Cabe una Karen. No pienso comprobarlo.', coger: 'Pesa más que yo y que mi maleta juntas.' },
    { id: 'buganvilla', name: 'buganvilla', rect: [0, 8, 78, 108], walk: [56, 156], faceRow: 'up',
      mirar: 'Una buganvilla que se ha comido media fachada. En mi país las plantas piden permiso.', coger: 'Tiene espinas escondidas. Aquí hasta lo bonito se defiende.' },
    { id: 'balcon', name: 'balcón', rect: [78, 22, 150, 50], walk: [160, 155], faceRow: 'up',
      mirar: 'El balcón de mi abuela. Sesenta años sin que nadie se asome.' },
    { id: 'farolillos', name: 'farolillos', rect: [0, 0, 320, 14],
      mirar: 'Farolillos de papel. La calle entera está de cumpleaños.', coger: 'Están muy altos y muy contentos ahí.' }
  ]
};

async function hablarGeraldo() {
  await dialog(() => [
    { id: 'g_abuela', text: '¿Quién era mi abuela?', run: () => say('geraldo', 'La señorita Trinidad. Se fue en el 62 con mucha prisa y pocas explicaciones. Había un muchacho del Perchel, creo. En Málaga siempre hay un muchacho.') },
    { id: 'g_chiquito', text: '¿Qué significa «Le conocí de Chiquito»?', cond: () => flag('carta_leida'), run: async () => { await say('geraldo', 'De pequeño. O de Chiquito. Aquí las mayúsculas las carga el diablo.'); addNote('Don Geraldo: «de Chiquito» puede ser de niño… o puede ser un nombre.'); } },
    { id: 'g_llave', text: 'La llave no gira.', cond: () => !flag('casa_abierta'), run: () => say('geraldo', 'Salitre. En esta ciudad, lo que no se oxida se atasca. Yo solo doy fe; arreglar no arreglo.') },
    { id: 'g_dentro', text: '¿Qué hay dentro de la casa?', cond: () => !flag('casa_abierta'), run: () => say('geraldo', 'Lo que una familia quiso olvidar. Suele ser lo más interesante.') },
    { id: 'g_te', text: '¿Por qué toma té con este calor?', run: () => say('geraldo', 'Porque son las cinco. El calor es una opinión local.') },
    { id: 'g_retrato', text: 'He encontrado un retrato sin cara.', cond: () => has('retrato'), run: () => say('geraldo', 'Borrar una cara cuesta más que pintarla. Alguien se tomó muchas molestias. En mi oficio, eso se llama un indicio.') },
    { id: 'g_vivo', text: 'Mi abuelo está vivo.', cond: () => flag('tiene_secreto'), run: () => say('geraldo', 'Entonces deje de hablar con un inglés y vaya a buscarlo.') },
    { id: 'g_mapa', text: '¿Cómo me muevo por la ciudad?', keep: true, cond: () => flag('casa_abierta'), run: () => say('geraldo', 'Use el mapa. Todo está a diez minutos, que en Málaga es una unidad de afecto, no de tiempo.') }
  ]);
}

async function intro() {
  G.busy = true;
  await wait(500);
  await K('Málaga. Cuarenta grados, una maleta que chirría y una casa heredada de una abuela a la que no conocí.');
  await walkTo(224, 156); G.k.dir = 1; G.k.face = 'side';
  await scene([
    ['geraldo', 'Miss Karen, supongo. Llevo sesenta años en Málaga y sigo llegando puntual. Nadie me lo perdona.'],
    ['karen', '¿Usted conoció a mi abuela?'],
    ['geraldo', 'Le guardé la llave. Que es conocer bastante. Tenga: llave, carta, y mi pésame.']
  ]);
  give('llave'); give('carta');
  await scene([
    ['karen', 'Gracias. ¿Y esta es la casa?'],
    ['geraldo', 'Esa. Lleva cerrada desde 1962. Le aviso: en esta ciudad todo se oxida menos las ganas de comer.'],
    ['karen', 'Tengo una llave. ¿Qué puede salir mal?']
  ]);
  await walkTo(206, 153); G.k.face = 'up'; await K('…No gira.'); flag('puerta_probada', 1); await say('geraldo', 'Salitre. Sesenta años de salitre.'); G.k.face = 'side';
  flag('intro', 1); G.busy = false; save();
}

/* ---------- SALA: patio de vecinos ---------- */
Rooms.patio = {
  name: 'Patio de vecinos', bg: null, scale: 1, walk: { x1: 66, x2: 284, y1: 112, y2: 154 },
  draw(c) { Props.botijo(c); if (!flag('mortero_dado')) Props.cenicero(c); },
  npcs: [
    { id: '_olivo', x: 0, y: 0, sy: 138, rect: [0, 0, 0, 0], sprite: c => Props.olivo(c, !flag('vareado')) },
    { id: 'maria', npc: true, name: 'doña María', x: 40, y: 128, sprite: Sprites.maria, rect: [26, 90, 34, 42], walk: [78, 132], face: -1,
      mirar: 'Una señora menuda, con un cigarrillo, un gato y la mirada de quien ya se ha leído el final.',
      hablar: () => hablarMaria(),
      dar: {
        biznaga: async () => {
          lose('biznaga'); flag('mortero_dado', 1);
          await say('maria', 'Ahora sí pienso.');
          await say('maria', 'Toma este mortero, que a mí me sirve de cenicero y a ti te va a servir de almazara.');
          give('mortero');
          await say('maria', 'Y recuerda: con el palo alcazabas tu objetivo.');
          flag('frase_palo', 1); addNote('Doña María: «Con el palo alcazabas tu objetivo.»');
          await K('¿«Alcazabas» es un verbo?');
          await say('maria', 'En Málaga, todo es un verbo si se dice con arte.');
        },
        jazmines: () => say('maria', 'Sueltos no. El pensamiento desordenado me da jaqueca.'),
        nerdo: () => say('maria', 'Un esqueleto. Muy bonito, pero yo he pedido un cuerpo entero.'),
        retrato: () => say('maria', 'A ese hombre le quitaron la cara, no la sombra.'),
        carta: () => say('maria', 'Las cartas de los muertos se leen dos veces: una con los ojos y otra con la calle.'),
        _: () => say('maria', 'Interesante. No me sirve, pero interesante.')
      } },
    { id: 'gato', npc: true, name: 'gato', x: 192, y: 148, sprite: Sprites.gato, rect: [181, 137, 22, 13], walk: [170, 148], face: 1,
      mirar: 'Un gato dormido al sol. Lleva aquí más que yo y trabaja menos que nadie.',
      coger: 'Me ha mirado como miran los notarios.',
      hablar: 'Ni miau. Este gato también habla en acertijos.',
      usar: 'Los gatos no se usan. Ellos te usan a ti.',
      dar: { _: 'Lo ha olido, ha bostezado y ha seguido durmiendo. Crítica demoledora.' },
      con: { palo: 'No. Soy guiri, no un monstruo.' } }
  ],
  hot: [
    { id: 'cenicero', name: 'cenicero de piedra', rect: [46, 110, 14, 10], walk: [78, 132], face: -1, when: () => !flag('mortero_dado'),
      mirar: 'Un mortero de piedra lleno de colillas filosóficas.', coger: 'Es suyo. Y está pensando encima.' },
    { id: 'botijo', name: 'botijo', rect: [96, 117, 16, 18], walk: [116, 136], face: -1,
      mirar: 'Una vasija con dos agujeros. Dicen que enfría el agua sin enchufe. Brujería.',
      coger: 'Está sudando. Lo entiendo perfectamente.',
      usar: 'Me he mojado la barbilla, la camiseta y el orgullo.' },
    { id: 'olivo', name: 'olivo', rect: [230, 72, 44, 66], walk: [226, 142], face: 1,
      mirar: () => K(flag('vareado') ? 'Un olivo recién vareado. Me mira con rencor vegetal.' : 'Un olivo en una maceta. Aquí hasta los árboles viven en pisos.'),
      coger: () => K(flag('vareado') ? 'Ya tengo aceitunas. Dejo las demás para los pájaros y los filósofos.' : 'Las aceitunas están altas. Y eso que la alta soy yo.'),
      usar: 'Sacudirlo con las manos no sirve. Lo he intentado y solo ha caído una hoja, por pena.',
      con: {
        palo: async () => {
          if (flag('vareado')) return 'Ya lo he vareado. Tengo un cupo de agresiones a árboles por día.';
          flag('vareado', 1); give('aceitunas');
          await K('¡Llueven aceitunas! En mi país esto sale en las noticias.');
          if (flag('frase_palo')) await K('«Con el palo alcazabas tu objetivo». Pues era literal.');
        }
      } },
    { id: 'geranios', name: 'geranios', rect: [116, 90, 24, 27], walk: [128, 116],
      mirar: 'Geranios rojos. Compiten conmigo.', coger: 'Doña María me mira. Los geranios se quedan.' },
    { id: 'salida', name: 'puerta a la calle', rect: [146, 40, 28, 66], walk: [160, 112],
      exit: () => goRoom('perchel', 247, 130, -1), mirar: 'La puerta del fondo da a la calle. Entra el ruido de la Feria, pero bajito, como pidiendo permiso.' },
    { id: 'tapia', name: 'tapia', rect: [286, 78, 34, 30], walk: [280, 124], face: 1,
      mirar: 'Al otro lado está la casa de mi abuela. Las tapias aquí separan poco.', usar: 'No trepo. Tengo una llave y una dignidad.', coger: 'Es una pared. Con buganvilla, pero pared.' },
    { id: 'azulejos', name: 'azulejos', rect: [112, 128, 96, 9],
      mirar: 'Azulejos pintados a mano. En casa tengo uno igual, pero es un imán de nevera.', coger: 'Llevan aquí trescientos años. No voy a ser yo.' }
  ]
};
Rooms.patio.npcs.find(n => n.id === 'maria').con = Rooms.patio.npcs.find(n => n.id === 'maria').dar;

async function hablarMaria() {
  await dialog(() => [
    { id: 'm_puerta', text: 'Necesito abrir una puerta.', cond: () => !flag('casa_abierta') && !flag('mortero_dado'), run: async () => { await say('maria', 'Todas las puertas se abren hacia dentro, hija. Pero yo, sin biznaga, no pienso.'); flag('pidio_biznaga', 1); addNote('Doña María no piensa sin una biznaga.'); } },
    { id: 'm_que', text: '¿Y usted a qué se dedica?', cond: () => !flag('pidio_biznaga') && !flag('mortero_dado'), run: async () => { await say('maria', 'A pensar. Pero hoy no he empezado: yo, sin biznaga, no pienso.'); flag('pidio_biznaga', 1); addNote('Doña María no piensa sin una biznaga.'); } },
    { id: 'm_biznaga', text: '¿Qué es una biznaga?', cond: () => flag('pidio_biznaga') && !flag('mortero_dado'), run: async () => { await say('maria', 'Jazmín con disciplina. Lo único que hemos conseguido ordenar en esta ciudad.'); addNote('Biznaga, según doña María: «jazmín con disciplina».'); } },
    { id: 'm_jazmines', text: '¿Dónde hay jazmines?', cond: () => flag('pidio_biznaga') && !flag('mortero_dado'), run: () => say('maria', 'Donde huele a que alguien se acuerda de ti.') },
    { id: 'm_ahora', text: '¿Y ahora la puerta?', keep: true, cond: () => flag('mortero_dado') && !flag('casa_abierta'), run: () => say('maria', 'Con el palo alcazabas tu objetivo.') },
    { id: 'm_noent', text: 'No lo he entendido.', keep: true, cond: () => flag('frase_palo') && !flag('casa_abierta'), run: () => say('maria', 'El olivo tampoco, y ahí lo tienes, dando aceitunas.') },
    { id: 'm_trini', text: '¿Conoció a Trini?', run: () => say('maria', 'Conocer es mucho decir. La oía reír por encima de esta tapia. Y un día dejé de oírla.') },
    { id: 'm_retrato', text: 'Hábleme del retrato.', keep: true, cond: () => flag('casa_abierta'), run: async () => { await oraculo('retrato'); } },
    { id: 'm_caja', text: 'Hábleme de la caja de música.', keep: true, cond: () => flag('casa_abierta'), run: async () => { await oraculo('caja'); } },
    { id: 'm_abuelo', text: 'Hábleme de mi abuelo.', keep: true, cond: () => flag('casa_abierta'), run: async () => { await oraculo('abuelo'); } },
    { id: 'm_claro', text: '¿No puede decírmelo claro?', keep: true, cond: () => flag('casa_abierta'), run: () => say('maria', rot('m_claro', ['La claridad es para quien ya ha llegado.', 'Si te lo digo claro, no lo sabrás; solo lo habrás oído.', 'Hija, soy filósofa, no taquillera.'])) }
  ]);
}

/* ---------- SALA: casa de Trini ---------- */
const motes = Array.from({ length: 16 }, (_, i) => ({ x: 30 + (i * 37) % 110, y: 40 + (i * 53) % 100, p: i * 1.7 }));
Rooms.casa = {
  name: 'Casa de Trini', bg: null, scale: 1, walk: { x1: 22, x2: 298, y1: 130, y2: 154 },
  async enter() { if (!flag('casa_vista')) { flag('casa_vista', 1); G.busy = true; await K('Huele a cerrado, a jazmín seco y a sesenta años de silencio.'); await K('Hola, abuela. Perdona el retraso.'); G.busy = false; } },
  draw(c, t) {
    if (!flag('retrato_cogido')) Props.retrato(c); if (!flag('caja_cogida')) Props.caja(c); if (!flag('pinturas_cogidas')) Props.pinturas(c); if (!flag('hucha_cogida')) Props.hucha(c);
    motes.forEach(m => { const x = m.x + Math.sin(t / 1900 + m.p) * 6 + (m.y - 40) * 0.5, y = m.y + Math.cos(t / 2300 + m.p) * 4; c.fillStyle = 'rgba(255,250,220,' + (0.35 + 0.3 * Math.sin(t / 700 + m.p)) + ')'; c.fillRect(x | 0, y | 0, 1, 1); });
  },
  npcs: [],
  hot: [
    { id: 'retrato', name: 'retrato', rect: [134, 20, 56, 64], walk: [162, 131], when: () => !flag('retrato_cogido'),
      mirar: 'Una chica joven que sonríe a un hombre sin cara. Alguien rascó con mucho cuidado y muy mala idea.',
      coger: async () => { flag('retrato_cogido', 1); give('retrato'); await K('Lo descuelgo y lo enrollo. Perdona, abuela: es por una buena causa.'); addNote('El retrato: Trini joven junto a un hombre al que le han borrado la cara.'); checkFin(); },
      con: { pinturas: 'Una cara no se inventa. Primero tendré que saber de quién es.', aceite: 'No pienso engrasar a mi abuela.' } },
    { id: 'clavo', name: 'marca en la pared', rect: [134, 20, 56, 64], walk: [162, 131], when: () => flag('retrato_cogido'),
      mirar: 'Una marca clara en la pared, del tamaño del cuadro. Volverá. Completo.' },
    { id: 'caja', name: 'caja-corazón', rect: [221, 65, 22, 14], walk: [232, 131], when: () => !flag('caja_cogida'),
      mirar: 'Un corazón de madera con cuatro ruedecitas y un hueco redondo. Mi abuela guardaba los secretos con combinación.',
      coger: async () => { flag('caja_cogida', 1); give('caja'); await K('Pesa poco para lo que debe de llevar dentro.'); await mirarCaja(); checkFin(); },
      usar: 'No se abre. Le falta algo en el hueco, y a mí me falta saber qué.' },
    { id: 'pinturas', name: 'pincel y pinturas', rect: [239, 110, 22, 14], walk: [226, 140], face: 1, when: () => !flag('pinturas_cogidas'),
      mirar: 'Pinturas secas como una carretera y un pincel con canas.',
      coger: async () => { flag('pinturas_cogidas', 1); give('pinturas'); await K('Me los llevo. No sé pintar, pero tampoco sabía hacer aceite.'); checkFin(); } },
    { id: 'hucha', name: 'hucha de barro', rect: [112, 86, 18, 13], walk: [121, 131], when: () => !flag('hucha_cogida'),
      mirar: 'Un cerdito de barro. Suena. Los cerditos que suenan me caen bien.',
      coger: async () => { flag('hucha_cogida', 1); give('hucha'); await K('Tintinea. Somos ricas, abuela.'); },
      usar: 'No tiene tapón. Los cerdos de aquí son de un solo uso.',
      con: { mortero: async () => { flag('hucha_cogida', 1); give('hucha'); await romperHucha(); }, palo: 'Con un palo se me escapa rodando. Tiene instinto de supervivencia.' } },
    { id: 'caballete', name: 'caballete', rect: [274, 60, 30, 58], walk: [270, 134], face: 1,
      mirar: 'Un caballete con un lienzo en blanco. Mi abuela pintaba. O lo intentaba. Lo de intentarlo viene de familia.', coger: 'Tres patas, cero ruedas. No viaja conmigo.' },
    { id: 'radio', name: 'radio antigua', rect: [264, 44, 30, 16], walk: [262, 131], face: 1,
      mirar: 'Una radio de válvulas. Seguro que sigue sintonizando 1962.', usar: 'Solo hace un zumbido. O es la radio, o es el calor.', coger: 'Pesa como un piano pequeño.' },
    { id: 'espejo', name: 'espejo', rect: [96, 34, 22, 46], walk: [107, 131],
      mirar: 'Estoy roja. Y tengo algo de la chica del cuadro. Los ojos, creo.', usar: 'Me arreglo el pelo. El pelo no colabora: hay un noventa por ciento de humedad.' },
    { id: 'colcha', name: 'colcha de ganchillo', rect: [6, 90, 84, 36], walk: [60, 134], face: -1,
      mirar: 'Alguien tardó un invierno entero en tejerla. Aunque aquí, ¿qué invierno?', coger: 'Está donde ella la dejó. Ahí se queda.', usar: 'Si me tumbo ahora, me despierto en septiembre.' },
    { id: 'reja_dentro', name: 'reja', rect: [16, 28, 44, 58], walk: [60, 134], face: -1,
      mirar: 'La reja por dentro. Desde aquí se veía pasar la vida. Y a los cenacheros, supongo.' },
    { id: 'telaranas', name: 'telarañas', rect: [0, 8, 18, 16],
      mirar: 'Sesenta años de polvo y telarañas. En mi país esto ya sería suelo fértil.', coger: 'Ya me llevo bastante polvo puesto.' },
    { id: 'salida', name: 'puerta a la calle', rect: [304, 44, 16, 76], walk: [298, 134],
      exit: () => goRoom('calle', 206, 154, 1), mirar: 'La calle. Farolillos, calor y una vecina que ya lo sabe todo.' }
  ]
};

/* ---------- arranque ---------- */
window.startGame = async function (fresh) {
  if (fresh) { G.room = 'calle'; G.k.x = 84; G.k.y = 156; G.inv = ['cuaderno']; renderInv(); $('#roomname').textContent = Rooms.calle.name; }
  if (!flag('intro')) await intro();
};
function loadAssets(done) {
  Rooms.casa.bg = drawCasa(); if (window.buildAct2Art) window.buildAct2Art();
  const jobs = (window.ExtraAssets || []).concat([['assets/calle.png', im => { Rooms.calle.bg = im; }, () => { Rooms.calle.bg = drawCalle(); }], ['assets/patio.png', im => { Rooms.patio.bg = im; }, () => { const [cv, c] = mk(W, H); R(c, 0, 0, W, H, '#e9e2cf'); R(c, 0, 108, W, 52, '#c9b48a'); Rooms.patio.bg = cv; }], ['assets/karen.png', im => { KarenSheet.img = im; }, () => {}]]);
  let left = jobs.length; const one = () => { if (--left === 0) done(); };
  jobs.forEach(([src, ok, ko]) => { const im = new Image(); im.onload = () => { ok(im); one(); }; im.onerror = () => { ko(); one(); }; im.src = src; });
}
window.addEventListener('DOMContentLoaded', () => loadAssets(boot));
