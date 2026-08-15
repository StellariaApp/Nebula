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

### 3. El color arbitrario se queda en JavaScript, y eso estrecha el contrato

`ColorExtended` admite `#hex`, las 19 paletas semilla con peldaño y sufijo de alpha
([ADR-147](ADR-147-las-style-props-de-color-cumplen-colorextended.md)). Eso **no se puede
precalcular**: es un espacio abierto.

Propuesta: los componentes que reciben un color arbitrario **siguen por la vía de JavaScript y siguen
siendo de cliente**. La vía rápida cubre las siete escalas semánticas; el resto es escotilla de
escape, igual que ADR-021 ya la declara para el modo plano.

**Esto es lo que hay que decidir**, y es lo que toca el contrato: hoy `docs/02` §2 no distingue entre
un color que el tema conoce y uno arbitrario. A partir de aquí, sí — y el segundo cuesta hidratación.

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
- **El contrato se estrecha**: el color arbitrario deja de ser equivalente al semántico en coste. Hay
  que documentarlo en `docs/02` §2 y decirlo en la ficha de las props.
- **Queda sin resolver en esta propuesta**: `glass` tiene rama propia con `glassClass`, y el
  `gradient` por props (`{from, to}`) es por instancia y no se puede precalcular. Ambos parecen caber
  en la escotilla del punto 3, pero **no está verificado** y hay que mirarlo antes de aceptar.
- **Es el cambio más invasivo del plan**: toca cómo pintan ~119 componentes, y no rompe de forma
  ruidosa —mueve un padding, cambia un tono un peldaño—. Por eso el gate visual de
  [ADR-149](ADR-149-el-entorno-unico-es-la-imagen-de-playwright.md) tenía que ir antes, y va antes.
