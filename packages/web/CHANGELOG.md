# @stellaria/nebula-web

## 1.1.10

### Patch Changes

- - La barra inferior se asienta como una fila más del grid, sin flotar sobre un hueco vacío ni dejar espacio muerto debajo.
  - @stellaria/nebula-tokens@1.1.10
  - @stellaria/nebula-hooks@1.1.10
  - @stellaria/nebula-themes@1.1.10
  - @stellaria/nebula-icons@1.1.10

## 1.1.9

### Patch Changes

- - Nuevo componente de barra inferior de navegación, formada por una fila de pestañas y con cada pestaña rotulada por su nombre.
  - La barra decide por sí sola si desplaza sus pestañas en función del ancho disponible, adaptándose al espacio de cada pantalla.
  - Pestañas más compactas: rótulo de 11 px, interlínea 1,15 y tope de 80, con espaciado uniforme por los cuatro lados y ranuras de los extremos ajustadas a su medida.
  - El rótulo de cada pestaña respeta la altura disponible y ya no recorta ni desborda el contenido.
  - @stellaria/nebula-tokens@1.1.9
  - @stellaria/nebula-hooks@1.1.9
  - @stellaria/nebula-themes@1.1.9
  - @stellaria/nebula-icons@1.1.9

## 1.1.8

### Patch Changes

- - El carrusel controlado ya respeta el índice que le pasas: al cambiarlo se desplaza a esa lámina y deja de reiniciarse al inicio.
  - @stellaria/nebula-tokens@1.1.8
  - @stellaria/nebula-hooks@1.1.8
  - @stellaria/nebula-themes@1.1.8
  - @stellaria/nebula-icons@1.1.8

## 1.1.7

### Patch Changes

- - Nuevo `AppShell.Footer.Content` para componer el contenido del pie dentro del AppShell.
  - `Label` ahora aplica su estilo también cuando envuelve un `div`, no solo texto.
  - `Button` deja de envolver en un `<span>` el contenido que no es texto, así que íconos y elementos pasados como hijos llegan sin ese wrapper extra.
  - @stellaria/nebula-tokens@1.1.7
  - @stellaria/nebula-hooks@1.1.7
  - @stellaria/nebula-themes@1.1.7
  - @stellaria/nebula-icons@1.1.7

## 1.1.6

### Patch Changes

- Updated dependencies
  - @stellaria/nebula-hooks@1.1.6
  - @stellaria/nebula-tokens@1.1.6
  - @stellaria/nebula-themes@1.1.6
  - @stellaria/nebula-icons@1.1.6

## 1.1.5

### Patch Changes

- - BREAKING: la semilla del tema ahora declara el material completo del sistema (cristal, degradados y superficies), por lo que los temas escritos contra el contrato anterior deben regenerarse (ADR-179, ADR-180).
  - Cada tema de producto genera su propio degradado de fondo y conserva su color de identidad en `brand`.
  - El material de cristal recupera su aspecto y expone su intensidad como un eje configurable del tema (ADR-178).
  - `CardSurface` admite `gradientBorder` para dibujar su borde con degradado, y el `gap` del botón deja de variar con su tamaño.
- Updated dependencies
  - @stellaria/nebula-tokens@1.1.5
  - @stellaria/nebula-themes@1.1.5
  - @stellaria/nebula-hooks@1.1.5
  - @stellaria/nebula-icons@1.1.5

## 1.1.4

### Patch Changes

- 75f703e: `Modal` acepta `content`, que sustituye su panel entero, y `children` pasa a ser opcional.

  El modal dibujaba su superficie —fondo, sombra, radio— y dentro montaba cabecera, cuerpo y pie, y no
  había forma de quitarla: `className` cae en el `<dialog>` y `bodyProps` en el cuerpo, por dentro. Eso
  obligaba a que cualquier ventana con forma propia en el producto —una `Card` con su anillo de
  degradado, por ejemplo— quedara **dentro** del panel, con dos superficies superpuestas, dos fondos y
  dos radios que no coinciden.

  Con `content` la superficie se queda en blanco: conserva el sitio, el ancho y el movimiento, y suelta
  todo lo que se ve. El modal sigue aportando lo que nadie quiere reescribir —el `<dialog>` en el top
  layer, el foco atrapado, el bloqueo del scroll, el velo desenfocado, las transiciones y el cierre por
  fuera y por `Esc`—, y el panel lo dibuja quien lo trae.

  Manda sobre `children`, `title`, `subtitle`, `footer`, `padding` y `withCloseButton`. **El nombre
  accesible pasa a hacer falta a mano**: sin cabecera no hay `title` del que colgar `aria-labelledby`,
  así que un `content` sin `aria-label` deja el diálogo sin nombre.

