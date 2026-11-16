# Malaguiri — El retrato borrado

Una aventura gráfica malagueña de apuntar y hacer clic.

**▶ [Jugar ahora](https://rpdaniels.github.io/Malaguiri/)**

Karen, una guiri escandinava, hereda de una abuela a la que no conoció una casa cerrada en el Perchel. Dentro hay un retrato con una cara borrada y una caja de música con forma de corazón. Para saber quién era el hombre del cuadro recorre una Málaga en plena Feria de Agosto, de fritura, jazmín y leyendas.

## Cómo se juega

- **Clic** en el escenario: Karen camina.
- **Verbo + clic**: Mirar, Coger, Usar, Hablar o Dar.
- **Clic derecho**: mirar, sin elegir verbo.
- **Inventario**: clic en un objeto y luego en otro (o en algo del escenario) para usarlos juntos. Dos clics sobre el mismo objeto lo usan solo.
- **Flechas amarillas** en los bordes: pasar a la pantalla de al lado.
- **Mapa** (botón o tecla M): ir directamente a cualquier sitio.

La partida se guarda sola en el navegador. En **Partidas** hay seis huecos para guardar y cargar puntos concretos, y un código para llevar la partida a otro dispositivo. «Empezar de nuevo» borra la partida en curso, no los huecos.

## Estructura

| Archivo | Contenido |
| --- | --- |
| `index.html` | Página, estilos e interfaz |
| `js/engine.js` | Motor: verbos, inventario, diálogos, mapa, guardado |
| `js/art.js`, `js/art2.js` | Fondos y personajes dibujados por código, iconos |
| `js/act1.js`, `js/act2.js`, `js/act3.js` | Los tres actos |
| `js/perchel.js`, `js/fondos2.js`, `js/rutas.js` | Calle del Perchel, fondos fotográficos y pasos entre pantallas |
| `js/charlas.js`, `js/salero.js` | Saludos, orden de las preguntas, chistes y curiosidades |
| `assets/` | Fondos a 320x160 y hoja de sprites de Karen |

No necesita compilación ni dependencias: basta con servir la carpeta.

## Créditos

Guion, personajes y arte de Rafa. Juego sin ánimo de lucro; los personajes son caricaturas de homenaje.
