# ADR-134 — Changesets versiona, y el tarball lleva solo lo que sirve

- **Estado**: **aceptada** · 2026-08-12 — W5.1
- **Cierra**: el supuesto #5 del roadmap (mecánica de versionado) y la parte de forma del paquete que
  [ADR-014](ADR-014-politica-de-dependencias-y-subpaths.md) dejaba en «se define al montar CI»
- **Añade**: `@changesets/cli` como dependencia de desarrollo de la raíz
- **Depende de**: [ADR-013](ADR-013-naming-de-paquetes.md) (scope `@stellaria`) y
  [ADR-113](ADR-113-el-nucleo-es-mit-y-los-dominios-se-venden.md) (MIT y público)

## Contexto

Los cinco paquetes publicables llevaban `private: true` y `version: 0.0.0`: nadie había versionado
nada nunca, y `npm publish` los rechazaba por diseño. W5.1 los deja listos sin publicar.

## Decisión

### 1. Changesets, con versionado independiente

Un cambio en `web` no debe subir la versión de `tokens`. `fixed` y `linked` quedan vacíos a
propósito: cada paquete lleva su propia línea, y las dependencias internas se actualizan con `patch`.

`access: "public"`, que es lo que ADR-113 fijó. En `ignore` van los workspaces que no se publican
—los dos playgrounds, el theme creator, el sitio y `demos`—, porque changesets pediría versión para
ellos si no.

Tres guiones en la raíz: `changeset` para declarar el cambio, `version:packages` para aplicarlo y
`release` para publicar. La publicación real es W5.2.

### 2. El tarball no lleva mapas de fuente

Medido en `@stellaria/nebula-web`: **427 kB de `.map` frente a 333 kB de código**. Los mapas pesaban
más que lo que mapean, y además **no sirven de nada**: no incrustan `sourcesContent` y sus `sources`
apuntan a `../../../src/`, que no se publica. Cada mapa del tarball era un puntero a la nada, y un
depurador no resolvía ni una línea.

Con `files: ["dist", "!dist/**/*.map", "LICENSE"]` el paquete pasa de **1,1 MB a 447 kB** empaquetado
y de 3.086 a 1.618 archivos, sin que el consumidor pierda nada.

La alternativa evaluada era la contraria —publicar también `src` para que los mapas resolvieran—, y
se descarta porque duplica el tamaño para dar lo que un `git clone` da mejor: el repositorio es
público y MIT.

### 3. El `LICENSE` viaja con cada paquete

Existía en la raíz y **no entraba en ningún tarball**: npm solo recoge automáticamente el que está en
el directorio del paquete. Se copia a los cinco. Un paquete MIT que no lleva su licencia dentro es un
paquete sin licencia para quien lo audite desde `node_modules`.

### 4. Cada paquete dice de dónde viene

`repository` con su `directory`, `homepage`, `bugs`, `author` y `engines` (`node >=20`). No estaban en
ninguno de los cinco, así que npm los mostraba sin enlaces y sin forma de abrir una incidencia.

Al ponerlos apareció que **el repositorio que el sitio publicaba era el equivocado**: cinco sitios
—el `codeRepository` del JSON-LD, dos enlaces y los dos «editar esta página»— apuntaban a
`github.com/stellaria/nebula`, y el remoto es `StellariaApp/Nebula`. Dos llevaban además
`apps/docs/content`, ruta que dejó de existir al renombrar el sitio en ADR-131. Se centraliza en
`REPO_URL` y `CONTENT_PATH` para que no vuelva a divergir en cinco copias.

### 5. `sideEffects` se queda como está, y se explica

`["*.css"]` es correcto y está verificado con un bundle de prueba, no por inspección: importar
`Button` **no arrastra** Recharts, TanStack Table, TipTap, `react-player`, dnd-kit ni Embla — las seis
deps pesadas de los subpaths. `Box` solo mide 190 kB e importar `/charts` sube a 1.450 kB, que es
exactamente lo que ADR-014 regla 3 pedía.

Lo que **no** se sacude es el CSS: las 128 hojas compiladas entran aunque importes un solo
componente, porque marcarlas como puras haría que un empaquetador borrase los estilos que sí usas. Es
el mismo efecto que [ADR-032](ADR-032-style-props-en-todo-el-catalogo.md) §6 midió en los
presupuestos, y ahora está dicho en el README en vez de solo en `docs/`.

### 6. Los peers opcionales se declaran

`form-atoms` y `@pqina/react-pintura` se usan **estructuralmente y no se importan** (ADR-014 regla 4),
así que no eran dependencias de nada y no estaban declaradas en ningún sitio. Pasan a
`peerDependencies` con `peerDependenciesMeta.optional`: npm no los instala ni avisa si faltan, y
quedan documentados donde un consumidor los busca.

## Consecuencias

- Los cinco paquetes pasan el `npm publish --dry-run`. Siguen en `0.0.0`: la primera versión la fija
  el primer changeset, en W5.2.
- No hay build CJS. ESM estricto, que es lo que ADR-001 y el `exports` map ya imponían; añadirlo
  obligaría a un segundo pipeline y a duplicar los tipos para ganar compatibilidad con
  herramientas que Next 16 y React 19 ya no requieren. Si aparece un consumidor que lo necesite, se
  reabre.
- El paquete paraguas `@stellaria/nebula` **sigue sin decidir** y es lo único que bloquea W5.2.
