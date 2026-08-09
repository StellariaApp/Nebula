# ADR-112 — El comparador de capturas del gate visual

- **Estado**: aceptada · 2026-08-08 (decisión del propietario en la revisión previa a W5) · **W5**
- **Cambia API pública**: no. Añade dos `devDependencies` a `apps/playground-web`, que no se publica.
- **Enmienda [ADR-037](ADR-037-gate-de-regresion-visual.md) §1**, que sigue vigente en todo lo demás:
  el alcance (§2), el determinismo (§3), el baseline versionado (§4) y el orden (§5) no cambian.

## Contexto

ADR-037 decidió la herramienta del gate de regresión visual con un argumento explícito:

> **La herramienta es el `@storybook/test-runner` ya instalado**, con `toMatchSnapshot` de Playwright
> en un hook de post-visita. No se añade ninguna dependencia.

Y ese «cero dependencias» fue lo que retiró la objeción de `docs/06` §8 y lo que descartó Chromatic.

**Al implementarlo resulta que ese matcher no existe en este montaje.** Medido sobre el árbol:

- `@storybook/test-runner` 0.24 corre sobre **Jest** —sus dependencias son `jest`, `jest-circus`,
  `jest-runner`, `@swc/jest`— y tipa su `Page` desde `playwright`, la librería de driver.
- El `toMatchSnapshot` que compara imágenes con `maxDiffPixelRatio` pertenece a **`@playwright/test`**,
  que es un paquete distinto y **no está instalado**: el árbol tiene `playwright@1.61.1` y
  `playwright-core@1.61.1`, que traen el driver, no el runner de tests.
- Tampoco hay ningún comparador de imágenes: ni `jest-image-snapshot`, ni `pixelmatch`, ni `pngjs`.

El `toMatchSnapshot` de Jest sí existe, pero **serializa valores**: escribiría la captura como base64
dentro de un `.snap`. Eso incumple dos puntos del propio ADR-037 —el umbral `maxDiffPixelRatio` del §3
y «las imágenes visibles en la revisión» del §4— y deja un diff que nadie puede leer, que es
exactamente el fallo que el ADR quería evitar.

**Capturar no cuesta ninguna dependencia** —`page.screenshot()` ya funciona—; lo que falta es comparar.

## Decisión

**El comparador es `jest-image-snapshot`, como `devDependency` de `apps/playground-web`.**

Es el matcher de imágenes del ecosistema Jest sobre el que el test-runner ya corre, así que entra en
el mismo hook de post-visita que ADR-037 §1 describe, sin segundo runner y sin tocar el grafo de
`packages/`. Da lo que el ADR pide y Jest no tiene:

- `failureThresholdType: "percent"` con `failureThreshold`, que es el `maxDiffPixelRatio` del §3;
- PNG de baseline, de diff y de recibido en disco, que es lo que hace revisable el §4.

**El umbral queda en `0.001` (0,1 % de píxeles).** ADR-037 §3 lo pide «pequeño pero no nulo» y lo deja
a calibrar en este PR. Medido: **dos pasadas consecutivas del catálogo completo en la misma máquina
dan cero píxeles de diferencia en las 75 capturas**, con el umbral puesto en `0` exacto y las 614
stories en verde. `animations: "disabled"` congela también las decorativas infinitas —spinner,
shimmer, `StarField`, gradientes en deriva—, que era lo que se esperaba que hiciera ruido.

Así que el margen **no cubre ruido observado sino la deriva de entorno** que el propio §3 anticipa, y
por eso se queda muy por debajo del 1–2 % habitual.

**Verificado rompiendo el gate a propósito**, que es la única forma de saber que muerde: subir el
`paddingInline` de un solo tamaño de `Badge` de `space.md` a `space.xl` hace fallar 3 capturas con
**0,67 % de diferencia** (7.754 píxeles) y salida 1. Ese mismo cambio **habría pasado inadvertido con
el umbral del 1 %**, que es el valor que se habría elegido sin medirlo. Es el argumento del número:
un desplazamiento real de un componente pequeño dentro de una lámina grande vive por debajo del 1 %.

