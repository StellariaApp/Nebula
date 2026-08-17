# Auditoría visual — motion activo · 2026-08-17

> **Fase 2 de VA1**, el hueco que el encargo marca como **prioritario**: el gate 8 corre bajo
> `prefers-reduced-motion`, así que **no cubre nada de lo que se mueve**. Se descubrió una vez por las
> malas —`AURORA_BLUR` de `StarField` era el cuello de botella del sitio y ninguna lámina lo habría
> notado— y desde entonces sigue sin mirarse.
>
> Alcance de [la rúbrica](rubrica-auditoria-visual.md) §0: **el color queda fuera**. Nada de lo de
> abajo lo toca.
>
> **Los dos fallos están aplicados y verificados** — ver §0. Las curvas **no**: al ir a proponerlas se
> descubrió que no eran un defecto.

## 0. Lo aplicado

| Cambio                              | Antes               | Ahora                      | Desvío |
| ----------------------------------- | ------------------- | -------------------------- | ------ |
| `StarField` · `AURORA_BLUR`         | `"50px"` literal    | `vars.blur.xxl` (24 px)    | —      |
| `StarField` · las cuatro auroras    | 18 · 22 · 26 · 20 s | `expressive × 43/52/62/48` | ≤0.8 % |
| `Loader` · spin / pulse / stretch   | 0.7 · 1.1 · 1 s     | `fast × 6/9/8`             | ≤4 %   |
| `Progress` · stripes / slide / spin | 0.8 · 1.2 · 1.1 s   | `fast × 7/10/9`            | ≤5 %   |
| `Skeleton` · shimmer y pulse        | 1.4 s ×2            | `slow × 5`                 | 0 %    |
| `Indicator` · pulse                 | 1.6 s               | `base × 9`                 | 1.3 %  |

Los múltiplos se eligieron **buscando el que menos mueve el valor actual**, no el más redondo: el
objetivo era tokenizar sin cambiar cómo se siente. Verificado en vivo tras reconstruir Storybook —
blur máximo **24 px**, duraciones de aurora en 18.06 / 21.84 / 26.04 / 20.16 s, `Loader` en 0.72 /
1.08 / 0.96 s— y la landing se ve **idéntica**. `typecheck` y `lint` en verde; reduced-motion sigue
dejándolo todo quieto.

**Nueve duraciones tokenizadas de nueve. Cero cambios de color.**

## Método

Storybook reconstruido (era anterior a `1a66444`…`cf19001`) y recorrido con Playwright en dos pasadas
por componente: **con motion activo** y **con `prefers-reduced-motion: reduce`**. En cada una, seis
fotogramas espaciados y su diferencia de píxel, más el estilo computado de todo el árbol: duraciones
en curso, capas promovidas con `will-change` y desenfoque máximo.

Los siete del encargo: `StarField`, `GradientBorder` con `beam`, `AnimatedGradient`, `Loader`,
`Segment` con y sin `lazy`, `Reveal`, `Transition`.

## Veredicto

**El contrato de reduced-motion se cumple en los siete.** Eso es lo primero y no es poco: es la parte
que un gate sí podría cubrir y está limpia.

Lo que aparece al mirar con motion **activo** son **dos hallazgos, y ninguno es de aspecto**: un
desenfoque fuera de la escala que el diseño no necesita, y dieciséis duraciones y curvas escritas a
mano que dejan a `motion.tier` sin alcance.

---

## 1. Reduced-motion — pasa

| componente            | movimiento activo | con `reduce` |
| --------------------- | ----------------- | ------------ |
| `StarField`           | sí                | **quieto**   |
| `GradientBorder` beam | sí                | **quieto**   |
| `AnimatedGradient`    | sí                | **quieto**   |
| `Loader`              | sí                | **quieto**   |
| `Reveal`              | (entrada, ver §4) | **quieto**   |
| `Transition`          | (entrada, ver §4) | **quieto**   |
| `Segment` con paneles | (entrada, ver §4) | **quieto**   |

Ninguno se queda congelado a medias, que es lo que [ADR-034](../adr/ADR-034-capa-de-motion-compartida.md)
prohíbe expresamente —«un spinner congelado a media vuelta dice lo contrario de lo que quiere decir»—.
El idioma `still` + sustituto estático está bien aplicado.

---

## 2. Fallos

