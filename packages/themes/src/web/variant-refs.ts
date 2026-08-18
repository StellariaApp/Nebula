import type { GlassLevel, NebulaTheme } from "@stellaria/nebula-tokens";

import { vars } from "./contract.css.js";
import { IsSemanticScale, type GradientProp } from "./resolve-variant.js";

/** Las siete variantes que el tema precalcula al crearse (ADR-150). `unstyled` no entra. */
const MATRIX_VARIANTS = new Set([
  "filled",
  "outline",
  "light",
  "glass",
  "ghost",
  "glow",
  "gradient",
]);

export interface VariantColorRefs {
  background: string;
  backgroundHover: string;
  backgroundActive: string;
  foreground: string;
  borderColor: string;
  borderWidth: string;
  backdropFilter: string;
  glow: string;
}

/**
 * Las ocho referencias que el tema ya publica para esta combinacion, o `undefined` si el caso no
 * esta en la matriz (ADR-150 §2).
 *
 * Devolver refs en vez de valores es lo que hace que el color lo resuelva **el navegador** contra la
 * clase activa, y no JavaScript contra el objeto del tema. Sin esto, el servidor hornea el color del
 * tema por defecto y el cliente lo recalcula al adoptar el suyo: por eso los degradados tardaban en
 * mostrar su color real.
 *
 * Queda fuera lo que la matriz no puede saber por adelantado, que es lo que ADR-150 §3 ya declara
 * infinito: un color suelto que no es escala semantica, un degradado escrito en la prop, y un nivel
 * de cristal elegido a mano. Esos siguen resolviendose en JavaScript.
 */
export function VariantRefs(
  variant: string,
  color: string,
  theme: NebulaTheme,
  gradient?: GradientProp,
  glassClass?: GlassLevel,
): VariantColorRefs | undefined {
  if (!MATRIX_VARIANTS.has(variant)) return undefined;
  if (gradient !== undefined) return undefined;
  if (!IsSemanticScale(color)) return undefined;

  // El nivel de cristal solo importa si la receta declara uno: de las ocho variantes, unicamente
  // `glass` lo hace. Los tres accionables traen un nivel por defecto, y sin esta comprobacion ese
  // defecto los sacaba de la matriz ENTERA — tambien en `filled` o `gradient`, que no tocan cristal.
  const recipe = theme.variantMap[variant as keyof NebulaTheme["variantMap"]];
  if (recipe.glass !== undefined && glassClass !== undefined && glassClass !== recipe.glass) {
    return undefined;
  }

  const matrix = vars.variant[variant as keyof typeof vars.variant];
  return matrix[color];
}

const GRADIENT_ROLES = new Set(["brand", "accent", "surface"]);

export interface GradientRefs {
  image: string;
  edge: string;
  tip: string;
}

/**
 * Las tres referencias que el tema publica para un rol de degradado, o `undefined` si lo que se pide
 * no es un rol (ADR-170).
 *
 * Es el mismo reparto que `VariantRefs`: si el degradado tiene nombre, el tema ya lo publico y lo
 * resuelve el navegador contra la clase activa. Un degradado escrito en la prop es el caso infinito
 * de ADR-150 §3 y se sigue construyendo en JavaScript.
 */
export function GradientRefsOf(gradient: unknown): GradientRefs | undefined {
  if (typeof gradient !== "string" || !GRADIENT_ROLES.has(gradient)) return undefined;
  return vars.gradient[gradient as keyof typeof vars.gradient];
}
