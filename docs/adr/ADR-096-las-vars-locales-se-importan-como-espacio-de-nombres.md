# ADR-096 — Las vars locales se importan como espacio de nombres

- **Estado**: aceptada · 2026-08-05 (decisión del propietario, escrita en el prompt de WN) · **Completa** ADR-094
- **No cambia API pública**: los `.vars.css.ts` no salen del barrel de `@stellaria/nebula-web`

## Contexto

ADR-094 separó las vars locales en su propio archivo y fijó que ahí los nombres van en `camelCase`
porque nombran la propiedad CSS que gobiernan. Quedaban dos cabos que el prompt de WN pedía atar y
que resultaron ser **el mismo problema**:

1. **La var debe llamarse como la propiedad, no como el componente**: `bg`, no `heroBg`. Al medir,
   60 vars llevaban el nombre del componente dentro — `avatarBg`, `toastFg`, `modalWidth`, los diez
   `sg*` de SimpleGrid.
2. **El idioma de import**: el prompt fijaba espacio de nombres; el catálogo usaba import nombrado
   por 133 a 18.

Son el mismo problema porque el import nombrado es lo que **obliga** al prefijo. Con
`import { bg } from "./Avatar.vars.css.js"`, un nombre corto choca con lo que ya hay en el módulo:
con la prop homónima, con `style` de vanilla-extract, con `size` del recipe. La prueba estaba en el
propio catálogo: **57 imports de vars renombraban con alias** para esquivar esa colisión, casi
siempre entre la var y la prop que la alimenta:

```ts
import { asideWidth as aside_var } from "./AppShell.vars.css.js";
// …
[aside_var]: has_aside ? `${String(asideWidth)}px` : "0px";
//                                  ^ la prop
```

## Decisión

Las vars locales se importan **siempre** como espacio de nombres:

```ts
import * as variables from "./Card.vars.css.js";

export const card = recipe({
  base: { background: variables.bg, color: variables.fg },
});
```

- **Vars propias** —las del componente o de un archivo del mismo nombre— se llaman `variables`.
- **Vars ajenas** —de otro componente o de `styles/`— llevan su origen: `calendar_vars`,
  `noise_vars`, `focus_vars`. Son ocho imports en todo el catálogo, y ahí el prefijo es información,
  no ruido.

Con el prefijo delante, el nombre corto es seguro y legible, así que la regla de nombres de ADR-094
se puede aplicar de verdad: la var se llama como la propiedad que gobierna y el archivo pone el
contexto.

### Qué prefijos NO se quitan

El prefijo se quita cuando nombra **el componente**. Se queda cuando nombra otra cosa:

- **Una parte**: `StarField` tiene `starColor`, `gridColor` y `accentColor`. Ahí `star` distingue la
  capa de estrellas de la retícula y del acento; dejarlo en `color` haría el archivo ilegible.
  Igual `bulletBg`/`trackBg` en Timeline y Progress, o `dayBg` en Calendar.
- **Una palabra del dominio CSS**: `scrollbarSize` en Scroll. `scrollbar` es la cosa que se estiliza,
  no el componente; `barSize` sería peor.

## Consecuencias

- 154 imports migrados en 151 archivos, 660 referencias reescritas. Desaparecen los 57 alias.
- 60 vars renombradas en 74 archivos, 237 ubicaciones.
- Dos vars declaradas y no leídas por nadie, borradas: `Hero.contentBodyMax` y
  `Progress.ringThickness`.
- El presupuesto de `Radio` sube a 15 kB (37 B de exceso).
- Aplicado con `ts.findRenameLocations` y `getReferencesAtPosition`. Un detalle que solo se ve
  ejecutándolo: calificar una **propiedad abreviada** (`{ borderWidth }`, que es
  `borderWidth: borderWidth`) exige reescribirla entera —`borderWidth: variables.borderWidth`—, no
  solo el identificador. Button, ActionIcon y QuickAction lo usaban.

### Lo que este ADR no resuelve

Siete vars no las asigna nunca ningún `.tsx` y se leen con `fallbackVar`: las dos de `Scroll` y las
cinco de brecha de `SimpleGrid`. **No son un defecto**: son puntos de extensión para el consumidor,
que es el principio que ordena WN. Se anotan aquí para que una futura limpieza no las tome por
código muerto — la diferencia con el código muerto es exactamente el `fallbackVar`.
