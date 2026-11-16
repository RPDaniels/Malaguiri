/* El retrato borrado — Calle del Perchel: carnicería, hermandad, vecina y entrada al patio */
'use strict';
Rooms.perchel = {
  name: 'Calle del Perchel', scale: 1, bg: null, walk: { x1: 10, x2: 306, y1: 128, y2: 155 },
  draw(c) {
    Props.puerta(c, false);
    // placa de la hermandad sobre la puerta
    R(c, 132, 30, 48, 17, '#f3f6fb'); R(c, 132, 30, 48, 1, '#2f62b0'); R(c, 132, 46, 48, 1, '#2f62b0'); R(c, 132, 30, 1, 17, '#2f62b0'); R(c, 179, 30, 1, 17, '#2f62b0');
    text35(c, 'HERMANDAD', 138, 32, '#2f62b0'); for (let y = 39; y < 46; y += 2) R(c, 135, y, 42 - (y % 4) * 3, 1, '#6f8fd0');
    R(c, 154, 22, 4, 8, '#b8892e'); R(c, 152, 24, 8, 2, '#b8892e');
  },
  npcs: [
    { id: 'vecina', npc: true, name: 'vecina del balcón', x: 294, y: 48, h: 28, color: '#ffa9cf', back: true, sprite: Sprites.vecina, rect: [284, 22, 20, 26], walk: [280, 132], faceRow: 'up',
      mirar: 'Una señora me mira desde arriba. Ya sabe quién soy, de dónde vengo y cuánto me ha costado el vuelo.',
      hablar: () => dialog(() => [
        { id: 'vc_hola', text: 'Buenas tardes.', run: async () => { await say('vecina', '¿Tú eres la nieta de la Trini? Estás mu colorada, hija. Ponte yogur.'); await K('Lo apunto. Yogur. Por fuera, supongo.'); } },
        { id: 'vc_trini', text: '¿Conoció usted a mi abuela?', run: () => say('vecina', 'De vista y de oído, que es como se conoce aquí. Una mañana ya no estaba. Y en esa casa no volvió a entrar ni el cartero.') },
        { id: 'vc_patio', text: '¿Qué hay tras ese arco?', run: () => say('vecina', 'El patio de vecinos. Allí vive una que piensa mucho y dice poco. Lo contrario que yo, que ni falta que hace.') },
        { id: 'vc_herm', text: '¿De qué es esa hermandad?', run: () => say('vecina', 'De toda la vida. El nombre no me lo sé entero, y eso que salgo de mantilla desde chica.') },
        { id: 'vc_todo', text: '¿Usted lo ve todo desde ahí?', keep: true, run: () => say('vecina', rot('vc_todo', ['Yo no veo na, hija. Yo es que estoy aquí.', 'Ver, no. Enterarme, sí.', 'El del té lleva sesenta años en esa puerta. No digo más.'])) },
        { id: 'vc_abuelo', text: 'He encontrado a mi abuelo.', cond: () => flag('reconocido'), run: () => say('vecina', '¡Si lo sabía yo! Bueno, no lo sabía. Pero ahora que lo dices, lo sabía.') }
      ]),
      dar: { _: 'No llego al balcón. Y ella no piensa bajar: desde ahí lo controla todo.' } }
  ],
  hot: [
    { id: 'hermandad', name: 'puerta de la hermandad', rect: [130, 22, 52, 98], walk: [158, 129], faceRow: 'up',
      mirar: async () => { const n = (G.flags.herm = (G.flags.herm || 0) + 1); if (n === 2) return K('No pienso leerlo otra vez.'); await K('Hay una placa. Dice…'); await K('«Real, Muy Ilustre, Venerable y Antigua Hermandad Sacramental y Cofradía de Nazarenos…'); await K('…del Santísimo Cristo de la Santísima Paciencia Infinita, María Santísima de la Espera en su Mayor Dolor y Traspaso…'); await K('…San Pancracio Bendito y Santa Rita la que lo que se da no se quita' + (n > 2 ? ' y Ánimas».' : '».')); await K('Y debajo pone: «Llamar fuerte».'); await say('vecina', '¡Y eso que es el nombre corto, hija!'); },
      usar: 'Llamo fuerte. Nadie abre. Están todos en la Feria, incluida la Paciencia Infinita.', coger: 'Es la puerta de una cofradía. Hay robos que no se perdonan ni en confesión.' },
    { id: 'carniceria', name: 'carnicería', rect: [0, 44, 98, 76], walk: [50, 130], faceRow: 'up',
      mirar: ['Carnicería «Cristo de la Epidemia». En mi país esto lo cerraría Sanidad solo por el rótulo.', 'Oferta: chuletas de la Epidemia a mitad de precio. Hoy no tengo hambre.'],
      coger: 'Los jamones están colgados, vigilados y bendecidos.', usar: 'Cerrado por Feria. «Volvemos cuando se acabe el Cartojal».', hablar: 'Le hablo al jamón del escaparate. Me mira con la serenidad de quien ya está curado.' },
    { id: 'arco', name: 'arco del patio', rect: [234, 48, 26, 72], walk: [247, 129], faceRow: 'up', exit: () => goRoom('patio', 160, 114, 1, 'down'),
      mirar: 'Un arco con un azulejo que dice «Patio». Dentro se ve verde, sombra y mucha buganvilla.' },
    { id: 'reja_p', name: 'reja con jazmines', rect: [186, 44, 42, 58], walk: [206, 129], faceRow: 'up',
      mirar: 'Una reja con un jazmín. En esta calle todas las ventanas huelen a algo y miran a alguien.', coger: 'Estos tienen dueña, y la dueña tiene balcón.' },
    { id: 'a_casa', name: 'callejón a la casa de la abuela', rect: [306, 62, 14, 98], walk: [304, 142], exit: () => goRoom('calle', 28, 156, 1),
      mirar: 'El callejón que lleva a la casa de mi abuela. Se ve la buganvilla desde aquí.' },
    { id: 'p_ciudad', name: 'salir a la ciudad (mapa)', rect: [0, 122, 12, 38], walk: [12, 142], when: () => flag('casa_abierta'),
      exit: async () => { G.after = async () => openMap(); }, mirar: 'Por ahí se sale al resto de Málaga. Todo a diez minutos, dicen.' },
    { id: 'balcon_p', name: 'balcón', rect: [272, 22, 44, 42], mirar: 'Un balcón con geranios y vigilancia las veinticuatro horas.' },
    { id: 'farolillos_p', name: 'farolillos', rect: [0, 12, 320, 16], mirar: 'Farolillos de papel. La calle entera está de cumpleaños.', coger: 'Están muy altos y muy contentos ahí.' }
  ]
};
const _b2 = window.buildAct2Art; window.buildAct2Art = function () { _b2(); Rooms.perchel.bg = drawCalle({ sinMaleta: true }); };