- - Esta versión no trae cambios funcionales: revierte por completo el 1.2.0, que se canceló antes de publicarse, y deja los paquetes iguales a la última versión disponible.
- Updated dependencies
  - @stellaria/nebula-tokens@1.1.4
  - @stellaria/nebula-hooks@1.1.4
  - @stellaria/nebula-themes@1.1.4
  - @stellaria/nebula-icons@1.1.4

## 1.1.3

### Patch Changes

- 7985f11: El relleno de `Card` se pone con `p`, como en el resto del catálogo, y su prop `padding` desaparece.

  `Card` tenía una prop propia para el relleno porque la banda a sangre (`Card.Section`) cancela el
  padding con un margen negativo y necesita el valor en una variable, y la variante de la receta era el
  único sitio capaz de publicarlo. El `p` de los style props escribía `padding` y dejaba la variable
  atrás: la tarjeta se veía bien y **todas las bandas a sangre de dentro sangraban la cantidad
  equivocada**, en silencio.

  Ahora la variable la publica `p` desde los sprinkles, en los dos carriles del extractor —el de tokens
  y el abierto—, así que sigue al relleno también por breakpoint y un `p={20}` la deja igual que un
  `p="md"`. Con eso `Card` ya no necesita prop propia.

  **Migración:** `padding="x"` pasa a `p="x"`. La escala entera es tipable ahora, porque es la del
  catálogo y no la de este componente; la recomendación de ADR-029 —`md`, `lg`, `xl`— sigue en pie
  aunque el tipo ya no la vigile.

  El `gap` interno sigue cayendo un escalón por debajo del relleno; la pareja se ata ahora en el
  componente en vez de en la receta, y cede cuando el consumidor trae su propio `gap`.

- - BREAKING: el relleno de `Card` ahora se controla con la prop `p`; la prop `padding` fue eliminada y debes migrar sus usos a `p`.
  - @stellaria/nebula-tokens@1.1.3
  - @stellaria/nebula-hooks@1.1.3
  - @stellaria/nebula-themes@1.1.3
  - @stellaria/nebula-icons@1.1.3

## 1.1.2

### Patch Changes

- - El registro de iconos crece de 73 a 110 y suma las categorías de tema y creativo, con más piezas disponibles para `Icon`.
  - `Card` acepta el valor `xs` en su relleno, para tarjetas más compactas.
  - Las ranuras de `Hero` reenvían los atributos HTML nativos igual que el resto de slots, así que ya puedes pasarles `id`, `data-*`, `aria-*` y demás.
- Updated dependencies
  - @stellaria/nebula-icons@1.1.2
  - @stellaria/nebula-tokens@1.1.2
  - @stellaria/nebula-hooks@1.1.2
  - @stellaria/nebula-themes@1.1.2

## 1.1.1

### Patch Changes

- - Los componentes web de Nebula incorporan funcionalidad de reveal para mostrar contenido de forma progresiva.
  - Se ajustan las propiedades de layout de los componentes afectados.
  - @stellaria/nebula-tokens@1.1.1
  - @stellaria/nebula-hooks@1.1.1
  - @stellaria/nebula-themes@1.1.1
  - @stellaria/nebula-icons@1.1.1

## 1.1.0

### Minor Changes

- a2c1e72: Detalle técnico, para quien mantenga: la auditoría de qué anima con CSS y qué con motion —y por qué
  los seis que quedan no pueden salir— está en `docs/03-a11y-motion-performance.md` §2. El modelo del
  scroll y el porqué de cada constante, en `packages/hooks/src/use-momentum-scroll.ts`.

  Los seis paquetes suben juntos aunque sólo dos tengan cambios: el tag que dispara la publicación
  nombra una sola versión, así que versiones distintas lo harían mentir.

- - La animación de entrada de `Reveal` pasa a CSS: entra más afinada, deja de rebotar al hacer scroll y ahora alcanza más superficies del catálogo.
  - El scroll suave adopta el modelo de smooth-scrollbar, con momentum y un borde que cede de verdad al llegar al final.
  - El bundle adelgaza: once componentes dejan de depender de motion y el provider baja 12 kB.

### Patch Changes

