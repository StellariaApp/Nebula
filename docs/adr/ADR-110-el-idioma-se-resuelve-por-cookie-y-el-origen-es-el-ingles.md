# ADR-110 — El idioma del sitio se resuelve por cookie, y el idioma de origen es el inglés

- **Estado**: aceptada · 2026-08-08 (decisión del propietario)
- **Enmienda**: la fila «Idioma» del checkpoint de DS (`prompts/1.5-docs-site/README.md`) y el punto 1
  de DS1.2, que fijaban rutas `/[lang]/...` y español como idioma de origen.
- **Depende de**: [ADR-107](ADR-107-el-sitio-es-una-app-next-que-no-compila-vanilla-extract.md)

## Contexto

DS1.2 entregó el sitio con el idioma en la ruta (`/es/...`, `/en/...`) y el español como origen, que
es lo que el checkpoint del 2026-08-07 había decidido. El propietario cambia las dos cosas: **el
idioma se elige por cookie** y **el sitio se escribe entero en inglés primero**; las traducciones se
piensan cuando el contenido esté listo.

## Decisión

1. **La URL no lleva idioma.** `/docs/installation`, no `/en/docs/installation`.
2. **El idioma sale de la cookie `nebula-lang`**, y si no existe, de `Accept-Language`, y si tampoco,
   del idioma de origen. Una cookie con un idioma que no existe se ignora, no rompe.
3. **`LANGS` queda en `["en"]` y `SOURCE_LANG` en `"en"`.** La maquinaria de i18n se conserva entera
   —negociación, diccionario por idioma, caída visible, `content/<lang>/`—: **añadir un idioma es
   añadirlo a `LANGS` y crear su directorio**, no reestructurar el sitio.
4. **El conmutador de idioma no se pinta con un solo idioma**, y la decisión se toma en servidor: con
   `LANGS.length < 2` la isla ni se monta ni su rótulo viaja en el payload.
5. **El prerenderizado estático se conserva.** El segmento `[lang]` sigue existiendo _dentro_ de
   `app/`, invisible en la URL: `proxy.ts` reescribe `/docs/x` a `/en/docs/x` según la cookie. Sin
   esa reescritura, leer la cookie en un Server Component habría hecho dinámicas todas las rutas.
6. **Una URL con prefijo de idioma redirige a la URL limpia y fija la cookie.** `/en/components` →
   `307` a `/components` con `Set-Cookie`. Es la única forma que queda de enlazar un idioma concreto,
   y sirve de escotilla para compartir.

## Lo que esto cuesta, dicho en voz alta

- **No hay enlace compartible por idioma.** Una URL sirve contenidos distintos según quién la pida.
- **SEO**: los buscadores indexan una sola versión y no hay `hreflang`. Para un sitio de
  documentación que aspira a que lo encuentren, es el precio real de esta decisión.
- **La caché de CDN tiene que variar por cookie** o servirá el idioma equivocado. Hoy no importa
  porque solo hay un idioma; **hay que resolverlo antes de añadir el segundo**, y es la razón por la
  que el punto 5 mantiene el segmento interno: la alternativa a `Vary: Cookie` es cachear por la ruta
  reescrita.

El propietario conoce los tres y decide seguir. Se revisa cuando entre el segundo idioma.

## Alternativas

- **Mantener el idioma en la ruta** (lo que DS1.2 entregó): enlaces compartibles, `hreflang`, caché
  trivial y SSG sin reescrituras. Rechazada por el propietario.
- **Cookie sin segmento interno**, leyéndola directo en el layout: más simple de escribir y **peor**,
  porque `cookies()` en un Server Component vuelve dinámica toda la ruta y el sitio pierde el
  prerenderizado que ADR-107 midió.
- **Detección solo por `Accept-Language`**, sin cookie: el lector no puede elegir, que es justo lo que
  un conmutador de idioma tiene que permitir.

## Consecuencias

- **El contenido en español se retira.** `content/es/` e `i18n/es/` desaparecen; lo que había era
  contenido semilla de DS1.2, no material traducido que se pierda.
- **El sitio pasa a escribirse en inglés**: prosa, diccionario del cromado y metadatos.
- **Esto empuja la pregunta abierta 1 de la fase** —en qué idioma va el JSDoc público— hacia el
  inglés, porque el `.d.ts` se publica y el sitio ya no es bilingüe. **No se ejecuta aquí**: son 71
  archivos y merece su propia decisión y su propio PR.
- `docs/00-inventory.md`, los ADRs y el resto de `docs/` **siguen en español**: son documentación
  interna del proyecto, no la superficie pública. Esta decisión no los toca.
