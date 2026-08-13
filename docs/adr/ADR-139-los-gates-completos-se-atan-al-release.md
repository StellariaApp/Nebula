# ADR-139 — Los gates completos se atan al release; en cada push corre una guardia ligera

- **Estado**: **aceptada** · 2026-08-13 — **WN**
- **Cambia**: `.github/workflows/gates.yml` y `docs/03-a11y-motion-performance.md` §4.1, que fijaba
  «en cada PR y en cada push a `main`».
- **No cambia**: los diez gates, lo que mide cada uno, ni el encadenado `publish → needs: [gates,
a11y]` de [ADR-134](ADR-134-changesets-y-la-forma-del-paquete-publicado.md). Sin dependencias
  nuevas.

## Contexto

El workflow se disparaba en cada push a `main`. Cada uno pagaba `gates` (~15 min) y `a11y` (~15 min,
más la descarga de Chromium) en paralelo, y ambos existían para llegar a `publish`, que **casi
siempre no hacía nada**: `changeset publish` es idempotente y solo manda al registro lo que todavía
no está. La idempotencia era el filtro, y el precio de usarla como filtro era construir el catálogo
entero para descubrir que no había nada que publicar.

Sobre el histórico real —14 runs en día y medio— eso se ve en tres síntomas a la vez:

- **Coste**: ~30 min de cómputo por commit para publicar nada, en un flujo que va directo sobre
  `main` con commits pequeños y seguidos. Los `pull_request` del disparador estaban inertes: los 14
  runs eran `push`.
- **Cancelaciones**: con `cancel-in-progress: true`, un push mientras corre el anterior lo mata. Hay
  runs de 2m26s que no llegaron a decir nada de nada, y la señal que se perdió no era señal de nadie.
- **Señal ignorada**: hay runs en rojo seguidos de más pushes sin arreglarlos. Un gate que falla y no
  detiene a nadie no es un gate; es ruido con insignia.

El contrato de docs/03 §4.1 suponía trabajo por PR, donde «cada push» equivale a «cada revisión de
algo que se va a integrar». En un catálogo que se construye a golpe de commit sobre `main`, «cada
push» significa otra cosa, y el contrato dejó de comprar lo que decía comprar.

## Decisión

### 1. El disparador sigue siendo el push; lo que cambia es qué corre

`on: push` a `main` se mantiene, y se añade `workflow_dispatch`. El trabajo se parte en dos ramas
separadas por **una sola condición**, escrita una vez y una vez invertida:

```
github.event_name == 'push' && !startsWith(github.event.head_commit.message, 'chore(release):')
```

| se cumple                       | no se cumple                                         |
| ------------------------------- | ---------------------------------------------------- |
| push corriente a `main`         | commit de release · PR · dispatch manual             |
| corre `guardia`: typecheck+lint | corren los diez gates, axe, `visual-a-mano`, publish |

Las dos ramas son **complementarias y disjuntas**: lo que una cubre la otra lo cede. Un commit de
release no paga la guardia además de los gates, y un push corriente no paga los gates.

### 2. El release se reconoce por el asunto del commit, no por un filtro de rutas

La alternativa obvia era `on.push.paths: ["packages/*/CHANGELOG.md"]`, y es más limpia en un sentido
—el run **ni se crea**, así que la lista de Actions queda sin una sola entrada saltada—. Se descarta
por lo mismo: si el run no se crea, tampoco hay guardia en los pushes corrientes, que es justo la
mitad que esta decisión quiere conservar.

El marcador es fiable por construcción, no por convención: `scripts/release.mjs` exige rama `main`,
árbol limpio y `main` al día **antes** de escribir nada, y commitea y empuja de una, así que el
commit `chore(release): …` es siempre la cabeza del push.

### 3. La guardia son typecheck y lint, y no pretende ser más

Son los dos gates que más atrapan por minuto —un tipo que no cierra, una regla rota— y los únicos que
no necesitan ni Chromium, ni `storybook-static`, ni el prerenderizado de Next.

**No es gratis y conviene no venderlo como tal**: ambos dependen de `^build` (`turbo.json`), así que
la guardia construye los paquetes de los que cada workspace depende. Lo que se ahorra frente a la
pasada completa es todo lo demás: el build de las apps, el prerender, storybook-static, Chromium, los
tests, `size-limit` y los dos presupuestos.

### 4. `publish` deja de apoyarse en la idempotencia como filtro

No cambia una línea de sus pasos, pero sí lo que lo gobierna: `needs: [gates, a11y]`, y un job cuya
dependencia se salta se salta también. Ya no llega hasta ahí en cada push. La idempotencia de
`changeset publish` pasa de ser el filtro a ser la red de seguridad, que es el papel que le sienta.

Efecto lateral deliberado de su `if`: un **dispatch manual corre los diez gates y axe pero no
publica** —solo publica un `push` a `main`—, así que se puede pedir una pasada completa a mitad de
trabajo sin tocar el registro.

## Alternativas descartadas

**Dejar el disparador y abaratar el workflow** (compartir el build entre `gates` y `a11y`, montar
caché remota de turbo). Reduce el coste pero no toca el problema: se seguirían corriendo diez gates
por un commit que no se publica, y las cancelaciones seguirían igual.

**Todo a mano, solo `workflow_dispatch`.** Máximo control y un único modo de fallo, el de acordarse.
Un gate que depende de la memoria no es un gate.

**Volver a trabajar por PR.** Es la respuesta que devolvería el contrato original a su sitio, y es
una decisión sobre cómo se trabaja, no sobre CI. Si algún día se adopta, el disparador `pull_request`
sigue puesto y los gates completos vuelven solos sin tocar este archivo.

## Consecuencias

- **Entre releases dejan de verificarse en CI**: `test`, `size`, `check:slots`, `check:contrast`,
  `check:docs`, `check:budget`, el build de las apps y axe. Todos siguen disponibles en local con
  `pnpm turbo <tarea>`, y todos corren antes de publicar.
- **El riesgo concreto queda anotado**: `pnpm release` versiona, commitea y **empuja** antes de que
  CI opine. Si los gates salen en rojo, `publish` no corre y `main` se queda con un commit de versión
  sin paquete en el registro. Se sale arreglando y volviendo a releasear —las versiones ya subidas no
  se repiten—, pero es un estado incómodo. La mitigación natural es correr los gates como preflight
  dentro de `scripts/release.mjs`, antes de versionar; **no se adopta aquí** y queda como decisión
  aparte.
- **La condición mira `head_commit`**, que en un push es el último commit. Si algún día el commit de
  release dejara de ser la cabeza, los gates no correrían y `publish` se saltaría con ellos: el modo
  de fallo es publicar **de menos**, nunca publicar sin gates.
- El hueco del gate 8 sigue donde estaba ([ADR-037](ADR-037-gate-de-regresion-visual.md),
  [ADR-112](ADR-112-el-comparador-de-capturas-del-gate-visual.md)); `visual-a-mano` ahora lo recuerda
  antes de publicar en vez de en cada push, que es cuando importa.
