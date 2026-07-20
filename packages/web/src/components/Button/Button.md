# Button

Plantilla canónica de las tres capas (docs/01 §4, ADR-018): React Aria para comportamiento y a11y, recipe de Vanilla Extract para la estructura, `motion` con los springs del theme.

## Trampas ya pisadas

**`onClick` y `onPress` se entregan A React Aria**, nunca al DOM en paralelo. Aria gobierna el press y previene el click nativo del teclado; si el handler viaja por separado al elemento, el botón deja de activarse con Enter y Space aunque siga funcionando con el ratón. React Aria trata `onClick` como alias de `onPress` (ver `PressEvents` en `@react-types/shared`).

**El label en `loading` usa `opacity: 0`**, no `visibility: hidden` ni `display: none`. Esos dos sacan el texto del árbol de accesibilidad y dejan al botón sin nombre discernible — violación `button-name` (crítica) que detectó el gate axe. Con `opacity` el lector de pantalla sigue anunciando la acción y `aria-busy` comunica la carga.

**El cast de `mergeProps` a `HTMLMotionProps` es una frontera real**: React Aria tipa sus handlers como eventos DOM (`DOMAttributes`) y `motion` redefine `onAnimationStart` y `onDrag*` con su propia firma. Los dos tipos son estructuralmente incompatibles por diseño; el objeto resultante es válido en runtime para un `<button>`. Por eso las props en conflicto se excluyen del contrato público en `Button.types.ts`.

## Color y variantes

El recipe no hornea ningún color: consume las vars locales de `Button.vars.css.ts`, que el componente asigna resolviendo `theme.variantMap[variant]` con `ResolveVariant`. Cambiar de tema reconfigura las 8 variantes sin tocar código.

## Motion

El press deriva de `isPressed` de React Aria, no de `whileTap`, para tener una sola fuente de verdad de la interacción. Se desactiva con `useReducedMotion()` y con `motion.tier: "minimal"` del tema. `domAnimation` se importa de forma estática: cargarlo con `import()` perezoso empeora el bundle porque el chunk dinámico arrastra el módulo `motion/react` entero (medido en ADR-018).
