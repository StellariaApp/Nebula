# ADR-094 — El archivo decide el formato de los nombres en las hojas

- **Estado**: aceptada · 2026-08-05 (decisión del propietario) · **Enmienda** ADR-019 §1
- **Contexto**: ADR-019 fijó el naming de Nebula pero nunca decidió cómo se llaman los `export const` de un `.css.ts`. Al abrir WN el catálogo tenía 169 símbolos multipalabra en camelCase repartidos por 64 hojas, escritos así por inercia del ecosistema, y `AppShell.css.ts` ya mezclaba las dos formas dentro del mismo archivo (`sidebar_container` junto a `sidebarBottom`). La regla de lint no lo detectaba: aceptaba `["UPPER_CASE", "snake_case", "PascalCase", "camelCase"]` para toda constante de módulo, o sea, todo. W5 congela el catálogo, así que era la última ocasión de decidirlo sin romper a nadie.

## Decisión

El formato lo decide **el archivo**, no el símbolo:

| Archivo          | Formato                    | Ejemplos                                            |
| ---------------- | -------------------------- | --------------------------------------------------- |
| `*.vars.css.ts`  | `camelCase`                | `bg` · `bgHover` · `borderColor` · `backdropFilter` |
| `*.css.ts`       | `snake_case`               | `root` · `list_row` · `sidebar_container`           |
| ambos            | `UPPER_CASE` para tablas   | `ROLE_COLORS` · `FONT_LEADING` · `PROGRESS`         |

El corte no es estético, y solo se sostiene porque N0 y N1 separan los dos archivos:

- **Una var nombra una propiedad CSS.** `borderColor` y `backdropFilter` son el nombre de la propiedad escrito como lo escribe CSS-in-JS. ADR-019 ya lo decidió para ellas — _"los compuestos siguen en camelCase (`bgHover`, `borderColor`)… es lo natural en el dominio CSS y lo que ya usan las CSS vars locales"_.
- **Un `style()` no nombra una propiedad**: es un asa de clase, una constante local del módulo. Para esas, la tabla de ADR-019 ya decía `snake_case`. Nunca se decidió nada sobre ellas.

### Dos excepciones, ambas verificadas por lint

**Funciones auxiliares.** Una hoja puede declarar funciones (`Track(step)`, `Dot(step)`), y ADR-019 §1 las quiere en `PascalCase`. El selector de lint que las cubre usa `types: ["function"]`, y ese tipo **no distingue** una función auxiliar de una receta: `recipe()` devuelve una función y es un asa. Por eso ese selector admite las dos formas (`snake_case` para recetas, `PascalCase` para auxiliares). Es el único punto donde la regla no puede ser estricta.

**Símbolos del barrel.** `themeClass` sale en `packages/web/src/index.ts` y conserva su nombre. Los símbolos exportados del paquete son contrato, no asas de clase — el mismo criterio que ADR-019 aplica a las props. `vars` no se ve afectado por ser de una palabra.

### Enforcement

Tres bloques `files` en `eslint.config.js`, en este orden (el último que casa gana):

1. `**/*.css.ts` → `snake_case` + `UPPER_CASE`
2. `**/*.vars.css.ts` → `camelCase` + `UPPER_CASE` — va después porque también casa con el patrón anterior
3. `packages/web/src/theme/themes.css.ts` → admite `camelCase` por `themeClass`

Sin lint la convención no aguanta 158 componentes; es el mismo argumento que ADR-019 se aplica a sí mismo.

## Alcance del cambio

Aplicado con dos codemods sobre el AST de TypeScript (`ts.findRenameLocations`, el mismo mecanismo que un rename de IDE), no con expresiones regulares — un renombrado textual pisa claves de objeto CSS (`aspectRatio:`), props (`showBelow`) y símbolos homónimos de otro origen (`transform` de dnd-kit).

- 174 símbolos renombrados en 64 hojas · 1.378 ubicaciones · 213 archivos
- 43 vars extraídas de 20 hojas a su `*.vars.css.ts` (adelanto del trabajo mecánico de N1, sin el cual el gate no podía cerrar sin exenciones)
- 16 imports de espacio de nombres reescritos a un segundo namespace (`drag_drop_vars.transform`), no a import nombrado, para no arriesgar colisiones de ámbito

## Consecuencias

- **Los nombres de clase generados cambian.** `vite.config.ts` usa `identifiers: "debug"`, así que el nombre de la variable viaja dentro de la clase emitida. Dos tests que afirmaban sobre esa cadena (`CardComplex`, `Scroll`) se actualizaron. Afirmar sobre nombres de clase es frágil y queda anotado como hallazgo de N5.
- **El bundle crece unos bytes por componente**: cada guion bajo es un byte en cada clase emitida. Reventó el presupuesto de `StarField` por 8 B y se subió su tope a 16 kB. La tabla de `.size-limit.js` está muy ajustada —diez entradas a menos de 90 B de su tope—; el propietario fija como criterio subir el presupuesto cuando haga falta. Cambiar `identifiers` a `"short"` en el build de librería devolvería margen a todas y queda anotado para decidir aparte.
- `docs/patterns/web-component-template.md` y `CLAUDE.md` se actualizan en el mismo PR.
- La regla hará fallar el gate `lint` ante cualquier desviación futura, incluida la de los componentes que N2 y N3 aún van a tocar.

## Alternativas

- **Todo camelCase, dejando las hojas como estaban**: descartado — deja sin decidir qué es un asa y qué es una var, que es justo lo que N1 quiere hacer visible, y contradice la tabla de ADR-019 para constantes de módulo.
- **Todo snake_case, incluidas las vars**: descartado — obligaría a escribir `border_color` para una propiedad que CSS-in-JS llama `borderColor`, y a renombrarla de vuelta al leerla.
- **Exención de lint para las 20 hojas que aún tenían vars dentro**, difiriendo la extracción a N1: descartado — la exención es por archivo, así que habría dejado `AppShell.css.ts` sin vigilar durante N4, que es cuando más se toca.
