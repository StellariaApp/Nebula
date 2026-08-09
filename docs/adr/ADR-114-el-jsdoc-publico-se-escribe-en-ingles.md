# ADR-114 — El JSDoc público se escribe en inglés

- **Estado**: aceptada · 2026-08-08 (decisión del propietario al definir la web pública) · **W5 · DS**
- **Cambia API pública**: no cambia tipos ni runtime. Cambia el idioma de lo que el consumidor lee.
- **Enmienda [ADR-105](ADR-105-el-jsdoc-de-api-publica-no-es-un-comentario.md)**, que sigue vigente en
  todo lo demás: qué se documenta, qué no, y por qué el `.md` cubre otra cosa.
- Responde la **pregunta abierta #1** de la fase DS.

## Contexto

ADR-105 fijó que el JSDoc sobre un miembro de un tipo público **no es un comentario: es documentación
que se publica**. Viaja al `.d.ts`, sale en el autocompletado del editor y alimenta las fichas del
sitio.

Y ahí está el problema que ADR-105 no tenía por qué ver: **el `.d.ts` no se puede traducir**. El sitio
tiene i18n montada entera y añadir un idioma es añadirlo a `LANGS` (ADR-110). El autocompletado del
consumidor no tiene esa salida: lo que se publica es un solo texto, y hoy está en español.

Con [ADR-113](ADR-113-el-nucleo-es-mit-y-los-dominios-se-venden.md) el núcleo sale **público y MIT**,
con estrategia de adopción externa. Eso convierte una cuestión de estilo en una de producto.

**Es la única parte de esta decisión que se encarece con el tiempo.** Hoy son ~70 contratos con
JSDoc; cada tanda que se documente en español es trabajo que habrá que rehacer.

## Decisión

**El JSDoc sobre API pública se escribe en inglés.** Alcanza a todo lo que viaja al `.d.ts`: miembros
de tipos exportados, props de ranura y firmas de funciones exportadas.

**El resto de la documentación interna sigue en español**, sin cambios: `docs/`, los ADRs, los
`<Nombre>.md` de mantenimiento y los cuadernos de revisión. Es la misma frontera que ya aplica el
sitio —público en inglés, interno en español— y no se mueve.

El criterio de ADR-105 sobre **qué** se escribe no cambia: lo que el tipo no puede decir —sobre qué
nodo cae, cuándo no aplica, si se comparte, qué gana a qué en el orden del esparcido— y nunca una
paráfrasis del nombre.

## Alternativas descartadas

**Dejarlo en español.** Coherente si los consumidores reales son solo fonicredito y tfv. Se descarta
porque ADR-113 acaba de decidir lo contrario: un core MIT y público cuya adopción externa es
justamente lo que hace vendibles los paquetes de dominio. Un sitio en inglés con el autocompletado en
español es una costura visible en el primer minuto de uso.

**Bilingüe en el mismo JSDoc.** Duplica cada bloque, dobla el peso del `.d.ts` y deja al lector
saltando entre dos idiomas dentro de un tooltip. Ninguna librería del ecosistema lo hace.

**Traducir en el sitio y dejar el `.d.ts` en español.** El sitio ya puede hacerlo —lo generado pasa
por el diccionario—, pero no arregla el autocompletado, que es donde ADR-105 dijo que se lee de
verdad: «props que el consumidor lee **en el autocompletado de su editor**, no en un `.md` que no va
a abrir».

## Consecuencias

- **~70 contratos a traducir**, y el volumen crece con cada tanda. No bloquea nada: el JSDoc no es
  _breaking_ y se puede migrar por lotes.
- **Lo nuevo nace en inglés desde hoy.** Es la parte que evita que la deuda siga creciendo, y no
  cuesta nada.
- El **gate de documentación no cambia**: `check:docs` compara lo generado con el código, y le da
  igual el idioma.
- Los `<Nombre>.md` **no se traducen**. ADR-105 ya los separó del JSDoc por audiencia —«quien lo
  mantiene» frente a «el consumidor, al teclear»— y esa frontera es ahora también la del idioma.
- El diccionario del sitio (`apps/docs/i18n/`) es donde vive la prosa traducible. Si algún día hay
  español en el sitio, sale de ahí y no del `.d.ts`.
