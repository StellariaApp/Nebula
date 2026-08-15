import {
  palettes,
  type ColorExtended,
  type GlassLevel,
  type GradientRole,
  type GradientToken,
  type NebulaTheme,
  type PaletteName,
  type SemanticScaleName,
  type Variant,
  type VariantBackground,
  type VariantColorRef,
  type VariantProps,
  type VariantRecipe,
} from "@stellaria/nebula-tokens";

import { vars } from "./contract.css.js";
import { OnColor } from "./ink.js";

export type ColorScale = SemanticScaleName;
export type GradientProp = NonNullable<VariantProps["gradient"]>;

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

const SEMANTIC_SCALES = [
  "primary",
  "accent",
  "gray",
  "success",
  "warning",
  "error",
  "info",
] as const;

const ON_FILL = "text.onPrimary";
const SCALE_REF = "scale.";
const GRADIENT_REF = "gradient.";
const INK_DARK = "#0b0b0b";

function ScaleHexFor(scale: ColorScale, theme: NebulaTheme): Record<string, string> {
  if (scale === "primary") return theme.colors.primary;
  if (scale === "accent") return theme.colors.accent;
  if (scale === "gray") return theme.colors.gray;
  return theme.colors.semantic[scale];
}

function FillHex(
  ref: VariantBackground,
  scale: ColorScale,
  theme: NebulaTheme,
): string | undefined {
  if (ref.startsWith("gradient.")) {
    const role = ref.slice("gradient.".length);
    return theme.effects.gradients[role as keyof NebulaTheme["effects"]["gradients"]]?.stops[0]
      ?.color;
  }
  const [group, key, alpha] = ref.split(".");
  if (group !== "scale" || key === undefined || alpha !== undefined) return undefined;
  return ScaleHexFor(scale, theme)[key];
}

const TRANSPARENT_HOVER = "scale.500.10" as VariantBackground;
const TRANSPARENT_ACTIVE = "scale.500.16" as VariantBackground;

