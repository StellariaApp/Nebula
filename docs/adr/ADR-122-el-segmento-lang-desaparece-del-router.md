# ADR-122 — El segmento `[lang]` desaparece del router: la cookie se lee en el layout

- **Estado**: aceptada · 2026-08-09 (decisión del propietario)
- **Enmienda**: [ADR-110](ADR-110-el-idioma-se-resuelve-por-cookie-y-el-origen-es-el-ingles.md) §5 y
  §6, y adopta la alternativa que ese mismo ADR había rechazado
- **Toca**: [ADR-109](ADR-109-el-buscador-del-sitio-indexa-el-html-construido.md) §1 y §2
- **Depende de**: [ADR-107](ADR-107-el-sitio-es-una-app-next-que-no-compila-vanilla-extract.md)

## Contexto

ADR-110 dejó el idioma en la cookie pero **conservó el segmento `[lang]` dentro de `app/`**, invisible
en la URL, con `proxy.ts` reescribiendo `/docs/x` → `/en/docs/x`. La razón era una sola: leer la
cookie en un Server Component vuelve dinámicas todas las rutas y el sitio pierde el prerenderizado que
ADR-107 midió.

Ese mecanismo dejó de funcionar. En Next 16 el `proxy.ts` **se vuelve a ejecutar sobre la URL
reescrita**, así que el redirect del §6 (`/en` → `/` con `Set-Cookie`) se dispara sobre el rewrite
interno del §5 y el sitio devuelve 404 en todas las rutas. Medido sobre el repo:

|                                                                | resultado |
| -------------------------------------------------------------- | --------- |
| `/`, `/en`, `/theme`, `/components` con `proxy.ts` tal cual    | 404 todas |
| mismo commit, `proxy.ts` desactivado, `GET /en`                | 200       |
| `proxy.ts` activo con la rama `IsLang(first)` anulada, `GET /` | 200       |

Es decir: el rewrite del §5 funciona; lo que rompe es su colisión con el §6. Se ofreció al propietario
arreglar la colisión —guardar el redirect para que no reentre— conservando ADR-110 intacto y el
prerenderizado. **El propietario elige quitar el segmento.**

## Decisión

1. **`app/[lang]/**` pasa a `app/**`.** No hay segmento de idioma en el router. La URL no cambia:
   ya era `/docs/installation` (ADR-110 §1).
2. **El idioma se resuelve con `CurrentLang()`** (`src/lib/lang.ts`): cookie `nebula-lang` →
   `Accept-Language` → idioma de origen. Es la misma cadena del §2 de ADR-110 y el mismo
   `ResolveLang`; **solo cambia dónde se resuelve**, de la reescritura al Server Component.
3. **`proxy.ts` desaparece**, y con él la escotilla del §6: ya no hay URL con prefijo que fije el
   idioma. El conmutador de idioma no se entera —es una isla cliente que ya escribía la cookie ella
   misma y llamaba a `router.refresh()`.
4. **Se retiran `AsLang` y `AllSlugs`.** El primero validaba el parámetro de ruta; el segundo existía
   para `generateStaticParams`. Sin segmento no tienen función. El resto de la maquinaria que el §3 de
   ADR-110 manda conservar —negociación, diccionario por idioma, caída visible, `content/<lang>/`—
   sigue entera: añadir un idioma sigue siendo añadirlo a `LANGS` y crear su directorio.

## Lo que esto cuesta, dicho en voz alta

- **Se pierde el prerenderizado.** Medido con `next build`: **7 de 7 rutas quedan `ƒ (Dynamic)`,
  server-rendered on demand**. Es exactamente el precio que ADR-110 §5 evitaba y que su alternativa
  rechazada anticipaba. Para un sitio de documentación, es el coste real de esta decisión.
- **ADR-109 se queda sin premisa.** Su punto 1 indexa con Pagefind **sobre la salida estática** de
  `next build`; con rutas dinámicas no hay HTML construido que indexar. Hoy no rompe nada porque
  Pagefind **no está instalado ni cableado** (`islands/search.tsx` es un `TextInput` de relleno), pero
  **hay que resolverlo antes de implementarlo**: indexar desde `content/*.mdx`, o prerenderizar una
  instantánea solo para el índice. El §2 de ADR-109 no se ve afectado en el mecanismo: `<html lang>`
  se sigue emitiendo correcto, ahora desde el layout raíz.
- **La caché de CDN vuelve a depender de `Vary: Cookie`.** ADR-110 §5 mantenía el segmento interno
  precisamente como alternativa a eso. Hoy da igual porque solo hay un idioma; **sigue siendo
  obligatorio resolverlo antes del segundo**, y ahora sin la salida de cachear por ruta reescrita.
- **Deja de haber URL para fijar idioma.** `/en/components` ya no existe.

El propietario conoce los cuatro y decide seguir.

## Alternativas

- **Arreglar la colisión §5/§6** marcando el rewrite interno con una cabecera y guardando el redirect
  contra ella: ~10 líneas, ADR-110 intacto, prerenderizado conservado. Rechazada por el propietario.
- **Quitar solo el redirect del §6**, dejando el rewrite: el sitio serviría y conservaría el
  prerenderizado, pero se perdería igualmente la escotilla por URL y quedaría un `proxy.ts` que
  reescribe sin motivo visible desde fuera.

## Consecuencias

- `apps/web/src/proxy.ts` se borra; `apps/web/src/lib/lang.ts` se añade.
- Verificado tras el cambio: `/`, `/components`, `/theme`, `/changelog`, `/native` y `/docs/<slug>`
  responden 200; cada slug renderiza su propio documento; `<html lang="en">` correcto; una cookie con
  un idioma inexistente se ignora sin romper. `typecheck`, `lint` y `build` en verde.
- Se revisa cuando entre el segundo idioma, junto con `Vary: Cookie` y el índice de búsqueda.
