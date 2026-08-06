# glyphs

Los iconos de **cromado**: la paloma de `Checkbox`, el chevrón de `Select`, la X de `ButtonClose`.
Son identidad visual del componente, no contenido, y por eso viven aquí y no en el registro de
`@stellaria/nebula-icons`.

## Por qué el registro no sirve para esto

`Icon name="check"` resuelve contra un `Map` que **puebla el consumidor** con `RegisterIcons`, y los
packs importan de `lucide-react`, que es peer **opcional**. Dos consecuencias que lo descartan para
el cromado:

1. Un `Checkbox` en un consumidor que no instaló lucide o no llamó a `RegisterIcons` se pintaría
   **sin su paloma, en silencio**: `RenderIcon` devuelve `null` cuando el nombre no resuelve. El
   componente dejaría de bastarse a sí mismo.
2. Un `Map` con clave string es **opaco al bundler**. No puede cargar "solo el que necesitas": carga
   el pack que se registró entero.

La distinción, entonces:

- **Cromado** —lo que pinta el componente por su cuenta— sale de aquí. Cero configuración, cero peer
  deps, y tree-shaking real porque son exports ESM planos y el paquete declara `sideEffects: ["*.css"]`.
- **Contenido** —lo que el consumidor mete en un `Button`, un `NavLink`, un `EmptyState`— sigue
  viajando como `ReactNode`, y ahí el registro es exactamente su sitio.

## Lo que sí se reutiliza

Todo menos el carril del registro. Cada glifo tiene la forma `IconComponent` de
`@stellaria/nebula-icons`, así que funciona con `Icon`, `CreateIcons`, `RegisterIcons` y
`RenderIcon` sin adaptador. Está fijado por tipo en `src/__checks__/glyphs.test-d.ts`.

## Lo que arregla

Antes había **42 `<svg>` en 32 archivos y 32 cuerpos distintos**, con el mismo glifo dibujado de
varias formas:

| Glifo    | Geometrías que convivían                                                       |
| -------- | ------------------------------------------------------------------------------ |
| paloma   | `M20 6 9 17l-5-5` · `M5 12l5 5L20 7` · `M5 12l5 5L20 6`                          |
| lupa     | mango `-3.5` · `-3.5` con otra sintaxis · `-4.3`                                 |
| chevrón  | `m9 18 6-6-6-6` y `M9 18l6-6-6-6`, misma forma escrita de dos maneras            |
| X        | mismo trazo con `strokeWidth` 2 y 3                                              |

`ButtonCopy` y `Checkbox` diferían **en una unidad** (`L20 7` contra `L20 6`). Eso no es una decisión
de diseño, es deriva de copiar y pegar.

`Glyph` fija los atributos compartidos —`viewBox`, `fill`, `stroke`, `strokeWidth`, los remates
redondos, `aria-hidden`— en un solo sitio. Cambiar el grosor de toda la librería es cambiar una
línea. Y como acepta `SVGProps`, un componente que necesite otro peso escribe
`<Check strokeWidth={3} />` sin salirse del sistema.
