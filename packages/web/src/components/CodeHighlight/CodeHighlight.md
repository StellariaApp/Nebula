# CodeHighlight

## No resalta, y eso es la decisión

[ADR-061](../../../../../docs/adr/ADR-061-rich-content-tiptap-y-dependencias-de-w43.md) cierra lo que
W2.2 dejó abierto («evalúa syntax highlighting como subpath por peso»): **no entra ningún resaltador**.
El componente aporta lo que aporta un design system —superficie temada, numeración, scroll, copia y
pestañas por fichero— y el léxico lo pone quien tiene el código.

Dos modos:

- **`code`** — texto plano. Se pinta como texto en un `<code>`, así que es seguro por construcción: un
  `<script>` en la cadena se ve, no se ejecuta (hay test).
- **`html`** — markup ya resaltado, inyectado con `dangerouslySetInnerHTML`.

## `html` es una superficie de confianza

Inyectar HTML es exactamente lo que la prop promete, y por eso el nombre es explícito. **Sanearlo es
responsabilidad de quien lo produce.** El caso previsto es resaltar en servidor o en build —Shiki en un
RSC o en el pipeline de docs—, donde el HTML lo genera tu propio código y no un usuario. Si el origen
es contenido de usuario, sanea antes o usa `code`.

Queda anotado en ADR-061 §Consecuencias y va al README de consumo de W5.

## `StripTags` existe por el botón de copia

Con `html`, el `<code>` contiene elementos de resaltado, así que copiar el `textContent` traería el
markup a medias. `StripTags` quita las etiquetas y decodifica las cinco entidades que un resaltador
emite, de modo que lo que llega al portapapeles es el código que se ve. Es una función exportada y con
test: la corrección de lo que se copia no puede depender de una regex escondida.

También alimenta la numeración cuando el origen es HTML: contar saltos de línea sobre el markup daría
el número correcto por casualidad, pero sobre el texto es lo que se lee.

## El bloque siempre es LTR

`direction: ltr` y `text-align: left` fijos en el `<pre>`, incluso dentro de un `DirectionProvider` en
RTL. El código fuente no se lee de derecha a izquierda en ningún idioma: voltearlo rompe la indentación
y el orden de los operadores. Es la misma regla que aplica `TypographyStylesProvider` a sus `<pre>`.
