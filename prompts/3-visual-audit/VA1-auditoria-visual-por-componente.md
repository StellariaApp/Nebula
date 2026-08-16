# VA1 — Auditoría visual por componente

> Para una sesión limpia con **workflows activos**. Modelo recomendado: **Opus 5** para los
> veredictos; un modelo más barato sirve para las fases mecánicas (capturar, recortar, agrupar).
>
> **Esto NO es el gate de regresión visual.** Ese responde «¿cambió?». Éste responde «¿está bien?»,
> que es la pregunta que `docs/wr-closure.md` dejó abierta y que bloquea el baseline de ADR-037.

---

```
Actúa como auditor de diseño en C:\Users\Skr13\Documents\GitHub\Nebula. El catálogo web está
completo: 158 componentes, todos con stories en apps/playground-web/src/stories.

LEE ANTES: CLAUDE.md, docs/03-a11y-motion-performance.md, docs/02-theming.md §2,
docs/patterns/web-component-template.md, docs/wr-closure.md (dice qué NO cubrió la auditoría
visual — eso es justo tu encargo), y .claude/skills/effects-guardrails.

REGLA QUE NO SE ROMPE
No escribas NUNCA en apps/playground-web/__snapshots__/. Ese es el baseline del gate de regresión
y tocarlo destruye la señal. Captura a un directorio temporal fuera del repo. Si al final propones
cambios, los aplica el propietario y el gate ya los cazará.

FASE 0 — EL CRITERIO SE ESCRIBE ANTES DE REPARTIR
No empieces a juzgar. Primero reúne contra qué vas a juzgar, o cada agente del abanico inventará su
propio gusto y 158 veredictos no sumarán a nada.

1. Busca las skills de UI/UX disponibles en esta sesión y carga las que apliquen. Las del repo son
   obligatorias porque son ley aquí: `effects-guardrails`, `theme-a11y-motion`, `ui-web-patterns`,
   `tokens-governance`. Si hay skills de diseño de propósito general, cárgalas también.
2. Complementa con heurística establecida y CÍTALA: Nielsen para usabilidad, WCAG 2.2 AA para
   contraste y objetivos táctiles (docs/03 ya lo exige), y los principios de escala tipográfica y
   ritmo vertical. Si algo no lo cubre ninguna fuente, dilo — no lo rellenes con opinión.
3. Escribe una RÚBRICA en el scratchpad antes de capturar nada: qué cuenta como fallo, qué como
   observación, y qué queda fuera de alcance. Cada agente del abanico recibe esa rúbrica literal.

Donde la heurística general choque con una decisión cerrada de `docs/`, MANDA EL DOC — y el choque
se reporta como hallazgo, porque saber que una regla propia contradice la práctica común es
información valiosa, no un error que corregir por tu cuenta.

FASE 1 — EL SISTEMA ANTES QUE LAS PIEZAS (esta fase va en Fable)
Con la rúbrica escrita, levanta el ESTADO VISUAL ACTUAL COMPLETO y critícalo, ANTES de repartir nada.

El motivo es de coste, no de gusto: si la escala tipográfica no es una progresión, si el espaciado
no tiene ritmo o si un peldaño de paleta salta, eso lo hereda TODO el catálogo. Auditar componentes
primero te devuelve 158 síntomas de una sola causa, y arreglarlos uno a uno es el trabajo caro.

Reúne y renderiza a un solo lienzo, para poder mirarlo junto y no en fichas sueltas:
- Las 16 paletas 50-950 (`packages/tokens`, generadas por `pnpm gen:palette`) — ¿los peldaños son
  perceptualmente parejos, o hay saltos?
- Los roles semánticos del contrato (`docs/02` §2): superficie, texto, borde, y las 7 escalas.
- La escala tipográfica y el ritmo vertical — ¿es una razón real o números que se acumularon?
- La escala de espaciado (`unit × scale`), la tabla de radios y los tres `corner`.
- La matriz de variantes de ADR-150: 7 variantes × 7 escalas, las 49 juntas.
- Motion: los tres tiers, duraciones y curvas.
- Las capas `@layer` (`docs/01`) y qué gobierna cada una.
- Los 4 temas oficiales y los 9 de producto, lado a lado.

Entrega de esta fase: `docs/reviews/auditoria-sistema-<fecha>.md` con lo que mejoraría y POR QUÉ,
separando lo que es error de lo que es preferencia. Si algo pide cambiar un doc cerrado, dilo y
propón el ADR — no lo cambies.

CHECKPOINT DEL PROPIETARIO. No sigas a la fase 2 sin que haya visto esto. Si de aquí sale un cambio
de escala o de paleta, auditar los componentes antes sería tirar el trabajo.

FASE 2 — MISIÓN
Por cada componente, juzgar si SE VE BIEN — no si cambió. Cuatro ejes:

1. ESPACIADO. Que el ritmo salga de la escala del tema y no de números sueltos. Padding y gap
   coherentes entre componentes de la misma familia. Nada de píxeles huérfanos.
2. ALINEACIÓN Y ESTILO. Líneas base compartidas, bordes que cuadran, radios coherentes con
   `corner`, tipografía en la escala. Sombras y glass dentro de lo que fija effects-guardrails.
3. RESPONSIVE. Al menos 360, 768 y 1280. Buscar desbordes, texto que se corta, objetivos táctiles
   por debajo del mínimo de docs/03, y layouts que se rompen entre breakpoints.
4. TEMA. Dark y light. Contraste percibido, y que ningún componente se vea "roto" en un tema de
   producto — docs/02 §3 dice que si pasa, está leyendo algo fuera del theme.

HUECO CONOCIDO, Y ES PRIORITARIO
El gate actual corre bajo `prefers-reduced-motion`, así que NO cubre animaciones ni materiales en
movimiento. Se descubrió que `AURORA_BLUR` de StarField era el cuello de botella de rendimiento del
sitio y ninguna lámina lo habría notado. Revisa con motion ACTIVO: StarField, GradientBorder con
`beam`, AnimatedGradient, Loader, Segment con y sin `lazy` (ADR-154), Reveal, Transition.

ORQUESTACIÓN
Reparte por familias de docs/00-inventory.md, no de uno en uno: los problemas de espaciado se ven
comparando hermanos. Un agente por familia captura y juzga; una fase final de síntesis busca
INCOHERENCIAS ENTRE FAMILIAS, que es donde vive lo caro de arreglar después.

Verifica cada hallazgo antes de reportarlo: un segundo agente con la captura delante que intente
refutarlo. Un falso positivo en una auditoría de 158 componentes cuesta más que un hueco.

ENTREGA
docs/reviews/auditoria-visual-<fecha>.md con:
- Hallazgos por componente, ordenados por gravedad, cada uno con su captura y qué regla incumple.
- Los que son de CATÁLOGO y no de componente: una decisión de escala mal propagada vale por veinte
  hallazgos sueltos.
- Lo que NO se pudo juzgar y por qué. Huecos declarados, nunca inventados.
- Un veredicto explícito sobre si el aspecto está estable, que es lo que ADR-037 espera.

NO cambies código. El entregable es el juicio, no el arreglo.
```

---

## Por qué está escrito así

**Por familias y no por componente.** Un padding mal puesto no se ve mirando un botón; se ve
mirando ocho botones juntos. La comparación entre hermanos es el instrumento.

**Con verificación adversaria.** En 158 componentes, un 5 % de falsos positivos son ocho
investigaciones inútiles y la auditoría pierde credibilidad entera.

**Sin tocar código.** Mezclar juicio y arreglo hace imposible saber si el arreglo respondía a un
problema real. Primero el veredicto, luego la decisión de qué se arregla.

**Con motion activo.** Es el hueco que el gate actual tiene y que ya costó caro una vez.