**El baseline lleva la plataforma en su ruta.** ADR-037 §3 dice que se genera y valida en un único
entorno, «el del CI» — y hoy **no hay CI**: no existe `.github/workflows`. Guardar las capturas en
`__snapshots__/visual/<plataforma>/` hace que el baseline de esta máquina y el que genere un CI en
Linux convivan en vez de invalidarse, y que el día que exista CI su primera pasada escriba el suyo sin
borrar el que ya sirve de referencia local. Sigue cumpliéndose la regla de fondo del §3: **cada
baseline se compara solo consigo mismo**.

### Enmienda del 2026-08-09 — ya hay CI, y el gate visual sigue fuera

`.github/workflows/gates.yml` corre **ocho** gates. El visual no es uno de ellos, y conviene decir por
qué, porque el párrafo de arriba se escribió esperando lo contrario.

Que exista un runner en Linux no resuelve el problema: lo mueve. Su primera pasada escribiría un
baseline `linux` que nadie ha revisado —el gate no compara, **acepta**—, y a partir de ahí compararía
capturas de Linux contra sí mismas con un umbral del 0,1 % calibrado midiendo que dos pasadas _en la
misma máquina_ dan cero. Entre dos ejecuciones de un runner efímero no dan cero: el antialiasing y la
síntesis de fuentes dependen de las que haya instaladas, y el margen medido no cubre eso.

Así que la regla del §3 —un entorno único— sigue sin tener candidato. El día que lo tenga será **un
contenedor con fuentes fijadas**, y ese contenedor pasará a ser el entorno único para todos, no solo
para el CI: el baseline de win32 se retiraría en el mismo PR en vez de convivir con él. Es una
decisión aparte y no se toma aquí.

Mientras tanto el gate se corre a mano con `pnpm visual`, y el workflow lleva un job que no hace nada
salvo explicar esto en cada PR — el hueco visible vale más que el hueco callado.

## Alternativas descartadas

**`@playwright/test` como runner aparte.** Da el `toMatchSnapshot` que ADR-037 nombra, con
`maxDiffPixelRatio` nativo. Descartada por coste de estructura: mete un segundo runner de tests en el
repo, con su propia configuración, su propio arranque del `storybook-static` y su propio informe,
conviviendo con el que ya corre el gate de axe. La ganancia es de literalidad, no de capacidad.

**Comparar a mano sin dependencia.** Node no trae decodificador de PNG, así que compararlas exige
escribir uno o apoyarse en `sharp`, que está en el árbol como transitiva de otro paquete y no
declarada. Depender de una transitiva es peor que declarar la dependencia.

**Volver a Chromatic.** Sigue descartada por lo mismo que en ADR-037: servicio de pago con los
baselines fuera del repositorio. Que el argumento de «cero dependencias» resultara inexacto no cambia
el resto de la comparación — dos `devDependencies` de una app que no se publica no son un servicio
externo.

**Dejar el gate sin implementar.** Es lo que había, y es lo que permitió que el barrido de WN
convirtiera ~95 nodos y añadiera 169 props de ranura sin que ningún gate pudiera detectar que algo se
hubiera movido de sitio.

## Consecuencias

- **Dos `devDependencies` nuevas en `apps/playground-web`**: `jest-image-snapshot` y sus tipos.
  Arrastran `pixelmatch` y `pngjs`. No entran en `packages/`, no viajan al paquete publicado y no
  aparecen en ningún presupuesto de `size-limit`.
- **El argumento de ADR-037 §1 queda corregido**: la vía elegida no era de cero dependencias. La
  decisión de herramienta se sostiene igual, pero por otra razón —seguir en el runner que ya existe—,
  y conviene que quede escrito para que la próxima lectura del ADR no vuelva a tropezar.
- **El repositorio gana ~100 PNG de baseline**, dentro del alcance que ADR-037 §2 acota.
- **`docs/03` §4 estrena su octavo gate** y `docs/06` §8 deja de tener deuda abierta, los dos en este
  mismo PR, como ADR-037 §6 exige.
- **El gate no bloquea en local por defecto.** ADR-037 §3 lo pide, y aquí es además necesario: sin CI,
  el único baseline es el de una máquina. `pnpm visual` compara y reporta; `--ci` es lo que lo hace
  fallar.
