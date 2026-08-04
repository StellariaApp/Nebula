# WN — Revisión y normalización del catálogo web

> Fase posterior a WB. No añade componentes ni cambia identidad visual: **iguala la forma** de los
> 158 que ya existen. Es la última puerta antes de W5 (publicación web v1), porque lo que se publica
> se congela: a partir de v1 cada uno de estos cambios es un _breaking change_.

## Por qué existe esta fase

WB cerró el color. Lo que queda desalineado es la **anatomía**: tres convenciones que el catálogo
adoptó a medias porque nacieron después de la mayoría de los componentes.

| Convención               | Adoptado                     | Falta                                     |
| ------------------------ | ---------------------------- | ----------------------------------------- |
| `<Nombre>.vars.css.ts`   | 58 componentes               | **75** declaran `createVar()` en el `.css.ts` |
| Compound                 | 9 de 158, en **dos** idiomas | criterio de cuál lo necesita, e idioma único |
| Props de ranura (`*Props`) | **1** archivo del catálogo | el patrón entero                          |
| `surface.hoverActive`    | el contrato (ADR-088)        | **el reparto**: ningún componente lo usa todavía |

Ninguna es cosmética. Las tres deciden si un consumidor puede ajustar un componente sin forkearlo,
que es el principio que ordena el proyecto.

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
N1 · LAS VARIABLES VIVEN EN SU PROPIO ARCHIVO
--------------------------------------------------------------------------------
Estado: 58 componentes tienen <Nombre>.vars.css.ts; 75 declaran createVar() dentro del
.css.ts. La convención está a medias y por eso nadie la sigue.

Objetivo: todo componente con vars locales expone <Nombre>.vars.css.ts y su hoja lo importa
como espacio de nombres:

    import * as variables from "./Hero.vars.css.js";

Por qué el archivo aparte y no un export más del .css.ts: vanilla-extract evalúa el .css.ts
para emitir CSS, así que importar vars desde él arrastra toda la hoja. Separarlas deja que
otro componente —o una story, o un consumidor— tome la var sin cargar el estilo. El
espacio de nombres, además, hace visible de un vistazo qué es var local y qué es contrato
(vars.* de tokens).

Regla de nombres: la var se llama como la propiedad que gobierna, no como el componente.
`createVar()` asignado a `bg`, no a `heroBg` — el archivo ya da el contexto.

Empieza por medir: lista los 75 y agrúpalos por número de vars. Los de 1-2 vars son
mecánicos; los de 5+ merecen mirada porque suelen esconder un contrato implícito que
debería ser prop.

--------------------------------------------------------------------------------
N2 · QUÉ COMPONENTES DEBEN SER COMPOUND
--------------------------------------------------------------------------------
Estado: 9 compounds de 158, y en dos idiomas distintos —Object.assign en index.ts (7) y
atadura directa (Grid, List)—. No hay criterio escrito de cuándo toca.

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
Migra Grid y List. La atadura directa impide tree-shaking de las partes no usadas.

Candidatos que la auditoría de WB dejó señalados —verifícalos, no los des por buenos—:
Card, Table, Timeline, Stepper, Accordion, Menu, Modal, Drawer.

--------------------------------------------------------------------------------
N3 · PROPS DE RANURA — EL PATRÓN QUE FALTA
--------------------------------------------------------------------------------
Estado: UN archivo del catálogo expone props de ranura. Es el hueco más grande de los tres.

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

No lo apliques a los 158. Empieza por los que un consumidor toca de verdad: los de
formulario, los de datos y los de cabecera. Mide el coste en bytes de cada tanda: esto
engorda el bundle y hay presupuestos por componente.

--------------------------------------------------------------------------------
N4 · REPARTIR surface.hoverActive
--------------------------------------------------------------------------------
El contrato ganó surface.hoverActive: el fondo de algo que YA está activo y además
recibe el ratón. Hasta ahora ese estado no existía, así que cada componente lo resolvía
de una de dos maneras, las dos malas:

  (a) el hover no se aplica cuando el elemento está activo → el ratón no da respuesta
      justo sobre lo que el usuario está a punto de pulsar;
  (b) el hover pisa al activo → el elemento seleccionado se disfraza de no seleccionado
      mientras lo señalas, que es peor.

La regla: si un componente tiene a la vez estado activo/seleccionado y respuesta a hover,
necesita hoverActive. Se aplica en el selector combinado, nunca sustituyendo a active:

    selectors: {
      "&[data-selected]": { background: vars.color.surface.active },
      "&[data-selected]:hover": { background: vars.color.surface.hoverActive },
    }

Barre el catálogo buscando el patrón. Los que casi seguro lo piden —verifícalos, la lista
sale de leer los tipos, no de medir el render—:

  navegación   NavLink, Nav, AppShell.Sidebar, Tabs, Segment, Stepper, Breadcrumbs
  selección    Menu, Select, Combobox, Autocomplete, MultiSelect, CommandPalette,
               GlobalSearch, ListBox, TransferList
  datos        Table, DataGrid, Kanban, Calendar, DatePicker, TimePicker
  control      Chip, Tag, ToggleButton, SegmentedControl, Rating, ColorSwatch

Dos cosas que NO son hoverActive:
  - el hover de un botón normal, que no tiene estado activo persistente — ese es hover;
  - el :active de CSS (botón pulsado). El token nombra "seleccionado", no "pulsado".
    Si un componente usa surface.active para el pulsado, está mal y es hallazgo de N5.

Cuando lo apliques, comprueba los dos esquemas: en oscuro hoverActive es un peldaño MÁS
CLARO que active, y en claro uno más OSCURO. Un componente que lo dé por sentado en una
dirección se rompe al cambiar de tema.

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
- Por tandas de 8-12 componentes, con los gates en verde entre tanda y tanda.
- Gates: pnpm turbo build typecheck lint · pnpm turbo test · pnpm --filter playground-web a11y
  · pnpm --filter @stellaria/nebula-web size. Si tocas tokens o temas, además check:contrast.
- El presupuesto de tamaño es un gate, no una sugerencia. Si una tanda lo revienta, para y
  decide con el propietario si sube el presupuesto o se recorta el patrón.
- N1 y N2 cambian API pública → ADR previo. N3 solo añade props opcionales, pero el patrón
  entero merece un ADR que lo fije de una vez.
- Commits convencionales con scope de Nebula. Una tanda, un commit.
```

## Orden sugerido

`N1` primero: es mecánico, no toca API pública y deja los `.css.ts` legibles para las otras dos.
`N2` después, porque el criterio de compound decide qué componentes reciben `N3`. `N4` puede ir en
cualquier momento —no depende de las otras tres— y conviene hacerlo pronto, porque es el único que
el usuario nota en pantalla. `N5` corre en paralelo como cuaderno de campo.

## Lo que esta fase NO hace

No toca color, ritmo, radio ni tipografía —eso lo cerró WB—. No añade componentes al catálogo. No
migra a los consumidores. Si aparece un hueco de catálogo, se anota en `N4` y se decide fuera de WN.
