import type {
  GradientToken,
  NebulaTheme,
  ThemeEffects,
  VariantMap,
  VariantRecipe,
} from "@stellaria/nebula-tokens";
import { z } from "zod";

import { themeSchema } from "./schema.js";

type ParsedTheme = z.output<typeof themeSchema>;
type ParsedRecipe = ParsedTheme["variantMap"]["filled"];
type ParsedGradient = ParsedTheme["effects"]["gradients"]["brand"];

export class ThemeValidationError extends Error {
  readonly issues: z.ZodError["issues"];

  constructor(pretty: string, issues: z.ZodError["issues"]) {
    super(`El tema no cumple el contrato NebulaTheme:\n${pretty}`);
    this.name = "ThemeValidationError";
    this.issues = issues;
  }
}

function NormalizeRecipe(recipe: ParsedRecipe): VariantRecipe {
  const normalized: VariantRecipe = {
    background: recipe.background,
    foreground: recipe.foreground,
    border: recipe.border,
  };
  if (recipe.glass !== undefined) normalized.glass = recipe.glass;
  if (recipe.glow !== undefined) normalized.glow = recipe.glow;
  return normalized;
}

function NormalizeGradient(token: ParsedGradient): GradientToken {
  const normalized: GradientToken = {
    type: token.type,
    angle: token.angle,
    stops: token.stops.map((stop) => ({ color: stop.color, position: stop.position })),
  };
  if (token.ink !== undefined) normalized.ink = token.ink;
  return normalized;
}

export function LoadTheme(json: unknown): NebulaTheme {
  const result = themeSchema.safeParse(json);
  if (!result.success) {
    throw new ThemeValidationError(z.prettifyError(result.error), result.error.issues);
  }
  const parsed = result.data;
  const variant_map: VariantMap = {
    filled: NormalizeRecipe(parsed.variantMap.filled),
    outline: NormalizeRecipe(parsed.variantMap.outline),
    light: NormalizeRecipe(parsed.variantMap.light),
    glass: NormalizeRecipe(parsed.variantMap.glass),
    ghost: NormalizeRecipe(parsed.variantMap.ghost),
    glow: NormalizeRecipe(parsed.variantMap.glow),
    gradient: NormalizeRecipe(parsed.variantMap.gradient),
    unstyled: NormalizeRecipe(parsed.variantMap.unstyled),
  };
  const gradients: ThemeEffects["gradients"] = {
    brand: NormalizeGradient(parsed.effects.gradients.brand),
    accent: NormalizeGradient(parsed.effects.gradients.accent),
    surface: NormalizeGradient(parsed.effects.gradients.surface),
  };
  return {
    ...parsed,
    effects: { ...parsed.effects, gradients },
    variantMap: variant_map,
  };
}
