# Plantilla canónica del componente web

> Extraída de los tres pilotos de W1.4 (Box, Text, Button). **Vinculante para W2–W4**.
> Decisiones de fondo en [ADR-018](../adr/ADR-018-anatomia-componente-web-w14.md) y [ADR-019](../adr/ADR-019-convenciones-de-codigo.md); anatomía en `docs/01-architecture.md` §4.
> Dirección visual, ritmo, densidad y effects budget en
> [06-visual-language.md](../06-visual-language.md) — también vinculante desde W2.V.

## 0. Convenciones (ADR-019)

- **Sin comentarios en el código.** Si algo necesita explicación, va en un `<Nombre>.md` junto al módulo.
- **Naming**: hooks `camelCase` · funciones `PascalCase` (incluido el API público) · constantes globales `UPPERCASE` · constantes locales que declaras tú `snake_case`. Las props y los retornos de librerías conservan su nombre. Lo verifica `@typescript-eslint/naming-convention` en el gate `lint`.
- **Componentes planos**, sin carpeta de categoría.

## 1. Estructura de archivos

```
packages/web/src/components/<Nombre>/
  <Nombre>.tsx            componente (forwardRef + displayName)
  <Nombre>.types.ts       contrato de props
  <Nombre>.css.ts         recipe() / style() — SOLO estructura
  <Nombre>.vars.css.ts    createVar() locales (si la variante es temable)
  use<Nombre>.ts          lógica extraída (opcional)
  <Nombre>.md             el porqué de lo no evidente (opcional)
  __tests__/<Nombre>.test.tsx
  index.ts                re-exports públicos
```

Y su story en `apps/playground-web/src/stories/<Nombre>.stories.tsx` (nunca dentro de `packages/web`, que queda libre de dependencias de Storybook).

**El contrato de props extiende `StyleProps`** (ADR-032): todo componente del catálogo las acepta, directamente o vía `BoxOwnProps`. La implementación llama a `ExtractStyleProps` sobre el resto de props y compone `className` y `style`:

```tsx
const { variant, size, className, style, ...style_rest } = props;
const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);
// …
<div
  className={cx(styles.base({ variant, size }), sprinkle_class, className)}
  style={{ ...css_vars, ...sprinkle_style, ...style }}
/>;
```

Tres reglas aprendidas al propagarlas a los 37 componentes del tramo:

- **Van al nodo que ya llevaba `className`**, aunque no sea el nodo visible. Si la raíz semántica y la visual no coinciden —`<nav>` sobre `<ul>` en Pagination—, gana la raíz: `className` y las style props deben describir siempre el mismo elemento. Lo que quede sin efecto se documenta en el `<Nombre>.md`.
- **En un campo de formulario van al `FormField` raíz**, no al control interno: `w="100%"` describe el campo, no la caja de texto. `className` sigue apuntando al control y `rootClassName` a la raíz.
- **En un overlay se intercalan** entre el `style` de React Aria —que posiciona— y el de la prop específica del componente, de modo que ninguna style prop pueda romper el posicionamiento.

**Colisiones de nombre**: sprinkles publica también los nombres largos (`color`, `background`, `padding`, `position`, `wrap`…), así que la colisión con las props del componente es la norma y no la excepción. Gana siempre la prop del componente; ADR-032 regla 3 tiene las cuatro clases y su resolución. Los componentes que no renderizan un elemento propio —`Conditional`, `Portal`, `FocusTrap`, los `.Item` de un compound— quedan fuera.

Registrar el componente en `packages/web/src/index.ts` (valor + tipos) y añadir su entry a `packages/web/.size-limit.js` —ya no a `package.json`, ADR-032 regla 6—, apuntando **al módulo** (`dist/components/…/X.js`), no al barrel.

## 2. Las tres capas

### Capa 1 — Comportamiento y a11y: React Aria (ADR-003)

```tsx
const { buttonProps, isPressed } = useButton({ isDisabled, elementType: "button", type }, ref);
const { hoverProps, isHovered } = useHover({ isDisabled });
const { focusProps, isFocusVisible } = useFocusRing();
const domProps = mergeProps(buttonProps, hoverProps, focusProps, rest);
```

Reglas aprendidas:

- **Los handlers del consumidor se entregan A React Aria**, no al DOM por separado: `useButton({ onClick })` (React Aria trata `onClick` como alias de `onPress`). Si se pasan al DOM en paralelo, **la activación por teclado deja de funcionar** porque Aria gobierna el press y previene el click nativo.
- Exponer también `onPress` (contrato compartido con native, que no tiene `onClick`).
- **Y el ciclo de press completo** (`onPressStart`, `onPressEnd`, `onPressUp`, `onPressChange`, `preventFocusOnPress`) vía `utils/press-props.ts` — ADR-025. No es opcional: los hooks de trigger de overlay (`useMenuTrigger`, `useSelect`, `useComboBox`) abren desde `onPressStart`, así que un componente de acción que solo reenvíe `onPress` **no puede usarse como trigger**.
- El estado se publica como `data-*` (`data-hovered`, `data-pressed`, `data-focus-visible`, `data-disabled`, `data-loading`) y el CSS reacciona a esos atributos. Nada de clases de estado calculadas en JS.

