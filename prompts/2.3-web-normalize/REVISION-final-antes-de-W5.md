# Revisión final del catálogo web antes de W5

> Prompt de arranque para una sesión limpia. WN está cerrada; esto es la pasada de refinamiento
> **antes de publicar**, que es el último momento en que corregir sale barato.
> Estado al 2026-08-08, rama `main`.

---

## Pega esto en la sesión nueva

```text
Actúa como revisor de calidad de UI en C:\Users\Skr13\Documents\GitHub\Nebula.

WN acaba de cerrar. El catálogo web (158 componentes) está a punto de publicarse en W5, y después
de publicar cada prop de ranura es API pública para siempre. Tu trabajo es la última pasada:
calidad de código, mejoras aplicables, optimizaciones y acabado visual.

NO estás continuando WN. No reabras sus criterios ni sus decisiones cerradas. Buscas lo que WN
dejó mal hecho, a medias o sin mirar.

LEE EN ESTE ORDEN, ANTES DE TOCAR NADA
  1. CLAUDE.md — guardrails y política de trabajo con el propietario.
  2. docs/01-architecture.md §8 (política de deps) y docs/03-a11y-motion-performance.md §4
     (los siete gates de CI, incluida la nota de recalibrado de budgets del 2026-08-08).
  3. docs/adr/ADR-103, 104, 105, 106 y 111 — el registro de style props, cómo se tipa una ranura,
     el JSDoc como documentación publicada, el gate de ranuras y los dos compounds nuevos.
  4. docs/reviews/wn-n3-barrido-ranuras.md — el cuaderno del barrido, con el estado de las 154
     filas y el repaso de descartes del 2026-08-08.
  5. tools/check-slots.mjs — lo que el gate YA comprueba, para no repetirlo a mano.

DÓNDE ESTÁN ENTERRADOS LOS CUERPOS

Esto no es una lista de sospechas genéricas: es lo que el barrido hizo y nadie verificó a fondo.
Empieza por aquí, en este orden de riesgo.

  1 · CONVERSIONES A Box/Text QUE CAMBIARON EL ELEMENTO  ← el riesgo más alto
      El barrido convirtió ~95 nodos de `<span>`, `<div>` y `<p>` crudos a Box o Text, en 77
      archivos, para que las ranuras aceptaran style props (ADR-104). Box pinta `div` por defecto
      y Text pinta `p`, así que cualquier conversión sin `component="…"` CAMBIÓ LA ETIQUETA.
      Se detectó UNA: Hero.Description pasó de `p` a `div`, y lo cazó un test en el último
      componente del barrido, por suerte. Nadie comprobó las otras 94.
      Un cambio de etiqueta rompe selectores CSS de descendencia, semántica y a veces layout.
      Compara cada conversión con el elemento que había antes. `git log` del barrido son 34
      commits desde 987f31b.

  2 · ORDEN DE LAS PROPS DE ARIA FRENTE A LA RANURA
      El gate comprueba dos cosas: que `className` no vaya antes del esparcido, y que ninguna
      ranura declarada quede sin llegar a su nodo. NO comprueba que las props de un hook de
      React Aria se esparzan ANTES que la ranura. Invertirlo deja al nodo sin sus manejadores o
      sin su nombre accesible, y no falla nada visible: en Modal solo lo cazó el test de a11y.
      Los sitios con hook + ranura sobre el mismo nodo son los de riesgo: CommandPalette,
      MultiSelect, Select, Calendar/CalendarGrid, Slider, DatePicker*, Menu, GlobalSearch.

  3 · EL ESTILO CALCULADO, ¿ESTÁ DE VERDAD DESPUÉS?
      A partir de la tanda 29 el barrido dejó de descartar los nodos con `style` calculado y
      empezó a meterles ranura escribiendo el estilo DESPUÉS del esparcido, para que no se pueda
      pisar. Verifica que en los once archivos que usan ese patrón el orden es el correcto y que
      lo protegido es lo que debe:
        Charts/ChartFrame · ColorPicker/ColorInput · ColorPicker/ColorPicker · EditorImage
        Lightbox · Main · Pagination · Rating · Signature · Spoiler · Toast/ToastProvider
      Y al revés: busca nodos con `style` calculado que SÍ tengan ranura y NO lo protejan.

  4 · JSDoc QUE MIENTE
      ADR-105 hizo del JSDoc de una prop pública documentación que viaja al `.d.ts`. Hay 169
      props de ranura, casi todas documentadas a mano en 34 tandas. Ya apareció uno obsoleto
      —Rating.itemProps decía «el relleno parcial no tiene ranura» después de que ganara una—.
      Comprueba las afirmaciones verificables: «solo se pinta si…», «no existe con…», «se
      esparce sobre TODAS», «se comparte entre los dos nodos», «su X se escribe después».

  5 · COHERENCIA DE NOMBRES ENTRE HERMANOS
      El criterio era que manda el contrato común sobre el nombre de la clase. Se aplicó a mano.
      Busca el mismo nodo con nombres distintos en componentes de la misma familia, y lo
      contrario: el mismo nombre para nodos que no son lo mismo.

  6 · HONESTIDAD DE LOS TIPOS
      `BoxSlotProps` sobre un nodo que no pasa por Box es mentira (es el defecto que ADR-104
      existió para arreglar). `ComponentPropsWithoutRef<"x">` con la `x` equivocada, también.
      El tipo sale del ELEMENTO, no del rol ARIA: un `<div role="option">` es un div.

  7 · EL CUADERNO CONTRA EL CÓDIGO
      Cada fila dice «hecho (N de M)». Comprueba que las N existen de verdad en el código y que
      las M−N descartadas siguen sin ranura. El cuaderno es la fuente de verdad del barrido y si
      miente, miente para siempre.

  8 · LOS DOS COMPOUNDS NUEVOS (ADR-111)
      Hero y Section pasaron a compound anteayer. Verifica: que el camino de props y el de partes
      produzcan el MISMO DOM; que el `Object.assign` con `/* @__PURE__ */` deje las partes
      tree-shakeables de verdad (mira el dist, no el fuente); y que el `id` del título por
      contexto no se pierda en ningún montaje.

LO QUE NADIE HA MIRADO EN ABSOLUTO

  · EL PÍXEL. El barrido añadió 169 ranuras y convirtió 95 nodos sin que nadie abriera el
    playground una sola vez. Hay gate de regresión visual (ADR-037) y gate de axe sobre stories
    (`pnpm turbo a11y`). Córrelos. Si alguna conversión rompió el layout, está ahí.
  · SI ALGÚN COMPONENTE ENGORDÓ DE MÁS. Los presupuestos se recalibraron con holgura del 5 %
    (docs/03 §4, nota del 2026-08-08), así que ahora NO saltan por ruido — pero eso también
    significa que un componente puede haber engordado sin avisar. Mira los que ganaron Box, Text
    o ResolveVariant y pregunta si el coste está justificado.
  · SIMPLIFICACIÓN. 2.983 líneas añadidas en 184 archivos con el mismo gesto repetido. Habrá
    repetición extraíble: el patrón `{...slotProps} className={cx(base, slotProps?.className)}`
    aparece cientos de veces, y `CalendarDayVars` ya demostró que sacar lo duplicado a un módulo
    es posible y barato.

CÓMO TRABAJAR
  · Por tandas temáticas, no por componente. Una tanda = un riesgo de la lista, barrido entero.
  · Prioriza por consecuencia: un elemento cambiado o un nombre accesible perdido va antes que
    un JSDoc impreciso.
  · Usa scripts para lo mecánico. Los del barrido funcionaron: comparar el antes y el después de
    un elemento es un `git diff` filtrado, no 95 lecturas.
  · Cada hallazgo, con su reproducción. «Esto parece raro» no vale; «con esta prop, este nodo
    pierde su nombre accesible» sí.
  · Gates entre tanda y tanda, sin excepción:
      set -o pipefail
      pnpm turbo build typecheck lint test
      pnpm check:slots
      pnpm check:contrast
      pnpm size
  · Y al menos una vez en la sesión, los dos que el barrido nunca corrió:
      pnpm turbo a11y

REGLAS QUE YA COSTARON UN ERROR
  · `git add` SIEMPRE con rutas explícitas. Nunca `git add -A <carpeta>` ni una carpeta entera:
    el propietario trabaja en paralelo y ya se colaron cambios suyos en un commit ajeno, y
    cambios ajenos en uno del propietario.
  · Antes de commitear, `git diff --cached --name-only` y míralo. Si aparece un archivo que no
    tocaste, sácalo con `git restore --staged`.
  · No encadenes `vite build && size-limit` con la salida silenciada: el dist a medio escribir da
    un error de resolución que parece un fallo de configuración y no lo es.
  · Turbo puede disparar un install del workspace. Si la red falla, corre los gates directamente
    sobre `packages/web` con `npx tsc --noEmit`, `npx eslint .`, `npx vitest run` y
    `npx size-limit`, y DILO en el mensaje del commit.

NO HAGAS
  · No reabras los criterios de WN. El barrido y sus descartes están razonados fila por fila en
    el cuaderno, con un repaso posterior que ya recuperó cinco. Si crees que uno está mal,
    arguméntalo contra lo que dice el cuaderno, no desde cero.
  · No aprietes los presupuestos. La holgura del 5 % es deliberada y está razonada en docs/03 §4.
  · No añadas catálogo. Esto es refinamiento, no alcance nuevo.
  · Ninguna dependencia nueva ni cambio de API pública sin ADR previo.

EMPIEZA por el riesgo 1 —los elementos cambiados—, porque es el único que puede haber roto algo
que ya funcionaba, y porque los 34 commits del barrido siguen frescos en el historial.
```

