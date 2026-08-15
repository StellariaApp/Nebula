# ADR-148 — El sitio sirve la fuente que pide

- **Estado**: **aceptada** · 2026-08-14 — aprobada por el propietario
- **Cierra**: la brecha entre lo que `@stellaria/nebula-tokens` declara como familia y lo que
  `apps/web` entrega. Hoy pide Geist y no manda ni un byte de fuente.
- **Afecta**: `apps/web` (layout raíz y presupuestos), `tools/route-budget` (categoría nueva) y el
  baseline del gate visual ([ADR-037](ADR-037-gate-de-regresion-visual.md)).
- **Sin dependencias de runtime nuevas**: `next/font` viene con Next; los `.woff2` se vendorizan.

## Contexto

`packages/tokens/src/tokens/typography.ts:5` declara la familia:

```
Geist Variable, Geist, Geist Sans, Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif
```

En `apps/web` no hay `@font-face`, ni `next/font`, ni un `.woff2`. La traza de red del sitio
desplegado lo confirma: **0 peticiones de fuente**. Los únicos Geist del repositorio están en
`apps/playground-web`, que sí declara `@fontsource-variable/geist@5.3.0` y lo importa desde
`.storybook/preview.tsx`.

Consecuencias que esto ya tiene, y que no son teóricas:

- **Nadie ve Geist salvo quien lo tenga instalado.** Un visitante en Windows ve Segoe UI; en Android,
  Roboto; en macOS, la de sistema. Quien desarrolla el catálogo **sí** lo tiene, porque se lo instaló
  Storybook: el sitio se ve distinto para quien lo hace que para quien lo usa.
- **El baseline del gate visual está capturado con las fuentes del host.** Por eso solo existe el de
  `win32` y por eso ADR-037 §3 lleva sin candidato a «entorno único»: no es una limitación abstracta
  de plataforma, son las fuentes de la máquina de quien lo generó.

## Decisión

### 1. El sitio sirve Geist, y lo sirve él

`next/font/local` sobre los `.woff2` **vendorizados** en `apps/web`, tomados de
`@fontsource-variable/geist@5.3.0` y `@fontsource-variable/geist-mono@5.3.0` — el mismo paquete y la
misma versión que ya pinea el playground.

Que sean los mismos bytes no es coincidencia buscada por comodidad: es lo que hace que **el sitio y
Storybook pinten con la misma fuente**, y sin eso el gate visual compararía dos cosas distintas.

Se descarta `next/font/google`, que haría lo mismo con menos código: descarga en tiempo de build, y
eso mete una dependencia de red en un build que hoy es hermético (`--frozen-lockfile`, procedencia
firmada). No se paga esa moneda por ahorrar dos ficheros.

### 2. Solo el subset latino

`LANGS = ["en"]` en `apps/web/src/lib/i18n.ts`: el sitio es solo inglés. El latino cubre ASCII y
Latin-1, que es cuanto se necesita.

| Fichero           | Peso        |
| ----------------- | ----------- |
| Geist latino      | **28,7 kB** |
| Geist Mono latino | **22,6 kB** |
| Paquete entero    | 164 kB      |

Los 164 kB incluyen cirílico, griego, vietnamita y símbolos. Servirlos sería pagar 112 kB por
alfabetos que ninguna página del sitio escribe.

### 3. `display: swap`, y el preload solo para el sans

El elemento que marca el LCP es el párrafo del Hero — **texto**. Con `display: block` la fuente pasa
a bloquear el renderizado justo del elemento más crítico de la portada, que es lo contrario de lo que
el plan de performance está intentando arreglar. Con `swap` el texto pinta ya con la del sistema y
cambia cuando Geist llega.

Se precarga **solo el sans**: es el que pinta el LCP. El mono lo consumen `Code` y `CodeHighlight`, y
que el fragmento de instalación cambie de fuente medio segundo después no le cuesta nada a ninguna
métrica.

### 4. Las métricas del respaldo se ajustan

`adjustFontFallback` de `next/font`, que sintetiza un `@font-face` de respaldo con `size-adjust` y
overrides de ascendente y descendente para que Geist y la fuente de sistema ocupen lo mismo.

**El CLS del sitio es 0 hoy**, medido en los ocho informes. `swap` sin ajuste de métricas es la forma
clásica de romperlo, y romperlo por una fuente sería un mal negocio.

## Consecuencias

