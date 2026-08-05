# ADR-097 — Criterio de compound y dónde viven las partes

- **Estado**: aceptada · 2026-08-05 (decisión del propietario durante N2)
- **Cambia API pública**: `Form` y `Table` exportan sus partes por nombre; `Grid` y `List` dejan la atadura directa

## Contexto

El catálogo tenía nueve compounds en **tres** idiomas distintos y ninguna regla escrita sobre cuándo
un componente debe serlo ni sobre dónde viven sus partes:

| idioma                        | componentes                                  |
| ----------------------------- | -------------------------------------------- |
| `Object.assign` en `index.ts` | AppShell · Card · Footer · Nav · Segment      |
| `Object.assign` en el `.tsx`  | Form · Table                                  |
| atadura directa (`X.Y = Z`)   | Grid · List                                   |

Y **tres** ubicaciones para las partes: un archivo con catorce partes dentro
(`AppShell/AppShellRail.tsx`), hermanos planos con nombre pelado (`Nav/Links.tsx`,
`Segment/Section.tsx`, `Grid/Col.tsx`) y una carpeta (`Scroll/components/Momentum.tsx`). `Nav` tenía
diecisiete archivos al mismo nivel, y `Nav/Section.tsx` y `Segment/Section.tsx` eran
indistinguibles en una pestaña del editor.

## Decisión

### 1. El criterio

> Es compound si el consumidor necesita **reordenar o sustituir** sus partes.
> Si solo necesita **rellenarlas**, bastan props de ranura (N3).

La atadura directa se abandona: `X.Y = Z` muta el componente después de crearlo, así que el bundler
no puede demostrar que `Z` sea prescindible y lo retiene siempre. `Object.assign` en `index.ts` con
`/* @__PURE__ */` sí es analizable, y las partes se exportan además por nombre para que un consumidor
que solo quiera `TableRow` no arrastre la tabla entera.

### 2. Dónde viven las partes

Toda parte con archivo propio vive en `<Padre>/components/`, siempre, aunque sea una sola:

```
Grid/
  Grid.tsx
  Grid.css.ts          <- hoja UNICA del compound
  Grid.vars.css.ts
  components/
    Col.tsx            <- nombre pelado; exporta GridCol
  __tests__/
  index.ts
```

Cuatro reglas la acompañan:

1. **El archivo va pelado** (`Col.tsx`); la carpeta ya da el contexto. El **símbolo exportado
   conserva el prefijo** (`GridCol`): está en el barrel y renombrarlo sería _breaking_.
2. **Los estilos no se parten**: una sola `<Padre>.css.ts` para el compound entero. Las partes se
   usan juntas, así que partirla no gana _tree-shaking_ y sí multiplica entradas de `size-limit` y
   riesgo de orden de `@layer`.
3. `components/` aloja **solo componentes-parte**. Hooks (`use-nav-active.ts`), contexto y tipos se
   quedan planos en el padre.
4. Los tests siguen en el `__tests__/` del padre, como ya hacía `Scroll`.

Esto **no** contradice ADR-019 §3. Esa regla prohíbe carpetas de _categoría_ en la raíz del
catálogo; una carpeta de partes dentro de un componente es lo contrario — mantiene la raíz plana.

## Qué se aplicó

- **Idioma**: `Grid` y `List` dejan la atadura directa; `Form` y `Table` suben su `Object.assign` al
  `index.ts`. Para ello sus partes pasan a exportarse con prefijo —`TableRow`, `TableCell`,
  `FormHeader`…—, obligatorio porque `Title` y `Cell` a secas chocarían con componentes del catálogo.
- **Carpeta**: nueve archivos movidos — `Nav` (4), `Segment` (3), `Grid` (1), `List` (1).
- `FormDelete` consumía `Form.Content` y `Form.Footer`; ahora importa `FormContent` y `FormFooter`
  directos. Importarlos desde `index.js` habría creado un ciclo, porque el `index` importa
  `FormDelete`.
- `Grid` y `List` exportan sus interfaces (`GridRoot`, `GridColComponent`…): sin eso TypeScript no
  puede nombrar el tipo que produce `Object.assign` y falla con TS4023.

## Lo que el barrido midió, y por qué no se aplicó

El prompt de WN señalaba ocho candidatos —Card, Table, Timeline, Stepper, Accordion, Menu, Modal,
Drawer— y pedía verificarlos. Verificados, **la lista no se sostiene**:

- `Card` y `Table` ya eran compound.
- `Timeline`, `Stepper`, `Accordion` y `Menu` reciben su contenido como **array de datos**
  (`items`, `steps`, `data`). El consumidor no reordena partes: pasa datos. Convertirlos en compound
  no es normalizar, es añadir una API de composición nueva junto a la existente.
- `Modal` y `Drawer` no tienen partes que separar.

De las tres señales que el prompt proponía, una **no existe** en el catálogo: cero props del tipo
`reverse` o `iconFirst`. Y `order`, que parecía serlo en Hero, Section y Header, es el **nivel del
encabezado** (`1|2|3|4|5|6`), no el orden de las partes.

La señal que sí discrimina es el número de ranuras `ReactNode`. Ordenados, los no-compound que más
tienen: `Kanban` (12), `Hero` (9), `Section` (8), `CardComplex` (7), `EmptyModule` (7), `Charts` (6),
`Header` (6). Los siete se revisaron uno a uno en
[`docs/reviews/wn-n2-candidatos-a-compound-2026-08-05.md`](../reviews/wn-n2-candidatos-a-compound-2026-08-05.md);
solo **dos** —`Hero` y `Section`— cumplen el criterio. `Kanban` ya resuelve la sustitución con una
render prop, `CardComplex` es un preset de `Card`, y `Header`, `EmptyModule` y `Charts` son
rellenables, no componibles: van a N3.

Ninguno se convirtió: crear un compound es **API pública nueva**, y WN declara que no añade catálogo.
Queda a decisión del propietario abrirlo dentro de WN o después de W5.

## Lo que apareció al partir AppShell

`AppShellRail.tsx` tenía catorce partes y **una función muerta**: `AppShellRail`, que ningún módulo
importaba ni renderizaba. Quedó huérfana en el refactor de ADR-086, cuando `AppShell.tsx` pasó a
pintar el carril él mismo. Se borra con el split.

El mismo archivo importaba `Box` desde `../../index.js` —el barrel del paquete— dentro de un
componente. Es un ciclo esperando a ocurrir, y se corrige a `../../Box/Box.js` al repartir las
partes. Era el único caso del catálogo.

`SIDEBAR_WIDTH` y `CHROME_HEIGHT` viajaban en ese mismo archivo y los consume `AppShell.tsx`; pasan a
`constants.ts`, que no es una parte y por eso no vive en `components/`.
