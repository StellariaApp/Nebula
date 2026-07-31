# DirectionProvider

## Hace dos cosas, y la segunda es la que importa

1. Pone `dir` en un contenedor, que es lo obvio.
2. **Envuelve el subárbol en el `I18nProvider` de React Aria** con un locale RTL, que es lo que
   realmente hace funcionar el catálogo al revés.

Sin lo segundo, `dir="rtl"` voltea el CSS pero React Aria sigue pensando en LTR: las flechas de un
listbox se mueven al lado equivocado, un `placement="start"` de Popover resuelve a la izquierda y el
arrastre por teclado calcula mal. Toda la lógica direccional de Aria sale de su locale, no del atributo
`dir`.

## La auditoría RTL de W4.3

Barrido de propiedades físicas sobre `src/components/*/*.css.ts`, `src/styles` y `src/collections`.
Resultado: **el catálogo ya estaba escrito en propiedades lógicas** (`paddingInline*`, `marginBlock*`,
`insetInline*`, `borderInline*`, `textAlign: start`). Tres hallazgos, uno real:

1. **Real — las style props `pl`/`pr`/`ml`/`mr` de sprinkles** mapeaban a `padding-left` y compañía,
   que no voltean. Se **añaden** `ps`/`pe`/`ms`/`me` (inline start/end) y `ta="start"|"end"`. Las
   físicas se conservan: su nombre dice «left» y quien la escribe quiere la izquierda de verdad.
2. **Falso positivo — la flecha de `Popover` y `Tooltip`** usa `left`/`right` bajo un selector de
   `data-placement`. React Aria **ya resuelve** el placement lógico al físico según el locale, así que
   cuando llega `left` es la izquierda real. Voltearlo lo rompería.
3. **Deliberado — `direction: ltr` en los bloques de código** de `CodeHighlight`,
   `TypographyStylesProvider` y el `<pre>` del `RichTextEditor`. El código fuente no se lee al revés en
   ningún idioma.

## El hook sin provider no lanza

`useDirection()` fuera del provider devuelve `ltr` con setters vacíos en vez de reventar. Es un
componente opcional —la inmensa mayoría de las apps no lo montan— y un hook que exigiera contexto
convertiría un provider opcional en obligatorio para cualquiera que lo consulte.
