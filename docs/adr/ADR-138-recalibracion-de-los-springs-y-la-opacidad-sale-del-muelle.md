# ADR-138 — Recalibración de los tres springs y la opacidad sale del muelle

- **Estado**: **aceptada** · 2026-08-13 (checkpoint del propietario, dos preguntas: calibración de la
  terna y dónde arreglar la cola de fade)
- **Resuelve**: dos defectos medidos sobre la capa de motion —(1) los tres springs del tema son
  físicamente el mismo spring y (2) toda entrada por muelle arrastra una cola de opacidad de entre
  545 y 851 ms— sin tocar la forma del contrato ni la API pública de ningún componente.
- **Recalibra**: `animation.spring` en `packages/tokens/src/tokens/animation.ts`. La **forma**
  (`{stiffness, damping, mass}`) y los **nombres** (`gentle` · `default` · `snappy`) no cambian, así
  que `NebulaTheme` queda intacto y ningún tema de terceros deja de validar.
- **Depende de**: [ADR-034](ADR-034-capa-de-motion-compartida.md) (la capa de motion es la única
  puerta) y [ADR-004](ADR-004-motion.md) (los mismos tres números alimentan `motion` y Reanimated).
- **Enmienda parcialmente**: [ADR-069](ADR-069-indicadores-de-scroll-y-momentum.md) §8, que describe
  los springs del tema como «calibrados para gestos de UI —4 px en 200 ms—». Esa frase describía la
  intención, no la medición: los números anteriores no la cumplían. La derivación `ScrollSpring`
  sigue en pie sin cambios.

## Contexto

Los tres springs del tema se escribieron en F0 y nunca se midieron contra el motor que los consume.
Al revisarlos aparecen dos problemas independientes.

### 1. Los tres springs son el mismo spring

Lo que decide el **carácter** de un muelle no son sus tres números sino dos magnitudes derivadas: el
coeficiente de amortiguamiento ζ = c / (2·√(k·m)), que decide **si rebota y cuánto**, y la frecuencia
natural ω = √(k/m), que decide **cuánto tarda**. Medidos sobre los valores anteriores:

| spring    |   k |   c |   m |     ζ | rebote |
| --------- | --: | --: | --: | ----: | -----: |
| `gentle`  | 120 |  22 |   1 | 1.004 |   0,0% |
| `default` | 170 |  26 |   1 | 0.997 |   0,0% |
| `snappy`  | 260 |  24 | 0,9 | 0.784 |   1,9% |

Los tres están en amortiguamiento crítico o a un pelo de él. **Ninguno rebota de forma
perceptible**: el 1,9 % de `snappy` son 0,4 px en un viaje de 24 px. La escala tenía un solo eje
—velocidad— y encima estrecho: 1,2× entre `gentle` y `default`. Pedir `spring="gentle"` en vez de
`spring="snappy"` producía prácticamente la misma animación, que es lo que se ve en la celda
«Springs, staggered» del laboratorio de motion.

`mass: 0.9` en `snappy` era además un grado de libertad redundante: la respuesta de un muelle queda
fijada por (ζ, ω), y la masa solo reescala k y c para llegar al mismo sitio. Con la masa variable
los tres tokens no se pueden comparar leyendo la tabla, y la paridad con Reanimated se lee peor.

### 2. La opacidad por muelle es lo que se sentía blando

`Spring()` devolvía **una sola transición para todo el target**, así que la opacidad también viajaba
por muelle. `motion` elige el umbral de parada según el tamaño del recorrido
(`isGranularScale = |delta| < 5` en `motion-dom/animation/generators/spring.mjs`), y la opacidad
recorre exactamente 1.0 → cae en el tramo granular → `restDelta: 0.005`, es decir **el 0,5 % del
recorrido**. Simulando ese criterio de parada exacto con los valores anteriores:

| spring    | opacidad 0→1 | scale .96→1 | y 24→0 px |
| --------- | -----------: | ----------: | --------: |
| `gentle`  |   **851 ms** |      503 ms |    625 ms |
| `default` |   **718 ms** |      436 ms |    535 ms |
| `snappy`  |   **545 ms** |      268 ms |    286 ms |

La transformada terminaba entre 270 y 430 ms y **el fundido seguía corriendo medio segundo más**. Y
como la salida es siempre un tween acelerado a dos tercios de `duration.base` (ADR-034), la entrada
de un modal duraba 718 ms contra 120 ms de salida: **una asimetría de 6×**. Esa cola es la causa real
de que las entradas se percibieran blandas; la velocidad del muelle era la causa secundaria.

## Decisión

### A. La terna se recalibra a ζ = 1.02 / 0.84 / 0.68 con masa 1

