---
name: ui-native-patterns
description: Patrones de componentes de @stellaria/nebula-native — Collector, Unistyles 3, CreateAnimated, Jotai stores y contrato a11y nativo.
---

# Patrones native (`@stellaria/nebula-native`)

Patrón consolidado de Stellaria (39 componentes verificados), adaptado a los nombres de Nebula.

## Estructura por componente

```
components/<Category>/<Name>/
├── index.ts               # Re-exports públicos
├── <Name>.tsx             # forwardRef + displayName + CreateAnimated
├── <Name>.types.ts        # Tokens/Vars/Props sobre el contrato compartido de nebula-tokens
├── <Name>.styles.ts       # Unistyles StyleSheet.create((theme) => …) + useVariants
├── <Name>.collector.ts    # (si tiene props custom) Collector dedicado
└── store/                 # (si usa Jotai) átomos + useStore hook
```

## Patrones establecidos

### Tipos (`*.types.ts`)

```ts
type OmitKeys = keyof VariantsProps | keyof DisplayProps | keyof FlexProps | keyof TypographyProps;
export type ComponentTokens = Omit<BaseProps, OmitKeys>;
export type ComponentVars = AnimatedProps<Element<"view">> & ComponentTokens & OverflowProps;
export type ComponentProps = ComponentVars & { customProp?: string; component_sub?: SubProps };
```

### Collector (`*.collector.ts`)

```ts
import { KeysBase } from "@stellaria/nebula-tokens";

const CollectorKeys = ["customProp", ...KeysBase] as const; // props propias + KeysBase
const ExcludeKeys = ["component_sub"] as const; // overrides de sub-componentes
export const CollectorComponent = (props: ComponentProps) => Collector(props, CollectorSet, ExcludeSet);
```

`KeysBase` ya incluye effects y data (bugs de Stellaria corregidos en F0.2) — auditar todo Collector migrado contra el contrato nuevo.

### Estilos: Unistyles 3, tokens del theme, nunca hardcode. Estilos dinámicos como funciones.

### Componente: `CreateAnimated(View)` por defecto; compound con `Object.assign(Root, { Sub })`.

### Estado compartido: Jotai `Provider` + `createStore()` (no Context). Anti-patterns: `atomFamily` con deepEqual sobre children; `JSON.stringify(props)` como dep de `useMemo`; `onLayout` para anchos calculables con porcentajes.

### Propagación a sub-componentes: `cloneElement` en render con `Record<string, unknown>` (no en atoms).

## Reglas

- **Contrato a11y obligatorio** (docs/03 §1): `accessibilityRole/Label/State/Value` en el contrato de cada componente; `accessibilityLabel` obligatorio si solo-icono; inputs con label vinculado desde FormField y error con live-region (gap de Stellaria TextInput/Textarea — se corrige al migrar).
- `ReduceMotion.System` en TODA animación Reanimated; haptics (`triggerHaptic`) en interacciones primarias, nunca en loops.
- Consumir SOLO roles semánticos del theme (Unistyles re-resuelve al cambiar tema).
- Skia y efectos pesados: lazy (Tier 3) con degradación por `useDeviceTier`.
- Preferir `columnGap`/`rowGap` sobre hacks de negative margin; porcentajes sobre `onLayout`.
- Sin dependencias de app dentro de los componentes; adapters de navegación declarativos (docs/01 §7).