### 2.1 · ALTO — `AURORA_BLUR` es un literal de 50 px fuera de la escala, y el diseño no lo necesita

**Qué se ve** — en `StarField/StarField.css.ts:88`:

```ts
const AURORA_BLUR = "50px";
```

Aplicado como `filter: blur(50px)` a **cuatro blobs** de 90vw×70vh, 60vw×60vh, 55vw×55vh y 30vw×30vh,
los cuatro con `willChange: "transform, opacity"`.

**Regla** — dos, y son de las duras:

- `effects-guardrails`: «Todos los efectos se consumen desde tokens — **nunca valores libres por
  componente**», y «blur operativo máximo recomendado: `md` (8 px)». El token más alto del contrato es
  `blur.xxl` = **24 px**. 50 px **no existe en la escala**.
- `tokens-governance`: «No hardcodear colores, spacing, radius, sombras ni duraciones fuera de
  tokens».

**Dónde se pinta de verdad** — `aurora` es `false` por defecto, así que las historias sueltas de
`StarField` **no lo muestran**. Se enciende en las composiciones reales: `Landing`, `Dashboard` y los
siete carriles de Rosette. Medido en vivo sobre `patterns-landing--nebula`: **blur máximo 50 px, 38
capas promovidas, duraciones de 18 s / 22 s / 26 s / 20 s en curso**.

Es el mismo componente que el plan de performance identificó como el cuello de botella del sitio.

**Y el aspecto no lo necesita** — renderizada la misma landing con el blur forzado a 50, 24, 16 y 8:

| valor     | resultado                                               |
| --------- | ------------------------------------------------------- |
| **50 px** | el actual                                               |
| **24 px** | `blur.xxl` — **indistinguible del actual**              |
| **16 px** | `blur.xl` — indistinguible                              |
| **8 px**  | `blur.md` — **aquí sí**: se ven los bordes de los blobs |

El velo ya lo suaviza el propio `radial-gradient`, que se desvanece a transparente en el 70 %, y los
blobs viven a opacidad 0.15–0.30. **El desenfoque de 50 px es en su mayor parte redundante.**

**Salida sin tocar color** — `filter: blur(vars.effects.blur.xxl)`. Entra en la escala, respeta el
guardrail de que los efectos salen de tokens, y **se ve igual**.

**Refutación intentada** — ¿será que a otro tamaño de viewport sí se nota? Las capturas son a 900 px
de ancho, que es donde los blobs son proporcionalmente **mayores** respecto a la pantalla y por tanto
donde el desenfoque más se notaría. ¿Y que el blur haga falta para que el gradiente no bandee? A 24 px
no aparece bandeado en la captura.

**Lo que no se midió** — **el ahorro real**. Se comprueba que el aspecto sobrevive, no cuánto cuesta
cada valor. Medirlo es de `tools/hydration-measure`, no de esta auditoría.

---

### 2.2 · MEDIO — Dieciséis duraciones y curvas escritas a mano, en seis componentes

**Qué se ve** — barrido sobre los `.css.ts` del catálogo:

| componente       | literales                                                                 |
| ---------------- | ------------------------------------------------------------------------- |
| `StarField`      | `"ease-in-out"` + las cuatro duraciones de aurora (18s · 22s · 26s · 20s) |
| `Loader`         | `"0.7s"` · `"1.1s"` · `"1s"` · `"linear"`                                 |
| `Progress`       | `"0.8s"` · `"1.2s"` · `"1.1s"` · `"linear"` ×2                            |
| `Skeleton`       | `"1.4s"` ×2 · `"linear"`                                                  |
| `Indicator`      | `"1.6s"` · `"ease-out"`                                                   |
| `GradientBorder` | `"linear"`                                                                |

**Regla** — `theme-a11y-motion`, literal: «Motion SIEMPRE vía tokens del theme
(`motion.duration/easing/spring`) — **jamás duraciones o easings sueltos**», y su anti-patrón
declarado: «Introducir un easing/duración sin token compartido». Lo repite `tokens-governance`.

**La consecuencia concreta** — `motion.tier` es, según `docs/02` §2 punto 2, un **interruptor de
tema**: «un tema enterprise sobrio apagaría glass y bajaría motion». Sobre estos dieciséis valores el
tema **no tiene alcance**: puede apagarlos —la vía de `reduced-motion` sí llega— pero **no puede
calmarlos**. Un tema que quiera un spinner más pausado no puede pedirlo.