function ScaleVarsFor(scale: ColorScale): Record<Shade, string> {
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

function IsShade(value: string): value is Shade {
  return (SHADES as readonly string[]).includes(value);
}

export function IsSemanticScale(value: string): value is SemanticScaleName {
  return (SEMANTIC_SCALES as readonly string[]).includes(value);
}

function IsPaletteName(value: string): value is PaletteName {
  return value in palettes;
}

function WithAlpha(color: string, alphaPercent: number): string {
  return `color-mix(in srgb, ${color} ${String(alphaPercent)}%, transparent)`;
}

function Darken(color: string, percent: number): string {
  return `color-mix(in srgb, ${color}, #000 ${String(percent)}%)`;
}

/** Halo suave tintado con el color del botón (no una sombra gris genérica). */
function TintedGlow(color: string): string {
  return `0 0 12px 0 ${WithAlpha(color, 40)}, 0 6px 16px -6px ${WithAlpha(color, 50)}`;
}

function GradientCss(token: GradientToken): string {
  const stops = token.stops.map((stop) => `${stop.color} ${String(stop.position)}%`).join(", ");
  return token.type === "linear"
    ? `linear-gradient(${String(token.angle)}deg, ${stops})`
    : `radial-gradient(circle at 50% 50%, ${stops})`;
}

// ── Modo plano: ColorExtended → color CSS + foreground legible ────────────────

interface FlatColor {
  base: string;
  /** hex concreto si se conoce (para calcular contraste); null si es CSS var. */
  concrete: string | null;
}

function ResolveColorExtended(color: string): FlatColor {
  if (color === "transparent" || color === "currentColor" || color === "inherit") {
    return { base: color, concrete: null };
  }
  if (color === "white") return { base: "#ffffff", concrete: "#ffffff" };
  if (color === "black") return { base: "#000000", concrete: "#000000" };
  if (color.startsWith("#")) return { base: color, concrete: color };

  const [group, key, alpha] = color.split(".");
  if (group === undefined) return { base: "transparent", concrete: null };

  if (group === "surface" || group === "text" || group === "border") {
    return { base: ResolveColorRef(color as VariantColorRef, "primary"), concrete: null };
  }

  const shade: Shade = key !== undefined && IsShade(key) ? key : "600";
  let flat: FlatColor;
  if (IsSemanticScale(group)) {
    flat = { base: ScaleVarsFor(group)[shade], concrete: null };
  } else if (IsPaletteName(group)) {
    const hex = palettes[group][shade];
    flat = { base: hex, concrete: hex };
  } else {
    return { base: "transparent", concrete: null };
  }

  if (alpha !== undefined) {
    const parsed = Number(alpha);
    return Number.isFinite(parsed) ? { base: WithAlpha(flat.base, parsed), concrete: null } : flat;
  }
  return flat;
}

export function ResolveColorRef(ref: VariantColorRef, scale: ColorScale): string {
  if (ref === "transparent" || ref === "currentColor") return ref;

  const [group, key, alpha] = ref.split(".");
  if (group === undefined || key === undefined) return "transparent";

  if (group === "scale") {
    if (!IsShade(key)) return "transparent";
    const color = ScaleVarsFor(scale)[key];
    if (alpha === undefined) return color;
    const parsed = Number(alpha);
    return Number.isFinite(parsed) ? WithAlpha(color, parsed) : color;
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

function ResolveBackground(ref: VariantBackground, scale: ColorScale, theme: NebulaTheme): string {
  if (ref.startsWith("gradient.")) {
    const role = ref.slice("gradient.".length);
    const token = theme.effects.gradients[role as keyof NebulaTheme["effects"]["gradients"]];
    return token === undefined ? "transparent" : GradientCss(token);
  }
  return ResolveColorRef(ref as VariantColorRef, scale);
}

function ShiftRef(ref: VariantBackground, steps: number): VariantBackground {
  const [group, key, alpha] = ref.split(".");
  if (group !== "scale" || key === undefined || !IsShade(key)) return ref;
  const index = SHADES.indexOf(key);
  const next = SHADES[Math.min(SHADES.length - 1, Math.max(0, index + steps))];
  if (next === undefined) return ref;
  return (alpha === undefined ? `scale.${next}` : `scale.${next}.${alpha}`) as VariantBackground;
}

function GradientFromProp(prop: GradientProp): string {
  const from = ResolveColorExtended(prop.from).base;
  const to = ResolveColorExtended(prop.to).base;
  return `linear-gradient(${String(prop.deg ?? 135)}deg, ${from}, ${to})`;
}

export function ResolveGradient(gradient: GradientRole | GradientProp, theme: NebulaTheme): string {
  if (typeof gradient !== "string") return GradientFromProp(gradient);
  const token = theme.effects.gradients[gradient];
  return token === undefined ? "transparent" : GradientCss(token);
}

/** Color plano equivalente a un gradiente: su primer stop. Para las ramas sin soporte de mask/clip. */
export function ResolveGradientEdge(
  gradient: GradientRole | GradientProp,
  theme: NebulaTheme,
): string {
  if (typeof gradient !== "string") return ResolveColorExtended(gradient.from).base;
  const first = theme.effects.gradients[gradient]?.stops[0];
  return first === undefined ? "transparent" : first.color;
}

export function ResolveGradientTip(
  gradient: GradientRole | GradientProp,
  theme: NebulaTheme,
): string {
  if (typeof gradient !== "string") return ResolveColorExtended(gradient.to).base;
  const stops = theme.effects.gradients[gradient]?.stops;
  const last = stops?.[stops.length - 1];
  return last === undefined ? "transparent" : last.color;
}

export function ResolveGradientToken(
  gradient: GradientRole,
  theme: NebulaTheme,
): GradientToken | undefined {
  return theme.effects.gradients[gradient];
}

export interface ResolvedVariant {
  background: string;
  backgroundHover: string;
  backgroundActive: string;
  foreground: string;
  borderColor: string;
  borderWidth: string;
  backdropFilter: string;
  glow: string;
  animated: boolean;
  gradientAnimated: boolean;
}

const UNSTYLED: ResolvedVariant = {
  background: "transparent",
  backgroundHover: "transparent",
  backgroundActive: "transparent",
  foreground: "currentColor",
  borderColor: "transparent",
  borderWidth: "0",
  backdropFilter: "none",
  glow: "none",
  animated: false,
  gradientAnimated: false,
};

/** Recetas del modo plano: el color es un base único, sin escala de 11 pasos. */
function ResolveFlat(
  variant: Variant,
  flat: FlatColor,
  theme: NebulaTheme,
  gradientOverride: string | undefined,
  gradientAnimated: boolean,
): ResolvedVariant {
  const { base } = flat;
  const on = OnColor(flat.concrete, theme.ink.floor);

  const solid = (bg: string, hover: string, active: string, fg: string): ResolvedVariant => ({
    background: bg,
    backgroundHover: hover,
    backgroundActive: active,
    foreground: fg,
    borderColor: "transparent",
    borderWidth: "0",
    backdropFilter: "none",
    glow: "none",
    animated: theme.motion.tier !== "minimal",
    gradientAnimated: false,
  });

  switch (variant) {
    case "outline":
      return {
        ...solid("transparent", WithAlpha(base, 10), WithAlpha(base, 16), base),
        borderColor: base,
        borderWidth: "1px",
      };
    case "light":
      return solid(WithAlpha(base, 12), WithAlpha(base, 18), WithAlpha(base, 24), base);
    case "ghost":
      return solid("transparent", WithAlpha(base, 10), WithAlpha(base, 16), base);
    case "glow":
      return { ...solid(base, Darken(base, 12), Darken(base, 20), on), glow: TintedGlow(base) };
    case "gradient": {
      const bg = gradientOverride ?? base;
      return {
        ...solid(bg, bg, bg, on),
        gradientAnimated: gradientOverride !== undefined && gradientAnimated,
      };
    }
    case "glass":
    case "filled":
    default:
      return solid(base, Darken(base, 12), Darken(base, 20), on);
  }
}

/** Recetas del modo escala: `color` es una de las 7 escalas de rol del tema. */
function ResolveScale(
  variant: Variant,
  scale: ColorScale,
  theme: NebulaTheme,
  gradientOverride: string | undefined,
  gradientAnimated: boolean,
  glassClass: GlassLevel | undefined,
): ResolvedVariant {
  const recipe: VariantRecipe = theme.variantMap[variant];
  const glass_on = theme.effects.glass.enabled && recipe.glass !== undefined;
  const glass_recipe = vars.glass[glassClass ?? recipe.glass ?? "default"];
  const is_transparent = recipe.background === "transparent";

  const fill_hex = FillHex(recipe.background, scale, theme);
  const dark_ink = fill_hex !== undefined && OnColor(fill_hex, theme.ink.floor) === INK_DARK;
  const darker = theme.meta.scheme === "dark" ? -1 : 1;
  const deepen = dark_ink ? -darker : darker;
  const hover_ref = is_transparent ? TRANSPARENT_HOVER : ShiftRef(recipe.background, deepen);
  const active_ref = is_transparent ? TRANSPARENT_ACTIVE : ShiftRef(recipe.background, deepen * 2);

  const background = glass_on
    ? glass_recipe.background
    : (gradientOverride ?? ResolveBackground(recipe.background, scale, theme));
  const hover = glass_on
    ? glass_recipe.background
    : (gradientOverride ?? ResolveBackground(hover_ref, scale, theme));
  const active = glass_on
    ? glass_recipe.background
    : (gradientOverride ?? ResolveBackground(active_ref, scale, theme));

  return {
    background,
    backgroundHover: hover,
    backgroundActive: active,
    foreground:
      recipe.foreground === ON_FILL && recipe.background.startsWith(SCALE_REF)
        ? vars.color.ink[scale]
        : recipe.foreground === ON_FILL && recipe.background.startsWith(GRADIENT_REF)
          ? vars.color.text.onGradient
          : ResolveColorRef(recipe.foreground, scale),
    borderColor: glass_on
      ? glass_recipe.borderColor
      : recipe.border === "none"
        ? "transparent"
        : ResolveColorRef(recipe.border, scale),
    borderWidth: glass_on || recipe.border !== "none" ? "1px" : "0",
    backdropFilter: glass_on ? glass_recipe.backdropFilter : "none",
    glow: recipe.glow === undefined ? "none" : TintedGlow(background),
    animated: theme.motion.tier !== "minimal",
    gradientAnimated: gradientOverride !== undefined && gradientAnimated,
  };
}

export function ResolveVariant(
  variant: Variant,
  color: ColorExtended,
  theme: NebulaTheme,
  gradient?: GradientProp,
  glassClass?: GlassLevel,
): ResolvedVariant {
  if (variant === "unstyled") return UNSTYLED;

  const gradient_override =
    variant === "gradient" && gradient !== undefined ? GradientFromProp(gradient) : undefined;
  const gradient_animated = gradient?.animate === true;

  return IsSemanticScale(color)
    ? ResolveScale(variant, color, theme, gradient_override, gradient_animated, glassClass)
    : ResolveFlat(
        variant,
        ResolveColorExtended(color),
        theme,
        gradient_override,
        gradient_animated,
      );
}
