# ADR-133 — El sitio vuelve a prerenderizarse, y con eso el buscador busca

- **Estado**: **aceptada** · 2026-08-11 — decisión del propietario en W5.0 P2
- **Enmienda**: [ADR-122](ADR-122-el-segmento-lang-desaparece-del-router.md) §2, en su consecuencia
  medida «se pierde el prerenderizado»
- **Saca de borrador**: [ADR-109](ADR-109-el-buscador-del-sitio-indexa-el-html-construido.md), que
  quedó sin premisa el 2026-08-09
- **Añade**: `pagefind@1.5.2` como dependencia de build de `apps/web`

## Contexto

W5.0 P2 abre con el buscador: `islands/search.tsx` era un `TextInput` de siete líneas sin
comportamiento, y ADR-109 llevaba en borrador desde que ADR-122 le quitó la premisa —sin HTML
construido no hay nada que indexar—.

Al medir por qué no había HTML apareció que **el bloqueo no era del buscador**. `CurrentLang()` lee
`cookies()` y `headers()`, y quien la llama es el **layout raíz**: cualquier ruta que toque esas API
sale de la generación estática, así que arrastraba al sitio entero. Medido con `next build`: las 7
rutas de contenido en `ƒ (Dynamic)`, y solo `robots.txt`, `sitemap.xml` y una tarjeta OG estáticas.

Y el dato que ordena la decisión: **`LANGS = ["en"]`**. Un idioma, un directorio de contenido. El
sitio pagaba renderizado dinámico completo por negociar entre **un** candidato, y `CurrentLang()`
devolvía siempre `"en"`.

## Decisión

### 1. Con un solo idioma no se negocia

`CurrentLang()` devuelve `SOURCE_LANG` sin tocar `cookies()` ni `headers()` mientras `LANGS` tenga un
miembro. La rama de negociación sigue entera y se reabre sola en cuanto entre el segundo idioma, que
es justo cuando ADR-122 dice que esto se revisa, junto con `Vary: Cookie`.

Esto **no revierte ADR-122**: el segmento `[lang]` sigue fuera del router, la URL no cambia y el
idioma se sigue resolviendo en el layout. Lo que devuelve es la consecuencia que ese ADR daba por
perdida.

### 2. Vuelve `generateStaticParams`, desde las fuentes que ya enumera el sitemap

ADR-122 §4 retiró `AllSlugs` porque sin segmento no tenía función. Vuelve la función, no el archivo:
`/guides/[section]` enumera `SECTIONS`, y `/guides/[section]/[...slug]` enumera `DocIndex` y
`CATALOG` — **las mismas tres fuentes que `sitemap.ts`**, para que ruta prerenderizada y URL
anunciada no puedan discrepar.

Medido: de **9 páginas generadas a 178**, con 174 archivos HTML en disco.

### 3. El índice se construye desde ese HTML, preparándolo antes

Pagefind deriva la URL del resultado de la ruta del archivo y solo recorta `index.html`. La salida de
Next es `guides/x.html`, que indexado tal cual daría `/guides/x.html` y **un 404 por resultado**. Así
que `scripts/search-index.mjs` copia cada página a `guides/x/index.html` en un directorio de paso,
indexa eso y lo borra. El paso va encadenado al `build` del sitio, no suelto.

`data-pagefind-body` acota lo indexado al contenido de la página. Sin él Pagefind indexaba también el
carril y la barra, de modo que **toda página casaba con todo nombre de componente**: es el mismo
ruido que ADR-109 §3 anticipó para las tablas del registro, resuelto en su raíz y no por exclusiones.

### 4. El índice no se versiona

`public/pagefind/` sale del build en cada pasada, como `dist` o `.next`. Va al `.gitignore` y a los
ignorados de ESLint —el bundle minificado de Pagefind disparaba 15 errores de `no-undef`—.

## Verificación

No es «queda cableado»: se comprobó en un navegador real contra el sitio servido.

- Los cuatro activos del índice se sirven con 200: `pagefind.js`, `pagefind-entry.json`, el
  `.pf_meta` y el `.pf_index`.
- Buscando `gradient` devuelve **8 resultados** con sus títulos y sus URL correctas —
  `GradientBorder`, `GradientText`, `GradientBackground`, `AnimatedGradient`, `MeshGradientBg`— y
  **cero errores de red o consola**.
- El clic navega al destino, verificado con `waitForURL`.
- El índice cubre **163 páginas** en un idioma.

## Consecuencias

- El runtime del buscador se carga en el primer tecleo y no antes (ADR-109 §4), por `import()` de una
  ruta armada en runtime para que no la resuelva el empaquetador.
- La URL del índice lleva barra final y el sitio sirve sin ella, lo que costaba un 308 por resultado;
  el cliente la recorta antes de pintar el enlace.
- La consulta se vacía **al llegar a destino**, no al pulsar: vaciarla en el `onClick` desmonta el
  enlace en mitad del clic y cancela la navegación. El cromado es un layout y no se remonta al
  navegar, así que sin ese efecto la consulta quedaría escrita en la página nueva.
- **El buscador solo existe en el cromado de `/guides`**: la portada monta `Bar`, que no tiene ranura
  de acciones con búsqueda. No se toca aquí porque no es lo que P2 pide, pero queda dicho.
- `/guides/[section]/opengraph-image` y `/og` siguen dinámicas a propósito: son endpoints de imagen
  parametrizados, no páginas.
