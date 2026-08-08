# GradientBackground

## `scrim` es la herramienta de contraste, y es del consumidor

Un gradiente recorre varios colores, así que **no tiene un único ratio de contraste**: el texto que es
AA sobre el primer stop puede fallar sobre el último. `pnpm check:contrast` evalúa cada stop de los
tokens (ADR-040), pero no puede saber qué texto vas a poner encima ni con qué rol.

`scrim` (0–1) interpone un velo de `colors.surface.base` entre el gradiente y el contenido: sube el
contraste sin cambiar la identidad cromática y funciona en los dos esquemas porque el velo es el propio
canvas del tema. Con `scrim={0.4}` un gradiente `brand` acepta `text.primary` en cualquiera de los
cuatro temas oficiales. Sin scrim, la única combinación segura es `text.onPrimary` sobre `brand`, que
es lo que ya hace `variantMap.gradient`.

No se calcula solo porque el componente no conoce el contenido: podría llevar un logo, un `Badge` o
nada.

## Qué NO degrada

Este componente **no** consulta `effects.glass.enabled`. Es la decisión del checkpoint de W4.1:
`glass.enabled` gobierna glass, blur y ruido —los tres materiales que cuestan compositor—, no los
gradientes. Un gradiente se neutraliza por sus **propios tokens**: un tema sobrio define `brand` como
`blue.700 → blue.500`, monocromo, y ahí acaba la degradación. Es la misma regla que ya seguía
`GradientText` desde W3.1.

Lo que sí lee de `glass` es el grano opcional, que es ruido y por tanto sí cae bajo esa palanca:
`grain` no pinta nada con `glass.enabled: false`.

## Orden de las capas

Raíz (`isolation: isolate`) con el gradiente como `background-image`; encima, en `z-index: -1`, el
scrim y luego el grano; encima de ambos, el contenido en flujo. Las dos capas decorativas van en
negativo por el mismo motivo que en `GlassSurface`: un absoluto con `z-index: auto` se pinta **después**
del contenido en flujo y taparía el texto.

En `forced-colors: active` el gradiente se sustituye por `Canvas` y las dos capas se ocultan: en alto
contraste no hay fondo decorativo que valga.
