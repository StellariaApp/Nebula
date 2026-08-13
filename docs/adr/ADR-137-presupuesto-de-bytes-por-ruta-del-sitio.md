# ADR-137 — El sitio tiene presupuesto de bytes por ruta, no solo la librería por módulo

- **Estado**: **aceptada** · 2026-08-12 — **WN**
- **Añade**: `tools/route-budget` (gate 10 de docs/03 §4), `apps/web/route-budget.json` y la tarea
  `check:budget` en turbo y en `gates.yml`. Sin dependencias nuevas: solo `node:zlib`.
- **Complementa**: el gate 5 (`size-limit` por entry de `@stellaria/nebula-web`), que mide otra cosa
  y no cubre esto.

## Contexto

El catálogo tenía presupuesto y el sitio no. `size-limit` mide **lo que pesa un componente si lo
importas suelto**; nadie medía **lo que descarga alguien que abre una página**. Son preguntas
distintas y la segunda es la que ve el usuario.

La diferencia no era teórica. Medido sobre producción antes de tocar nada:

- la **portada** servía 1.778 kB de JS sin comprimir, de los cuales **424 kB eran la librería de
  gráficos entera** —`AreaChart`, `BarChart`, `LineChart`, `PieChart` y sus ejes— arrastrada por un
  import estático en una banda que en móvil vive muy por debajo del pliegue;
- las **158 fichas** servían 1.758 kB y **70 hojas CSS** porque un solo módulo de muestras importaba
  ~150 componentes, de modo que la ficha de `Button` descargaba `TagsInput`, `Dropzone` y
  `MonthPicker`.

Ninguna de las dos cosas rompió ningún gate. Los ocho que corrían estaban verdes mientras la portada
servía una librería de gráficos que nadie miraba.

## Decisión

### 1. Se mide el HTML prerenderizado, no un manifiesto

`tools/route-budget` recorre `apps/web/.next/server/app/**/*.html`, extrae cada
`/_next/static/…` de sus `href`/`src` y los pesa en disco. Es **exactamente lo que recibe el
navegador**, incluidas las etiquetas de hoja que Next emite por ruta, y no hace falta levantar un
servidor ni salir a la red.

La alternativa era leer `app-build-manifest.json`. Se descarta porque describe la intención del
bundler y no el documento servido: el recuento de hojas —que es justo la métrica que destapó una
regresión que nadie explicaba— solo está en el HTML.

### 2. Cinco métricas, porque cada una caza algo distinto

| métrica    | qué caza                                                                |
| ---------- | ----------------------------------------------------------------------- |
| `jsRaw`    | el coste de **parseo**, que es lo que se paga en un móvil de gama media |
| `jsBr`     | el coste de **red**                                                     |
| `cssFiles` | peticiones que **bloquean el render**                                   |
| `cssBr`    | el peso real de esas hojas                                              |
| `htmlBr`   | la carga útil RSC en línea                                              |

`jsRaw` y `jsBr` no son redundantes: los gráficos eran el 24 % del bruto y el 22 % del comprimido,
pero un cambio que añade código muy repetitivo mueve mucho más el bruto que el brotli, y es el bruto
el que se paga en el hilo principal.

`cssFiles` está porque **ninguna otra métrica lo veía**. En esta misma sesión aparecieron 7 hojas de
más en rutas que no se habían tocado, con **cero bytes** de diferencia en el total: cualquier gate de
peso lo habría dado por verde.

### 3. Se presupuesta por grupo y manda el peor de cada grupo

Las 172 rutas prerenderizadas no llevan 172 topes. Van en cinco grupos por patrón, y **cada tope se
compara contra el peor miembro del grupo**, con la ruta culpable en el informe. Las 158 fichas miden
lo mismo hasta el byte —el mismo chasis, la muestra resuelta en cliente—, así que una línea las cubre
y una regresión en cualquiera de ellas la rompe.

**Una ruta sin grupo es un fallo**, no un aviso. Añadir una página sin declararla deja de ser posible
en silencio, que es como se colaron las dos regresiones del contexto.

### 4. Los topes llevan holgura, por la regla que WN ya escribió

Se aplica el criterio del recalibrado de 2026-08-08: `max(medido × 1,05, medido + 1 kB)`, redondeado
al alza a 0,25 kB, y `medido + 2` para el recuento de hojas. Ninguno queda por debajo del 4,3 % de
holgura.

Es literal: «un tope no se vuelve a fijar al valor medido; sin holgura, el número no es un gate, es un
cable trampa». Ese aprendizaje costó que `size-limit` fallara por 3 B durante N3, y no hace falta
repetirlo aquí.

## Alternativas descartadas

**Lighthouse o un presupuesto de métricas de campo (LCP, TBT).** Miden mejor lo que importa y no
sirven de gate: dependen de la máquina, del runner y de la red, y un umbral que oscila se acaba
ignorando. Los bytes son deterministas y el build ya los tiene en disco.

**Reutilizar `size-limit`.** Está construido alrededor de «bundlea este entry y pésalo», no de «lee
este documento y suma sus assets». Ni ve las hojas por ruta ni distingue bruto de comprimido por
grupo.

## Consecuencias

- El gate corre en CI con los otros ocho, en el mismo `turbo --continue`, y **depende de `web#build`**
  porque necesita `.next` en disco. En local, `pnpm turbo check:budget`.
- Verificado en rojo, no solo en verde: bajando dos topes a mano el proceso sale con **código 1** y
  nombra la métrica y la ruta; restaurados, sale con 0.
- Cuando un cambio suba legítimamente un presupuesto, se sube el tope en el mismo PR. Eso es lo que
  convierte la subida en una decisión visible en la revisión en vez de en una deriva.
- **Residual anotado**: el gate mide rutas **prerenderizadas**. `/preview/[name]` y `/og` se sirven
  bajo demanda y no tienen HTML en disco, así que quedan fuera. Cubrirlas exige levantar el servidor
  en CI, que es otra decisión.
