# ADR-142 — La cascada se declara por capas, no por orden de archivo

- **Estado**: **aceptada** · 2026-08-13 — aprobada por el propietario en WN
- **Enmienda**: [ADR-119](ADR-119-el-radio-lo-manda-la-style-prop.md), que cerró el contrato de
  cascada con una sola capa (`nebula.base`) y las sprinkles fuera de capa. Ese contrato resolvía la
  relación Nebula↔consumidor y dejaba sin resolver la relación Nebula↔Nebula.
- **Afecta**: `theme/layers.css.ts`, los 133 `.css.ts` que hoy escriben en `base_layer`, y las
  sprinkles de `Box.css.ts` / `Box.open.css.ts`.

## Contexto

`base_layer` existe para que los estilos del componente **pierdan**. Está en
`docs/patterns/web-component-template.md` §2 sin rodeos: sin capa, la clase base empata a 0-1-0 con
la clase atómica de sprinkles y pisa en silencio la style prop del consumidor. ADR-119 lo cerró así y
funciona: en CSS lo no encapado gana a lo encapado sin importar la especificidad, de modo que
`fz="xl"` gana siempre al `fontSize` interno.

Lo que ese contrato no fija es **el orden de Nebula contra sí mismo**. Una sola capa es un único
cajón: dentro, todas las reglas son clases a 0-1-0 y el desempate cae al último criterio de la
cascada, el orden de aparición en la hoja. Y ese orden no lo decide el diseño, lo decide el recorrido
del grafo de módulos del bundler.

`Hero` compone `Title` y le pasa su tamaño por `className` (`Hero/components/Title.tsx:21`):

```tsx
<Title order={hero.order} className={cx(styles.title, styles.title_size[hero.size], …)}>
```

`Title` aplica lo suyo dentro (`Title/Title.tsx:19`), y como `Title.css.ts` cae después en la hoja
emitida, gana. `Hero.title_size.xl` pierde `fontSize`, `lineHeight` y `letterSpacing`; `Hero.title`
pierde `fontWeight`, `lineHeight` y `margin`. El `xl` de un `Hero` no existe.

**`cx` no puede arreglarlo.** El orden de las clases dentro del atributo `class` no participa en la
cascada. No hay orden de argumentos que cambie el resultado.

### Cuatro envoltorios, cuatro estrategias, dos rotas

`Title` se compone desde cuatro sitios y ninguno resuelve el problema igual:

| envoltorio        | cómo estiliza el título                                 | resultado                            |
| ----------------- | ------------------------------------------------------- | ------------------------------------ |
| `Hero.Title`      | `className={cx(styles.title, styles.title_size[size])}` | **muerto** — `Title.orders` gana     |
| `Form`            | `className={cx(styles.title)}`, solo `margin: 0`        | inerte — duplica el reset `nomalize` |
| `AppShell.Header` | `fz="h6"`, style prop                                   | funciona — sprinkles sin capa        |
| `Section.Title`   | no usa `Title`: `<h2>` crudo y tipografía a mano        | esquiva la primitiva                 |

Los dos que funcionan lo hacen **saliéndose del sistema de estilos del componente**: uno por la
escotilla de las style props, el otro no componiendo. `Section.css.ts:74-84` reimplementa `margin`,
`fontSize`, `fontWeight`, `lineHeight` y `color` para un `<h2>` que `Title` ya sabía pintar.

Esa es la señal que motiva el ADR: la capa que falta no produce solo un bug, **produce
duplicación**. Con 541 sitios que pasan `className={cx(styles.…)}` a otro nodo, el patrón está en
todo el catálogo y hoy cada uno de ellos gana o pierde según el orden del bundle.

### Y el orden del bundle no es estable

Con code-splitting el orden de los chunks depende de la ruta. Los islands de `apps/web` cargan
subconjuntos distintos del catálogo por página, así que el mismo par de componentes puede resolverse
en un sentido en una ruta y en el contrario en otra. No es un orden incorrecto que se pueda corregir:
es un orden que no está definido.

## Decisión

**1. Cinco capas anidadas bajo un padre `nebula`, declaradas en un único sitio.**

```
@layer nebula.reset, nebula.primitive, nebula.component, nebula.composite, nebula.util;
   más débil ────────────────────────────────────────────────────────────► más fuerte
```

El peso no es un número: **es la posición en la lista**. Y la capa se evalúa antes que la
especificidad, de modo que una clase pelada en `nebula.composite` gana a cualquier selector de
`nebula.primitive` por retorcido que sea. El desempate deja de emerger del build y pasa a estar
declarado.

