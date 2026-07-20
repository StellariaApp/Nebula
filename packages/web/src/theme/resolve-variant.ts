/**
 * Resolver de `VariantRecipe` → valores CSS (ADR-018 §3).
 *
 * El `variantMap` es data NO-CSS del theme (ADR-016): vive en el objeto JS y por
 * tanto no puede hornearse en el `recipe()` de Vanilla Extract, que se resuelve en
 * build. Este módulo traduce las referencias serializables de una receta
 * (`scale.600`, `scale.500.12`, `surface.overlay`, `gradient.brand`…) a valores CSS
 * que los componentes asignan a sus vars locales con `assignInlineVars`.
 *
 * Regla clave: las referencias a escala se resuelven a **`var(...)` del contrato**,
 * nunca a hex. Así, cambiar de tema oficial (cambio de clase CSS) repinta sin JS;
 * solo se recalcula cuando cambia la receta en sí (p.ej. `playful` pinta `filled`
 * con gradiente).
 */
import type {
  GradientToken,
  NebulaTheme,
  SemanticScaleName,
  Variant,
  VariantBackground,
  VariantColorRef,
  VariantRecipe,
} from "@stellaria/nebula-tokens";

import { vars } from "./contract.css.js";

/** Escala semántica que resuelve las referencias `scale.*` de la receta. */
export type ColorScale = SemanticScaleName;

const SHADES = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
] as const;

type Shade = (typeof SHADES)[number];

type ScaleVars = Record<Shade, string>;

function scaleVarsFor(scale: ColorScale): ScaleVars {
  switch (scale) {
    case "primary":
      return vars.color.primary;
    case "accent":
      return vars.color.accent;
    case "gray":
      return vars.color.gray;
    case "success":
      return vars.color.semantic.success;
    case "warning":
      return vars.color.semantic.warning;
    case "error":
      return vars.color.semantic.error;
    case "info":
      return vars.color.semantic.info;
  }
}

function isShade(value: string): value is Shade {
  return (SHADES as readonly string[]).includes(value);
}

/** Aplica alpha (0–100) a una var sin conocer su valor concreto. */
function withAlpha(color: string, alphaPercent: number): string {
  return `color-mix(in srgb, ${color} ${String(alphaPercent)}%, transparent)`;
}

function gradientCss(token: GradientToken): string {
  const stops = token.stops
    .map((stop) => `${stop.color} ${String(stop.position)}%`)
    .join(", ");
  return token.type === "linear"
    ? `linear-gradient(${String(token.angle)}deg, ${stops})`
    : `radial-gradient(circle at 50% 50%, ${stops})`;
}

/** Traduce una referencia de color de la receta a un valor CSS. */
export function resolveColorRef(ref: VariantColorRef, scale: ColorScale): string {
  if (ref === "transparent" || ref === "currentColor") return ref;

  const [group, key, alpha] = ref.split(".");
  if (group === undefined || key === undefined) return "transparent";

  if (group === "scale") {
    if (!isShade(key)) return "transparent";
    const color = scaleVarsFor(scale)[key];
    if (alpha === undefined) return color;
    const parsed = Number(alpha);
    return Number.isFinite(parsed) ? withAlpha(color, parsed) : color;
  }
  if (group === "surface") {
    return vars.color.surface[key as keyof typeof vars.color.surface] ?? "transparent";
  }
  if (group === "text") {
    return vars.color.text[key as keyof typeof vars.color.text] ?? "currentColor";
  }
  if (group === "border") {
    return vars.color.border[key as keyof typeof vars.color.border] ?? "transparent";
  }
  return "transparent";
}

function resolveBackground(
  ref: VariantBackground,
  scale: ColorScale,
  theme: NebulaTheme,
): string {
  if (ref.startsWith("gradient.")) {
    const role = ref.slice("gradient.".length);
    const token = theme.effects.gradients[role as keyof NebulaTheme["effects"]["gradients"]];
    return token === undefined ? "transparent" : gradientCss(token);
  }
  return resolveColorRef(ref as VariantColorRef, scale);
}