- **`tools/route-budget` necesita categoría de fuentes ANTES de que esto entre.** Hoy clasifica en
  dos cubos: lo que acaba en `.css` es CSS y **todo lo demás es JS**. Un `.woff2` precargado aparece
  en el HTML como `<link rel="preload" href="/_next/static/media/…">`, así que entraría en el
  presupuesto de JavaScript y lo corrompería en ~29 kB. Es la primera tarea de la implementación, no
  la última.
- **Los presupuestos por ruta suben.** ~29 kB en las rutas que solo escriben prosa y ~51 kB donde
  además hay código. Se recalibran con la regla de holgura de WN una vez medido, como en P0.
- **El baseline visual queda invalidado, y eso es una mejora.** Las 75 láminas de ADR-037 guardan un
  aspecto pintado con las fuentes de una máquina concreta. Con la fuente servida por el sitio, el
  baseline pasa a depender solo del navegador — que es lo que un contenedor sí puede fijar. Hay que
  regenerarlo, y el aspecto va a cambiar en cualquier máquina donde Geist no estuviera instalado.
- **Se mide antes y después.** Entra ~29 kB de red y una dependencia de renderizado nueva sobre el
  elemento del LCP. `tools/hydration-measure` y `check:budget` tienen la línea base del 2026-08-14
  ([P0](../reviews/p0-linea-base-2026-08-14.md)); si el LCP empeora, se revisa el preload antes que
  la decisión.
- **`apps/web` gana dos ficheros binarios versionados.** Es el precio de un build hermético, y son
  51,3 kB que no cambian salvo que suba la versión de Geist.

## Enmiendas de implementación — 2026-08-14

Tres cosas se decidieron mal arriba y se corrigen aquí, con lo medido al implementarlas.

### A. No es `next/font/local`; es el propio `@fontsource-variable`

`next/font/local` genera un **nombre de familia opaco** (`__geist_a1b2c3`) y no deja elegirlo. El
stack de `packages/tokens` pide `Geist Variable` por su nombre, así que la fuente cargada nunca
habría casado con el token: habría que duplicar el stack en la app y sacar la familia del contrato.

`@fontsource-variable/geist` declara `font-family: 'Geist Variable'` y `font-display: swap` de
fábrica — exactamente lo que el token pide y lo que la decisión 3 quería. Se importa desde el layout
raíz, con la versión clavada a `5.3.0`, la misma del playground. Sigue siendo hermético y sigue
siendo los mismos bytes que Storybook, que era lo que importaba.

### B. El subset no se elige: lo resuelve `unicode-range`

La decisión 2 daba por hecho que había que escoger el fichero latino. No hace falta: cada `@font-face`
de fontsource lleva su `unicode-range`, y el navegador **solo pide el subset que la página escribe**.

Medido con Playwright sobre el build servido: de **33 declaraciones**, el navegador pide **2
ficheros, 51,3 kB** — `geist-latin` (28,7 kB) y `geist-mono-latin` (22,6 kB). Los 164 kB del paquete
están en disco y en el deploy, no en la descarga de nadie.

### C. El preload no está puesto, y el gate no ve las fuentes

Las dos cosas tienen la misma causa: los `.woff2` se referencian desde `url()` **dentro del CSS**, no
desde un atributo del HTML.

- **Preload**: precargar exige la ruta con hash que emite el bundler, y el layout no la tiene sin
  plumbing de build. Queda **pendiente**. Consecuencia: el texto del Hero pinta con la fuente del
  sistema y cambia a Geist un poco más tarde de lo que lo haría con preload. No afecta al CLS.
- **Gate**: `route-budget` gana la categoría `fontBr` y funciona para fuentes precargadas, pero hoy
  mide **0** porque no lee `url()` del `<style>` inline. Contarlas de ahí sumaría los 33 subsets —
  164 kB que nadie descarga—, así que hacerlo bien pide entender `unicode-range`. Queda anotado.

### D. El efecto en tiempo no se pudo medir; el de CLS sí

**CLS = 0**, dispersión 0 % sobre 7 pasadas, con la fuente servida. Era el riesgo que la decisión 4
quería cubrir, y está cubierto.

El resto no: construir el mismo commit con y sin fuente dio TBT de 2.382 ms y 513 ms, y una fuente no
elimina ocho tareas largas. Lo que cambió entre las dos sesiones fue la carga de la máquina — la
dispersión pasó del 4 % al 60 %. Es el suelo de detección que [P0](../reviews/p0-linea-base-2026-08-14.md)
§4 ya había documentado, confirmado por segunda vez. **El coste en tiempo de esta decisión queda sin
medir hasta que haya entorno fijo.**
