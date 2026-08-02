# ADR-073 — El momentum de página vive en `Main`

- **Estado**: **aceptada** · 2026-08-02 — a petición del propietario durante WB
- **Resuelve**: la landing quiere la inercia de rueda que `Scroll` ya tiene, pero **su scroll no es el
  de un contenedor: es el del documento**.
- **Amplía**: `useMomentumPage` en `@stellaria/nebula-hooks` y las props `momentum` · `spring` ·
  `multiplier` de `Main`. **Recorta** `MainProps`, que heredaba de `ScrollProps`.
- **Depende de**: [ADR-069](ADR-069-indicadores-de-scroll-y-momentum.md), que introdujo el muelle de
  scroll y `ScrollSpring`; y [ADR-034](ADR-034-capa-de-motion-compartida.md), que prohíbe que un
  componente escriba su propia física.

## Contexto

`Scroll` tiene `momentum` desde ADR-069 y está resuelto: muelle sobre la rueda, física del tema a
media frecuencia, y las cinco cesiones de gesto —táctil, `ctrl`+rueda, scroller anidado, tope,
scroll ajeno—. Nada de eso hay que reinventarlo.

Lo que no encaja es **dónde**. `useMomentumScroll` opera sobre un nodo con overflow, y en una landing
quien desplaza es el documento: `Main` es `flex: 1` y no tiene scroller propio.

Y había una trampa. `MainProps extends Omit<ScrollProps, …>` hacía que `<Main momentum />`
**typechequease sin hacer absolutamente nada**: `Main` destructura las props que usa y el resto va a
`ExtractStyleProps`, que las deja en un `rest` que `Main` descarta. Igual que `border.subtle.40` antes
de ADR-071 y que `parallax` sin anclaje: una prop que se acepta, no falla y no hace nada.

## Decisión

1. **`useMomentumPage` es un hook nuevo, hermano de `useMomentumScroll`**, con el mismo núcleo. Ambos
   delegan en una función `Subscribe` que recibe el _scroller_ resuelto; lo único que los distingue
   son tres cosas y no la física:

   |                     | `useMomentumScroll` | `useMomentumPage`           |
   | ------------------- | ------------------- | --------------------------- |
   | Mide y aplica sobre | el nodo             | `document.scrollingElement` |
   | Escucha `wheel` en  | el nodo             | `window`                    |
   | Escucha `scroll` en | el nodo             | `document`                  |

   La tercera fila es la que obliga a que sea un hook y no un parámetro: **el scroll de la página no
   se despacha en `documentElement`**, así que registrarlo en el nodo dejaría muerta la
   resincronización que mata el muelle cuando alguien arrastra la barra o salta a un ancla.

2. **`Main` no se convierte en scroller.** Aplica la inercia al documento y conserva su layout, de
   modo que `window.scrollY` sigue siendo la fuente de verdad.

3. **`MainProps` deja de heredar de `ScrollProps` y declara lo que soporta.** Heredar `axis`,
   `gutter`, `scrollbarSize` y `shadows` de un componente que no tiene overflow era la causa directa
   de la trampa. Pasa a extender `StyleProps`, que es lo que de verdad reenvía.

4. **Los defaults son los de `Scroll`**: `spring: "default"`, `multiplier: 1.5`. La misma prop debe
   sentirse igual en los dos sitios, y 1,5 ya estaba justificado en ADR-069 — una muesca que solo
   recorre su propio delta se siente floja cuando además decelera.

5. Se apaga con `prefers-reduced-motion` y con `motion.tier: "minimal"`, por el mismo `MotionOff` que
   usa `Scroll`.

## Alternativa

**Que `Main` fuese el contenedor de scroll** (`overflow-y: auto` + el subcomponente `Momentum` que ya
existe). Era el camino más corto —cero código nuevo en hooks— y es lo natural para un dashboard
dentro de `AppShell`. Descartada para la landing porque rompe tres cosas a la vez, y las tres estaban
recién verificadas:

- `StarField parallax` deja de moverse: su efecto lee `window.scrollY`, que en ese modelo no cambia.
- `Nav` pierde el scroll-spy y la píldora al desplazar.
- `Reveal` necesita que le pasen `root`, porque su observer usa el viewport.

Cambiar quién desplaza no es una prop más: es cambiar la fuente de verdad de todos los efectos
anclados al scroll.

## Consecuencias

- **`Main` monta dos hooks más aunque `momentum` esté apagado** —`useTheme` y `useMediaQuery`—. Ya era
  `"use client"`, así que no cambia de naturaleza; con la prop apagada, `useMomentumPage` no suscribe
  nada.

- **Su presupuesto sube de 13 a 14 kB**: el módulo pasa a arrastrar el hook y la física del muelle
  aunque nadie encienda la prop, +699 B medidos. Es el mismo precio que ADR-069 aceptó en `Scroll` por
  tener una sola caja en vez de dos, y por la misma razón: `momentum` es una prop de `Main`, no un
  componente aparte que el consumidor tenga que ir a buscar.

- **Verificado sobre el render**, con una muesca de `deltaY: 300` sobre la landing:

  |       t | `scrollY` | `transform` de las estrellas |
  | ------: | --------: | ---------------------------- |
  |   16 ms |        27 | 1.215 px                     |
  |  186 ms |       221 | 9.945 px                     |
  | 1186 ms |       447 | 20.07 px                     |

  La muesca no salta a su destino: decelera hasta 447 de los 450 que fija el multiplicador. Y el
  parallax sigue valiendo `0.045 × scrollY` en cada muestra, que es lo que la decisión 2 tenía que
  preservar.

- **Un `Main` con `momentum` gobierna el scroll de toda la página**, no solo el de su región. Es lo
  correcto para el componente de página, y es la razón de que la prop no exista en `Section` ni en
  `Hero`.

- **Quien pasara `axis`, `shadows` o `gutter` a `Main` verá un error de tipo.** No hay migración que
  escribir: esas props nunca hicieron nada.
