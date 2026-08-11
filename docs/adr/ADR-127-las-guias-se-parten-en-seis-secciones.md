# ADR-127 — Las guías se parten en seis secciones y Components vive dentro

- **Estado**: aceptada · 2026-08-10 (decisión del propietario, `docs/NOTAS-PARA-REVISAR.md`) · **WN** ·
  implementada
- **Cambia API pública**: no. Es el mapa de rutas de `apps/docs`, que estaba cerrado en su README
  (2026-08-08) y este ADR sustituye. Ningún paquete del catálogo cambia.
- **Depende de**: [ADR-122](ADR-122-el-segmento-lang-desaparece-del-router.md) (el idioma no está en
  la URL) · [ADR-126](ADR-126-el-carril-y-el-contenido-comparten-eje.md) (el eje compartido).

## Contexto

El sitio tenía **una sola sección de prosa** —`/docs/[...slug]`— y un carril con dos grupos: «Learn»
con las cinco guías y «Reference» con cuatro enlaces sueltos (`/components`, `/theme`, `/native`,
`/changelog`). El carril lo montaba el cromado, así que era el mismo en las nueve rutas: en
`/changelog` seguía listando las guías.

Dos problemas, y el segundo es el que no escala:

1. **`/components` y `/docs` eran raíces hermanas** con la misma naturaleza —las dos son
   documentación— y el nav superior tenía que nombrar las dos. Cuando llegue la ficha por componente
   son 158 páginas más colgando de una raíz que el carril no sabe recorrer.
2. **Un carril global no puede tener contexto.** Si el carril es el mismo en todas partes, o lista
   todo —y son 158 fichas más cinco guías más los hooks— o no lista casi nada, que es lo que hacía.

## Decisión

### Seis secciones hermanas, cada una con su URL y su carril

```
/guides/getting-started        /guides/components        /guides/theming-styles
/guides/hooks                  /guides/form              /guides/native
```

`Components` **vive dentro de Guides**, no como raíz aparte. El nav superior queda con **Guides ·
Components · Theme Creator** —el logotipo ya lleva a la portada, así que «Home» era una entrada de
más—. `/changelog` y el resto siguen alcanzables desde el pie.

**Una sección lleva a su primera página, no a su índice.** Lo que enlaza a la sección entera —la
pestaña, «Guides» en la barra, en el pie y en la portada— aterriza en `SectionLanding`, que es la
primera entrada de su `DocIndex`; sin páginas, cae en el índice, que es lo único que hay. Nadie
escribe el slug a mano: si la primera guía cambia de nombre, el destino la sigue.

La tabla vive en `src/lib/sections.ts` y cada entrada declara **de qué tipo es**, que es lo que
decide qué renderiza el índice y qué lleva el carril:

| sección           | tipo       | índice                          | carril                  |
| ----------------- | ---------- | ------------------------------- | ----------------------- |
| `getting-started` | `docs`     | fichas de sus cinco `.mdx`      | sus páginas             |
| `components`      | `catalog`  | la tabla de las 158 por familia | las familias, con ancla |
| resto             | `reserved` | la pantalla `Reserved`          | «Lands with web v1»     |

**Las secciones sin contenido aparecen igual.** Theming & Styles, Hooks, Form y Native entran con la
pantalla reservada que ya existía: una sección que no se ve no se puede prometer, y son cuatro de las
seis.

### La sección sale de la carpeta, no del front matter

`content/<lang>/<section>/<slug>.mdx`. Una sola fuente: `DocIndex(lang, section)` lee el directorio y
no hay forma de que el front matter y la ruta discrepen. El precio es que mover una guía de sección
es mover un archivo, que es exactamente lo que uno espera.

### Las pestañas y el carril viven en `guides/layout.tsx`

Es lo que evita el remontado. Un layout de App Router no se desmonta mientras navegas dentro de su
segmento, así que la sección activa se lee con `useSelectedLayoutSegment()` y solo cambia el
`children`. **Si las pestañas vivieran en las páginas, se remontarían en cada salto** y el indicador
del `Segment` saltaría en vez de deslizarse.

El layout monta los seis carriles y muestra el de la sección activa; el resto no renderiza nada. El
carril es el mismo nodo antes y después de saltar de pestaña —verificado en navegador—, así que
conserva su scroll.

**Las pestañas navegan con `router.push`**, no con anclas. Se asume el coste: sin clic central, sin
`Cmd+clic` y sin enlace visible para el crawler. La alternativa —`href` en `Segment.Control.Item`— es
API del catálogo y va con su propio ADR.

### El cromado se queda sin carril, y aparece un segundo chasis

`ui/chrome.tsx` monta ahora **la barra, el fondo y el ThemePanel**, y nada más. Debajo hay dos
chasis hermanos, porque las rutas que no son guías no tienen carril que enseñar:

