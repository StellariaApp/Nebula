# ADR-141 — La portada se queda en tres piezas y el movimiento entra en el escenario

- **Estado**: **aceptada** · 2026-08-14 — aprobada por el propietario en WN
- **Afecta**: `apps/web/src/app/page.tsx`, `packages/demos/src/Patterns/Scenarios.tsx`,
  `packages/demos/src/Scenarios/*`, `apps/web/i18n/en/chrome.json`
- **Deja obsoleto**: dos filas de la tabla de `deferHeight` de
  [ADR-144](ADR-144-la-seccion-monta-su-cuerpo-cuando-se-acerca.md) §4 —las bandas que este ADR
  elimina—. El mecanismo de diferido por sección sigue vigente tal cual.

## Contexto

La portada montaba cinco bandas: hero, prueba (`ProductSurface`), pilares con números, movimiento
(`MotionLab`) y cierre. Tres de ellas dicen lo mismo por vías distintas —que un solo `NebulaTheme`
reafina todo el catálogo—, y las dos del medio lo dicen **contando** en vez de **enseñando**, que es
justo lo que `ProductSurface` ya hace conmutando producto, esquema y situación en vivo.

Dentro del escenario `components`, las tres últimas tarjetas —Notifications, Account, Profile— no
añadían ningún componente que no estuviera ya en las seis anteriores: eran tres `Switch` y cuatro
`Button` repetidos, y ocupaban una fila entera de la rejilla.

Y `Scenarios.tsx` era un módulo de 901 líneas con los seis escenarios dentro y ~30 imports estáticos
del catálogo. La ventana de montaje que ya tenía —activo, anterior y siguiente, más los ya vistos—
evitaba **renderizar** de más, pero no evitaba **descargar**: el JS de los seis viajaba en el bundle
inicial de la portada aunque solo se viera uno. Lo único partido en chunk eran los charts, vía el
`Deferred` que el paquete ya tenía.

## Decisión

1. **La portada se queda en tres piezas**: hero, prueba y cierre. Salen la banda de pilares —con sus
   tres `Feature` y sus cuatro `Stat`— y la banda de movimiento.

2. **El movimiento deja de ser banda y entra en el escenario `components`**, en **la misma rejilla**
   que el catálogo y no en una sub-sección aparte: son tarjetas de la vitrina como las demás, y
   separarlas con su propio rótulo las volvía a leer como una banda dentro de otra.

   Se conservan las cuatro piezas que **enseñan un material**: el haz de `GradientBorder beam`, el
   `AnimatedGradient`, el trabajo indeterminado (`Progress` + `Skeleton` + `Button loading`) y el
   `GradientText`. Se van las cinco que eran **instrumentación de laboratorio** —la tabla de tokens
   de motion, los springs escalonados, el bucle de presets, la cuenta atrás y el hover con intención—:
   miden el sistema en vez de mostrarlo, y esa lectura pertenece a las guías, no a la portada.

   Sin rótulo de sub-sección, el mensaje que la banda llevaba en la cabecera lo recoge la celda del
   `GradientText`, que ya lo decía con otras palabras y ahora lo dice con las suyas: _One switch
   retunes colour, type, motion and glass at once._

3. **La rejilla queda en nueve, en tres columnas.** Salen las tres tarjetas redundantes
   —Notifications, Account y Profile— y también la de notas, cuyos dos botones repetían los de
   controles; su `Textarea` se mueve al formulario para no perder el componente. El orden agrupa por
   lo que hace cada una: captura —formulario, verificación, controles—, luego dato e identidad
   —precio, identidad, trabajo indeterminado—, y la última fila entera para los tres efectos de
   marca —haz, gradiente animado y texto con gradiente—.

4. **Cada escenario es un chunk, salvo el que se ve de entrada.** Los cinco no visibles se cargan con
   `Deferred`; `components` se importa estático **a propósito**: `Deferred` no renderiza en servidor,
   así que diferir el escenario activo por defecto sacaría del HTML servido el contenido principal de
   la portada, que es exactamente lo que ADR-144 se negó a pagar. La ventana de tres sigue mandando
   el montaje y ahora también decide qué chunk se pide.

5. **Las claves de diccionario que quedan sin consumidor se borran** (21, todas `home.*`). Las once
   que ya estaban huérfanas antes de este cambio **no se tocan**: varias se componen dinámicamente
   (`api.group.*`, `catalog.boundary.*`, `theme.to.*`) y un barrido por texto no puede distinguirlas
   de las muertas.

## Alternativas

**MotionLab como séptima situación del conmutador.** Heredaba la ventana y el chunk sin tocar nada.
Descartada por el propietario: las cuatro piezas que sobreviven son materiales del catálogo, y su
sitio es la vitrina del catálogo, no una situación de producto al lado de «Mail» o «Finances».

**Diferir también `components`.** Un chunk más fuera del bundle inicial, a cambio de servir la
portada sin su contenido. Descartada: rompe el prerender que ADR-133 restauró.

**Dejar la carga como estaba.** La ventana de tres ya evitaba montar de más, y era fácil darla por
suficiente. No lo era: montar y descargar son cosas distintas y solo una estaba resuelta.

## Consecuencias

- **Los cinco escenarios no visibles salen del bundle inicial.** Verificado sobre los chunks que
  referencia el HTML de `/`: ninguno de los marcadores exclusivos de Dashboard, Mail, Finances,
  Onboarding y Settings aparece en él. Los cinco chunks suman **16.6 kB brotli** (55 kB sin
  comprimir), más los componentes del catálogo que solo ellos usan —`Stepper`, `Accordion`,
  `Timeline`, `Table`, los charts—, que dejan de estar en el grafo de entrada.

- **El presupuesto por ruta se queda con holgura de sobra.** La portada mide 1264.7 kB sin comprimir
  y 354.9 kB brotli, con **9.5 % y 9.2 % de holgura** contra el 4.7–4.8 % en que están los otros
  cuatro grupos. Los topes de `route-budget.json` **no se bajan en este ADR**: la holgura se
  recalibra cuando el trabajo abierto sobre `Segment` y `Hero` cierre, para no fijar un tope contra
  un árbol en obra.

- **El contenido visible sigue prerenderizado.** Comprobado en el HTML servido de `/`: la rejilla del
  escenario, el rótulo del movimiento y el gradiente animado están en él.

- **`MotionLab.tsx` se borra.** Era resoluble como `@stellaria/nebula-demos/Patterns/MotionLab` por
  el export comodín del paquete, pero `@stellaria/nebula-demos` es `private: true` y su único
  consumidor era la portada. No hay ruptura que anunciar.

- **La tabla de `deferHeight` de ADR-144 §4 pierde dos filas.** «Pilares» y «MotionLab» ya no
  existen como bandas. La prop `deferHeight` tampoco existe ya en `Band`, retirada por su cuenta
  antes de este cambio; queda en `band.tsx` un comentario de documentación huérfano que la describe,
  ajeno a este ADR.
