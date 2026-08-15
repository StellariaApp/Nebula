# ADR-150 — Las variantes se resuelven una vez por tema, no una vez por render

- **Estado**: **propuesta** · 2026-08-15 — **pendiente de decisión del propietario**
- **Toca**: `docs/02` §2, contrato `NebulaTheme`, que es decisión cerrada. Por eso es propuesta y no
  aceptada.
- **Es**: la decisión C de la [auditoría de componentes de servidor](../reviews/auditoria-server-components-2026-08-14.md)
  y el núcleo de P5 del [plan de performance](../reviews/plan-performance-web-2026-08-14.md).

## Contexto

Medido sobre el sitio desplegado, en móvil: **1.366 ms evaluando script** sobre 2.203 ms de hilo
principal, y un LCP de 3,3 s del que **686 ms son retraso de renderizado** — el navegador tiene el
texto y no puede pintarlo. **119 de 158 componentes** son de cliente.

La causa no es la interactividad. Así resuelve `Badge` su color, y es el patrón de todo el catálogo:

```tsx
const { theme } = useTheme(); // contexto de React → obliga a "use client"
const resolved = ResolveVariant(variant, color, theme); // cálculo en JS, en cada render
const css_vars = assignInlineVars({
  // …que acaba siendo CSS de todas formas
  [variables.bg]: resolved.background,
  [variables.fg]: resolved.foreground,
});
```

Tres hechos que juntos definen el problema:

1. **`useTheme` es `useContext`**, y `useContext` no existe en el servidor. Un componente que solo
   quiere saber de qué color pintarse queda atado al cliente por leer un objeto de JavaScript.
2. **El resultado acaba en CSS igualmente**: propiedades personalizadas en el atributo `style`.
3. **El tema ya vive en CSS**: `theme/contract.css.ts` publica el contrato y `apps/web/src/app/layout.tsx`
   lo usa sin una línea de JavaScript.

Es decir: el tema está en CSS, el resultado va a CSS, y en medio hay un rodeo por JavaScript que
cuesta hidratar el árbol entero.

Y hay un multiplicador: **lo que un componente de cliente renderiza es cliente**, se declare lo que se
declare. `Hero` es de cliente, así que el `Badge`, el `GradientText` y los `Button` de dentro hidratan
aunque se conviertan. Por eso esto no se arregla componente a componente.

## El tamaño real del espacio

`ResolveVariant` parece intratable hasta que se cuenta lo que abarca:

|                                                                                                                                                         |                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| Variantes (`filled`, `outline`, `light`, `glass`, `ghost`, `glow`, `gradient`)                                                                          | **7** + `unstyled`, trivial |
| Escalas semánticas (`primary`, `accent`, `gray`, `success`, `warning`, `error`, `info`)                                                                 | **7**                       |
| Combinaciones                                                                                                                                           | **49**                      |
| Valores CSS por combinación (`background`, `backgroundHover`, `backgroundActive`, `foreground`, `borderColor`, `borderWidth`, `backdropFilter`, `glow`) | **8**                       |
| Propiedades personalizadas por tema                                                                                                                     | **≈392**                    |

**Y ninguna depende de nada de runtime.** No hay estado, ni props del usuario más allá de `variant` y
`color`, ni nada del navegador. Son función pura de `(variante, escala, tema)`.

Lo que hoy se calcula **una vez por componente y por render** podría calcularse **una vez por tema**.

## Decisión propuesta

### 1. El tema publica sus variantes resueltas como propiedades CSS

Al cargar un tema —en build para los oficiales, en el provider para los dinámicos— se resuelven las
49 combinaciones y se publican en el ámbito del tema:

```css
--nebula-v-filled-primary-bg: …;
--nebula-v-filled-primary-fg: …;
--nebula-v-filled-primary-bg-hover: …;
```

El cálculo que hoy corre por render pasa a correr **una vez**, y sigue siendo el mismo código:
`ResolveVariant` no se tira, se mueve.

Esto conserva lo que hace difícil el problema. La decisión de tinta legible por **luminancia**
(`OnColor`, ADR-021) y la dirección de oscurecido según `theme.meta.scheme` no se pueden expresar en
CSS hoy — pero tampoco hace falta: se resuelven una vez, en JavaScript, y el resultado viaja como
valor.

### 2. Los componentes referencian, no calculan

`Badge.css.ts` pasa a leer `var(--nebula-v-{variant}-{color}-bg)` desde su receta. Sin `useTheme`, sin
`assignInlineVars`, sin `"use client"`.

### 3. Solo el hex literal se queda fuera — corregido el 2026-08-15

> La primera redacción decía que las paletas semilla tampoco se podían precalcular. **Era falso**, y
> la corrección estrecha muchísimo lo que este ADR toca del contrato. Se deja el error a la vista
> porque cambia la decisión.