- `guides/layout.tsx` — la banda de pestañas y, debajo, el `AppShell` en modo carril con
  `contentWidth`.
- `(plain)/layout.tsx` — `AppShell` sin barra lateral, para `/theme` y `/changelog`.

**La banda de pestañas es el segundo peldaño de la barra, no una fila del carril.** No va en el área
`chrome` del shell —que arranca a la derecha del carril— sino fija bajo la barra, y sigue la misma
regla que ella: **la superficie cruza la pantalla y su contenido no**. `GlassSurface level="subtle"`
queda dos peldaños por debajo del `strong` de la barra, y el `Segment` va sin fondo ni borde propios:
lo único que pinta es el indicador de la pestaña activa. Medido: logo, contenido de la banda y carril
arrancan los tres en x=80.

**Barra y banda están fuera del flujo, y el shell arranca en y=0.** Es la única forma de que el
contenido pase **por detrás** del cristal al scrollear: si el cromado va encima del `main`, el
material no tiene nada que velar y el cristal se ve plano. Las dos capas son `position: fixed` y los
dos scrollers reservan el hueco —`mainProps={{ pt: CHROME_HEIGHT }}` y el mismo `pt` en el carril,
que sale de `NAV_HEIGHT + BAND_HEIGHT` en `lib/layout.ts`—. El índice de la página se pega por debajo
del cromado con el mismo número, y el velo de scroll del `AppShell` se apaga: con la banda encima
duplicaba el filo.

Los dos declaran `z={1}`: el fondo del cromado es `position: fixed`, y sin capa propia pintaría por
encima del contenido.

**El pie va dentro de cada chasis, no en el cromado.** En el modo carril lo que scrollea es el
`main`, no la ventana; un pie hermano del `AppShell` quedaría clavado abajo comiéndose el alto en vez
de cerrar la página.

`SHELL_WIDTH` sale a `src/lib/layout.ts` porque ahora lo comparten tres capas —la barra, el grid del
carril y el chasis plano—, y ADR-126 ya avisó de que ese número no puede estar dos veces.

### Redirecciones, no enlaces muertos

`/docs/:slug*` → `/guides/getting-started/:slug*`, `/components` → `/guides/components`, `/native` →
`/guides/native` y `/guides` → `/guides/getting-started`. Son **307 y no 308**: el sitio no está
desplegado y un permanente se queda cacheado en el navegador del propietario mientras itera.

Los enlaces del pie, del nav, de la portada y de dentro del MDX se actualizan igual: la redirección
es la red de seguridad para lo que ya está fuera, no la forma de enlazar.

### La URL de la ficha es kebab-case

`/guides/components/code-highlight`, no `/codehighlight`. `ComponentSlug` lo deriva del nombre
(`CodeHighlight` → `code-highlight`) y la tabla del índice ya enlaza ahí. **La ficha todavía no
existe**: hasta que llegue, esas 158 filas apuntan a un 404 conocido.

## Alternativas descartadas

**El carril en una ruta paralela (`@rail`)**, para que el cromado siguiera dueño del `AppShell`. Es
más maquinaria de router para el mismo resultado, y el segmento activo se lee peor desde una ranura.

**Las pestañas en cada página.** Se remontan en cada navegación: el indicador salta y el carril
pierde el scroll. Es justo lo que el layout evita.

**Dejar `Components` como raíz.** Obliga a que el nav superior tenga cuatro entradas y a mantener dos
carriles distintos, uno por raíz de documentación, para el mismo tipo de contenido.

**Una sección por archivo de front matter** (`section: components` dentro del `.mdx`). Dos fuentes
para lo mismo y ninguna manda: un `.mdx` en `getting-started/` con `section: hooks` no tiene
respuesta correcta.

## Consecuencias

- **Va en un solo commit y no se puede partir**: mover `content/<lang>/*.mdx` rompe `/docs/*` hasta
  que existen el layout, las dos rutas nuevas y las redirecciones.
- **El buscador no se entera** (ADR-109): Pagefind no está instalado y el campo es un `TextInput`
  inerte. Cuando se cablee indexará las rutas nuevas como cualquier otra.
- **Queda pendiente la ficha por componente**, que es el trabajo siguiente y decide antes si se
  genera desde `generated/api.json` o se escribe a mano.
- **El carril declara `h` desde `tablet`**: su `blockSize: 100dvh` no descontaba la barra, y con la
  banda encima le sobraban 121 px por debajo de la ventana. El valor es responsive a propósito —por
  debajo de `tablet` la barra lateral se convierte en la barra inferior fija y ahí manda su propia
  regla—.
- **Una cosa heredada sigue igual**: los enlaces del carril no llevan icono, con lo que en la barra
  inferior de móvil y en el carril mini de tablet se ven vacíos. Viene de antes de la reestructura.
