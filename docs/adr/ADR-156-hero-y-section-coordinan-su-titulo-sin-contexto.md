# ADR-156 — `Hero` y `Section` coordinan su título sin contexto

- **Estado**: **aceptada** · 2026-08-16 — implementada el mismo día. Los tests obligaron a reponer el
  clonado que esta redacción había descartado: sin él se rompía el invariante «el camino de props y
  el de partes producen el mismo DOM», y `cloneElement` no cuesta SSR
- **Toca**: la implementación de dos compounds de `@stellaria/nebula-web`. **No cambia API pública.**
- **Es**: la decisión **B** de la [auditoría de componentes de servidor](../reviews/auditoria-server-components-2026-08-14.md),
  la mitad que falta de P5.

## Contexto

`Hero` es **el dueño del elemento que marca el LCP**. Y en RSC manda una regla que hace de esto un
cuello de botella y no un componente más:

> Un componente de servidor dentro de uno de cliente **sigue hidratando**.

Así que mientras `Hero` sea de cliente, el `Badge`, el `GradientText` y los `Button` que lleva dentro
hidratan igual **aunque estén convertidos**. Es exactamente lo que se midió: 13 componentes pasados a
servidor el 2026-08-16 y el LCP sin moverse. [ADR-150](ADR-150-las-variantes-se-resuelven-una-vez-por-tema.md)
ya lo avisaba — «con solo una de las dos no se mueve».

## El problema es mucho más pequeño de lo que la auditoría dijo

La auditoría lo llamó «rediseño de dos componentes». Leyendo el código, no lo es.

**Los contextos llevan tres valores, y ninguno es estado**:

```ts
interface HeroContextValue    { titleId: string; order: HeroOrder | undefined; size: HeroSize }
interface SectionContextValue { titleId: string; order: SectionOrder }
```

**Y los consume UNA sola parte en cada compound: `Title`.** Nadie más llama a `useHero` ni a
`useSection`. Toda la maquinaria de `createContext` existe para pasar tres valores a un único hijo.

Los otros bloqueantes que se les atribuían ya no existen:

| Señal              | Estado                                                                     |
| ------------------ | -------------------------------------------------------------------------- |
| `useId`, `useMemo` | **no atan**: React 19 los sirve en el servidor, verificado por build el 08-16 |
| `useTheme`         | resuelto por ADR-150 — es el patrón aplicado ya 13 veces                   |
| `createContext`    | **el único que queda en `Hero`**                                            |
| `motion`           | sigue vivo en `Section`, y es independiente de esto                        |

## Decisión propuesta

### 1. `size` viaja por `data-*`, y no toca a nadie

La raíz ya publica su escala; basta con exponerla como `data-size` y que la hoja del título la lea
por descendencia. Es puramente visual (`styles.title_size[size]`), así que **CSS lo resuelve entero**
y `Title` deja de necesitar ese valor.

Es además lo que conserva la compatibilidad sin pedir nada al consumidor: quien ya escribe
`<Hero.Title>` dentro de un `<Hero size="lg">` sigue viéndose igual sin tocar una línea.

### 2. `id` y `order` se pasan como props, y en composición los pasa el consumidor

`Title` gana `id` y `order` como props, con valores por defecto.

- **Camino por defecto** (`<Hero title="…">`): la raíz ya construye el título, así que se los pasa
  ella. Sin cambio para el consumidor.
- **Camino de composición** (`<Hero><Hero.Title>…</Hero.Title></Hero>`): los pasa quien escribe el
  título.

**Se descartó clonar los hijos**, que era la propuesta anterior. `cloneElement` habría mantenido la
inyección automática, pero es maquinaria que solo alcanza al primer nivel y esconde de dónde salen
las props. El propietario fijó la prioridad: **SSR total por encima de la comodidad**, y aceptar que
en composición se declare el `id` es el precio.

### 2.1 Lo que esto cuesta en a11y, dicho en voz alta

Hoy la raíz nombra su landmark con `aria-labelledby` apuntando al `titleId` que ella genera. Con el
contexto fuera y sin clonado, **en el camino de composición la raíz no conoce el `id` del título**,
así que no puede nombrarse sola.

El consumidor que quiera la asociación pasa el mismo `id` a `Hero.Title` y `aria-labelledby` a
`Hero` — la raíz ya reenvía props sueltas por `rest`, así que funciona sin API nueva.

**Un `<section>` sin nombre accesible sigue siendo un landmark válido**, solo que anónimo. Es una
degradación real y acotada al camino de composición, y se documenta en la ficha para que no se
descubra por sorpresa.

### 3. `Section` va detrás, no junto

`Hero` pierde su directiva con esto. **`Section` no**: le queda `motion`, que es un bloqueante real e
independiente. Se hace `Hero` primero porque es el único que toca el elemento del LCP, y `Section`
cuando se sepa qué anima y si eso cabe en CSS o en una parte interna de cliente.

## Consecuencias

- **API pública intacta.** Ni props nuevas ni renombres: cambia cómo viajan tres valores por dentro.
- **`Hero` pasa a servidor**, y con él **dejan de hidratar sus hijos** — que es el pago real y la
  razón de todo esto.
- **`Title` fuera de su compound** deja de lanzar y cae a valores por defecto. Hoy `useHero` tira un
  error explícito; conviene decidir si esa red se conserva con un aviso o se pierde a cambio de que
  el componente sea usable suelto.
- **El gate visual es el juez**: no debe moverse una lámina. Si se mueve, el clonado cambió algo.

## Alternativa descartada

**Dejar `Hero` de cliente y seguir convirtiendo hojas.** Es lo que se hizo el 2026-08-16 y está
medido: 41 → 50 componentes de servidor, LCP sin moverse. Convertir hojas dentro de un contenedor de
cliente no ahorra nada, y hacerlo otra vez sabiendo esto sería repetir el experimento.
