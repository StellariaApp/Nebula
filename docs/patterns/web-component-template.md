# Plantilla canónica del componente web

> Extraída de los tres pilotos de W1.4 (Box, Text, Button). **Vinculante para W2–W4**.
> Decisiones de fondo en [ADR-018](../adr/ADR-018-anatomia-componente-web-w14.md); anatomía en `docs/01-architecture.md` §4.

## 1. Estructura de archivos

```
packages/web/src/components/<Categoría>/<Nombre>/
  <Nombre>.tsx            componente (forwardRef + displayName)
  <Nombre>.types.ts       contrato de props
  <Nombre>.css.ts         recipe() / style() — SOLO estructura
  <Nombre>.vars.css.ts    createVar() locales (si la variante es temable)
  use<Nombre>.ts          lógica extraída (opcional)
  __tests__/<Nombre>.test.tsx
  index.ts                re-exports públicos
```

Y su story en `apps/playground-web/src/stories/<Categoría>/<Nombre>.stories.tsx` (nunca dentro de `packages/web`, que queda libre de dependencias de Storybook).

Registrar el componente en `packages/web/src/index.ts` (valor + tipos) y añadir su entry a `size-limit` en `package.json`, apuntando **al módulo** (`dist/components/…/X.js`), no al barrel.

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
const resolved = resolveVariant(variant, color, theme);
const cssVars = assignInlineVars({ [bg]: resolved.background, [fg]: resolved.foreground });
```

`resolveVariant` (`src/theme/resolve-variant.ts`) traduce las referencias serializables (`scale.600`, `scale.500.12`, `surface.overlay`, `gradient.brand`) a **`var(...)` del contrato**, nunca a hex — así el cambio de tema oficial sigue repintando por CSS. Aplica además los guardrails del tema: `effects.glass.enabled` off degrada la variante glass, `motion.tier: "minimal"` desactiva la animación.

**`@layer` es obligatorio en los estilos base** de cualquier componente que acepte style props:

```ts
export const base = style({ "@layer": { [baseLayer]: { color: vars.color.text.primary } } });
```

Sin capa, la clase base gana a la clase atómica de sprinkles y **pisa silenciosamente la style prop del consumidor** (`c="text.onPrimary"` deja de aplicarse). El gate axe lo detectó como contraste insuficiente; es un fallo invisible en revisión de código.

### Capa 3 — Motion: `motion` v12 con los springs del theme (ADR-004/018)

```tsx
<LazyMotion features={domAnimation} strict>
  <m.button
    animate={{ scale: animate && isPressed ? 0.98 : 1 }}
    transition={animate ? { type: "spring", ...theme.motion.spring.default } : { duration: 0 }}
  />
</LazyMotion>
```

- Siempre `m.*` + `LazyMotion` (nunca `motion.*`), con `strict`.
- El press se deriva del `isPressed` **de React Aria**, no de `whileTap` — una sola fuente de verdad de la interacción.
- Se desactiva con `useReducedMotion()` **y** con `motion.tier: "minimal"` del tema.
- Solo `transform`/`opacity` (docs/03 §2). Color y sombra transicionan por CSS con los tokens.

## 3. Tipado (TS 7 estricto)

- **Toda prop opcional pública declara `| undefined`** (`className?: string | undefined`). Con `exactOptionalPropertyTypes`, si no, el consumidor no puede escribir `className={cond ? "x" : undefined}`.
- Polimorfismo con prop **`component`** (ADR-018 §2): tipar `XOwnProps` + `XProps<C>` y castear el `forwardRef` a una interfaz llamable genérica.
- Props que `motion` redefine (`onAnimationStart`, `onDrag*`) se excluyen del contrato con `Omit`.
- Los casts en la frontera React Aria ↔ motion se documentan con comentario: sus tipos DOM son estructuralmente incompatibles por diseño.

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

**Cuidado con el contraste en las stories**: usar solo pares validados por `pnpm check:contrast` (p. ej. `text.onPrimary` va sobre `primary.600`, no sobre `primary.500`). Una story con una combinación arbitraria rompe el gate aunque el componente sea correcto.

## 6. Checklist antes de dar por cerrado un componente

- [ ] `pnpm turbo build typecheck lint test size` verde.
- [ ] `pnpm turbo a11y --filter=playground-web` verde (0 violaciones).
- [ ] Estilos base dentro de `baseLayer`.
- [ ] Cero hex y cero paletas crudas en el componente: solo roles y `variantMap`.
- [ ] Entry de `size-limit` añadido y dentro de budget (docs/03 §3).
- [ ] `"use client"` **solo** si el componente es interactivo; los presentacionales quedan server-safe.
- [ ] Coherente en los 4 temas (sober y playful incluidos) — es el gate del theming.