| spring    |   k |   c |   m |     ζ | rebote | llega (24 px) | asienta (24 px) | ancla de duración |
| --------- | --: | --: | --: | ----: | -----: | ------------: | --------------: | ----------------- |
| `gentle`  | 190 |  28 |   1 | 1.016 |   0,0% |        353 ms |          525 ms | `expressive` 420  |
| `default` | 280 |  28 |   1 | 0.837 |   0,8% |        216 ms |          318 ms | `slow` 280        |
| `snappy`  | 450 |  29 |   1 | 0.684 |   5,3% |        134 ms |          367 ms | `base` 180        |

1. **La escala estrena un eje de carácter**, que es lo que hacía falta para que los tres nombres
   signifiquen algo distinto: `gentle` no rebota nunca (ζ ≥ 1), `default` lo insinúa (0,8 %) y
   `snappy` tiene vida (5,3 %). El eje de velocidad se conserva y se ensancha: de 1,2× a 2,6× entre
   los extremos si se mide por el momento en que la animación **llega**.

2. **Cada peldaño se ancla a una duración que ya existía en el tema.** No es decorativo: es lo que
   permite razonar sobre un spring y un tween en la misma frase, y lo que hace evidente que el
   `default` anterior (535 ms) era más lento que la duración más lenta de la escala
   (`expressive`, 420 ms).

3. **La masa es 1 en los tres.** El grado de libertad redundante desaparece y la tabla se vuelve
   legible: la amortiguación queda casi constante (28 · 28 · 29) y lo que sube es la rigidez
   (190 → 280 → 450). Se lee de un vistazo como **un amortiguador, tres resortes**.

4. **`snappy` asienta más tarde que `default` (367 vs 318 ms) y es correcto.** Es la consecuencia
   aritmética del rebote: hay que esperar a que el sobreimpulso se apague. Lo que el ojo lee como
   «rápido» es la **llegada**, y ahí `snappy` gana claramente (134 vs 216 ms). En los recorridos
   pequeños que son sus usos reales —el pulgar de `Switch`, el indicador de `Segment`, la escala de
   `Popover` y `Menu`— también asienta primero: 194 ms contra 290 ms en un `scale` de .96 a 1.

5. **El 5,3 % de sobreimpulso de `snappy` se ve en los indicadores que alinean contra un borde**
   (`Segment`, `Nav`). Es intencional y es la mitad del cambio que el propietario eligió. Si en
   revisión visual chirría, el ajuste es bajar `snappy` a ζ ≈ 0.75 (k 450, c 32) sin tocar nada más;
   queda escrito aquí para no volver a derivarlo.

6. **La frecuencia se fijó en dos pasos, y el segundo es parte de la decisión.** La primera terna
   —300/35, 450/35, 700/36, mismos ζ y frecuencias 1,6× las originales— **se implementó y el
   propietario la rechazó por rápida** al verla correr. La terna vigente es el **punto medio
   geométrico** entre aquella y la original: se conserva ζ peldaño a peldaño —el carácter no estaba
   en discusión— y solo baja ω, que es el parámetro que gobierna la velocidad sin tocar el rebote.
   Queda escrito porque el error fue de método: **se puede derivar el carácter de un muelle sobre el
   papel, pero no su velocidad**; esa hay que verla correr.

### B. La opacidad sale del muelle, y sale en la capa compartida

7. **`Spring()` devuelve el muelle para la transformada y un tween corto para la opacidad**, como
   transición por valor de `motion`:

   ```ts
   {
     type: "spring", stiffness, damping, mass,
     opacity: { inherit: true, type: "tween", duration: slow/1000, ease: decelerate },
   }
   ```

   La cola de fundido pasa de 545–851 ms a **280 ms** (`duration.slow`, curva `decelerate`) en todo
   lo que entra por muelle. La transformada conserva su física intacta.

   **El fundido se calibró junto con la frecuencia**, en el mismo paso que la decisión 6. Con la
   primera terna estaba en `duration.base` (180 ms), que contra transformadas que se posaban en
   250–430 ms se leía seco. Al bajar la frecuencia se subió un peldaño: 280 ms sigue a un tercio de
   la cola que se retiró, y acompaña a la transformada en vez de adelantarla.

8. **`inherit: true` no es decorativo, es obligatorio.** `getValueTransition` de `motion` resuelve
   `transition[key] ?? transition["default"] ?? transition` y **reemplaza** la transición padre por
   la del valor; solo con `inherit` hace la mezcla superficial (`{...padre, ...propia}`). Sin esa
   bandera, el `delay` que `Reveal` añade en la raíz para el stagger no llegaría a la opacidad, y
   una lista escalonada fundiría todos sus items a la vez mientras las transformadas sí esperan su
   turno. Es un defecto que la separación introduciría en silencio, y la razón por la que este punto
   lleva test propio.

