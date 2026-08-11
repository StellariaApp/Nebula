# WN — Revisión y normalización del catálogo web

> Fase posterior a WB. No añade componentes ni cambia identidad visual: **iguala la forma** de los
> 158 que ya existen. Es la última puerta antes de W5 (publicación web v1), porque lo que se publica
> se congela: a partir de v1 cada uno de estos cambios es un _breaking change_.

## Por qué existe esta fase

WB cerró el color. Lo que queda desalineado es la **anatomía**: cuatro convenciones que el catálogo
adoptó a medias porque nacieron después de la mayoría de los componentes.

| Convención                 | Adoptado                               | Falta                                                          |
| -------------------------- | -------------------------------------- | -------------------------------------------------------------- |
| Nombres en las hojas       | ninguno — la regla de lint acepta todo | **~181 símbolos** en 64 hojas, y AppShell ya mixto             |
| `<Nombre>.vars.css.ts`     | 58 componentes                         | **18** declaran `createVar()` en el `.css.ts`                  |
| Compound                   | 9 de 158, en **tres** idiomas          | criterio de cuál lo necesita, idioma único y carpeta de partes |
| Props de ranura (`*Props`) | **ninguno** con la forma canónica      | el patrón entero                                               |
| `surface.hoverActive`      | contrato, 4 temas y 3 consumidores     | **cerrado** (2026-08-05) — ver N4                              |

Ninguna es cosmética. Todas deciden si un consumidor puede ajustar un componente sin forkearlo,
que es el principio que ordena el proyecto.

**Los números están medidos sobre el repo, no estimados** (2026-08-05): 58 componentes con
`.vars.css.ts`, 18 con `createVar()` en la hoja —AppShell, Burger, Carousel, Charts, CodeHighlight,
DragDrop, EditorImage, ImageGallery, Kanban, Lightbox, NProgress, Overlay, Panel, Player,
RichTextEditor, Scroll, ScrollProgress, TransferList— y 83 sin ninguna var local. `Scroll` es el
único mixto: tiene las dos cosas.

## Prompt de arranque — pegar en una sesión limpia

