# apps/docs — la web pública de Nebula

Sitio bilingüe (`es` · `en`) construido **con Nebula**. Cero CSS de terceros: cada página es una
prueba de producción del catálogo.

Decisiones cerradas:
[ADR-107](../../docs/adr/ADR-107-el-sitio-es-una-app-next-que-no-compila-vanilla-extract.md) (stack) ·
[ADR-109](../../docs/adr/ADR-109-el-buscador-del-sitio-indexa-el-html-construido.md) (buscador,
borrador).

## Rutas

Todo cuelga de `/[lang]/`, y **toda ruta existe en los dos idiomas siempre**. `proxy.ts` redirige la
raíz por `Accept-Language` con `es` por defecto.

| Ruta                     | Estado                                          |
| ------------------------ | ----------------------------------------------- |
| `/[lang]`                | portada                                         |
| `/[lang]/docs/[...slug]` | prosa desde `content/<lang>/**`                 |
| `/[lang]/components`     | índice del catálogo, desde el registro generado |
| `/[lang]/theme`          | **reservada** — Theme Creator, pista TC         |
| `/[lang]/changelog`      | **reservada**                                   |
| `/[lang]/native`         | **reservada**                                   |

Las tres reservadas existen vacías a propósito: meterlas después sería una mudanza de URLs.

## Las tres capas de contenido, que no se mezclan

| Capa        | Dónde                   | Quién la escribe                                   |
| ----------- | ----------------------- | -------------------------------------------------- |
| Prosa       | `content/<lang>/**.mdx` | una persona                                        |
| Generado    | `generated/*.json`      | `pnpm gen:docs` — **nadie lo edita a mano, jamás** |
| Diccionario | `i18n/<lang>/*.json`    | la prosa de lo generado y del cromado              |

El MDX es **portable**: sin imports de framework. Lo que necesita React se registra por nombre en
`src/ui/mdx.tsx` y se compila con `next-mdx-remote/rsc`, que lee de disco y no obliga a que el
contenido viva en el árbol de rutas.

## Caída de idioma

Si la página no existe en el idioma pedido se sirve la de origen (`es`) **con una marca visible** y un
enlace para contribuir la traducción. Nunca un 404, nunca una página en blanco. Se ve hoy en
`/en/docs/instalacion`.

## Dos cosas que no son como en el resto del monorepo

- **Imports relativos sin extensión**: Turbopack no resuelve `./x.js` a `./x.tsx` (ADR-107 §6).
- **`experimental.useTypeScriptCli`**: sin él, el typecheck de Next rechaza el `typescript@7.0.2` del
  paquete.

## Lo que todavía no funciona

**El buscador está montado pero no busca.** El campo tiene su sitio y su `aria-label`; el índice
llega cuando se acepte ADR-109. Con Pagefind el índice se construye sobre el HTML ya generado, así que
en `next dev` el campo queda inerte por diseño.