### Capa 2 — Visual: recipe de estructura + vars locales de color

El `variantMap` del tema es **data no-CSS** (ADR-016): vive en el objeto JS, mientras el `recipe()` se resuelve en build. La conciliación:

```ts
// X.vars.css.ts — contrato de color del componente
export const bg = createVar();
export const fg = createVar();

// X.css.ts — el recipe consume las vars; NUNCA hornea un color
export const x = recipe({
  base: { background: bg, color: fg, height: vars.size.md /* estructura */ },
  variants: { size: { xs: {…}, …} },
});

// X.tsx — el tema decide el color en runtime
const resolved = ResolveVariant(variant, color, theme);
const css_vars = assignInlineVars({ [bg]: resolved.background, [fg]: resolved.foreground });
```

`ResolveVariant` (`src/theme/resolve-variant.ts`) traduce las referencias serializables (`scale.600`, `scale.500.12`, `surface.overlay`, `gradient.brand`) a **`var(...)` del contrato**, nunca a hex — así el cambio de tema oficial sigue repintando por CSS. Aplica además los guardrails del tema: `effects.glass.enabled` off degrada la variante glass, `motion.tier: "minimal"` desactiva la animación.

**`@layer` es obligatorio en los estilos base** de cualquier componente que acepte style props:

```ts
export const base = style({ "@layer": { [baseLayer]: { color: vars.color.text.primary } } });
```

Sin capa, la clase base gana a la clase atómica de sprinkles y **pisa silenciosamente la style prop del consumidor** (`c="text.onPrimary"` deja de aplicarse). El gate axe lo detectó como contraste insuficiente; es un fallo invisible en revisión de código.

### Capa 3 — Motion: `motion` v12 con los springs del theme (ADR-004/018)

```tsx
<m.button
  animate={{ scale: is_animated && isPressed ? 0.98 : 1 }}
  transition={Spring("default", { theme, reduced: !is_animated })}
/>
```

- Siempre `m.*` (nunca `motion.*`). **El `LazyMotion` no se monta en el componente**: es único y vive en `NebulaProvider` con `domMax` (ADR-034 regla 5). Un `m.*` sin provider renderiza sin animación y en silencio, así que el provider es requisito, no recomendación.
- El press se deriva del `isPressed` **de React Aria**, no de `whileTap` — una sola fuente de verdad de la interacción.
- **La física sale de `utils/motion.ts`**: `Spring`, `Tween`, `SurfaceTransition`, `ExitTween`, `Stagger`. Ningún componente vuelve a escribir `{ type: "spring", stiffness, damping, mass }` ni su ternario de reduced-motion; los helpers ya resuelven `useReducedMotion()` **y** `motion.tier: "minimal"`.
- Solo `transform`/`opacity` (docs/03 §2). Color y sombra transicionan por CSS con los tokens.

### Capa 3.1 — Variantes con efecto: glow tintado + idle (patrón para W2–W4)

Toda variante con "halo/glow" (hoy `Button.glow`; mañana Badge, ActionIcon, Card, Chip…) sigue este patrón (ADR-021):

1. **Tint del color, no sombra gris.** El halo se deriva del color resuelto del componente, nunca de `vars.shadow.*` genérico. En `resolve-variant.ts`:

```ts
function TintedGlow(color: string): string {
  return `0 0 12px 0 ${WithAlpha(color, 40)}, 0 6px 16px -6px ${WithAlpha(color, 50)}`;
}
// modo escala: TintedGlow(background) · modo plano: TintedGlow(base)
```

El resultado se expone en una var local (`glow`) que consume el CSS.

2. **Animar `::after`, nunca el `box-shadow` del elemento.** El halo vive en un pseudo `::after` (`inset: 0`, `z-index: -1`, `border-radius: inherit`, `box-shadow: <glow>`); todas las transiciones/animaciones son **solo `opacity`/`transform`** (docs/03 §2), GPU-friendly:

```ts
"&[data-variant='glow']::after": { opacity: 0.55 },              // suave en reposo
"&[data-variant='glow'][data-hovered='true']::after": {          // se potencia en hover (solo opacidad)
  animationName: "none", opacity: 1,
},
"&[data-glow-idle='true']::after": { animationName: GLOW_PULSE }, // breathing sutil (opacity)
```

