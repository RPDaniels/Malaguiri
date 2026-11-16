/* El retrato borrado — conversaciones naturales: primero se saluda, y cada pregunta sale cuando tiene sentido */
'use strict';
(function () {
  const who = (room, id) => Rooms[room].npcs.find(n => n.id === id);
  function saludo(room, id, saludos, intro, pide) {
    const n = who(room, id), old = n.hablar;
    n.hablar = async () => {
      if (!flag('con_' + id) && (!pide || pide())) {
        G.saludando = true; const r = await ask(saludos.concat(['(Mejor no molestar.)'])); G.saludando = false;
        if (r === saludos.length) return;
        await K(saludos[r]); await intro(r); flag('con_' + id, 1); save();
      }
      return old();
    };
  }
  const S2 = (w, t) => say(w, t);

  saludo('patio', 'maria', ['Buenas tardes.', 'Perdone, ¿vive usted aquí?'], async () => { await S2('maria', 'Pasa, hija, pasa. Aquí la sombra es de todos.'); await S2('maria', 'Yo soy María. Tú eres la de la maleta que chirría.'); });
  saludo('perchel', 'vecina', ['Buenas tardes.', '¡Hola! ¿Vive usted ahí arriba?'], async () => { await S2('vecina', '¿Tú eres la nieta de la Trini? Estás mu colorada, hija. Ponte yogur.'); await K('Lo apunto. Yogur. Por fuera, supongo.'); });
  saludo('kent', 'victoria', ['Buenas tardes.', '¿Qué vende usted aquí?'], async () => { await S2('victoria', 'Camperos. Conforme al artículo primero de esta plancha, el campero lleva de todo.'); });
  saludo('merced', 'pablo', ['Buenos días. ¿Es usted pintor?', 'Bonito cuadro.'], async () => { await S2('pablo', 'Pintor. Eso dicen. Mira: una paloma.'); await S2('pablo', 'Ayer, una paloma. Mañana, me temo, una paloma.'); }, () => !flag('pablo_inspirado'));
  saludo('soho', 'antonio', ['Buenas noches.', 'Perdone, ¿trabaja usted aquí?'], async () => { await S2('antonio', '¿Trabajar? Bienvenida a mi teatro. Y a mi calle. Y esa nube de ahí, casi.'); });
  const imp = async () => { await S2('manolo', 'Carteles de…'); await S2('emilio', '…Feria, versos…'); await S2('manolo', '…y esquelas, que también riman.'); await S2('emilio', 'Pero hoy, nada.'); await S2('manolo', 'Estamos parados.'); flag('con_manolo', 1); flag('con_emilio', 1); };
  saludo('imprenta', 'manolo', ['Buenas tardes.', '¿Qué imprimen aquí?'], imp); saludo('imprenta', 'emilio', ['Buenas tardes.', '¿Qué imprimen aquí?'], imp);
  saludo('puerto', 'ernesto', ['Buenas tardes.', '¿Es suyo ese barco?'], async () => { await S2('ernesto', 'No es mío. Pero no sale sin mí. Y yo no subo.'); });
  saludo('caleta', 'marisol', ['Hola, bonita.', '¿Estás bien?'], async () => { await S2('marisol', '*(llorando y cantando)* ¡Nooo-o-o-oh!'); }, () => !flag('pelota_dada'));
  saludo('catedral', 'jesus', ['Buenas tardes, padre.', 'Perdone, ¿es usted cura?'], async () => { await S2('jesus', '¡Fraile, hermana! ¡Desde hace poco!'); await S2('jesus', 'Antes construía. Mucho. Donde ve usted ese monte había otro monte.'); });
  saludo('larios', 'rafael', ['Buenas tardes.', '¿Se encuentra bien?'], async () => { await S2('rafael', 'Perfectamente, señorita. Solo tengo un ángel en el bolsillo y un demonio en la…'); await S2('rafael', '*(otra voz)* …en la sintaxis. Ese adjetivo sobra.'); }, () => !flag('tiene_libro'));
  saludo('botanico', 'pablob', ['Hola. ¿Toca usted en la boda?', 'Qué cara trae. ¿Va todo bien?'], async () => { await S2('pablob', 'Tocaría. Pero tengo la guitarra como mi corazón en febrero: desafinada.'); await S2('pablob', 'Y el afinador, sin pilas.'); }, () => !flag('tiene_acorde'));
  saludo('chiringuito', 'kanka', ['Buenas.', '¿Usted toca?'], async () => { await S2('kanka', 'Toco, canto y comento. Sobre todo comento.'); });
  saludo('chiringuito', 'mari', ['Buenas tardes.', 'Perdone que la despierte.'], async () => { await S2('mari', 'No duermo, corazón. Descanso los ojos, que es más fino.'); });
  saludo('pirimpi', 'dani', ['Buenas.', '¿Está abierto?'], async () => { await S2('dani', 'Para ti, siempre. Soy Dani. ¿Qué te pongo, guapa?'); });
  saludo('pirimpi', 'chiquito', ['Buenas tardes.', 'Perdone, ¿es usted Chiquito?'], async () => { await S2('chiquito', '¡Fistro! ¡Pecadora! ¡Jarl!'); await K('Lo tomaré como un sí.'); }, () => !flag('vino_dado') && !flag('tiene_secreto'));
  saludo('mercado', 'chanquete', ['Buenos días.', '¿Qué tiene de bueno hoy?'], async () => { await S2('chanquete', 'To, niña. Pero tú lo que necesitas es comer, que estás muy flaca.'); }, () => !(flag('tiene_secreto') && flag('caja_abierta')));

  Object.assign(OptPatch, {
    g_llave: { req: () => flag('puerta_probada') }, g_dentro: { req: () => flag('puerta_probada') },
    m_puerta: { req: () => flag('puerta_probada'), text: 'Necesito abrir la puerta de mi abuela. Está atascada.' }, m_claro: { req: () => flag('oraculo_dicho') },
    m_retrato: { req: () => has('retrato') }, m_caja: { req: () => has('caja') }, m_abuelo: { req: () => flag('carta_leida') },
    vc_hola: { drop: true }, vc_herm: { req: () => G.flags.herm > 0 },
    v_setas: { req: () => flag('seta_vista') || has('seta'), text: 'He visto unas setas en el Parque. ¿Sabe de setas?' }, v_pintor: { req: () => has('retrato'), text: 'Busco a un pintor. ¿Conoce a alguno?' }, v_gafas2: { text: '¿Y si se quitara las gafas?' },
    pp_que: { drop: true }, pp_correcta: { after: () => { flag('pp_abrir', 1); } }, pp_hambre: { req: () => flag('pp_abrir'), text: '¿Y qué le abriría la cabeza? ¿Tiene hambre?' }, pp_retrato: { req: () => has('retrato'), text: 'Traigo un retrato. ¿Puede mirarlo?' },
    an_suyo: { drop: true }, an_pirimpi: { req: () => flag('vis_pirimpi') }, an_obra: { text: '¿Qué estrenan hoy?' },
    i_que: { drop: true }, i_parada: { text: '¿Por qué están parados?' }, i_versos: { text: 'Traigo dos versos grabados en una caja. ¿Les suenan?' },
    e_embarca: { text: '¿Por qué no sube?', after: () => { flag('e_frase', 1); } }, e_escribe: { req: () => flag('e_frase'), text: '¿Qué está escribiendo?' }, e_retraso: { req: () => flag('e_frase'), text: 'Pero el barco lleva retraso por usted.' }, e_pesca: { text: '¿Qué pesca con una caña sin anzuelo?' }, e_pirimpi: { req: () => flag('vis_pirimpi') }, e_pelota: { req: () => flag('pelota_sabe') },
    ma_lloras: { after: () => { flag('pelota_sabe', 1); } }, ma_otra: { req: () => flag('pelota_sabe') }, ma_como: { req: () => flag('pelota_sabe') }, ma_cenachero: { req: () => has('caja') }, ma_cantar: { text: '¿Puedes llorar sin cantar a la vez?' },
    j_fraile: { drop: true }, j_pecados: { text: '¿Y qué pecados cometió construyendo?' },
    r_bien: { drop: true }, r_quien: { text: '¿Quién ha dicho eso?' }, r_libro: { text: '¿Qué es eso del ángel en el bolsillo?' },
    pb_pasa: { drop: true }, pb_notas: { text: '¿Y no puede afinarla de oído?' }, pb_casa: { text: '¿Quién se casa?' },
    ka_toca: { drop: true }, ka_barca: { req: () => flag('mari_pide'), text: '¿Puedo usar la barca para hacer un espeto?' },
    mr_copla: { text: '¿Conoce una canción que se llama «Cuatro cosas»?' },
    d_hielo: { text: '¿Y dónde consigo yo hielo?' }, d_posa: { text: '¿Puedo llevarme un posavasos de recuerdo?' },
    cq_es: { drop: true }, cq_abuelo: { req: () => flag('carta_leida'), text: 'Mi abuela escribió que conoció a mi abuelo «de Chiquito». ¿Sabe usted algo?' },
    c_bueno: { drop: true }, c_casado: { req: () => flag('c_cenacho') }, c_quien: { text: 'Antes dijo que le recuerdo a alguien. ¿A quién?' }, c_lleva: { text: '¿Lleva mucho tiempo en este puesto?' }
  });
})();

