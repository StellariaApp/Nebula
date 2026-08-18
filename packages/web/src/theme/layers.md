# layers

Las capas CSS de Nebula (ADR-142). El orden de las capas lo fija su **declaración**, no el orden en
que caen las reglas en la hoja, y la cascada evalúa la capa **antes** que la especificidad. Por eso
el desempate entre dos componentes está declarado y no emerge del grafo de módulos del bundler.

```
@layer nebula.theme, nebula.reset, nebula.primitive, nebula.component, nebula.composite, nebula.util;
   más débil ───────────────────────────────────────────────────────────────────────────► más fuerte
```

`nebula.theme` va la primera —la que menos manda— y es donde `CompileThemes` pone las reglas de tema
([ADR-169](../../../../docs/adr/ADR-169-los-temas-comparten-su-base-y-viven-en-una-capa.md)). Es lo
correcto para un tema: define valores por defecto que cualquier cosa más específica debe poder
pisar, empezando por el propio catálogo.

Las dos clases del par por defecto se quedan **fuera** de la capa a propósito: las genera
`createTheme` en build y llevan las 627 variables completas, así que al no estar capadas ganan sobre
una base compilada. Es la dirección segura — quien mezcle las dos vías acaba con el tema entero y no
con medio.

El peso de una capa es su posición en la lista. Una clase pelada en `nebula.composite` gana a
cualquier selector de `nebula.primitive`, por retorcido que sea.

## Dónde vive la declaración, y por qué no aquí

En `packages/web/styles.css`, una hoja plana que el consumidor importa antes que nada:

```tsx
import "@stellaria/nebula-web/styles.css";
```

**No puede vivir en este módulo.** El plugin de Vanilla Extract emite el CSS propio de cada archivo
antes que el de sus dependencias (`import "./Hero.css.ts.vanilla.css"` precede a
`import "../../theme/layers.css.ts.vanilla.css"`), y en CSS el orden de una capa queda fijado en su
**primer uso**: el primer componente que cargue impondría su capa como la más débil. Por eso las
capas se crean con `globalLayer` —nombres estables, sin hash— y el orden se declara fuera del grafo
de Vanilla Extract.

Si el consumidor olvida esa importación no hay error: los estilos se pintan y el orden vuelve a
decidirlo el bundler.

## Al escribir un componente

```ts
import { primitive_layer } from "../../theme/layers.css.js";

export const root = style({
  "@layer": { [primitive_layer]: { color: vars.color.text.primary } },
});
```

Toda regla de un componente va en una capa; ninguna se queda fuera. Lo que queda fuera gana al
consumidor, que es justo lo contrario de lo que Nebula quiere.

Los `.vars.css.ts` son la excepción y no llevan capa: declaran variables, no compiten en la cascada.

## En qué capa va un componente

El criterio es la **composición**, no la complejidad: si A renderiza a B y necesita poder
resobrescribirlo, A va en una capa posterior a B. `Title` es primitiva no por ser sencilla, sino
porque `Hero`, `Form` y `AppShell` la consumen.

| capa               | qué contiene                                                                                                           |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `nebula.reset`     | normalizaciones — `Title.nomalize` y equivalentes                                                                      |
| `nebula.primitive` | no compone otro componente estilizado: `Box`, `Text`, `Title`, `Anchor`, `Code`, `Divider`, `Paper`, `Image`, `Loader` |
| `nebula.component` | compone primitivas: `Button`, `TextInput`, `Card`, `Alert`, `Select`, `Menu`, `Tabs`, `Segment`                        |
| `nebula.composite` | compone componentes: `Hero`, `Header`, `Footer`, `Nav`, `AppShell`, `Section`, `CardComplex`, `DataGrid`               |
| `nebula.util`      | sprinkles y style props                                                                                                |

## Por qué todo va dentro de una capa

Una regla **sin capa gana a cualquier regla dentro de una capa**, sin importar la especificidad. Las
cinco anidan bajo el padre `nebula`, así que el bloque entero pierde contra el CSS del consumidor:
`.mi-clase` de la app gana a todo Nebula sin pelear especificidad ni recurrir a `!important`.

Esa es la garantía que ADR-119 cerró con una sola capa y que ADR-142 conserva al subdividirla. Es
también el motivo de que las sprinkles vivan en `nebula.util` en vez de quedarse sin capa: ganan al
componente igual que antes, pero por declaración y no por descuido.

## `base_layer`

Retirado. Era la capa única anterior a ADR-142 y sobrevivió como alias de `component_layer` durante
la migración. Ya no existe: todo el catálogo está clasificado.