3. **Reduced-motion + tier.** `data-glow-idle` solo se aplica cuando `resolved.animated` (tier ≠ `minimal`) **y** `!prefers-reduced-motion`; el glow suave y el realce en hover se conservan siempre. En sober (glow remapeado sin halo) el `glow` es `none` y el `::after` queda invisible: la variante se degrada sola por tema.

## 3. Tipado (TS 7 estricto)

- **Toda prop opcional pública declara `| undefined`** (`className?: string | undefined`). Con `exactOptionalPropertyTypes`, si no, el consumidor no puede escribir `className={cond ? "x" : undefined}`.
- Los `<Nombre>.md` sustituyen a los comentarios: documenta ahí las trampas ya pisadas, no en el archivo.
- Polimorfismo con prop **`component`** (ADR-018 §2): tipar `XOwnProps` + `XProps<C>` y castear el `forwardRef` a una interfaz llamable genérica.
- Props que `motion` redefine (`onAnimationStart`, `onDrag*`) se excluyen del contrato con `Omit`.
- Los casts en la frontera React Aria ↔ motion se explican en el `<Nombre>.md` del componente: sus tipos DOM son estructuralmente incompatibles por diseño.

## 4. Testing contract (ADR-015)

Mínimo por componente, en `__tests__/`:

1. Render por defecto y polimorfismo.
2. Todas las variantes del `variantMap` y todos los `size`.
3. Interacción principal (ratón) **y teclado** (Enter/Space/flechas según el patrón APG).
4. Estados: `disabled` no dispara acción, `loading` anuncia `aria-busy` y **conserva el nombre accesible**.
5. Foco visible solo por teclado.
6. Theming: el mismo componente resuelve vars distintas en los 4 temas.
7. Que los tokens **no** caigan en estilo inline (garantiza el zero-runtime).

## 5. Stories

Seguir `apps/playground-web/STORIES-TEMPLATE.md`: `Default`, `Variants`, `Sizes`, `States`, `Dark`, `ReducedMotion` + play function de teclado. El gate `turbo a11y` corre axe sobre todas.

Las matrices aisladas no cierran la review visual. Todo componente visual añade:

- `Composition`: contexto creíble con jerarquía, contenido y componentes vecinos reales;
- `AllThemes`: misma composición en `nebula-dark`, `nebula-light`, `sober-light` y `playful`;
- phone + desktop cuando el ancho cambia su comportamiento;
- densidad default + data-dense cuando aplique.

La composición sigue `docs/06-visual-language.md`: cuerpo ≥12 px, medida de lectura, spacing por
relación, una sola escalera de elevación y máximo un efecto dominante por región.

**Cuidado con el contraste en las stories**: usar solo pares validados por `pnpm check:contrast` (p. ej. `text.onPrimary` va sobre `primary.600`, no sobre `primary.500`). Una story con una combinación arbitraria rompe el gate aunque el componente sea correcto.

## 6. Checklist antes de dar por cerrado un componente

- [ ] `pnpm turbo build typecheck lint test size` verde.
- [ ] `pnpm turbo a11y --filter=playground-web` verde (0 violaciones).
- [ ] Acepta `StyleProps` y las aplica con `ExtractStyleProps` (ADR-032), salvo que no renderice un elemento propio.
- [ ] Las colisiones de nombre resueltas a favor de la prop del componente, con el `Omit` o el estrechamiento explícito en el tipo.
- [ ] Estilos base dentro de `baseLayer` — **obligatorio**, no opcional: sin capa, la clase base pisa en silencio la style prop del consumidor.
- [ ] Cero transiciones, duraciones y curvas escritas a mano: se componen de `styles/motion.css.ts` y la física de `utils/motion.ts` (ADR-034). Reduced-motion declarado, con su sustituto estático si anima por keyframes.
- [ ] Cero hex y cero paletas crudas en el componente: solo roles y `variantMap`.
- [ ] Cero alturas en literales: `vars.size.control.*` si es interactivo, `vars.size.compact.*` si no (ADR-033).
- [ ] El anillo de foco sale de `styles/focus.css.ts` con `...focus.ring` — nunca un `outline` ni un `boxShadow` propios (ADR-036).
- [ ] Entry de `size-limit` añadido y dentro de budget (docs/03 §3).
- [ ] `"use client"` **solo** si el componente es interactivo; los presentacionales quedan server-safe.
- [ ] Coherente en los 4 temas (sober y playful incluidos) — es el gate del theming.
- [ ] `Composition` demuestra jerarquía y ritmo reales; no solo variantes aisladas.
- [ ] Tipografía, spacing, elevación y efectos cumplen `docs/06-visual-language.md`.
