# Rúbrica de la auditoría visual VA1

> Entrada literal para cada agente del abanico de la fase 2. No se reinterpreta ni se amplía.
> Escrita en la fase 0 a partir de las fuentes de abajo; la fase 1 (sistema) ya se juzgó con ella.

## 0. El alcance, fijado por el propietario el 2026-08-17

**El color está fuera de alcance. Todo lo demás entra.**

Queda fuera cualquier propuesta que mueva un valor de color: paletas, `colors.surface`, `colors.text`,
`colors.border`, el filo del cristal o el velo. No se proponen, no se aplican, **y no se vuelven a
discutir**: la identidad cromática está alineada y tocarla la desalinea.

Se llegó a esta regla midiendo. Cuatro propuestas de color se construyeron, se midieron y se
aplicaron; el borde a 6:1 —el mínimo que exige WCAG SC 1.4.11 sobre la rampa actual— **arruinó el
diseño al verlo**. La medida era correcta y el resultado, peor. Está en
[la auditoría del sistema](auditoria-sistema-2026-08-16.md) §Desenlace y en los ADR 158/159/160,
todos `rechazada`.

Qué hacer entonces con un hallazgo de color:

- **Se reporta igual**, con su medida y su regla. Un defecto no deja de existir porque su arreglo esté
  vetado.
- **Se marca `color · fuera de alcance`** y no lleva propuesta.
- Si tiene una salida **que no toca color** —geometría, grosor, tamaño, estado, tipografía—, esa sí se
  propone. Es el caso interesante y hay que buscarlo antes de dar el hallazgo por muerto.

Lo que **sí** entra, y es donde va el esfuerzo: espaciado y ritmo, alineación y geometría, tipografía,
responsive, estados e interacción, motion, y las divergencias entre `docs/` y el código.

## 1. Jerarquía de fuentes — manda la de arriba

1. **`docs/` cerrados y ADR aceptados** de Nebula. Si una heurística general choca con ellos, **manda
   el doc**, y el choque **se reporta como hallazgo** — no se corrige por cuenta propia.
2. **Skills del repo** (son ley aquí): `effects-guardrails`, `theme-a11y-motion`, `ui-web-patterns`,
   `tokens-governance`.
3. **WCAG 2.2 AA estricto** — es la política declarada en `docs/03` §preámbulo, así que no es
   heurística externa: es contrato. SC 1.4.3 (texto 4.5:1), 1.4.11 (UI y bordes 3:1), 2.5.8
   (objetivo táctil 24 px CSS), 1.4.1 (el color nunca es el único portador de significado).
4. **Heurística establecida, citada siempre**: Nielsen (visibilidad del estado del sistema;
   consistencia y estándares; reconocer antes que recordar) y los principios de escala modular y
   ritmo vertical.
5. **Nada más.** Si ninguna fuente cubre el caso, se dice «sin criterio aplicable» y se deja abierto.
   No se rellena con gusto propio.

## 2. Qué cuenta como FALLO

Se reporta como fallo solo si cumple las tres:

- **Regla nombrada**: se puede citar el doc, ADR, skill o criterio WCAG que incumple.
- **Verificable**: se sostiene con un número medido o con una captura donde se ve.
- **Alcanzable**: le pasa a un consumidor por un camino público del API, con valores por defecto o
  con una composición corriente. Un defecto que exige una combinación que nadie escribiría es
  observación, no fallo.

Gravedades:

| Grado       | Criterio                                                                |
| ----------- | ----------------------------------------------------------------------- |
| **crítico** | Incumple WCAG 2.2 AA por el camino por defecto, o rompe el uso          |
| **alto**    | Incumple una regla cerrada de `docs/` con efecto visible en el catálogo |
| **medio**   | Incoherencia entre hermanos o con la escala, visible al comparar        |
| **bajo**    | Se ve al medir, apenas al mirar                                         |

## 3. Qué cuenta como OBSERVACIÓN

- Preferencia estética sin regla que la respalde.
- Deuda de nomenclatura o de contrato sin efecto visual hoy (p. ej. un peldaño sin consumidores).
- Divergencia `docs/` ↔ código que **no** cambia píxeles.
- Todo lo que sea «yo lo haría de otra forma». Se escribe como preferencia, etiquetada.

## 4. Fuera de alcance

- **Cualquier escritura en `apps/playground-web/__snapshots__/`.** Regla que no se rompe.
- Cambiar código, tokens o docs. El entregable es el juicio.
- «¿Cambió?» — esa es la pregunta del gate 8, no de esta auditoría.
- Native (`packages/native`): fuera del encargo, que es el catálogo web.
- Rendimiento en cifras (lo cubre el plan de performance), salvo cuando un material se ve mal.

## 5. Los cuatro ejes de la fase 2

1. **ESPACIADO** — el ritmo sale de `vars.space.*`; nada de píxeles huérfanos; padding y gap
   coherentes entre hermanos de familia.
2. **ALINEACIÓN Y ESTILO** — líneas base compartidas, radios desde `vars.radius.*`, tipografía en la
   escala, sombras y glass dentro de `effects-guardrails`.
3. **RESPONSIVE** — 360, 768 y 1280 como mínimo. Desbordes, texto cortado, objetivo táctil < 24 px,
   layouts que se parten entre breakpoints.
4. **TEMA** — `dark` y `light`, más los 9 de producto. Contraste percibido y componentes que se vean
   «rotos» en un tema (docs/02 §3: si pasa, lee algo fuera del theme).

**Y con motion ACTIVO**, que es el hueco declarado del gate 8: `StarField`, `GradientBorder` con
`beam`, `AnimatedGradient`, `Loader`, `Segment` con y sin `lazy`, `Reveal`, `Transition`.

## 6. Verificación adversaria — obligatoria

Ningún hallazgo se reporta sin que un segundo agente, **con la captura delante**, haya intentado
refutarlo. Se le pide refutar, no confirmar. Si queda en duda, **cae**: en 158 componentes un falso
positivo cuesta más que un hueco. Se anota qué se refutó y por qué, porque eso también es resultado.

> Precedente de la fase 1: la lectura a ojo de que el texto de las variantes `ghost` y `light` iba
> flojo en oscuro **era falsa** — medido da 9.2–14.5. Se cayó antes de escribirse.

## 7. Forma de cada hallazgo

```
[grado] Componente · eje
Qué se ve:      (una frase, observable)
Regla:          (doc/ADR/skill/SC de WCAG concreto)
Medida:         (el número, o la captura y qué mirar en ella)
Alcance:        (¿solo este componente, o la familia, o el catálogo?)
Refutación:     (qué intentó el verificador y por qué no se sostuvo)
```

**Si el alcance es «catálogo», se sube al informe como hallazgo de catálogo y no se repite por
componente.** Una decisión de escala mal propagada vale por veinte hallazgos sueltos.