/* ---------- lo pendiente no se agota: las preguntas que llevan a una tarea siguen ahí hasta resolverla ---------- */
(function () {
  const P = (id, patch) => Object.assign(OptPatch[id] = OptPatch[id] || {}, patch);
  const sigue = (id, mientras) => P(id, { keep: true, req2: mientras });
  // req2 se combina con req en un solo requisito
  const comb = id => { const o = OptPatch[id], a = o.req, b = o.req2; if (b) { o.req = a ? () => a() && b() : b; delete o.req2; } };
  [
    ['g_llave', () => !flag('casa_abierta')], ['m_biznaga', () => !flag('mortero_dado')], ['m_jazmines', () => !flag('mortero_dado')], ['vc_patio', () => !flag('mortero_dado')],
    ['v_setas', () => !flag('pablo_inspirado')], ['v_pintor', () => !flag('fondo_restaurado')],
    ['pp_correcta', () => !flag('pablo_inspirado')], ['pp_hambre', () => !flag('pablo_inspirado')], ['an_coctel', () => !flag('salsa_cogida')],
    ['i_parada', () => !flag('tintero_lleno')], ['i_poema', () => has('poema')], ['e_embarca', () => true], ['e_pelota', () => true],
    ['ma_lloras', () => !flag('pelota_dada')], ['ma_cenachero', () => !flag('tiene_secreto')],
    ['pb_acorde', () => !flag('tiene_acorde')], ['ka_mari', () => !flag('acorde_dado')], ['ka_donde', () => !flag('tiene_acorde')], ['ka_barca', () => !flag('mari_lista')],
    ['d_chiquito', () => !flag('tiene_secreto')], ['d_hielo', () => !flag('vino_dado')], ['cq_abuelo', () => true], ['c_busco', () => !flag('reconocido')]
  ].forEach(([id, m]) => { sigue(id, m); comb(id); });

  const nota = t => addNote(t), S3 = (w, t) => say(w, t);
  Object.assign(ExtraOpts, {
    geraldo: { text: '¿Necesita usted algo?', run: () => S3('geraldo', flag('casa_abierta') ? 'Nada. Mi encargo está cumplido. Ahora el té me lo tomo por gusto.' : 'Que abra usted esa puerta. Llevo sesenta años esperando a que alguien lo haga. La señora del patio sabe de cerraduras, a su manera.') },
    maria: { text: '¿Necesita usted algo?', run: async () => { if (flag('mortero_dado')) return S3('maria', 'Nada. Tengo sombra, gato y tabaco. Pregúntame por lo tuyo.'); await S3('maria', 'Una biznaga, hija: jazmines clavados uno a uno en un tallo seco. Sin ella no pienso.'); flag('pidio_biznaga', 1); nota('Doña María quiere una biznaga: jazmines clavados en un tallo seco.'); } },
    vecina: { text: '¿Necesita usted algo?', run: () => S3('vecina', 'Que me cuentes cosas, hija. Yo desde aquí veo, pero no oigo bien.') },
    victoria: { text: '¿Necesita usted algo?', run: () => S3('victoria', 'Que me paguen los camperos. Y que nadie mire debajo de la chaqueta.') },
    pablo: { text: '¿Necesita usted algo?', run: async () => { if (!flag('pablo_inspirado')) { await S3('pablo', 'Algo que me abra la cabeza. Y de paso el estómago: un campero de la Victoria, pero con algo especial dentro.'); nota('Don Pablo quiere un campero «con algo especial dentro» que le abra la cabeza.'); } else if (!flag('fondo_restaurado')) await S3('pablo', 'Algo que mirar con estos ojos nuevos. ¿No llevabas un cuadro?'); else await S3('pablo', 'Nada, niña. Ya lo veo todo. Demasiado, incluso.'); } },
    antonio: { text: '¿Necesita usted algo?', run: async () => { if (flag('entrada')) return S3('antonio', 'Que disfrutes. Y que pruebes el cóctel.'); await S3('antonio', 'Arte para el vestíbulo. Un don Pablo: cualquier cosa que firme el pintor de la Merced.'); nota('Antonio quiere algo firmado por don Pablo, el pintor de la Merced.'); } },
    manolo: { text: '¿Necesitan ustedes algo?', run: () => necImprenta() }, emilio: { text: '¿Necesitan ustedes algo?', run: () => necImprenta() },
    ernesto: { text: '¿Necesita usted algo?', run: async () => { await S3('ernesto', 'Una última frase. Un final verdadero. Si lo traes escrito, dámelo.'); nota('Don Ernesto quiere un final escrito para su libro.'); } },
    marisol: { text: '¿Qué necesitas?', run: () => S3('marisol', flag('pelota_dada') ? 'Nada. Ya tengo mi No-vea.' : flag('barco_zarpado') ? '¡Mi pelota! ¡Mírala, en la orilla!' : '¡Mi pelota! Está con el barco gordo. Hasta que no se vaya, no vuelve.') },
    jesus: { text: '¿Necesita usted algo?', run: async () => { if (flag('tiene_nombre')) return S3('jesus', '¡Nada, hermana! ¡Ya tengo a mi Victoria!'); await S3('jesus', '¡Una estampita de la Virgen de la Victoria! Perdí la mía en una recalificación.'); await S3('jesus', 'A quien me la traiga le confieso lo que quiera. Y sé cosas de demonios, hermana.'); flag('jesus_pide', 1); nota('Fray Jesús quiere una estampita de la Victoria. A cambio confiesa lo que sea; sabe de demonios.'); } },
    rafael: { text: '¿Necesita usted algo?', run: async () => { if (flag('tiene_libro')) return S3('rafael', 'Paz. Y ya la tengo.'); await S3('rafael', 'Que alguien llame a este demonio por su nombre. Yo no me lo sé, y él no lo dice.'); await S3('rafael', 'Eso lo sabrá un fraile.'); flag('rafael_pide', 1); nota('Don Rafael necesita que llamen a su demonio por su nombre. Lo sabrá un fraile.'); } },
    pablob: { text: '¿Necesitas algo?', run: async () => { if (flag('tiene_acorde')) return S3('pablob', 'Nada. Que no se acabe el vals.'); await S3('pablob', 'Afinar. Me faltan las notas de las seis cuerdas. Venían en un libro de ángeles, de un poeta de calle Larios.'); flag('pablo_pide', 1); nota('Pablo necesita las notas de las seis cuerdas: están en un libro de ángeles de un poeta de calle Larios.'); } },
    kanka: { text: '¿Necesitas algo?', run: async () => { if (flag('acorde_dado')) return S3('kanka', 'Nada. Yo ya solo comento.'); await S3('kanka', 'Un acorde que se me fue. El de una copla vieja, uno con mucho sol. Pablo, el de las bodas, se los sabe todos.'); flag('kanka_pide', 1); nota('El Kanka necesita un acorde «con mucho sol». Pablo, el de las bodas, en el Botánico, se los sabe todos.'); } },
    mari: { text: '¿Necesita usted algo?', run: () => S3('mari', flag('tiene_letra') ? 'Nada, corazón. Yo ya he comido y he cantado.' : flag('mari_lista') ? 'Que este encuentre su acorde. Yo estoy.' : 'Un espetito, corazón. Sardina, palo y brasa. Con el estómago vacío no hago nada.') },
    dani: { text: '¿Y tú necesitas algo?', run: async () => { await S3('dani', 'Que te quedes un rato. Y hielo, que no me queda ni para un remedio.'); flag('sin_hielo', 1); } },
    chiquito: { text: '¿Necesita usted algo?', run: async () => { await S3('chiquito', '*(se señala la garganta y hace el gesto de beberse algo pequeñito y muy frío)* ¡Fistro!'); await K('Creo que tiene sed. De algo concreto. El camarero sabrá de qué.'); } },
    chanquete: { text: '¿Necesita usted algo?', run: () => S3('chanquete', 'Que comas, niña. Y que vuelvas mañana, que me alegras el puesto.') }
  });
  async function necImprenta() {
    const d = async (...l) => { for (let i = 0; i < l.length; i++) await S3(i % 2 ? 'emilio' : 'manolo', l[i]); };
    if (!flag('tintero_lleno')) { await d('Tinta.', 'Negra.', 'Que manche.'); nota('Los impresores necesitan tinta negra, o algo que manche igual.'); }
    else if (!flag('versos_reconocidos')) await d('Algo que imprimir.', '¿No llevabas unos versos grabados en algo?');
    else if (!flag('poema_impreso')) await d('Que alguien componga el poema en la caja de tipos.', 'Nosotros solo discutimos.');
    else await d('Nada.', 'Bueno, ganar la discusión.');
  }
  // quién está hablando, para añadirle su «¿Necesita algo?»
  Object.keys(Rooms).forEach(r => (Rooms[r].npcs || []).forEach(n => { if (!n.npc || typeof n.hablar !== 'function' || !ExtraOpts[n.id]) return; const old = n.hablar; n.hablar = async () => { G.dialogWho = n.id; try { await old(); } finally { G.dialogWho = null; } }; }));
})();