- Updated dependencies [a2c1e72]
- Updated dependencies
  - @stellaria/nebula-hooks@1.1.0
  - @stellaria/nebula-themes@1.1.0
  - @stellaria/nebula-tokens@1.1.0
  - @stellaria/nebula-icons@1.1.0

## 1.0.0

### Major Changes

- - BREAKING: los temas y su contrato CSS se mudan a `@stellaria/nebula-themes`; ahora son dieciséis, se nombran por su color y `sun` pasa a `sol` (ADR-168, ADR-172) — actualiza de dónde importas los temas y con qué nombre los pides.
  - BREAKING: nuevo runtime de tema — `ColorSchemeScript` pasa a `ThemeScript`, la identidad (`meta.name`) y el esquema (`meta.scheme`) van en claves separadas, el provider acepta temas ya materializados y `CompileTheme` los materializa en caliente; la elección de tema ya sobrevive al refresco (ADR-164/166/167).
  - BREAKING: los puntos de ruptura salen del contrato del tema (ADR-174) y `Paper`, `GlassSurface` y los decoradores puros dejan de exponer `ref` (ADR-157).
  - `Hero`, `Section`, `Card` y una veintena más de componentes dejan de ser de cliente: el color de variante se resuelve por clase CSS desde la matriz que publica el tema, sacando el tema del camino de render (ADR-150).
  - El peldaño de control más pequeño sube al mínimo táctil (ADR-162), las style props de color aceptan `ColorExtended` (ADR-147) y las superficies glass y gradient acusan el hover con `liftHover`.

### Minor Changes

- fbf7fae: El cristal de los accionables es un velo, no una superficie (ADR-136)

  `GlassLevel` gana `veil`, el escalón más transparente de la escala: `blur(1px)` con el borde subido.
  En dark el velo **aclara** —`rgba(255, 255, 255, 0.05)`, la receta que ADR-078 describía— en vez de
  oscurecer, que sobre un canvas oscuro no separaba nada; en light es `rgba(255, 255, 255, 0.30)`.

  El borde es lo que separa un control de 48 px de su fondo, así que subirlo deja bajar el velo y el
  filo **mejora**: de 1,18 con `control` a 1,25–1,60. `check:contrast`: 186 pares por tema, 0 FAIL y la deuda declarada de ADR-161.

  El `variantMap` lo declara como nivel por defecto de la variante `glass` (ADR-170): el nivel lo
  decide el **tema**, no el componente. Son los únicos accionables del catálogo
  que admiten `variant="glass"`; el resto estrecha `Variant` sin incluirlo. `QuickAction` estrena la
  prop `glass`, que los otros dos ya tenían.

  **Rompedor para temas propios.** El contrato es `Record<GlassLevel, GlassSurfaceRecipe>`, así que un
  tema que no defina `veil` deja de compilar. Añade la entrada con la receta que quieras; si omites
  `borderColor`, el schema pone `rgba(128, 128, 128, 0.24)`.

  Consumir componentes no rompe: quien no escriba temas propios solo ve el material nuevo en los tres
  accionables.

### Patch Changes

- Updated dependencies [fbf7fae]
- Updated dependencies
  - @stellaria/nebula-tokens@1.0.0
  - @stellaria/nebula-themes@1.0.0
  - @stellaria/nebula-hooks@1.0.0
  - @stellaria/nebula-icons@1.0.0

## 0.1.0

### Minor Changes

- - Primera publicación de Nebula en npm: `@stellaria/nebula-tokens`, `@stellaria/nebula-hooks`, `@stellaria/nebula-themes`, `@stellaria/nebula-icons` y `@stellaria/nebula-web` quedan disponibles para instalar.
  - `@stellaria/nebula-web` trae los componentes web del design system, construidos con Vanilla Extract, React Aria y motion.
  - `@stellaria/nebula-themes` incluye los temas oficiales, el schema de Zod del tema y sus presets; `@stellaria/nebula-tokens`, los tokens base y los contratos de tipos compartidos.
  - `@stellaria/nebula-hooks` aporta los hooks cross-platform sin UI y `@stellaria/nebula-icons`, el componente `Icon` con su registry de iconos sobre lucide.
  - Instala `@stellaria/nebula` como mapa de los paquetes: no exporta código, solo te indica cuál necesitas.

### Patch Changes

- Updated dependencies
  - @stellaria/nebula-tokens@0.1.0
  - @stellaria/nebula-hooks@0.1.0
  - @stellaria/nebula-themes@0.1.0
  - @stellaria/nebula-icons@0.1.0