**Contraste con los que sí lo hacen bien** — `StarField` en su capa de estrellas y `AnimatedGradient`
resuelven `calc(${vars.motion.duration.expressive} * N)` con `vars.motion.easing.standard`. **El
patrón correcto ya existe en los mismos archivos**; es la capa de aurora la que se salió de él.

**Alcance** — catálogo, seis componentes. No es de aspecto: hoy nadie ve nada mal.

**Aplicado** (§0). Quedan las curvas, y ahí el hallazgo se cayó al ir a arreglarlo:

### 2.2b · El `"linear"` de los bucles NO es un defecto — y por eso no se tocó

Al buscar el token con el que sustituirlo apareció que **`EasingName` solo tiene cuatro curvas**
—`standard`, `emphasized`, `decelerate`, `accelerate`— y ninguna es `linear`. La conclusión fácil
habría sido «falta un token, hay que ampliar el contrato». Es falsa:

**`linear` no es una curva, es la ausencia de curva.** Los cinco sitios donde aparece —el spinner de
`Loader`, las rayas y el spin de `Progress`, el shimmer de `Skeleton`, el haz de `GradientBorder`— son
**bucles continuos**, y en un bucle continuo la velocidad constante no es una elección estética sino
la única correcta: un spinner que acelera y frena en cada vuelta se lee como roto. Un tema no debería
poder cambiarlo, igual que no debería poder cambiar que `transparent` sea transparente.

Ampliar `NebulaTheme.motion.easing` con una clave obligatoria habría sido además **breaking** para
cualquier tema de terceros, y los seis paquetes ya están publicados en `0.1.0`.

**Lo que sí queda abierto son dos curvas, no cinco**: el `"ease-in-out"` de la deriva de aurora
(`StarField:143`) y el `"ease-out"` del pulso de `Indicator:73`. Esas **sí** son elecciones de estilo
sin token detrás. `decelerate` existe y es el equivalente del tema a `ease-out`, pero es bastante más
agresivo —`cubic-bezier(0, 0, 0, 1)` contra `(0, 0, 0.58, 1)`—, así que sustituirlo cambiaría el pulso
de forma visible. **No se tocó**: es una decisión de aspecto, y el aspecto se decide mirándolo.

---

## 3. Observaciones

- **38 capas promovidas con `will-change` en la landing**, y 37 en la historia de anillos animados de
  `GradientBorder`. `effects-guardrails` nombra el anti-patrón —«encadenar animación + blur alto +
  sombra intensa en componentes repetidos», «capas múltiples de blur superpuestas en una misma
  vista»— pero no fija un número, así que **no hay regla que citar** y esto no es un fallo. Se anota
  porque es medible y porque la promoción de capas tiene coste de memoria de GPU.

- **Las auroras animan `transform` y `opacity`, y solo eso.** `docs/03` §2 regla 1 se cumple: no hay
  animación de layout ni del propio `filter`. El blur es caro por estático, no por animado.

---

## 4. Lo que NO se pudo juzgar

- **`Reveal`, `Transition` y `Segment` dan cero movimiento en la medición, y eso no es un hallazgo.**
  Son animaciones de **entrada**, de una sola pasada: a los 900 ms de espera ya habían terminado. Para
  juzgarlas hace falta capturar desde el montaje, que el harness todavía no hace.
- **`Segment` con y sin `lazy`** (ADR-154): solo se midió la historia con paneles. La comparación entre
  las dos ramas, que es lo que el encargo pide, queda pendiente.
- **El coste real en CPU/GPU** de cualquiera de los dos hallazgos. Esta auditoría dice qué se ve y qué
  regla se incumple, no cuántos milisegundos cuesta.
- **`GradientBorder` con `beam` en composición**, no aislado.

---

## 5. Resumen para decidir

| Hallazgo                                 | Alcance     | Salida sin tocar color                          |
| ---------------------------------------- | ----------- | ----------------------------------------------- |
| §2.1 `AURORA_BLUR` 50 px fuera de escala | **entra**   | `blur.xxl` (24 px) — verificado que se ve igual |
| §2.2 dieciséis duraciones/curvas a mano  | **entra**   | `vars.motion.*`, el patrón ya existe al lado    |
| §3 38 capas promovidas                   | observación | sin regla que citar                             |
