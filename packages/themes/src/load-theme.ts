/**
 * Carga de temas dinámicos (Theme Creator, tenant): valida contra themeSchema
 * y devuelve un NebulaTheme estructuralmente garantizado (ADR-006, 02 §4).
 * El cumplimiento AA se verifica aparte (tools/contrast-check · docs/03 §4.2).
 */
import type { NebulaTheme, VariantMap, VariantRecipe } from "@stellaria/nebula-tokens";
import { z } from "zod";

import { themeSchema } from "./schema.js";

type ParsedTheme = z.output<typeof themeSchema>;
type ParsedRecipe = ParsedTheme["variantMap"]["filled"];

export class ThemeValidationError extends Error {
  /** Issues crudos de Zod, por si el consumidor (p.ej. Theme Creator) quiere señalar campos. */
  readonly issues: z.ZodError["issues"];

  constructor(pretty: string, issues: z.ZodError["issues"]) {
    super(`El tema no cumple el contrato NebulaTheme:\n${pretty}`);
    this.name = "ThemeValidationError";
    this.issues = issues;
  }
}

/**
 * Zod infiere opcionales como `clave?: T | undefined`; el contrato usa
 * opcionales exactos (exactOptionalPropertyTypes). Reconstruye la receta
 * omitiendo claves undefined — sin casts.
 */
function normalizeRecipe(recipe: ParsedRecipe): VariantRecipe {
  const normalized: VariantRecipe = {
    background: recipe.background,
    foreground: recipe.foreground,
    border: recipe.border,
  };
  if (recipe.glass !== undefined) normalized.glass = recipe.glass;
  if (recipe.glow !== undefined) normalized.glow = recipe.glow;
  return normalized;
}

/** Valida `json` contra el contrato; lanza ThemeValidationError con mensaje legible si no cumple. */
export function loadTheme(json: unknown): NebulaTheme {
  const result = themeSchema.safeParse(json);
  if (!result.success) {
    throw new ThemeValidationError(z.prettifyError(result.error), result.error.issues);
  }
  const parsed = result.data;
  const variantMap: VariantMap = {
    filled: normalizeRecipe(parsed.variantMap.filled),
    outline: normalizeRecipe(parsed.variantMap.outline),
    light: normalizeRecipe(parsed.variantMap.light),
    glass: normalizeRecipe(parsed.variantMap.glass),
    ghost: normalizeRecipe(parsed.variantMap.ghost),
    glow: normalizeRecipe(parsed.variantMap.glow),
    gradient: normalizeRecipe(parsed.variantMap.gradient),
    unstyled: normalizeRecipe(parsed.variantMap.unstyled),
  };
  return { ...parsed, variantMap };
}
