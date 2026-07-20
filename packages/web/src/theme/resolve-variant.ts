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

function WithAlpha(color: string, alphaPercent: number): string {
  return `color-mix(in srgb, ${color} ${String(alphaPercent)}%, transparent)`;
}

function GradientCss(token: GradientToken): string {
  const stops = token.stops.map((stop) => `${stop.color} ${String(stop.position)}%`).join(", ");
  return token.type === "linear"
    ? `linear-gradient(${String(token.angle)}deg, ${stops})`
    : `radial-gradient(circle at 50% 50%, ${stops})`;
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

export interface ResolvedVariant {
  background: string;
  backgroundHover: string;
  backgroundActive: string;
  foreground: string;
  borderColor: string;
  borderWidth: string;
  backdropFilter: string;
  glassBorder: string;
  glow: string;
  animated: boolean;
}

const UNSTYLED: ResolvedVariant = {
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

export function ResolveVariant(
  variant: Variant,
  scale: ColorScale,
  theme: NebulaTheme,
): ResolvedVariant {
  if (variant === "unstyled") return UNSTYLED;

  const recipe: VariantRecipe = theme.variantMap[variant];
  const glass_on = theme.effects.glass.enabled && recipe.glass !== undefined;
  const glass_recipe = vars.glass[recipe.glass ?? "default"];
  const is_transparent = recipe.background === "transparent";

  const hover_ref = is_transparent ? TRANSPARENT_HOVER : ShiftRef(recipe.background, 1);
  const active_ref = is_transparent ? TRANSPARENT_ACTIVE : ShiftRef(recipe.background, 2);

  return {
    background: glass_on
      ? glass_recipe.background
      : ResolveBackground(recipe.background, scale, theme),
    backgroundHover: glass_on
      ? glass_recipe.background
      : ResolveBackground(hover_ref, scale, theme),
    backgroundActive: glass_on
      ? glass_recipe.background
      : ResolveBackground(active_ref, scale, theme),
    foreground: ResolveColorRef(recipe.foreground, scale),
    borderColor: recipe.border === "none" ? "transparent" : ResolveColorRef(recipe.border, scale),
    borderWidth: recipe.border === "none" ? "0" : "1px",
    backdropFilter: glass_on ? glass_recipe.backdropFilter : "none",
    glassBorder: glass_on ? glass_recipe.border : "none",
    glow: recipe.glow === undefined ? "none" : vars.shadow[recipe.glow],
    animated: theme.motion.tier !== "minimal",
  };
}
