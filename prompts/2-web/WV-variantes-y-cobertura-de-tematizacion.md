# Prompt WV — Cobertura de variantes y superficie temable

> Auditoría **transversal**, no una fase del roadmap. Requiere W2 cerrado (`docs/w2-closure.md`).
> Produce un informe y ADRs; **no implementa**. Su salida alimenta W3 y debe ejecutarse antes de que
> W3 multiplique el patrón por 60 componentes más.
>
> Origen: pregunta del propietario (2026-07-28) — «¿convendría crear variantes como Button para Text,
> Title o los Input, para permitir más configuraciones?».

---

```
Trabajas en C:\Users\Skr13\Documents\GitHub\Nebula (monorepo Nebula; W2 cerrado).

LEE ANTES, completos:
- docs\02-theming.md §2 (contrato NebulaTheme, en especial variantMap) y §3 (temas oficiales).
- docs\06-visual-language.md §5 y §6 (elevación y effects budget: acotan qué variantes tienen
  sentido sobre qué superficies).
- docs\patterns\web-component-template.md §2 capa 2 y 3.1 (cómo un componente consume variantMap
  vía ResolveVariant, y el patrón de variante con efecto).
- packages\tokens\src\types\variants.ts (la unión Variant y VariantRecipe).
- packages\web\src\theme\resolve-variant.ts (la traducción real a var() del contract).
- ADR-021 (ColorExtended y gradient en Button), ADR-024 (lenguaje visual), ADR-026 (Segment),
  ADR-028 (elevación por esquema), ADR-032 (style props: fija que size/variant/color/radius/shadow
  son props de COMPONENTE y jamás style props), ADR-035 §4 (error es estado, no variante cromática).
- docs\00-inventory.md §1 (qué componentes faltan por construir en W3/W4: la decisión debe servirles
  a ellos también, no solo a los 68 actuales).

REGLAS DE LA SESIÓN:
- Es una auditoría. NO toques código de componentes. El entregable es informe + ADRs propuestos.
- Toda ampliación de la unión `Variant` o de la API pública de un componente requiere ADR previo
  (ADR-014 regla 6) y checkpoint del propietario.
- No reabras decisiones cerradas por preferencia. Si una conclusión choca con un ADR aceptado,
  regístrala como conflicto con opciones e impacto, no la apliques.
- Apoya cada afirmación en rutas y símbolos concretos. Nada de juicios estéticos sin evidencia.
```

## Punto de partida a verificar, no a creer

Medición del 2026-07-28, que debes reproducir y corregir si cambió:

- **6 de 68** componentes aceptan `variant`: Button, ActionIcon, Alert, Badge, Divider, Loader.
- **21 de 68** aceptan `color`.
- La unión `Variant` tiene 8 miembros y es **contrato compartido Web/Native** en
  `@stellaria/nebula-tokens`.

## El error que esta auditoría debe evitar

«Variantes como Button» son **tres preguntas distintas**. Tratarlas como una sola produce API
incoherente. Sepáralas explícitamente en el informe:

### Pregunta A — Componentes que pintan superficie

Los que tienen fondo + primer plano + borde pueden consumir `variantMap` literalmente, igual que
Button. Candidatos a evaluar: Card, Paper, Avatar, Toast, Tooltip, NavLink, Pagination, Progress,
Segment, y los de W3 (Chip, Status, Stepper, Banner).

Para cada uno responde: ¿las 8 variantes tienen sentido sobre él, o solo un subconjunto? Una `Card`
con `variant="glow"` puede ser legítima; una lista entera de cards con glow viola `docs/06` §6.

### Pregunta B — Campos de formulario

Un `variant` en un input **no significa lo mismo**: es el tratamiento de la superficie del campo
(`outline`, `filled`, `unstyled`, `underline`), no una receta cromática de acento. Evalúa si el caso
existe de verdad en el código de producto que Nebula debe sustituir —`tfv-frontend/packages/components`
y `fonicredito-app/src/services/shared/components`— o si es una necesidad supuesta.

