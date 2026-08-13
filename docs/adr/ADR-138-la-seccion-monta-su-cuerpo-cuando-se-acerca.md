# ADR-138 — La sección monta su cuerpo cuando se acerca, y su cabecera siempre

- **Estado**: **aceptada** · 2026-08-13 · **WN**
- **Cambia API pública**: sí, y es **aditivo**: `defer` y `deferHeight` en `SectionProps`. Sin ellas
  el componente se comporta igual que antes.
- **Depende de**: [ADR-111](ADR-111-hero-y-section-a-compound.md) (`Section` como compound) y
  [ADR-034](ADR-034-capa-de-motion-compartida.md) (el idioma de reduced
  motion)
- **Lo respalda**: el gate 10 de [ADR-137](ADR-137-presupuesto-de-bytes-por-ruta-del-sitio.md), que
  es lo que hizo medible este cambio

## Contexto

La portada montaba las cuatro bandas al cargar aunque solo se viera el hero. Medido sobre el HTML
servido: **980 elementos**, de los que la mayoría vive por debajo del pliegue.

El coste no era el DOM en sí. La sesión que produjo este ADR lo midió tres veces: diferir los seis
escenarios de `ProductSurface` quitó el 39 % de los nodos y movió el TBT un 3 %, porque quitaba nodos
dentro de un subárbol que ya era de cliente. Diferir **bandas enteras** quita `ProductSurface`,
`MotionLab` y todas las instancias de `Reveal`, `GlassSurface`, `Feature` y `Stat`: quita
**componentes de cliente**, que es lo que de verdad se paga al hidratar.

## Decisión

### 1. Se difiere el cuerpo, nunca la cabecera

`Section` reparte cabecera, cuerpo y pie. Solo el cuerpo espera. La cabecera —eyebrow, título,
descripción— es texto barato y **sigue en el HTML servido**, de modo que un buscador y un lector de
pantalla ven la estructura de la página completa aunque el contenido pesado no haya montado.

### 2. `defer` NO se apaga con reduced motion, al contrario que `reveal`

`useReveal` observa lo mismo y comparte maquinaria, pero su puerta se cierra con
`prefers-reduced-motion` y con `motion.tier: "minimal"`. Reutilizarla habría sido natural y **es un
fallo**: quien pide menos movimiento se habría quedado con la página vacía. Animar es una mejora;
montar es la página. Por eso `useDeferredBody` lleva observador propio, y sin
`IntersectionObserver` monta de entrada.

### 3. El `ref` es una función, y eso no es estilo

`Section` cambia su raíz de `section` a `m.section` cuando `useReveal` se arma, y **cambiar el tipo
de un elemento hace que React desmonte y vuelva a montar todo el subárbol**. Con un `RefObject` el
observador se quedaba mirando el hueco original, ya huérfano, y no disparaba nunca: **las bandas no
llegaban a montarse jamás**.

No se detectó leyendo el código —parecía correcto, y el `dist` también— sino midiendo con un
navegador: 4 huecos antes de scrollear y 4 después. Un observador idéntico inyectado a mano _sí_
disparaba sobre los mismos nodos, y esa contradicción fue la pista. Con ref de función cada nodo
nuevo vuelve a suscribirse.

Medido, el fallo además **puntuaba mejor de lo que merecía**: Lighthouse no scrollea, así que medía
una página cuyas bandas no montaban nunca. La versión arreglada saca 76 contra los 70 de la rota,
porque la rota dejaba un observador huérfano por sección.

### 4. `deferHeight` se mide, no se estima

El hueco reserva el alto para que diferir no cueste desplazamiento. Los valores del sitio salen de
medir cada banda en un navegador real a 412 px:

| banda          |   móvil | portátil |
| -------------- | ------: | -------: |
| ProductSurface | 2058 px |   923 px |
| Pilares        | 1360 px |   683 px |
| MotionLab      | 1859 px |   756 px |
| Cierre         |  611 px |   311 px |

Se reservan los de móvil, que es el caso que se optimiza. Verificado scrolleando: **CLS 0,0023 en
móvil y 0,0057 en portátil, contra 0,0025 y 0,0055 sin diferir** — indistinguible.

## Alternativas descartadas

**Diferir la sección entera, cabecera incluida.** Más simple y más rápido, y saca los títulos del
HTML servido. Para un sitio de documentación que quiere posicionar, es pagar SEO por milisegundos.

**Reutilizar `useReveal`.** Descrito en §2: la puerta es la equivocada.

**Esperar a que Next lo resuelva con PPR.** `ppr` existe en 16.2.12 y ataca el mismo problema desde
el servidor. No se descarta para el futuro; se descarta como sustituto, porque exige reestructurar
con `Suspense` y esto son dos props.

## Consecuencias

- Medido en A/B sobre el mismo equipo, tres corridas de Lighthouse por lado: **59 → 76 de
  rendimiento**, con **TBT de 1559 a 447 ms** (−71 %). FCP y LCP se mueven poco —1,46 → 1,28 s y
  4,28 → 4,05 s— y era lo esperado: `defer` no toca el CSS crítico, que sigue siendo el techo del
  primer pintado.
- **`defer` no reduce el CSS.** Se comprobó: con y sin él, el `<style>` mide 376 kB, las hojas son 67
  y el payload lleva las mismas 2941 reglas. Next emite el CSS del grafo estático, no de lo que se
  monta — el mismo comportamiento que ya se midió con el módulo de muestras del sitio.
- El contenido diferido **no está en el HTML servido**. Es la contrapartida de §1 acotada al cuerpo,
  y por eso la cabecera se queda.
- El sitio lo usa vía `Band`, que expone `deferHeight` y activa `defer` solo cuando se le da un alto:
  sin número medido no hay diferido, que es la forma de que nadie lo encienda a ojo.