/**
 * Deriva el color de un estado interactivo desplazando la escala.
 * - `scale.N` → `scale.N±step` (el paso 600→700 de hover es el que valida
 *   `tools/contrast-check`, par "filled:hover").
 * - superficies translúcidas/transparentes → tinte de la escala activa.
 */
function shiftRef(ref: VariantBackground, steps: number): VariantBackground {
  const [group, key, alpha] = ref.split(".");
  if (group !== "scale" || key === undefined || !isShade(key)) return ref;
  const index = SHADES.indexOf(key);
  const next = SHADES[Math.min(SHADES.length - 1, Math.max(0, index + steps))];
  if (next === undefined) return ref;
  return (alpha === undefined ? `scale.${next}` : `scale.${next}.${alpha}`) as VariantBackground;
}

export interface ResolvedVariant {
  background: string;
  backgroundHover: string;
  backgroundActive: string;
  foreground: string;
  borderColor: string;
  /** `0` cuando la receta declara `border: "none"`. */
  borderWidth: string;
  /** Recetas glass ya resueltas, o `undefined` si el tema tiene glass off. */
  backdropFilter: string;
  glassBorder: string;
  /** Sombra de halo para la variante `glow`, o `"none"`. */
  glow: string;
  /** El tema desactiva el spring cuando `motion.tier === "minimal"`. */
  animated: boolean;
}

/**
 * Resuelve la receta de una variante en el tema activo, aplicando los guardrails
 * del theme: `effects.glass.enabled` off degrada `glass` a superficie sólida y
 * `motion.tier: "minimal"` desactiva la animación de press.
 */
export function resolveVariant(
  variant: Variant,
  scale: ColorScale,
  theme: NebulaTheme,
): ResolvedVariant {
  const recipe: VariantRecipe = theme.variantMap[variant];
  const animated = theme.motion.tier !== "minimal";

  if (variant === "unstyled") {
    return {
      background: "transparent",
      backgroundHover: "transparent",
      backgroundActive: "transparent",
      foreground: "currentColor",
      borderColor: "transparent",
      borderWidth: "0",
      backdropFilter: "none",
      glassBorder: "transparent",
      glow: "none",
      animated: false,
    };
  }

  const glassOn = theme.effects.glass.enabled && recipe.glass !== undefined;
  const glassLevel = recipe.glass ?? "default";
  const glassRecipe = vars.glass[glassLevel];

  // Fondo transparente (ghost/outline): el hover se insinúa con un tinte de la
  // escala activa en vez de desplazar un paso inexistente.
  const isTransparent = recipe.background === "transparent";
  const hoverRef = isTransparent
    ? (`scale.500.10` as VariantBackground)
    : shiftRef(recipe.background, 1);
  const activeRef = isTransparent
    ? (`scale.500.16` as VariantBackground)
    : shiftRef(recipe.background, 2);

  return {
    background: glassOn
      ? glassRecipe.background
      : resolveBackground(recipe.background, scale, theme),
    backgroundHover: glassOn
      ? glassRecipe.background
      : resolveBackground(hoverRef, scale, theme),
    backgroundActive: glassOn
      ? glassRecipe.background
      : resolveBackground(activeRef, scale, theme),
    foreground: resolveColorRef(recipe.foreground, scale),
    borderColor:
      recipe.border === "none" ? "transparent" : resolveColorRef(recipe.border, scale),
    borderWidth: recipe.border === "none" ? "0" : "1px",
    backdropFilter: glassOn ? glassRecipe.backdropFilter : "none",
    glassBorder: glassOn ? glassRecipe.border : "none",
    glow: recipe.glow === undefined ? "none" : vars.shadow[recipe.glow],
    animated,
  };
}