Ojo: `glow`, `gradient` y `glass` sobre un campo de texto contradicen `docs/06` §6 («gradients nunca
sostienen texto largo», «glass común no se anida»). Si el caso B existe, la pregunta real es si se
resuelve con un **subconjunto** de `Variant`, con una unión propia, o con props existentes.

### Pregunta C — Tipografía

`Text` y `Title` no tienen superficie: `filled` u `outline` no significan nada sobre ellos. Antes de
proponer nada, comprueba qué cubre ya la API actual —`c`, `fw`, `fz`, `ff`, `tt`, `ls` como style
props— y si el hueco real es «texto con gradiente», que el roadmap ya asigna a **W4 como
`GradientText`** (`docs/05` §W4). Proponer `variant` en Text puede ser duplicar un componente de W4.

La respuesta legítima a una de las tres preguntas puede ser «no procede». Dilo si es el caso.

## El coste que hay que cuantificar

No basta con decir que más variantes dan más configuración. Mide:

1. **Coste de contrato.** `variantMap` es `Record<Variant, VariantRecipe>`: **cada miembro nuevo de la
   unión obliga a los 4 temas oficiales y a todo tema de tenant a definir una receta**. Ampliar la
   unión es la decisión más cara del sistema. Cuantifícalo antes de proponerlo.
2. **Coste de bundle.** Un componente que resuelve variantes en runtime arrastra `ResolveVariant`
   (`dist/theme/resolve-variant.js`, ~6 kB). Comprueba contra los budgets de `docs/03` §3 y ADR-022
   (primitivo temable ≤12 kB) qué componentes se saldrían del suyo. Mídelo con
   `pnpm --filter @stellaria/nebula-web size`, no lo estimes.
3. **Coste de paridad W/N.** `Variant` vive en tokens y N1 debe implementar lo mismo. Toda variante
   nueva es trabajo duplicado en native.
4. **Coste de a11y.** Cada variante nueva es un par color/superficie más que `tools/contrast-check`
   debe cubrir. Comprueba si `BuildPairs` (`tools/contrast-check/src/pairs.ts`) los cubriría o hay que
   ampliarlo.

## Entregable

`docs/reviews/variantes-cobertura-<YYYY-MM-DD>.md` con:

**1. Matriz por componente** — una fila por cada uno de los 68, más los pendientes de W3/W4 que la
decisión afectaría:

| Componente | Clase (superficie / campo / tipografía / estructural) | `variant` hoy | Variantes con sentido | Tratamiento | Coste | Prioridad |
| ---------- | ----------------------------------------------------- | ------------- | --------------------- | ----------- | ----- | --------- |

Tratamientos: `añadir ahora` · `subconjunto` · `no aplica` · `ya cubierto por props existentes` ·
`pertenece a W3/W4` · `requiere ampliar contrato`.

**2. Respuesta separada a A, B y C**, cada una con recomendación explícita y su alternativa.

**3. Evidencia de consumo real**: qué variantes usan de verdad tfv y fonicredito hoy. Una variante que
nadie usa en el código que Nebula va a sustituir es superficie de API sin demanda.

**4. ADRs propuestos**, redactados pero en estado `propuesta`, no `aceptada`. Numeración a partir del
último ADR existente — **verifícalo con `ls docs/adr/`**, no lo asumas: hay trabajo en paralelo en este
repositorio y la numeración se mueve.

**5. Un plan por tramos** con dependencias, en el formato de `docs/reviews/code-design-audit-2026-07-28.md`
§5, indicando cuáles pueden ir en paralelo con W3 y cuáles lo bloquean.

## Checkpoint obligatorio

Presenta la matriz y las tres respuestas al propietario **antes** de redactar los ADRs. Si alguna
recomendación amplía la unión `Variant`, formula la pregunta con el coste del punto 1 explícito: es la
decisión con más arrastre de toda la auditoría.

## Gate

`pnpm turbo build typecheck lint test` verde al terminar (la auditoría no debería moverlo; si lo mueve,
es que tocaste código y no debías). Las mediciones de bundle y contraste citadas en el informe deben
venir de una ejecución real, con su salida pegada.
