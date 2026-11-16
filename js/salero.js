/* El retrato borrado — menos pistas y más salero: cada personaje dice lo que quiere, no lo que hay que hacer */
'use strict';
(function () {
  const T = (w, t) => say(w, t), nota = t => addNote(t);
  const duo = async (...l) => { for (let i = 0; i < l.length; i++) await T(i % 2 ? 'emilio' : 'manolo', l[i]); };
  OptPatch.ka_donde = Object.assign(OptPatch.ka_donde || {}, { drop: true });

  /* «¿Necesita algo?»: solo el deseo */
  const nec = (id, run) => { ExtraOpts[id].run = run; };
  nec('geraldo', () => T('geraldo', flag('casa_abierta') ? 'Nada. Mi encargo está cumplido. Ahora el té me lo tomo por gusto.' : 'Que alguien abra esa puerta. Llevo sesenta años de guardia y el té solo se me enfría una vez al día.'));
  nec('maria', async () => { if (flag('mortero_dado')) return T('maria', 'Nada. Tengo sombra, gato y tabaco. Lo demás son complementos.'); await T('maria', 'Una biznaga, hija. Sin ella no pienso; si no pienso, me aburro; y si me aburro, opino.'); flag('pidio_biznaga', 1); nota('Doña María quiere una biznaga.'); });
  nec('pablo', async () => { if (!flag('pablo_inspirado')) { await T('pablo', 'Algo que me abra la cabeza. Y algo de comer. Si fueran la misma cosa, me ahorraba un viaje.'); nota('Don Pablo quiere algo que le abra la cabeza. Y algo de comer.'); } else if (!flag('fondo_restaurado')) await T('pablo', 'Algo digno de mirarse con estos ojos nuevos. Las palomas ya me las sé.'); else await T('pablo', 'Nada, niña. Ya lo veo todo. Demasiado, incluso.'); });
  nec('antonio', async () => { if (flag('entrada')) return T('antonio', 'Que disfrutes. Y que hables bien de mí, que eso también es mío.'); await T('antonio', 'Arte para el vestíbulo. Del que lleva firma. Lo compraría yo, pero ya me he gastado el mes en la calle.'); nota('Antonio quiere arte con firma para su vestíbulo.'); });
  const imp = async () => { if (!flag('tintero_lleno')) { await duo('Tinta.', 'Negra.', 'Que manche.'); nota('Los impresores quieren tinta.'); } else if (!flag('versos_reconocidos')) await duo('Algo que imprimir.', 'Versos, a ser posible.', 'Los carteles nos tienen fritos.'); else if (!flag('poema_impreso')) await duo('Manos.', 'Las nuestras están ocupadas…', '…discutiendo.'); else await duo('Nada.', 'Bueno, ganar la discusión.'); };
  nec('manolo', imp); nec('emilio', imp);
  nec('ernesto', async () => { await T('ernesto', 'Una última frase. Verdadera. Las falsas ya las he escrito todas.'); nota('Don Ernesto quiere una última frase, verdadera, para su libro.'); });
  nec('marisol', () => T('marisol', flag('pelota_dada') ? 'Nada. Ya tengo mi No-vea.' : '¡Mi pelota! ¡Se la ha llevado la mar!'));
  nec('jesus', async () => { if (flag('tiene_nombre')) return T('jesus', '¡Nada, hermana! ¡Ya tengo a mi Victoria!'); await T('jesus', '¡Una estampita de la Virgen de la Victoria! Perdí la mía en una recalificación.'); await T('jesus', 'A quien me la traiga le confieso lo que quiera. Y tengo mucho que confesar, hermana.'); flag('jesus_pide', 1); nota('Fray Jesús quiere una estampita de la Virgen de la Victoria.'); });
  nec('rafael', async () => { if (flag('tiene_libro')) return T('rafael', 'Paz. Y ya la tengo. Ahora echo de menos las erratas.'); await T('rafael', 'Silencio. Que alguien llame a este inquilino por su nombre y lo eche.'); await T('rafael', '*(otra voz)* No me pienso presentar. Es de mala educación preguntar.'); flag('rafael_pide', 1); nota('Don Rafael quiere que alguien llame a su demonio por su nombre.'); });
  nec('pablob', async () => { if (flag('tiene_acorde')) return T('pablob', 'Nada. Que no se acabe el vals, que luego viene la conga.'); await T('pablob', 'Afinar. Me faltan las notas de las seis cuerdas. Sin eso, lo mío no es una balada: es una denuncia.'); flag('pablo_pide', 1); nota('Pablo quiere saber las notas de las seis cuerdas de su guitarra.'); });
  nec('kanka', async () => { if (flag('acorde_dado')) return T('kanka', 'Nada. Yo ya solo comento.'); await T('kanka', 'Un acorde que se me fue. El de una copla vieja. Uno con mucho sol.'); flag('kanka_pide', 1); nota('El Kanka quiere recordar un acorde «con mucho sol».'); });
  nec('mari', () => T('mari', flag('tiene_letra') ? 'Nada, corazón. Yo ya he comido y he cantado.' : flag('mari_lista') ? 'Que este se acuerde de tocar. Yo estoy.' : 'Un espetito, corazón. Con el estómago vacío no canto ni por soleares.'));
  nec('dani', async () => { await T('dani', 'Hielo. Y que te quedes un rato, pero eso ya es vicio mío.'); flag('sin_hielo', 1); });
  nec('chiquito', async () => { await T('chiquito', '*(se señala la garganta y hace el gesto de beberse algo pequeñito y muy frío)* ¡Fistro!'); await K('Creo que tiene sed. De algo muy concreto.'); });

  /* Preguntas de color: chistes, ironías y curiosidades. Se gastan al usarlas. */
  const mas = (id, list) => { MasOpts[id] = list.map(([oid, text, run, cond]) => ({ id: oid, text, run, cond })); };
  mas('geraldo', [
    ['x_g1', '¿Por qué se quedó usted en Málaga?', () => T('geraldo', 'Vine a pasar un invierno. Me dijeron que aquí no había. Tenían razón, y sigo esperándolo.')],
    ['x_g2', '¿Qué es exactamente un «guiri»?', async () => { await T('geraldo', 'Un forastero que todavía se sorprende. Yo dejé de serlo el día que pedí un «mitad» sin mirar el azulejo.'); await K('No he entendido nada de esa frase.'); await T('geraldo', 'Exacto. Guiri.'); }]
  ]);
  mas('maria', [
    ['x_m1', '¿Qué lee usted?', () => T('maria', 'El mundo. Viene sin índice y con muchas erratas.')],
    ['x_m2', '¿Qué es el terral?', () => T('maria', 'Un viento que baja de tierra adentro a recordarnos que el infierno es de secano. Cuando sopla, Málaga entera se pone de acuerdo en algo: en quejarse.')],
    ['x_m3', '¿No le molesta el humo al gato?', () => T('maria', 'El gato es estoico. Yo soy más de la escuela del tabaco.')]
  ]);
  mas('vecina', [
    ['x_v1', '¿Qué se celebra en la Feria?', () => T('vecina', 'Que en 1487 entraron aquí los Reyes Católicos. Fíjate tú: quinientos años celebrando una mudanza.')],
    ['x_v2', '¿Por qué hay tantos farolillos?', () => T('vecina', 'Porque si no, no se sabría que es Feria. Bueno, sí: por el ruido, el olor a fritura y mi cuñado.')]
  ]);
  mas('victoria', [
    ['x_k1', '¿Qué es exactamente un campero?', async () => { await T('victoria', 'Jamón cocido, queso, lechuga, tomate y mayonesa en un mollete redondo, a la plancha. Invento malagueño.'); await T('victoria', 'Lo demás son sándwiches con pretensiones. Consta en acta.'); }],
    ['x_k2', '¿Usted antes era abogada?', () => T('victoria', 'Fui la primera en muchas cosas. Ahora soy la primera en encender la plancha. Se llama conciliación.')]
  ]);
  mas('pablo', [
    ['x_p1', '¿Por qué siempre palomas?', () => T('pablo', 'Mi padre pintaba palomas y me dejaba acabarles las patas. Desde entonces no he levantado cabeza. Ni ellas el vuelo.')],
    ['x_p2', '¿Nació usted en esta plaza?', () => T('pablo', 'En aquella esquina. Luego me fui fuera a hacerme famoso. Volver es lo difícil: aquí todo el mundo me recuerda de chico.')]
  ]);
  mas('antonio', [
    ['x_a1', '¿Por qué volvió a Málaga?', async () => { await T('antonio', 'Porque en Hollywood nadie sabe lo que es un pitufo mixto.'); await K('¿Un… pitufo?'); await T('antonio', 'Un bocadillo pequeño. Jamón y queso. Aquí se desayuna así. Es lo único azul que no sale en los estudios.'); }],
    ['x_a2', '¿No se cansa de saludar?', () => T('antonio', 'Si paro, creen que estoy rodando una de autor.')]
  ]);
  const impCol = [
    ['x_i1', '¿Desde cuándo imprimen?', () => duo('Desde el 27.', 'Nos llamaron «generación».', 'Éramos una imprenta con amigos.', 'Que es lo mismo, pero con tinta.')],
    ['x_i2', '¿Cómo los distingo a ustedes dos?', () => duo('Yo soy el serio.', 'Yo soy el serio.', '¿Ves?')]
  ];
  mas('manolo', impCol); mas('emilio', impCol);
  mas('ernesto', [
    ['x_e1', '¿Le gusta Málaga?', () => T('ernesto', 'Vine por los toros. Me quedé por el vino. Es una ciudad que no corrige a nadie. Eso es raro. Eso es bueno.')],
    ['x_e2', '¿Qué es «el melillero»?', () => T('ernesto', 'El barco de Melilla. Sale cada noche desde hace cien años. Menos estas tres semanas. Asumo la responsabilidad. No la culpa.')]
  ]);
  mas('marisol', [
    ['x_s1', '¿Qué cantas?', () => T('marisol', 'Lo que salga. Mi madre dice que nací afinada y con hambre.')]
  ]);
  mas('jesus', [
    ['x_j1', '¿Por qué la llaman «la Manquita»?', async () => { await T('jesus', '¡Porque le falta un brazo, hermana! El dinero de la segunda torre se fue a otra cosa.'); await T('jesus', 'Dicen que a ayudar a la independencia de los Estados Unidos. ¡Y luego el de las recalificaciones soy yo!'); }],
    ['x_j2', '¿Echa de menos su vida de antes?', () => T('jesus', '¡El helicóptero, hermana! Aquí todo es andando y en sandalias. Pero el alma, eso sí, la tengo reformada. A estrenar.')]
  ]);
  mas('rafael', [
    ['x_r1', '¿Qué escribe usted?', async () => { await T('rafael', 'Ángeles. Aforismos. Animales que no existen.'); await T('rafael', '*(otra voz)* Y facturas, que es lo único que le sale redondo.'); }, () => !flag('tiene_libro')],
    ['x_r2', '¿Esta calle siempre fue así?', () => T('rafael', 'La abrió un marqués para que corriera el aire del puerto. Es la única calle de Málaga trazada con regla. Por eso desentona: aquí lo demás se hizo a ojo y con arte.')]
  ]);
  mas('pablob', [
    ['x_b1', '¿Siempre canta tan bajito?', () => T('pablob', 'Si canto fuerte se me nota que estoy bien, y entonces no me creen.')],
    ['x_b2', '¿Cuántas bodas lleva este mes?', () => T('pablob', 'Catorce. En agosto se casa media Málaga y la otra media va de invitada. Luego en septiembre se devuelven los regalos.')]
  ]);
  mas('kanka', [
    ['x_c1', '¿Y qué comenta usted?', () => T('kanka', 'Que aquí hay nueve maneras de pedir un café y ninguna de pedir la cuenta.')],
    ['x_c2', '¿Qué es exactamente un espeto?', async () => { await T('kanka', 'Seis sardinas en una caña, clavada en la arena al lado de la brasa. Al lado, no encima: el que las pone encima es de Madrid.'); await T('kanka', 'Y solo en los meses sin erre. Agosto no tiene erre. Has venido bien.'); }]
  ]);
  mas('mari', [
    ['x_h1', '¿Cómo es vivir en El Palo?', () => T('mari', 'El Palo es un barrio de pescadores que se cree un pueblo. Y tiene razón, corazón. Los de Málaga, cuando vienen, dicen que «bajan a El Palo». Como quien va de excursión.')],
    ['x_h2', '¿No tiene calor en la hamaca?', () => T('mari', 'El calor es para quien se mueve. Yo hace años que lo dejé.')]
  ]);
  mas('dani', [
    ['x_d1', '¿Qué es el Cartojal?', () => T('dani', 'Moscatel, dulce, rosita y fresquito. Entra como un refresco y sale como una procesión. En Feria se bebe por litros y se lamenta por días.')],
    ['x_d2', '¿Por qué se llama «Pirimpi» esta taberna?', () => T('dani', 'Por los tipos que antiguamente se iban al puerto a recibir a los marineros y los traían a beber. Relaciones públicas, pero con boina.')],
    ['x_d3', '¿Qué es un «mitad»?', () => T('dani', 'Un café con la mitad de leche. Lo inventó un camarero harto de que le dijeran «un poquito menos, un poquito más». Hizo un azulejo y se acabó la tontería.'), () => flag('cafes_vistos')]
  ]);
  mas('chanquete', [
    ['x_q1', '¿Por qué le llaman Chanquete?', () => T('chanquete', 'Por un pescaíto tan chico, tan chico, que de tanto comérnoslo se acabó. Está prohibido. Me quedó el nombre, que ese no lo veda nadie.')],
    ['x_q2', '¿Qué es un boquerón?', async () => { await T('chanquete', 'Un pescao. Y un malagueño: así nos llaman.'); await T('chanquete', 'Los mejores son los victorianos, los chiquititos de septiembre, cuando la Virgen de la Victoria. Fritos en manojito, cogidos por la cola. Eso no se explica, niña: se come.'); }],
    ['x_q3', '¿Siempre regala el pescado?', () => T('chanquete', 'A las flacas, sí. Tengo un criterio.')]
  ]);
})();
