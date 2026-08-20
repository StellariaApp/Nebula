# @stellaria/nebula

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

## 0.1.0

### Minor Changes

- - Primera publicación de Nebula en npm: `@stellaria/nebula-tokens`, `@stellaria/nebula-hooks`, `@stellaria/nebula-themes`, `@stellaria/nebula-icons` y `@stellaria/nebula-web` quedan disponibles para instalar.
  - `@stellaria/nebula-web` trae los componentes web del design system, construidos con Vanilla Extract, React Aria y motion.
  - `@stellaria/nebula-themes` incluye los temas oficiales, el schema de Zod del tema y sus presets; `@stellaria/nebula-tokens`, los tokens base y los contratos de tipos compartidos.
  - `@stellaria/nebula-hooks` aporta los hooks cross-platform sin UI y `@stellaria/nebula-icons`, el componente `Icon` con su registry de iconos sobre lucide.
  - Instala `@stellaria/nebula` como mapa de los paquetes: no exporta código, solo te indica cuál necesitas.
