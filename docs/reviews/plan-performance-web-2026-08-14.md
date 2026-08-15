# Plan de performance web — por fases

> **Fecha**: 2026-08-14 · **Alcance**: `apps/web` y lo que de `packages/web` le llega al navegador.
> **Origen**: medición de 8 informes de PageSpeed sobre `nebula.stellaria.app` (runs 1-4 y 11-15) más
> el build local del 16:29 y el árbol de chunks de la portada.

## Lo que ya sabemos, y que este plan da por asentado

Está medido, no supuesto. Los números salen del run móvil del sitio desplegado salvo donde se dice.

| Hecho                                               | Número                                                                  |
| --------------------------------------------------- | ----------------------------------------------------------------------- |
| El hilo principal es el cuello de botella           | 2.203 ms, de los cuales **1.366 evaluando script**                      |
| El LCP no espera a la red                           | TTFB 43 ms + **686 ms de retraso de renderizado**                       |
| Un solo chunk (react-dom + runtime de Next) domina  | 1.343 ms de arranque · 3 de las 6 tareas largas                         |
| Casi todo el catálogo se declara cliente            | **129 de 158** componentes con `"use client"`                           |
| …y 21 de ellos solo porque leen el tema             | `Hero` entre ellos — el dueño del elemento LCP                          |
| La base común pesa casi tanto como la portada       | `/changelog` 1.143 kB vs portada 1.196 kB (raw)                         |
| El CSS es inocente                                  | 5,1 kB en 4 hojas · 45 ms de parseo · 0 bloqueo                         |
| Producción sirve gzip, no brotli                    | HTML **117,3 kB servidos vs 43,8 con brotli**                           |
| El gate de bytes cuenta un chunk que nadie descarga | 110 kB de core-js con `noModule`, verificado ausente de la traza de red |
| Ningún gate mide tiempo de CPU                      | los diez en verde con 1.366 ms de evaluación                            |

**Descartado con datos, no por opinión** — no volver sobre ello sin números nuevos:

- **El CSS y el CSS de vanilla-extract.** 45 ms de parseo de HTML+CSS sobre 2.203 ms.
- **Cambiar a Astro como primer movimiento.** El coste es hidratar componentes propios; en Astro
  siguen siendo islas React con React Aria y motion. Movería ~200 kB de peso y dejaría los 1.366 ms.
  Se reevalúa en P6, con la medición de P5 delante.
- **Simplificar la portada.** `/changelog` es texto plano y sirve el 96 % del JS de la portada. El
  margen está en el cromado común, no en la portada.

## Regla del plan

**Ninguna fase cierra sin que el instrumento de P0 enseñe el número movido**, con mediana de N
pasadas y no con una. La prueba del `reveal` del 2026-08-14 es el porqué: 4 runs contra 4 dieron 88,0
vs 89,0 de score con dispersión interna de 11 y 15 puntos — no medía nada, y el cambio atacaba un
componente (`Band`) que ni siquiera contiene el elemento LCP.

Las fases van en orden de `(confianza × ganancia) / coste`. P0 bloquea a todas las demás.

---

## P0 — Instrumentos y línea base

**Motivo**: hoy no hay forma de saber si un cambio funcionó. Es la causa raíz de que esto se
descubriera por PageSpeed y no por CI.

**Entregables**

1. Arreglar [`tools/route-budget`](../../tools/route-budget/): excluir los `<script noModule>` del
   recuento y medir el encoding que sirve producción, no solo brotli. Hoy suma 110 kB fantasma.
2. Medida directa de hidratación: `performance.mark` alrededor de la hidratación, headless con
   throttling de CPU ×4, mediana de N pasadas. Es el número que habría cazado esto, y es estable y
   rápido — no depende de infraestructura compartida como PageSpeed.
3. Capturar la línea base del estado actual y comprometerla, para que las fases siguientes tengan
   contra qué comparar.

**Gate**: dos pasadas consecutivas del medidor de hidratación caen dentro del ±5 %; `check:budget`
deja de contar el chunk `noModule`; la línea base está comprometida.

**ADR**: no para el arreglo del gate 10 (corrige lo que ya decidió [ADR-137](../adr/ADR-137-presupuesto-de-bytes-por-ruta-del-sitio.md)).
Sí, probablemente, para añadir un gate de tiempo a `docs/03` §4 — es un gate nuevo.

---

## P1 — Compresión y presupuesto honesto

**Motivo**: 73,5 kB tirados solo en el documento, y un 18 % más en los scripts que se pudieron cruzar
por nombre. Es configuración, cero código.

**Entregables**: brotli en el CDN para HTML, JS y CSS. Verificar `content-encoding: br` en la
respuesta real, no en la configuración.

**Gate**: el transferido de la portada baja de ~573 kB a ~420 kB medido desde fuera, y `check:budget`
(ya arreglado en P0) lo confirma.

