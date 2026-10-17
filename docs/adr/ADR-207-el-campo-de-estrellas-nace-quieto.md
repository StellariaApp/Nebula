# ADR-207 — El campo de estrellas nace quieto: animarlo se pide con `twinkle`

- **Estado**: **aceptada** · 2026-10-17 — pedida por el propietario (el panel de Vela calentaba el
  Mac) · **implementada** el mismo día.
- **Cambia API pública**: sí, **solo un valor por defecto**: `StarField.twinkle` pasa de `true` a
  `false`. No se añade ni se quita ninguna prop.
- **Dependencias nuevas**: **ninguna**.
- **Toca**: `packages/web/src/components/StarField/`, `apps/web/src/ui/site-background.tsx`, la
  preview de `StarField`, las stories `Effects/StarField` y `Landing`, `docs/06` §6 y `docs/07`.

## Contexto

`twinkle` gobierna todo el movimiento del campo: el parpadeo de las estrellas y, con `aurora`, la
deriva de las cuatro manchas (`data-still` sale del mismo `twinkling`). Venía encendido por defecto,
así que cualquier `<StarField aurora />` animaba sin pedirlo.

El coste no está en el hilo principal —son animaciones CSS de `transform` y `opacity` que compone la
GPU, como dice `StarField.md`— sino en el compositor: **una animación infinita le obliga a producir
fotogramas a la frecuencia de la pantalla mientras la página esté abierta**, 120 Hz en un MacBook con
ProMotion. Y el campo vive detrás de todo, así que cada fotograma cambia el fondo de cualquier
superficie de cristal que tenga encima y su `backdrop-filter` se vuelve a calcular.

En una landing eso dura lo que dura la visita. En un panel dura horas: Vela monta
`<StarField aurora … />` como `backdrop` de `AppShell`, con botones y tarjetas de cristal encima y
vídeo en directo, y el proceso de GPU del navegador se quedaba alto en reposo.

## Decisión

- **`twinkle` vale `false` por defecto.** Sin pedirlo, el campo se pinta una vez y no vuelve a
  generar trabajo: estrellas uniformes (opacidad 0.6, escala 1, el mismo sustituto que con
  `prefers-reduced-motion`) y, con `aurora`, manchas quietas en su sitio.
- **Animarlo se pide** con `twinkle` donde el campo es el foco de la región: hero, landing, login,
  estado vacío. Las paradas siguen igual: `prefers-reduced-motion` y `motion.tier: "minimal"` lo
  apagan aunque se pida.
- `aurora` sigue siendo su propia prop: con ella y sin `twinkle` da el color sin el coste del
  movimiento.

En el repo, lo que era portada lo pide ahora a mano —la portada de `apps/web` (`twinkle={!ambient}`:
las páginas de lectura y tabla se quedan quietas), su preview, la story `Landing` y la receta de
landing de `docs/07`—. Los fondos de panel (`Dashboard`, `RosetteCarril`, la receta de panel) no lo
piden: es el caso que esta decisión arregla.

## Alternativas

- **Dejar el valor y que cada panel ponga `twinkle={false}`.** Es lo que hizo Vela primero. Funciona,
  pero el coste lo descubre cada consumidor cuando el portátil ya se calienta: el valor por defecto
  tiene que ser el que no cuesta nada mientras la página está abierta.
- **Separar `twinkle` y una prop nueva para la deriva de la aurora.** Más API para el mismo
  interruptor: no hay caso pedido de estrellas quietas con manchas moviéndose, ni al revés.
- **Pre-renderizar la aurora como vídeo en bucle.** Peor: añade decodificación por fotograma a la
  misma composición continua que se quiere evitar.

## Consecuencias

- **Cambio visible para quien no pasaba la prop**: su campo deja de moverse al actualizar. Lo que
  quiera seguir animado añade `twinkle`. Va en las notas de la versión.
- **El gate visual no se mueve**: captura con `reducedMotion: "reduce"` y `animations: "disabled"`,
  así que las láminas ya eran el campo quieto.
- Un panel con `StarField` de fondo deja de componer en reposo; solo lo hace cuando algo cambia de
  verdad (scroll con `parallax`, un vídeo, una interacción).