**1-bis. La declaración se emite desde una hoja plana que el consumidor importa, no desde
`layer()`.** La prueba de concepto demostró que declararla con `layer()` en `theme/layers.css.ts` **no
funciona**, y el motivo es determinista: el plugin de Vanilla Extract emite el CSS propio del archivo
**antes** que el de sus dependencias.

```js
// dist/components/Hero/Hero.css.js
import "./Hero.css.ts.vanilla.css";
import "../../theme/layers.css.ts.vanilla.css";
```

Como en CSS el orden de una capa queda fijado en su **primer uso** y una declaración posterior ya no
lo reordena, el primer componente que cargue impone su capa como la más débil. Con `Hero` antes que
`Title` el orden emitido era `composite → reset → primitive → component → util`: `composite` la más
débil y `Hero` perdiendo otra vez. La lotería del bundler no desaparecía, cambiaba de cara.

Por eso las capas se declaran con `globalLayer` —nombres estables, sin hash— y el orden vive en
`packages/web/styles.css`, una hoja plana de una línea que se exporta como
`@stellaria/nebula-web/styles.css` y que **el consumidor importa antes que nada**:

```css
@layer nebula.reset, nebula.primitive, nebula.component, nebula.composite, nebula.util;
```

Verificado sobre el bundle con el peor orden posible (`Hero` primero): el optimizador lee la
declaración y **reordena los bloques** para respetarla.

```
@layer nebula.reset     { .Title_nomalize }
@layer nebula.primitive { .Title_orders }
@layer nebula.composite { .Hero_title, .Hero_title_size_xl }   ← gana
```

**2. El criterio de clasificación es la composición, no la complejidad.** Si A renderiza a B y
necesita poder resobrescribirlo, A va en una capa posterior a B. Es un orden topológico, no un juicio
sobre lo elaborado que sea un componente: `Title` no es primitiva por ser sencilla, sino porque
`Hero`, `Form` y `AppShell` la consumen.

| capa               | qué contiene                                                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `nebula.reset`     | normalizaciones — `Title.nomalize` y equivalentes                                                                             |
| `nebula.primitive` | lo que no compone otro componente estilizado: `Box`, `Text`, `Title`, `Anchor`, `Code`, `Divider`, `Paper`, `Image`, `Loader` |
| `nebula.component` | compone primitivas: `Button`, `TextInput`, `Card`, `Alert`, `Select`, `Menu`, `Tabs`, `Segment`                               |
| `nebula.composite` | compone componentes: `Hero`, `Header`, `Footer`, `Nav`, `AppShell`, `Section`, `CardComplex`, `DataGrid`, `CommandPalette`    |
| `nebula.util`      | sprinkles y style props                                                                                                       |

**3. Las sprinkles pasan a `nebula.util` en vez de quedarse sin capa.** El resultado frente a los
componentes es el mismo que hoy —siguen ganando—, pero pasa a estar **declarado** en vez de depender
de que nadie les ponga una capa por descuido. Es la garantía que ADR-119 buscaba, ahora escrita.

**4. Lo que ADR-119 cerró se conserva entero.** Las cinco capas anidan bajo `nebula`, así que todo
sigue dentro de una capa y **cualquier CSS sin capa del consumidor gana al bloque completo**. La
propiedad que justificaba `base_layer` no se toca; se subdivide.

De hecho mejora en un punto: hoy las sprinkles sin capa empatan a 0-1-0 con las clases sin capa del
consumidor y decide el orden del bundle. Con `nebula.util` el consumidor gana de forma determinista.

**5. `base_layer` desaparece.** Sobrevivió como alias de `component_layer` durante la migración y se
retiró al clasificar el último archivo. El catálogo entero está en su capa.

### La taxonomía se validó midiendo, no razonando

La clasificación se derivó del grafo de composición del catálogo, no a mano: profundidad 0 →
`primitive`, 1 → `component`, ≥2 → `composite`.

**La profundidad real llega a 5** —`Search → Filters → MultiSelect → Select → FormField`—, lo que
deja las profundidades 2 a 5 compartiendo la capa `composite`. Eso solo importa si dos componentes de
la misma capa se resobrescriben, así que se midió: de los **151 pares** en los que un componente pasa
`className={cx(styles.…)}` a otro componente de Nebula, **ninguno queda en la misma capa**. Tres
peldaños de contenido linealizan todas las relaciones de sobrescritura que el catálogo tiene hoy.

Reparto resultante, verificado sobre el `dist`:

| capa               | hojas |
| ------------------ | ----- |
| `nebula.reset`     | 1     |
| `nebula.primitive` | 51    |
| `nebula.component` | 36    |
| `nebula.composite` | 45    |
| `nebula.util`      | 2     |

Los módulos de estilo compartidos (`collections/option-list`, `styles/field`, `styles/noise`,
`fields/*`) se clasificaron con el mismo criterio: son ingredientes, así que van por debajo de quien
los compone.

