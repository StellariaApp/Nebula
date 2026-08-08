# apps/docs — la web pública de Nebula

Sitio construido **con Nebula**. Cero CSS de terceros: cada página es una prueba de producción del
catálogo.

Decisiones cerradas:
[ADR-107](../../docs/adr/ADR-107-el-sitio-es-una-app-next-que-no-compila-vanilla-extract.md) (stack) ·
[ADR-110](../../docs/adr/ADR-110-el-idioma-se-resuelve-por-cookie-y-el-origen-es-el-ingles.md)
(idioma) ·
[ADR-109](../../docs/adr/ADR-109-el-buscador-del-sitio-indexa-el-html-construido.md) (buscador,
borrador).

## El sitio se escribe en inglés

`LANGS` está hoy en `["en"]` y el contenido, el diccionario del cromado y los metadatos van en
inglés. **La maquinaria de i18n está montada entera**: añadir un idioma es añadirlo a `LANGS` y crear
`content/<lang>/` e `i18n/<lang>/`. Nada más.

El resto de `docs/` y los ADRs siguen en español: son documentación interna, no superficie pública.

## Rutas — la URL no lleva idioma

| Ruta              | Estado                                          |
| ----------------- | ----------------------------------------------- |
| `/`               | portada                                         |
| `/docs/[...slug]` | prosa desde `content/<lang>/**`                 |
| `/components`     | índice del catálogo, desde el registro generado |
| `/theme`          | **reservada** — Theme Creator, pista TC         |
| `/changelog`      | **reservada**                                   |
| `/native`         | **reservada**                                   |

El idioma sale de la cookie `nebula-lang`; si no está, de `Accept-Language`; si tampoco, del idioma de
origen. `proxy.ts` reescribe internamente a un segmento `[lang]` que **no se ve en la URL**, y por eso
todas las rutas siguen prerenderizadas estáticas. Una URL con prefijo (`/en/components`) redirige a la
limpia y deja la cookie puesta: es la escotilla para compartir un idioma concreto.

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

Si la página no existe en el idioma pedido se sirve la del idioma de origen **con una marca visible** y
un enlace para contribuir la traducción. Nunca un 404. Hoy no se ve porque solo hay un idioma.

## Dos cosas que no son como en el resto del monorepo

- **Imports relativos sin extensión**: Turbopack no resuelve `./x.js` a `./x.tsx` (ADR-107 §6).
- **`experimental.useTypeScriptCli`**: sin él, el typecheck de Next rechaza el `typescript@7.0.2` del
  paquete.

## Lo que todavía no funciona

**El buscador está montado pero no busca.** El campo tiene su sitio y su `aria-label`; el índice llega
cuando se acepte ADR-109. Con Pagefind el índice se construye sobre el HTML ya generado, así que en
`next dev` el campo queda inerte por diseño.
