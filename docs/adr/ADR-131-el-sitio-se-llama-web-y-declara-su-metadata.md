# ADR-131 — El sitio se llama `web` y declara su metadata

- **Estado**: aceptada · 2026-08-11 (decisión del propietario) · **WN** · implementada
- **Cambia API pública**: no. Renombra el workspace `apps/docs` → `apps/web` y añade metadata,
  sitemap, robots y tarjetas sociales al sitio.
- **Depende de**: [ADR-107](ADR-107-el-sitio-es-una-app-next-que-no-compila-vanilla-extract.md) (el
  sitio es una app Next) · [ADR-127](ADR-127-las-guias-se-parten-en-seis-secciones.md) (el mapa de
  rutas que el sitemap recorre).

## Contexto

El workspace se llamaba `docs`, y el nombre dejó de describirlo: el sitio es la web pública del
proyecto —portada, catálogo, fichas y Theme Creator—, no solo su documentación. Y no declaraba nada
para un buscador ni para quien pega un enlace en un chat: un `<title>` fijo, una descripción y punto.

## Decisión

### El workspace pasa a `apps/web`

El paquete se llama `web`, el filtro de turbo es `--filter=web` y los punteros de `docs/`, de los ADR
y de `prompts/` apuntan a la ruta nueva. No colisiona con `packages/web`: los nombres de paquete son
`web` y `@stellaria/nebula-web`.

### La metadata se declara donde vive el dato

- **Raíz**: `metadataBase`, plantilla de título `%s · Nebula`, descripción, palabras clave, `robots`
  con `max-image-preview: large`, y las bases de Open Graph y Twitter.
- **Cada página** declara su título, su descripción y **su canónica**. Las de sección y las fichas
  las derivan de lo que ya tienen —el diccionario, el front matter, el registro—, así que no hay una
  segunda fuente que se desincronice.
- **Sitemap** (172 URLs) y **robots** generados. `/preview/*` queda fuera de los dos: son las muestras
  que la ficha enmarca, no páginas con contenido.
- **JSON-LD** en la portada con `WebSite` + `SoftwareSourceCode`.

### Las tarjetas sociales, y por qué una es un endpoint

La portada y cada sección usan el convenio de archivo (`opengraph-image.tsx`). Las fichas y las guías
**no pueden**: viven bajo `[...slug]` y el router prohíbe cualquier ruta después de un catch-all —el
build falla con «Catch-all must be the last part of the URL»—. Por eso hay `/og`, un endpoint que
recibe `eyebrow`, `title`, `description` y `tags`, y `generateMetadata` le pasa lo que la propia
página ya sabe: familia, nombre, subpath, frontera RSC y presupuesto.

Las tres comparten plantilla en `ui/og-card.tsx`. Se pinta con Satori, que no es un navegador: solo
flexbox, sin variables CSS y sin las hojas del catálogo. De ahí que los colores sean el eje de marca
de ADR-020 escrito a mano y no `vars`.

## Consecuencias

- **El origen sale del entorno**: `NEXT_PUBLIC_SITE_URL`, con `https://nebula.stellaria.app` —el
  dominio real, confirmado por el propietario— como defecto. De él cuelgan las canónicas, el sitemap
  y las URL absolutas de las tarjetas, así que un despliegue en otro origen lo pone por entorno y no
  toca código.
- **El grafo JSON-LD va fuera del árbol de cliente.** Dentro de `Main` no llegaba al DOM; como
  hermano en el servidor, sí.
- Una página que declara su propio `openGraph` **pisa** el `opengraph-image` heredado: `/theme` y
  `/changelog` se quedaron sin imagen hasta declararla, y se vio en la comprobación, no razonando.

## Alternativas descartadas

**Dejar el nombre `docs`.** Describe una parte de lo que el sitio es.

**Una imagen social estática para todo.** Un enlace a `Button` y otro a `DataGrid` compartirían
tarjeta, que es justo lo contrario de lo que la tarjeta sirve.
