# ADR-149 — El «entorno único» es la imagen de Playwright anclada por digest

- **Estado**: **aceptada** · 2026-08-14 — aprobada por el propietario
- **Cierra**: el hueco que [ADR-037](ADR-037-gate-de-regresion-visual.md) §3 dejó abierto el
  2026-07-28: «un entorno único» sin decir cuál. El gate 8 lleva desde entonces sin correr en CI.
- **Enmienda**: [ADR-112](ADR-112-el-comparador-de-capturas-del-gate-visual.md) mantiene umbral y
  comparador; lo único que cambia es dónde se capturan las láminas.
- **Sin imagen propia y sin registro**: se usa la oficial de Playwright como contenedor del job.

## Contexto

El gate 8 compara 78 láminas contra un baseline versionado por plataforma, y hoy solo existe el de
`win32`. En un runner Linux no habría contra qué comparar, y regenerarlo en cualquier máquina daba
falsos positivos por encima del umbral del 0,1 %.

La causa concreta se identificó al implementar [ADR-148](ADR-148-el-sitio-sirve-la-fuente-que-pide.md):
**el aspecto dependía de las fuentes instaladas en el host**. Quien generó el baseline tenía Geist
instalado por Storybook; otra máquina no. Con ADR-148, tanto el sitio como el playground sirven su
propia Geist desde `@fontsource-variable/geist@5.3.0`, así que la tipografía deja de depender de la
máquina. Lo que queda por fijar es **el navegador**.

## Decisión

### 1. El entorno único es `mcr.microsoft.com/playwright:v1.61.1-noble`, anclado por digest

```
mcr.microsoft.com/playwright:v1.61.1-noble@sha256:5b8f294aff9041b7191c34a4bab3ac270157a28774d4b0660e9743297b697e48
```

La etiqueta se mueve; el digest no. Anclar por digest es lo que hace que el baseline de dentro de
seis meses siga comparándose contra el mismo Chromium que lo generó — sin eso, una actualización
silenciosa de la etiqueta repinta 78 láminas y nadie sabe por qué.

La versión no se elige al azar: `apps/playground-web` resuelve `playwright@1.61.1`, y la imagen
`v1.61.1-noble` trae exactamente ese Chromium. Un desajuste entre el runner de tests y el navegador
del contenedor es precisamente el tipo de deriva que este ADR existe para cerrar. **Subir Playwright
obliga a subir la imagen en el mismo PR, y a regenerar el baseline.**

### 2. Se usa como `container:` del job, no como imagen propia

GitHub Actions sabe correr un job dentro de una imagen. No hace falta escribir un `Dockerfile`,
construirlo, publicarlo en un registro ni mantenerlo al día. La alternativa —imagen propia— añadiría
un artefacto que versionar y un registro que pagar para envolver lo mismo que la oficial ya trae.

### 3. El baseline pasa a ser `linux`, y el de `win32` se queda

`jest-image-snapshot` escribe en `__snapshots__/visual/${process.platform}`, así que el contenedor
genera `visual/linux/` en su primera pasada. Ese es a partir de ahora **el baseline que manda**.

El de `win32` no se borra: sigue sirviendo para correr `pnpm visual` en local y ver una regresión
antes de abrir un PR. Lo que deja de ser es la referencia.

### 4. El gate visual bloquea; el de tiempo, no

- **Visual → bloquea.** Comparar píxeles es determinista una vez fijados navegador y fuentes. Que el
  runner esté cargado cambia lo que tarda, no lo que pinta.
- **Tiempo → no entra como gate.** Los runners compartidos de GitHub tienen CPU variable, el mismo
  problema que [P0](../reviews/p0-linea-base-2026-08-14.md) §4 midió en local: ~30 % de suelo de
  detección. Un gate que falla al azar se acaba ignorando, que es exactamente lo que pasó con la
  tanda de runs en rojo de agosto. Se queda fuera hasta que haya con qué sostenerlo.

## Consecuencias

- **El gate 8 empieza a correr en CI** con los demás, bajo la misma condición de ADR-139: commit de
  release, PR o dispatch manual. El job `visual-a-mano`, que existía solo para recordar el hueco,
  desaparece porque el hueco se cierra.
- **La primera pasada no compara: genera.** No hay `visual/linux/`, así que el primer run escribe las
  78 láminas y las sube como artefacto. Hay que **descargarlas y comprometerlas** antes de que el
  gate signifique algo. Hasta entonces está armado pero vacío.
- **El aspecto del baseline va a cambiar** respecto al de `win32`: distinto motor de rasterizado y
  distinta síntesis de fuentes. No es una regresión, es la referencia mudándose de máquina. Conviene
  mirar las 78 la primera vez en lugar de comprometerlas a ciegas.
- **Correrlo en local exige Docker**, que hoy no está en la máquina del propietario (ni Docker
  Desktop, ni WSL, ni Podman). No es un requisito nuevo para el día a día —`pnpm visual` sigue
  funcionando contra el baseline `win32`—, pero reproducir un fallo de CI sí lo pide.
- **`publish` depende de `visual`** desde el 2026-08-15. No lo hizo desde el principio a propósito:
  atar la publicación a un gate cuyo baseline no existe garantiza el fallo, y atarla a uno sin
  revisar es peor, porque bloquea por un aspecto que nadie declaró bueno. Se ató cuando las 75
  láminas de `linux` estuvieron generadas en el contenedor y **revisadas por el propietario**. Esa
  línea es la que convierte el gate 8 en bloqueante de verdad.

## Lo que costó ponerlo en marcha — 2026-08-15

Cuatro fallos encadenados, todos entre la primera corrida y el baseline comprometido. Se dejan
escritos porque tres de los cuatro salían **en verde**, y ésos son los que cuestan de encontrar.

1. **El navegador no aparecía.** La imagen lo deja en `/ms-playwright`, pero Actions fija
   `HOME=/github/home` y Playwright lo buscaba en `$HOME/.cache`. Se fija `PLAYWRIGHT_BROWSERS_PATH`.
2. **Y aun fijado, no llegaba.** Turbo 2 corre en `envMode: strict` y filtra lo que no esté
   declarado. Va como `passThroughEnv` en `turbo.json`, no como `env`, porque la ruta del navegador
   no debe entrar en el hash.
3. **El baseline no se generaba solo.** `jest-image-snapshot` no escribe capturas nuevas en CI, así
   que la primera pasada daba 75 «New snapshot was not written». Entra `visual:update` y el input
   `regenerar_baseline`; generar es deliberado y se pide.
4. **Y `visual:update` no capturaba nada.** El runner decidía por `npm_lifecycle_event === "visual"`,
   comparación exacta, así que con `visual:update` se iba por la rama de axe: 14 minutos de
   accesibilidad, cero capturas, **job en verde**. Pasa a comprobar el prefijo.

Lo que acortó el cuarto fue instrumentar en vez de deducir: un paso que comprueba si la carpeta
existe y lo dice en una línea, en lugar de 75 errores idénticos que no nombran la causa.
