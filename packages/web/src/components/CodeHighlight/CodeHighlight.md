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

## La superficie sale del `variantMap` y el plegado no esconde nada (ADR-124)

Sin `variant` el bloque conserva su calibración propia —`surface.sunken` con filo `border.subtle`—,
que no es ninguna variante del mapa. Con `variant` la resuelve `ResolveVariant` y la vuelca a
variables, igual que `Card`: por eso `glass` trae también su `glass` level.

**`gradient`, `glow` y `ghost` quedan fuera.** Los dos primeros porque `docs/06` §6 dice que un
gradiente no es fondo de lectura larga, y treinta líneas de código lo son; `ghost` porque sin
superficie ni filo el bloque deja de leerse como bloque.

`expandable` recorta a `collapsedHeight` y ofrece un botón, pero **el `pre` conserva su `tabIndex` y
su scroll**: el código plegado sigue siendo alcanzable con rueda y con teclado, y sin JavaScript el
bloque nace plegado y se recorre igual. Esa es la razón de no usar `<details>`, que al cerrarse saca
el contenido del árbol de accesibilidad y del `Ctrl+F` de la página — y el contenido es justo lo que
la gente busca.

El velo de desvanecido se apaga con `prefers-reduced-motion`. No anima; es el mismo interruptor con el
que se pide sobriedad.
