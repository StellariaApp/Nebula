# ADR-031 — Carga de la tipografía: responsabilidad del consumidor, obligación del catálogo

- **Estado**: aceptada · 2026-07-28 (decisión del propietario)
- **Contexto**: `font.family.sans` declara Geist como tipografía por defecto desde F0, y `docs/02-theming.md`
  §3 la lista como parte de la identidad de los temas oficiales. **Nunca se cargó en ninguna parte.** En
  todo el monorepo no había un solo `@font-face`, `@fontsource` ni `<link>` de fuente; la única que el
  playground servía era Nunito Sans, que es el chrome de la propia Storybook.

  Consecuencia: el catálogo renderizaba en la fuente de sistema —Segoe UI en Windows— y toda la
  calibración tipográfica se juzgó contra ella:

  - la escala de ADR-024 (`48/40/32/28/24/20`, cuerpo `16/14/13`, pesos y `lineHeight.tight`);
  - el `letterSpacing` de ADR-027, que es la propiedad más dependiente de la tipografía de todas;
  - las cinco láminas `Foundations/Visual QA`, que existen precisamente para ser el baseline visual;
  - y cualquier baseline de screenshot futuro, que habría congelado la fuente equivocada.

  Es el mismo patrón que ADR-030: el catálogo mostrando algo distinto de lo que la librería especifica,
  sin que ningún gate pudiera notarlo.

## Decisión

1. **La librería no carga fuentes.** `@stellaria/nebula-web` no emite `@font-face` ni descarga archivos:
   imponer un mecanismo de carga (CDN, `next/font`, bundler) contradice `docs/03` §Rendimiento —«no
   cargar fuentes desde cada componente»— y ataría al consumidor a una estrategia concreta. El tema
   declara la familia; cargarla es responsabilidad de la app.
2. **El catálogo sí la carga, y es obligatorio.** `apps/playground-web` añade
   `@fontsource-variable/geist` y `@fontsource-variable/geist-mono` como **devDependencies de la app**,
   nunca de un paquete publicable. Un catálogo que no muestra la tipografía real del sistema no sirve
   como referencia visual, que es su única razón de existir.
   Se eligen las variantes **variable** (un archivo cubre 100–900) porque el contrato usa cuatro pesos
   —`regular`, `medium`, `semibold`, `bold`— y con archivos estáticos serían cuatro descargas por familia.
3. **El stack de `font.family` enumera los nombres de las distribuciones habituales.** Fontsource
   registra la familia como `Geist Variable`, mientras el paquete `geist` de Vercel usa `Geist`. Con el
   stack anterior, instalar Fontsource no habría tenido ningún efecto: el nombre no coincidía y la
   cascada seguía cayendo a la fuente de sistema, en silencio. El token pasa a listar
   `Geist Variable, Geist, Geist Sans, Inter, …` y `Geist Mono Variable, Geist Mono, …`, que es
   exactamente para lo que sirve un font stack.
4. **W5 documenta la obligación del consumidor**: cargar Geist por el medio que prefiera, o sobrescribir
   `font.family` en su tema. Hoy no está dicho en ninguna parte, y un consumidor que no lo haga recibe
   una tipografía distinta de la que vio en el catálogo sin ninguna señal de error.

## Alternativas

- **Que la librería incluya los archivos de fuente**: rechazada. Añade peso al bundle publicado, obliga a
  una estrategia de carga y arrastra una decisión de licencia que no es necesaria.
- **Cambiar el default a `system-ui`**: rechazada por el propietario. Haría correctos por definición los
  valores ya calibrados, pero contradice `docs/02` §3 y renuncia a la firma tipográfica de la casa.
- **Cargar la fuente solo en el playground sin tocar el stack**: no funciona. Es lo que revela el punto 3:
  el nombre de familia de Fontsource no coincide con el del token, así que el catálogo habría seguido
  renderizando en la fuente de sistema mientras aparentaba tener la fuente instalada.

## Consecuencias

- El catálogo cambia de aspecto en todas las stories: la referencia visual anterior a esta fecha no vale.
- **La calibración de ADR-024 y ADR-027 queda pendiente de revisión contra Geist.** Los valores no se
  tocan aquí: se corrige primero el entorno para que la decisión pueda tomarse sobre la tipografía real.
  Verificado en el build: `Geist Variable` resuelta y cargada, `h1` a 48 px con tracking efectivo de
  −1,44 px.
- `packages/tokens` sigue sin dependencias de runtime: el cambio es un literal de string.
- Antes de automatizar visual regression conviene cerrar esa revisión, o el baseline nacerá con una
  calibración no validada.