```text
Actúa como ingeniero de UI en C:\Users\Skr13\Documents\GitHub\Nebula.

Fase WN — revisión y normalización del catálogo web. NO se añaden componentes, NO se cambia
identidad visual. Se iguala la forma de los 158 que ya existen, antes de que W5 los congele.

EL PRINCIPIO QUE ORDENA LA FASE:
  **Un consumidor tiene que poder ajustar cualquier componente sin forkearlo.**
  Si para cambiar el peso de un título hay que copiar el componente, el componente está mal.
  La personalización entre productos va por tema; la personalización de una instancia va por
  props de ranura. No hay tercera vía.

ANTES DE TOCAR NADA, LEE EN ESTE ORDEN
  1. CLAUDE.md — guardrails, convenciones (ADR-019) y política de trabajo con el propietario.
  2. docs/patterns/web-component-template.md — la plantilla canónica. Es la vara de medir.
  3. docs/01-architecture.md §anatomía de componente.
  4. Los ADR del rango 080-090 — la calibración de WB, que es de dónde vienes.

--------------------------------------------------------------------------------
N0 · CÓMO SE NOMBRAN LOS SÍMBOLOS DE LAS HOJAS
--------------------------------------------------------------------------------
Estado: nadie decidió nunca cómo se llaman los `export const` de un .css.ts, así que son
camelCase por inercia — ~181 símbolos multipalabra en 64 hojas. AppShell.css.ts ya está
mixto dentro del mismo archivo (`sidebar_container` junto a `sidebarBottom` y `linkGroup`),
que es exactamente el estado que hay que evitar. La regla de lint no lo detecta: hoy
`variable/const/global` acepta ["UPPER_CASE", "snake_case", "PascalCase", "camelCase"],
o sea, todo.

La regla es PARTIDA, y solo se sostiene porque N1 separa los dos archivos:

  .vars.css.ts  → camelCase        bg · fg · bgHover · borderColor · backdropFilter
  .css.ts       → snake_case       root · title · list_row · sidebar_container · icon_wrap

El porqué del corte, que hay que entender antes de aplicarlo:

  - Una var NOMBRA UNA PROPIEDAD CSS. `borderColor` y `backdropFilter` son el nombre de la
    propiedad escrito como lo escribe CSS-in-JS. ADR-019 ya lo decidió y dejó escrito el
    motivo: "los compuestos siguen en camelCase (bgHover, borderColor)… es lo natural en
    el dominio CSS y lo que ya usan las CSS vars locales". Esto NO se toca.
  - Un style() NO nombra una propiedad: es un asa de clase, una constante local del módulo.
    Y para las constantes locales la tabla de ADR-019 ya dice snake_case. Nunca se decidió
    nada sobre ellas; se escribieron camelCase por costumbre del ecosistema.

Excepción: las globales que ya viven en algunas hojas siguen en UPPER_CASE — FONT_LEADING,
PROGRESS, ROLE_COLORS. Son tablas de constantes y nombres de keyframes, no asas de clase.

Enforcement, sin el cual esto no aguanta 158 componentes: dos bloques `files` en
eslint.config.js, uno para **/*.vars.css.ts (camelCase) y otro para **/*.css.ts
(snake_case + UPPER_CASE). Es el mismo argumento que ADR-019 se aplica a sí mismo — la
convención se verifica en el gate lint, no en revisión manual.

Cómo hacerlo: codemod sobre los 64 archivos y sus ~235 líneas de import, EN SU PROPIO
COMMIT y ANTES que todo lo demás. Si se deja para después, cada diff de N3 y N4 mezcla un
renombrado masivo con un cambio de comportamiento y la review deja de ser legible.

No es ADR nuevo: los exports de .css.ts no salen en el barrel de packages/web, así que no
son API pública. Es una enmienda a ADR-019 §1, en el mismo PR que el codemod.

--------------------------------------------------------------------------------
N1 · LAS VARIABLES VIVEN EN SU PROPIO ARCHIVO
--------------------------------------------------------------------------------
Estado: 58 componentes tienen <Nombre>.vars.css.ts; 18 declaran createVar() dentro del
.css.ts; 83 no tienen vars locales y no les hace falta ninguna. Son 18 componentes, no un
barrido del catálogo — mídelo antes de planificar tandas.

Objetivo: todo componente con vars locales expone <Nombre>.vars.css.ts y su hoja lo importa
como espacio de nombres:

    import * as variables from "./Hero.vars.css.js";

Por qué el archivo aparte y no un export más del .css.ts: vanilla-extract evalúa el .css.ts
para emitir CSS, así que importar vars desde él arrastra toda la hoja. Separarlas deja que
otro componente —o una story, o un consumidor— tome la var sin cargar el estilo. El
espacio de nombres, además, hace visible de un vistazo qué es var local y qué es contrato
(vars.* de tokens).

Regla de nombres: la var se llama como la propiedad que gobierna, no como el componente.
`createVar()` asignado a `bg`, no a `heroBg` — el archivo ya da el contexto. Y en camelCase
si es compuesta (N0).

Empieza por Scroll: es el único que tiene las dos cosas a la vez —.vars.css.ts Y createVar()
en la hoja— y por tanto el peor caso. Después, agrupa los 17 restantes por número de vars:
los de 1-2 son mecánicos; los de 5+ merecen mirada porque suelen esconder un contrato
implícito que debería ser prop.

--------------------------------------------------------------------------------
N2 · QUÉ COMPONENTES DEBEN SER COMPOUND, Y DÓNDE VIVEN SUS PARTES
--------------------------------------------------------------------------------
Estado: 9 compounds de 158, en TRES idiomas distintos:

  Object.assign en index.ts    AppShell · Card · Footer · Nav · Segment
  Object.assign en el .tsx     Form (Form.tsx:183) · Table (Table.tsx:200)
  atadura directa              Grid (Grid.tsx:64) · List (List.tsx:74)

No hay criterio escrito de cuándo toca.

Primero **escribe el criterio**, después aplícalo. Propuesta de partida, discútela con el
propietario antes de barrer:

  Es compound si el componente tiene partes que el consumidor necesita REORDENAR o
  SUSTITUIR. Si solo necesita rellenarlas, basta con props de ranura (N3).

  Señales de que falta un compound:
    - una story reimplementa el componente con Box para conseguir un montaje que las
      props no expresan  → esto ya pasó con AppShell y produjo ADR-086;
    - el componente tiene props que solo existen para elegir orden (`reverse`, `iconFirst`);
    - tiene más de tres props de ranura de ReactNode.

Idioma único: Object.assign en index.ts, que es el mayoritario y el que ya usa AppShell.
Migran CUATRO: Form y Table (mueven el Object.assign del .tsx al index.ts) y Grid y List
(la atadura directa impide tree-shaking de las partes no usadas).

DÓNDE VIVEN LAS PARTES — decisión del propietario, 2026-08-05:

  Toda parte de un compound que tenga archivo propio vive en <Padre>/components/.
  SIEMPRE, aunque sea una sola parte: el beneficio es saber dónde mirar sin contar archivos.

  Hoy conviven tres ubicaciones y por eso hace falta la regla: un archivo con 14 partes
  dentro (AppShell/AppShellRail.tsx), hermanos planos con nombre pelado (Nav/Links.tsx,
  Segment/Section.tsx, Grid/Col.tsx) y una carpeta (Scroll/components/Momentum.tsx). Nav
  tiene 17 archivos al mismo nivel, y Nav/Section.tsx y Segment/Section.tsx son
  indistinguibles en una pestaña del editor.

    AppShell/
      AppShell.tsx
      AppShell.types.ts
      AppShell.css.ts          <- hoja ÚNICA, también para las partes
      AppShell.vars.css.ts
      AppShellContext.ts
      components/
        Sidebar.tsx            <- nombre PELADO; exporta AppShellSidebar
        Rail.tsx
        Content.tsx
      __tests__/
        AppShell.test.tsx
        Sidebar.test.tsx       <- los tests NO se mueven
      index.ts

  Las cuatro reglas que la acompañan:
    1. El archivo va pelado (Sidebar.tsx); la carpeta ya da el contexto. Pero el SÍMBOLO
       exportado conserva el prefijo (AppShellSidebar): ya está en el barrel de
       packages/web y renombrarlo sí sería breaking.
    2. Los estilos NO se parten: una sola hoja <Padre>.css.ts para el compound entero.
       Las partes de un compound se usan juntas, así que partirla no gana tree-shaking y
       sí multiplica entradas de size-limit y riesgo de orden de @layer.
    3. components/ aloja SOLO componentes-parte. Hooks (use-nav-active.ts), contexto y
       tipos se quedan planos en el padre.
    4. Los tests siguen en el __tests__/ del padre, como ya hace Scroll.

  Esto NO contradice ADR-019 §3. Esa regla prohíbe carpetas DE CATEGORÍA en la raíz del
  catálogo; una carpeta de partes dentro de un componente es lo contrario — mantiene la
  raíz plana. Dilo explícito en el ADR para que nadie lea un conflicto dentro de seis meses.

  ORDEN: la carpeta se aplica a los 9 compounds actuales ANTES de barrer el catálogo
  buscando candidatos. Si no, el barrido crea compounds nuevos con la forma vieja y los
  mueves dos veces.

Candidatos que la auditoría de WB dejó señalados —verifícalos, no los des por buenos—:
Card, Table, Timeline, Stepper, Accordion, Menu, Modal, Drawer.

--------------------------------------------------------------------------------
N3 · PROPS DE RANURA — EL PATRÓN QUE FALTA
--------------------------------------------------------------------------------
Estado: NINGÚN componente del catálogo expone props de ranura con la forma canónica. Es el
hueco más grande de los cuatro y el que más se nota en un consumidor real.

Forma canónica (la trajo el propietario, respétala):

    export type HeaderProps = Omit<ViewProps, "top"> & {
      title?: ReactNode
      subtitle?: ReactNode
      titleProps?: TextProps
      subtitleProps?: TextProps
      wrapperProps?: ViewProps
      headProps?: ViewProps
      leftSection?: ReactNode
      rightSection?: ReactNode
      top?: ReactNode
      middle?: ReactNode
      bottom?: ReactNode
    }

Las tres reglas que la hacen funcionar:

  1. Por cada nodo que el componente pinta y el consumidor podría querer ajustar, hay un
     `<nodo>Props` con el tipo del componente que lo pinta. `titleProps: TextProps`, no
     `titleProps: Record<string, unknown>`.
  2. Las props de ranura se esparcen DESPUÉS de las que calcula el componente, para que
     el consumidor gane. Excepto className, que se compone con cx.
  3. Si la ranura acepta `string | ReactNode`, el `*Props` solo aplica cuando es string —
     si el consumidor pasa un nodo, ya controla todo. Documéntalo en el .md.

Ojo con exactOptionalPropertyTypes: toda prop opcional pública declara `| undefined`
(`titleProps?: TextProps | undefined`), o el consumidor no puede escribir un ternario.

No lo apliques a los 158. Empieza por los que un consumidor toca de verdad: los de
formulario, los de datos y los de cabecera. Mide el coste en bytes de cada tanda: esto
engorda el bundle y hay 192 entradas de presupuesto en packages/web/.size-limit.js.

--------------------------------------------------------------------------------
N4 · REPARTIR surface.hoverActive — CERRADO el 2026-08-05
--------------------------------------------------------------------------------
Hecho, y la regla resulto ser MAS ESTRECHA que la que decia este tramo. Se deja escrito
porque la lista de candidatos original mandaba a meter el token donde no toca.

Consumidores reales, y son los correctos: DataGrid, Table y TransferList. Los tres son
filas o elementos de lista con seleccion sobre superficie NEUTRA.

LA REGLA, corregida:
  surface.hoverActive es para seleccion sobre superficie neutra.
  Si el estado seleccionado lleva RELLENO DE MARCA, el cruce lo resuelve la escala de esa
  marca, no el sistema de superficies.

Por que. Un NavLink activo esta tenido de accent; al pasar el raton tiene que ahondar ESE
tinte, no saltar a un gris del sistema. Meterle surface.hoverActive le rompe la escala de
color. Lo mismo Calendar, GridPicker y Pagination, que ya lo resuelven con su propia var:

  Calendar      variables.dayBgHover
  NavLink       variables.activeBgHover
  Pagination    variables.accentHover
  Nav           transparent   — el indicador ya marca el activo
  GlobalSearch  usa hover COMO color de activo; no hay cruce que resolver

Si aparece un componente nuevo con seleccion, la pregunta es una sola: cuando esta
seleccionado, ¿su fondo sale de surface o de una escala? Si es surface, usa hoverActive.

--------------------------------------------------------------------------------
N5 · MEJORAS DE CÓDIGO, DISEÑO Y ARQUITECTURA
--------------------------------------------------------------------------------
Mientras recorres cada componente, anota —no arregles sobre la marcha— lo que encuentres:

  - recetas de variante duplicadas que deberían salir de ResolveVariant;
  - valores literales donde debería haber un token (busca px, #hex y ms sueltos);
  - componentes que leen useTheme() solo para un color que ya viaja como var;
  - props booleanas que se excluyen entre sí y piden ser una unión;
  - .md ausente o desactualizado — ADR-019 exige que lo que necesite explicación viva ahí,
    porque el código no lleva comentarios;
  - a11y: nombre accesible, foco visible y orden de tabulación en los compounds nuevos.

Junta los hallazgos en docs/reviews/ y llévalos al propietario por lotes, con opciones y
recomendación. No abras un ADR por cada uno: agrúpalos por causa.

Si al repartir hoverActive (N4) aparecen más huecos de estado —un "activo deshabilitado",
un "seleccionado sin foco"— anótalos aquí. El contrato se amplía con ADR, no sobre la marcha.

--------------------------------------------------------------------------------
CÓMO TRABAJAR
--------------------------------------------------------------------------------
- Por tandas de 8-12 componentes, con los gates en verde entre tanda y tanda. N0 es la
  excepción: va entero en un commit, porque partirlo deja el catálogo en dos idiomas.
- Gates: pnpm turbo build typecheck lint · pnpm turbo test · pnpm --filter playground-web a11y
  · pnpm --filter @stellaria/nebula-web size. Si tocas tokens o temas, además check:contrast.
- El presupuesto de tamaño es un gate, no una sugerencia. Si una tanda lo revienta, para y
  decide con el propietario si sube el presupuesto o se recorta el patrón.
- N0 es enmienda a ADR-019 (no ADR nuevo: los exports de .css.ts no son API pública).
  N1 y N2 cambian API pública → ADR previo. N3 solo añade props opcionales, pero el patrón
  entero merece un ADR que lo fije de una vez.
- Commits convencionales con scope de Nebula. Una tanda, un commit.
```

## Orden sugerido

`N0` primero y en un solo commit: es puro renombrado, y hacerlo después ensucia todos los diffs
posteriores. `N4` segundo, porque no depende de nada, el token ya está pagado en los 4 temas y es el
único que el usuario nota en pantalla. `N1` después: son 18 componentes, mecánico, y deja los
`.css.ts` con solo asas de clase, que es lo que hace legible la regla de N0. `N2` a continuación
—primero la carpeta sobre los 9 que ya existen, después el barrido de candidatos—, porque el
criterio de compound decide qué componentes reciben `N3`. `N5` corre en paralelo como cuaderno de
campo.

## Lo que esta fase NO hace

No toca color, ritmo, radio ni tipografía —eso lo cerró WB—. No añade componentes al catálogo. No
migra a los consumidores. Si aparece un hueco de catálogo, se anota en `N5` y se decide fuera de WN.