9. **Va en `utils/motion.ts` y no en los componentes.** Es la regla 6 de ADR-034 aplicada tal cual:
   un solo sitio arregla los doce consumidores —`Reveal`, `Transition`, `Collapse`, `Pagination`,
   `Modal`, `Drawer`, `Toast`, `Popover`, `Menu`, `ContextMenu`, `Tooltip` y las dos colecciones—
   y ninguno estrena una duración escrita a mano. `SurfaceTransition` lo hereda gratis porque las
   superficies con muelle pasan por `Spring()`.

10. **`Fade()` se exporta.** No porque ningún componente deba llamarlo hoy —ninguno lo hace— sino
    para que el fundido del sistema tenga nombre y el test pueda afirmar sobre él sin reconstruirlo.

11. **La salida no cambia.** Sigue siendo el tween acelerado a dos tercios de la referencia. Lo que
    cambia es que ahora la comparación entrada/salida es honesta: 318 ms contra 120 ms en un modal,
    en vez de 718 contra 120.

### C. El helper de momentum deja de duplicar los números

12. **`DEFAULT_SPRING` de `useMomentumScroll` pasa a leer `animation.spring.default`** en vez de
    repetir `{170, 26, 1}` a mano. `@stellaria/nebula-hooks` ya dependía de
    `@stellaria/nebula-tokens` —importaba de ahí el tipo `SpringConfig`—, así que no hay dependencia
    nueva. Ningún llamador del repo usaba el valor por defecto (los tres pasan su spring explícito
    vía `ScrollSpring`), de modo que era una copia latente que esta recalibración habría
    desincronizado en silencio.

## Alternativas

- **Recalibrar sin rebote** (ζ 1.00 / 0.95 / 0.82), arreglando solo la escala de velocidad.
  Presentada al propietario y descartada: sin eje de carácter, `snappy` seguiría significando
  únicamente «más rápido» y la escala seguiría teniendo una sola dimensión. Su ventaja era no tocar
  la alineación de los indicadores.
- **No tocar los tokens y arreglar solo la opacidad.** Presentada y descartada. Habría resuelto la
  cola de fundido —el defecto mayor— dejando en pie que los tres nombres describen el mismo muelle.
- **Reparametrizar el contrato a `{visualDuration, bounce}`**, que es la forma que `motion` 12
  recomienda y que expresa (ζ, ω) directamente. Es medible y más legible que (k, c, m), pero
  **rompe `NebulaTheme` y la paridad con Reanimated**, que habla en rigidez y amortiguación. Exigiría
  un traductor en el borde native y un cambio de API pública para un beneficio de ergonomía. No se
  descarta para v2; hoy no paga su precio.
- **Separar la opacidad solo en `Reveal` y `Transition`.** Presentada y descartada: deja la cola
  larga en modales, toasts, popovers y menús, y mete la excepción en los componentes en vez de en la
  capa, que es exactamente lo que ADR-034 prohíbe.
- **Bajar `restDelta` de la opacidad en vez de sacarla del muelle.** Corrige la cola sin cambiar la
  física, pero elige el umbral de parada en vez de la curva: la opacidad seguiría acelerando y
  frenando como un muelle, solo que cortada antes. La separación dice lo que se quiere decir —el
  contenido aparece rápido y la caja se posa después— en vez de aproximarlo.

## Consecuencias

- **Todo el catálogo se siente distinto.** Es un cambio de calibración deliberado y no hay
  componente que quede fuera: cualquier captura del gate visual que congele una entrada a medias
  cambia. Las que comparan estados finales no se mueven.
- **Los presupuestos no cambian**: la separación añade cuatro claves a un objeto que ya se construía
  por llamada; no entra código nuevo en ningún bundle de componente.
- **`ScrollSpring` sigue siendo correcto sin tocarlo.** Escala k por 0,25 y c por 0,5, factores que
  son √0.25 y su cuadrado, de modo que **ζ se conserva y solo baja la frecuencia a la mitad**. La
  inercia del scroll hereda la recalibración con su carácter intacto, y su test lo verifica sobre
  cualquier terna.
- **Native queda pendiente de heredar la terna.** Los números viven en `tokens` y Reanimated los
  consume igual, así que la paridad se mantiene por construcción; lo que no se ha hecho es
  **verificar** el resultado en un dispositivo. Queda anotado para WN/N.
- **Deuda declarada, no resuelta aquí**: `motion.tier` sigue teniendo tres valores de los que solo
  `minimal` hace algo — `expressive` es hoy idéntico a `standard`, mientras `docs/03` §2 dice que el
  tier «escala/desactiva efectos no esenciales». Modular la terna por tier (subir el rebote y la
  frecuencia en `expressive`) es la continuación natural de este ADR y necesita el suyo.
- **Lo que este ADR no decide**: si `gentle` debería dejar de existir. Con la terna recalibrada sus
  usos reales son dos (`Reveal` por defecto y la entrada de `Toast`), y la pregunta de si un
  peldaño sin rebote y anclado a `expressive` merece nombre propio es de WN, no de aquí.
