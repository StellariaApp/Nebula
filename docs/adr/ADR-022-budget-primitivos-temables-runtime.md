# ADR-022 — Budget de bundle para primitivos temables en runtime (W2)

- **Estado**: aceptada · 2026-07-20 (checkpoint W2 con el propietario)
- **Contexto**: W2 aterriza la capa de layout de `@stellaria/nebula-web` (Flex, Center, Group, Grid/Grid.Col, SimpleGrid, Container, Scroll, Divider, Space, AspectRatio, Paper) sobre la plantilla canónica de ADR-018. El budget de bundle de docs/03 §3 —revisado en ADR-018— fija **primitivos ≤9 kB brotli/módulo**, pero ese número se calibró midiendo únicamente Box (8,46), Text (8,76) y Button (45,1). Ninguno de esos tres era un **primitivo que resolviera roles del tema en runtime**: Box/Text son sprinkles puros; Button ya cae en el budget de compuestos por `motion`.

## Problema medido

Un primitivo de layout que (1) se compone sobre `Box` y (2) resuelve su variante/config del tema en runtime —vía `recipe()` de Vanilla Extract y/o `assignInlineVars` de `@vanilla-extract/dynamic`, que es exactamente el patrón cerrado en ADR-018— arranca de un suelo por encima de 9 kB:

| Coste | brotli |
| --- | --- |
| `Box` (base compartida: mapa de sprinkles + contrato) | 8,6 kB |
| runtime de `recipe` y/o `assignInlineVars` + helpers de token (`SpaceToCss`…) | +0,6 a +2,7 kB |

Medición real por módulo (W2):

| Componente | brotli | Mecánica |
| --- | --- | --- |
| Flex · Center · VisuallyHidden | 8,7 · 8,7 · 8,8 | composición pura de Box (sin runtime) |
| AspectRatio | 9,2 | `assignInlineVars` (1 var) |
| Space · Container · Group · Paper | 10,1 · 10,6 · 10,7 · 10,7 | recipe / vars / helpers |
| SimpleGrid · Scroll · Grid · Divider | 10,8 · 11,0 · 11,3 · 11,3 | recipe + vars |
| Transition · Collapse | 26,7 · 24,8 | `motion` (ya en budget de compuestos ≤48) |

## Decisión

Se desdobla el budget de primitivos en docs/03 §3:

- **Primitivo de composición pura ≤9 kB** (sin runtime de theming: Flex, Center, VisuallyHidden y futuros equivalentes).
- **Primitivo temable en runtime ≤12 kB** (compuesto sobre Box + `recipe`/`assignInlineVars`). El 12 da headroom sobre el máximo medido (Divider/Grid 11,3).
- Compuestos ≤48 kB y patterns ≤70 kB se mantienen.

Se rechazó bajar el coste reescribiendo estos componentes sin `recipe` ni `assignInlineVars`: ahorraría ~1,5–2 kB pero **abandonaría el patrón canónico de ADR-018** (recipe de estructura + vars locales de color), dejaría a Grid/Divider igualmente al filo y aumentaría la superficie de código de cada uno de los ~150 primitivos restantes. La paridad con la anatomía cerrada pesa más que los 3 kB.

## Consecuencias

- docs/03 §3 actualizado en este mismo PR (nota de revisión W2).
- El gate `size-limit` etiqueta estos entries como "primitivo temable en runtime" con límite 12 kB; los de composición pura siguen en 9 kB.
- Es el mismo mecanismo de calibración que ADR-018: medir al aterrizar la primera tanda real de una clase de componente y ajustar el número, no fijarlo a ciegas.
- No introduce dependencias nuevas (`@vanilla-extract/dynamic` y `/recipes` ya estaban en la tabla de ADR-018).