**Ganancia**: ~27 % de bytes. **No mueve los 1.366 ms** — mejora FCP y poco más. Se hace porque es
gratis, no porque resuelva el problema.

**ADR**: no. **Riesgo**: ninguno.

---

## P2 — Que no se hidrate lo que no se ve

**Motivo**: el arranque monta `ThemePanel` (arrastra todos los temas), `StarField` (canvas con
parallax y aurora) y `ProductSurface` con su escenario por defecto. Nada de eso es necesario para
pintar el Hero, que es lo que mide el LCP.

**Entregables**

1. `ThemePanel` bajo interacción — no existe hasta que se abre.
2. `StarField` montado tras la primera pintura o en `requestIdleCallback`.
3. `ProductSurface` y `ScenarioComponents` diferidos: están bajo el pliegue. Los otros cinco
   escenarios ya son `import()` dinámico — el patrón está y solo falta aplicarlo al que queda.

**Gate**: la hidratación medida en P0 baja; el JS raw de la portada baja; el gate visual (`pnpm
visual`) sigue verde, que es quien detecta si algo se movió de sitio.

**Ganancia esperada**: es la fase con más incertidumbre honesta del plan. Quita trabajo del arranque,
pero no cambia que `Hero`, `Section` y `Card` hidraten. **Estimación sin medir** — P0 la convierte en
número.

**ADR**: no, es `apps/web`. **Riesgo**: el aspecto de entrada cambia si `StarField` aparece tarde;
lo cubre el gate visual.

---

## P3 — El reflujo forzado

**Motivo**: `forced-reflow-insight` falla con ~86 ms repartidos entre el chunk de motion (~40 ms), el
de React Aria (~7 ms) y el commit de react-dom (~40 ms). Es pequeño pero tiene nombre y sitio.

**Entregables**: localizar la lectura de layout síncrona en el arranque y sacarla del camino.

**Gate**: `forced-reflow-insight` deja de fallar.

**ADR**: depende de dónde caiga. Si es `packages/web`, revisar antes de tocar.

---

## P4 — La tabla de sprinkles de `Box`

**Motivo**: 129,1 kB raw — el segundo chunk más grande del sitio — son los nombres de clase generados
de `Box` (`Box_display_flex_phone__…` por cada valor y cada uno de los 6 breakpoints). Comprime 10:1,
así que en red cuesta 13 kB, pero son 129 kB que parsear y un objeto que construir en el arranque.

**Entregables**: medir qué combinaciones se usan de verdad y podar, o mover la resolución a CSS.

**Gate**: el chunk baja; `check:slots` y el gate visual verdes; ningún componente pierde una prop.

**ADR**: **sí, si se poda.** Reducir qué props de estilo aceptan objeto responsive es cambio de API
pública ([ADR-098](../adr/ADR-098-props-de-ranura.md) y el barrido de ranuras de WN mandan aquí).

---

## P5 — El tema fuera del camino de render

**Motivo**: es la palanca. La cadena está medida de punta a punta — el tema se resuelve en runtime
por contexto de React → 129 de 158 componentes se declaran cliente → el árbol entero hidrata →
1.366 ms de evaluación → 686 ms de retraso de renderizado → LCP 3,3 s. **21 componentes son cliente
solo por leer el tema**, y [`Hero`](../../packages/web/src/components/Hero/Hero.tsx) —dueño del
elemento LCP— es uno: lo atan `useId`, `useMemo` y `useTheme`, y los dos primeros son sustituibles
sin tocar nada público.

**Entregables**: que los componentes que solo leen tokens resuelvan sin contexto de React y puedan
ser componentes de servidor.

**Gate**: `Hero` renderiza sin `"use client"`; la hidratación medida en P0 baja; el retraso de
renderizado del LCP baja; contraste, axe y visual verdes.

**ADR**: **obligatorio y previo.** Toca el contrato `NebulaTheme` de `docs/02` §2, que es decisión
cerrada. No se empieza a picar sin él.

**Riesgo**: el más alto del plan, y el único que toca el corazón de la librería. Por eso va después
de que P0 sepa medirlo y de que P1-P4 hayan recogido lo barato.

---

## P6 — Veredicto de framework

**Motivo**: hoy la pregunta «¿Astro?» no tiene respuesta con datos, solo con estimaciones. Después de
P5 sí la tiene: si con la parte estática fuera de la hidratación el número sigue mal, el framework
entra en la conversación; si queda bien, la pregunta se cierra sola.

**Entregables**: decisión escrita con la medición de P5 delante.

**Gate**: la decisión existe y cita números, no impresiones.

---

## Orden y dependencias

```
P0 ──┬── P1  (independiente, gratis)
     ├── P2 ── P3
     ├── P4  (ADR si se poda)
     └── P5  (ADR obligatorio) ── P6
```

P0 primero y sin excepción. P1 puede ir el mismo día. P2, P3 y P4 son independientes entre sí. P5 no
se abre sin su ADR, y P6 no se abre sin P5 medida.