---

## Estado para quien lea esto sin abrir nada

**WN cerrada del todo**: N1 (vars privadas de `Scroll`), N2 (`Hero` y `Section` a compound, ADR-111)
y N3 (barrido de ranuras: 108 filas hechas, 46 descartadas, 0 pendientes).

**Lo que el barrido movió**, medido: 34 commits, 184 archivos, **2.983 líneas añadidas**, **169 props
de ranura** en el catálogo y **~95 nodos** convertidos a `Box`/`Text` en 77 archivos.

**Gates montados y en verde** al cerrar: `build typecheck lint test` (34 tareas, 1.235 tests),
`check:slots` (ADR-106, gate nuevo del barrido), `check:contrast`, `size` (194 presupuestos
recalibrados con holgura del 5 %).

**Gates que existen y el barrido NO corrió ni una vez**: `pnpm turbo a11y` (axe sobre todas las
stories) y el de regresión visual de ADR-037.

## Por qué esta revisión y no otra

El barrido fue mecánico y repetitivo por diseño: el mismo gesto, 34 veces, sobre casi todo el
catálogo. Eso es lo que lo hizo terminable y también lo que lo vuelve sospechoso — quien lo ejecutó
se acostumbró a la forma y dejó de ver el contenido. La prueba está en que el único cambio de
elemento detectado (`Hero.Description`, `p` → `div`) se cazó en **el último componente de todos**, y
por un test que existía por otro motivo.

Después de W5 nada de esto se puede corregir barato: una prop de ranura publicada es contrato, y un
elemento cambiado ya está en el DOM de alguien.
