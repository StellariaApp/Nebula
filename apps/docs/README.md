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

Mapa cerrado el 2026-08-08 con el propietario. La vara de medir es `mantine.dev` y `ui.shadcn.com`.
Tres cubos, que son los que ya nombra `i18n/<lang>/chrome.json`: **Learn**, **Reference** y el resto.

| Ruta                        | Cubo      | Estado                                                                   |
| --------------------------- | --------- | ------------------------------------------------------------------------ |
| `/`                         | —         | portada                                                                  |
| `/docs/[...slug]`           | Learn     | **toda la prosa**: instalación, inicio rápido, a11y, RSC, estilos, guías |
| `/components`               | Reference | índice de las 158, por familia, desde el registro generado               |
| `/components/web/<name>`    | Reference | la ficha de cada componente                                              |
| `/components/native`        | Reference | «próximamente» con el inventario planificado — hay 0 componentes native  |
| `/components/native/<name>` | Reference | **reservada** — llega con N1                                             |
| `/styles`                   | Reference | las 128 style props de ADR-103, generada entera                          |
| `/theme`                    | Reference | el contrato `NebulaTheme` y cómo se cambia todo desde él                 |
| `/theme/tokens`             | Reference | color, espaciado, tipografía, motion, radios, sombras                    |
| `/theme/creator`            | Reference | **reservada** — pista TC                                                 |
| `/premium`                  | —         | escaparate de los 6 paquetes de dominio, sin precio ni fecha             |
| `/premium/<paquete>`        | —         | **reservada** — llega con W6                                             |
| `/pricing`                  | —         | **reservada** — necesita el modelo comercial de ADR-113 desplegado       |
| `/changelog`                | —         | desde el primer deploy, con el badge de API en normalización             |
| `/agents`                   | —         | cómo consumir Nebula desde un agente de IA                               |
| `/llms.txt`                 | —         | índice plano para modelos                                                |
| `/llms-full.txt`            | —         | el catálogo entero en texto                                              |
| `/components/web/<name>.md` | —         | cada ficha en markdown plano, para agentes                               |

### Las cuatro decisiones que fijan este mapa

1. **Toda la prosa vive bajo `/docs`.** No hay `/guides` como raíz: las recetas por framework son
   `/docs/guides/<framework>`. Dos raíces de prosa producen una pregunta permanente —«¿dónde va
   esto?»— que con dos ficheros de contenido no se justifica.
2. **La plataforma cuelga de `/components`, no de la raíz.** Sustituye a la `/native` que esta tabla
   reservaba: el segmento significa algo donde hay un catálogo que dividir.
3. **El premium es escaparate, no catálogo.** Separado de `/components` a propósito: mezclarlos
   obliga a poner candados por toda la tabla de 158 y convierte el índice en una tienda.
4. **`/agents` es documentación legible por máquinas**, no una familia de componentes. Se deriva de
   `generated/*.json`, así que es casi todo generación y no prosa.

### Lo que el pie declara

Desde [ADR-113](../../docs/adr/ADR-113-el-nucleo-es-mit-y-los-dominios-se-venden.md): **núcleo MIT y
público, paquetes de dominio con licencia comercial**. Deja de aplicar la regla de DS de no declarar
licencia, que existía porque el supuesto #11 estaba abierto.

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