Las paletas **no son un espacio abierto**: son 19 semillas × 11 peldaños = **209 valores cerrados**,
generados por `pnpm gen:palette` y estáticos en `packages/tokens`. Se pueden precalcular igual de bien
que las escalas.

Lo que de verdad no se puede saber por adelantado es un `#ff0066` que el consumidor escriba en una
prop. Eso, y solo eso, es infinito.

**El motivo real de que la resolución sea de cliente tampoco era el que escribí arriba.** No es que
`useContext` no exista en el servidor —que no existe—, es algo más de fondo: **el servidor no sabe qué
tema está activo**. Lo elige el navegador a partir de la preferencia del usuario (`ColorSchemeScript`,
`docs/02` §3). Así que la respuesta no puede venir resuelta del servidor: tiene que venir en una forma
que el navegador resuelva, y esa forma es una propiedad CSS con el ámbito del tema.

Eso no cambia la propuesta, la explica mejor y la refuerza.

Lo que hay que publicar, entonces:

| Qué                                        | Cuántas          | Depende del tema          |
| ------------------------------------------ | ---------------- | ------------------------- |
| Variantes sobre escalas semánticas         | 49 × 8 = **392** | sí                        |
| Hex de las 19 paletas semilla              | **209**          | no — estáticas, una vez   |
| Tinta legible sobre cada peldaño de paleta | **209**          | sí, vía `theme.ink.floor` |

Unas **810 propiedades**, muy repetitivas, que comprimen a casi nada. El resto del modo plano —el
alpha de `light`, el borde de `outline`, el oscurecido del hover— es `color-mix()` sobre el hex base,
sin JavaScript.

**Lo que queda fuera es el hex literal en una prop**, y para eso ADR-021 ya declara que el modo plano
es una escotilla de escape que no se adapta entre temas. Aquí además costaría hidratación.

**Lo que hay que decidir**: hoy `docs/02` §2 trata igual un color que el tema conoce y un `#hex`
suelto. A partir de aquí no — el segundo obligaría a su componente a ser de cliente. Es un caso raro,
pero deja de ser gratis y hay que documentarlo.

### 4. Los temas dinámicos siguen funcionando, y mejor

Cargar un tema en runtime recalcula las 392 propiedades **una vez** y las republica. Hoy, un cambio de
tema propaga por contexto y **re-renderiza cada componente que lo lee**. La propuesta cambia N
re-renders por una escritura de variables.

## Alternativas descartadas

**Expresar la resolución entera en CSS.** `color-mix()` cubre el oscurecido, pero elegir tinta por
luminancia pide `contrast-color()`, que no tiene soporte suficiente. Y aunque lo tuviera, movería a
CSS un cálculo que solo hay que hacer una vez.

**Precalcular solo en build.** Rompe el Theme Creator y la carga dinámica de `docs/02` §5, que son
decisión cerrada. Por eso el provider también resuelve.

**Dejarlo y atacar solo `apps/web`.** Diferir `ThemePanel`, `StarField` y `ProductSurface` (P2) quita
peso del arranque de la portada, pero **no toca el catálogo**: cada app que se construya sobre Nebula
seguiría heredando el coste. Publicar v1 así lo hornea en cada consumidor.

## Consecuencias

- **Libera los que solo leen el tema**, y sobre todo abre la puerta a los contenedores. `Hero` es el
  caso que importa: es dueño del elemento que marca el LCP, y hoy lo atan dos cosas — este ADR y su
  contexto de compound. **Con solo una de las dos no se mueve**, así que las decisiones B y C del plan
  van juntas o no van.
- **Se cambia JavaScript por CSS**: entran ~392 propiedades por tema —muy repetitivas, comprimen
  bien— y sale la resolución por render más, en parte, la tabla de sprinkles de 129 kB.
- **El contrato se estrecha, pero mucho menos de lo escrito al principio**: solo el `#hex` literal
  en una prop deja de ser equivalente en coste. Las 19 paletas semilla se precalculan igual que las
  escalas (ver §3, corregido). Hay que documentarlo en `docs/02` §2 y en la ficha de las props.
- **Queda sin resolver en esta propuesta**: `glass` tiene rama propia con `glassClass`, y el
  `gradient` por props (`{from, to}`) es por instancia y no se puede precalcular. Ambos parecen caber
  en la escotilla del punto 3, pero **no está verificado** y hay que mirarlo antes de aceptar.
- **Es el cambio más invasivo del plan**: toca cómo pintan ~119 componentes, y no rompe de forma
  ruidosa —mueve un padding, cambia un tono un peldaño—. Por eso el gate visual de
  [ADR-149](ADR-149-el-entorno-unico-es-la-imagen-de-playwright.md) tenía que ir antes, y va antes.