## Alternativas

**Reorganizar los componentes en carpetas numeradas (`1-primitives/`, `2-complex/`).** Era la
propuesta inicial del propietario y se descartó porque no funciona: los bundlers no ordenan el CSS
por nombre de carpeta, lo ordenan por recorrido del grafo de módulos. Renombrar carpetas no cambia
una línea del orden de emisión, y con code-splitting el orden sigue variando por ruta. Habría sido un
refactor de 158 componentes con el bug intacto.

**Subir especificidad en los envoltorios** (`.hero .title`, doble clase). Descartada: es la carrera
armamentística que `@layer` existe para terminar, y rompe la escotilla del consumidor —cada peldaño
de especificidad que gana Nebula es uno que el consumidor tiene que igualar—.

**Dejar que cada envoltorio use style props, como hace `AppShell.Header`.** Funciona hoy y seguirá
funcionando, pero no es respuesta: solo cubre lo que las sprinkles expresan, y convierte la escotilla
del consumidor en el mecanismo interno de la librería. No habría arreglado `Section`, cuyo problema
es tipografía completa, no una prop.

**Tres capas en vez de cinco.** Es el mínimo que arregla `Hero`/`Title`, pero deja sin sitio propio
ni al reset ni a las sprinkles, que son justo los dos extremos donde el contrato de ADR-119 vive.

## Consecuencias

- **El bug de `Hero` desaparece por construcción, no por ajuste.** `Hero.title_size.xl` gana a
  `Title.orders[1]` porque está en una capa posterior, sin tocar especificidad ni el orden de `cx`.

- **`Section` y `Form` pasan a tener una salida que hoy no tienen.** `Section.Title` podrá componer
  `Title` y sobrescribir su tipografía desde `nebula.composite`, retirando la duplicación de
  `Section.css.ts:74-84`. No entra en este ADR —es trabajo de WN sobre esos dos componentes— pero
  queda desbloqueado.

- **La clasificación resultó mecánica, no manual.** El criterio se pudo derivar del grafo de imports
  y aplicar de una vez a los 130 archivos restantes. El censo a mano que se temía no hizo falta, y el
  resultado es reproducible: recalcular el grafo devuelve la misma partición.

- **Las sprinkles pasan a `nebula.util` sin perder nada.** `defineProperties` de sprinkles acepta
  `'@layer'`, así que `Box.css.ts` y `Box.open.css.ts` entran en capa sin cambiar de comportamiento
  frente a los componentes. Lo que sí cambia —y es el objetivo— es que el CSS del consumidor pasa a
  ganarles de forma determinista en vez de por orden de bundle.

- **Importar `@stellaria/nebula-web/styles.css` pasa a ser obligatorio para el consumidor.** Es lo
  único que este ADR añade al contrato público de consumo, y es la contrapartida de la decisión 1-bis:
  sin esa hoja, el orden de las capas vuelve a decidirlo el primer componente que cargue. Nebula no
  tenía hasta ahora ninguna hoja global —todo el CSS entra por side-effect de cada componente—, así
  que no había dónde colocar la declaración sin crearla.

  **Falla en silencio si se olvida**, así que lo cubre un gate: `pnpm check:layers`
  (`tools/check-layers.mjs`) verifica que la declaración de `styles.css` liste exactamente las capas
  que define `layers.css.ts`, que ninguna hoja emita reglas fuera de capa, y que toda app de `apps/`
  que dependa de `@stellaria/nebula-web` importe la hoja. Va fuera de turbo porque cruza `apps/` y
  `packages/`. Los tres modos de fallo se probaron rompiéndolos a propósito.

- **El riesgo técnico se midió y se materializó.** Era el único punto que no se podía afirmar desde
  el código, y la prueba de concepto sobre `Title` y `Hero` lo cazó con dos archivos tocados en vez
  de 133: `layer()` a secas no ordena nada, por la emisión propio-antes-que-dependencias descrita en
  1-bis. El plan de migración por lotes no cambia; lo que cambia es que el lote 0 incluye la hoja
  plana y su cableado en los consumidores.

- **`docs/patterns/web-component-template.md` cambia de instrucción.** Deja de decir «`@layer` es
  obligatorio en los estilos base» para decir en qué capa va cada componente y por qué. Se actualiza
  en el mismo PR que retire el alias, no antes: mientras el alias viva, la instrucción vigente sigue
  siendo correcta.

- **El presupuesto de bytes no debería moverse.** Las capas no añaden reglas, solo envuelven las
  existentes; el coste es el texto de los `@layer` anidados en el CSS emitido. Se mide al cerrar la
  migración, no en la prueba de concepto, donde el delta sería ruido.
