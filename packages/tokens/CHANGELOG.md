# @stellaria/nebula-tokens

## 1.1.6

## 1.1.5

### Patch Changes

- - BREAKING: la semilla del tema ahora declara el material completo del sistema (cristal, degradados y superficies), por lo que los temas escritos contra el contrato anterior deben regenerarse (ADR-179, ADR-180).
  - Cada tema de producto genera su propio degradado de fondo y conserva su color de identidad en `brand`.
  - El material de cristal recupera su aspecto y expone su intensidad como un eje configurable del tema (ADR-178).
  - `CardSurface` admite `gradientBorder` para dibujar su borde con degradado, y el `gap` del botón deja de variar con su tamaño.

## 1.1.4

### Patch Changes

- - Esta versión no trae cambios funcionales: revierte por completo el 1.2.0, que se canceló antes de publicarse, y deja los paquetes iguales a la última versión disponible.

## 1.1.3

## 1.1.2

## 1.1.1

## 1.1.0

### Minor Changes

- a2c1e72: Detalle técnico, para quien mantenga: la auditoría de qué anima con CSS y qué con motion —y por qué
  los seis que quedan no pueden salir— está en `docs/03-a11y-motion-performance.md` §2. El modelo del
  scroll y el porqué de cada constante, en `packages/hooks/src/use-momentum-scroll.ts`.

  Los seis paquetes suben juntos aunque sólo dos tengan cambios: el tag que dispara la publicación
  nombra una sola versión, así que versiones distintas lo harían mentir.

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

## 0.1.0

### Minor Changes

- - Primera publicación de Nebula en npm: `@stellaria/nebula-tokens`, `@stellaria/nebula-hooks`, `@stellaria/nebula-themes`, `@stellaria/nebula-icons` y `@stellaria/nebula-web` quedan disponibles para instalar.
  - `@stellaria/nebula-web` trae los componentes web del design system, construidos con Vanilla Extract, React Aria y motion.
  - `@stellaria/nebula-themes` incluye los temas oficiales, el schema de Zod del tema y sus presets; `@stellaria/nebula-tokens`, los tokens base y los contratos de tipos compartidos.
  - `@stellaria/nebula-hooks` aporta los hooks cross-platform sin UI y `@stellaria/nebula-icons`, el componente `Icon` con su registry de iconos sobre lucide.
  - Instala `@stellaria/nebula` como mapa de los paquetes: no exporta código, solo te indica cuál necesitas.
