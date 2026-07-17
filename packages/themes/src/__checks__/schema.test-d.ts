/**
 * Sincronía de tipos schema ↔ contrato NebulaTheme (ADR-006). Se typechecka y
 * lintea pero NO se emite a dist (excluido en tsconfig.build.json).
 *
 * La dirección salida→contrato de variantMap no se comprueba aquí porque Zod
 * infiere opcionales como `clave?: T | undefined` y el contrato usa opcionales
 * exactos; esa dirección la garantiza loadTheme, tipado sin casts.
 */
import type { NebulaTheme, VariantRecipe } from "@stellaria/nebula-tokens";
import type { z } from "zod";

import type { themeSchema } from "../schema.js";

type SchemaTheme = z.output<typeof themeSchema>;

type Expect<T extends true> = T;
type Extends<A, B> = A extends B ? true : false;

// ── 1. Todo NebulaTheme del contrato es aceptado estructuralmente por el schema ──

export type CheckContractAssignableToSchema = Expect<Extends<NebulaTheme, SchemaTheme>>;

// ── 2. La salida del schema cumple el contrato, sección por sección ──────────

export type CheckMeta = Expect<Extends<SchemaTheme["meta"], NebulaTheme["meta"]>>;
export type CheckPalettes = Expect<Extends<SchemaTheme["palettes"], NebulaTheme["palettes"]>>;
export type CheckColors = Expect<Extends<SchemaTheme["colors"], NebulaTheme["colors"]>>;
export type CheckFont = Expect<Extends<SchemaTheme["font"], NebulaTheme["font"]>>;
export type CheckRadius = Expect<Extends<SchemaTheme["radius"], NebulaTheme["radius"]>>;
export type CheckSpacing = Expect<Extends<SchemaTheme["spacing"], NebulaTheme["spacing"]>>;
export type CheckSizes = Expect<Extends<SchemaTheme["sizes"], NebulaTheme["sizes"]>>;
export type CheckMotion = Expect<Extends<SchemaTheme["motion"], NebulaTheme["motion"]>>;
export type CheckEffects = Expect<Extends<SchemaTheme["effects"], NebulaTheme["effects"]>>;
export type CheckZIndex = Expect<Extends<SchemaTheme["zIndex"], NebulaTheme["zIndex"]>>;
export type CheckBreakpoints = Expect<
  Extends<SchemaTheme["breakpoints"], NebulaTheme["breakpoints"]>
>;

// ── 3. VariantRecipe campo a campo (módulo opcionales exactos) ───────────────

type SchemaRecipe = SchemaTheme["variantMap"]["filled"];

export type CheckRecipeBackground = Expect<
  Extends<SchemaRecipe["background"], VariantRecipe["background"]>
>;
export type CheckRecipeForeground = Expect<
  Extends<SchemaRecipe["foreground"], VariantRecipe["foreground"]>
>;
export type CheckRecipeBorder = Expect<Extends<SchemaRecipe["border"], VariantRecipe["border"]>>;
export type CheckRecipeGlass = Expect<
  Extends<NonNullable<SchemaRecipe["glass"]>, NonNullable<VariantRecipe["glass"]>>
>;
export type CheckRecipeGlow = Expect<
  Extends<NonNullable<SchemaRecipe["glow"]>, NonNullable<VariantRecipe["glow"]>>
>;
