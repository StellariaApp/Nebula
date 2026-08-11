import { paletteNames } from "@stellaria/nebula-tokens";
import type { GlassLevel, GlassSurfaceRecipe } from "@stellaria/nebula-tokens";
import { z } from "zod";

import {
  blurLevels,
  borderRoles,
  breakpointNames,
  colorSchemes,
  colorShades,
  durationNames,
  easingNames,
  fontFamilyNames,
  fontWeightNames,
  glassLevels,
  gradientRoles,
  gradientTypes,
  letterSpacingNames,
  lineHeightNames,
  motionTiers,
  radiusNames,
  semanticStatuses,
  shadowLevels,
  sizeNames,
  spacingNames,
  springNames,
  surfaceRoles,
  textRoles,
  textSizeNames,
  variants,
  zIndexNames,
} from "./enums.js";

const colorValue = z.string().min(1);

const scale11 = z.record(z.enum(colorShades), colorValue);

const scaleRef = z.templateLiteral(["scale.", z.enum(colorShades)]);

const scaleAlphaRef = z.templateLiteral(["scale.", z.enum(colorShades), ".", z.int()]).refine(
  (ref) => {
    const alpha = Number(ref.split(".")[2]);
    return alpha >= 0 && alpha <= 100;
  },
  { error: "el alpha de `scale.<paso>.<alpha>` debe estar entre 0 y 100" },
);

const variantColorRef = z.union([
  z.literal("transparent"),
  z.literal("currentColor"),
  scaleRef,
  scaleAlphaRef,
  z.templateLiteral(["surface.", z.enum(surfaceRoles)]),
  z.templateLiteral(["text.", z.enum(textRoles)]),
  z.templateLiteral(["border.", z.enum(borderRoles)]),
]);

const variantBackground = z.union([
  variantColorRef,
  z.templateLiteral(["gradient.", z.enum(gradientRoles)]),
]);

const variantRecipe = z.strictObject({
  background: variantBackground,
  foreground: variantColorRef,
  border: z.union([variantColorRef, z.literal("none")]),
  glass: z.enum(glassLevels).optional(),
  glow: z.enum(shadowLevels).optional(),
});

const meta = z.strictObject({
  name: z.string().min(1),
  scheme: z.enum(colorSchemes),
  version: z.string().min(1),
});

const paletteScales = Object.fromEntries(paletteNames.map((name) => [name, scale11])) as Record<
  (typeof paletteNames)[number],
  typeof scale11
>;

const colors = z.strictObject({
  ...paletteScales,
  primary: scale11,
  accent: scale11,
  gray: scale11,
  semantic: z.record(z.enum(semanticStatuses), scale11),
  surface: z.record(z.enum(surfaceRoles), colorValue),
  text: z.record(z.enum(textRoles), colorValue),
  border: z.record(z.enum(borderRoles), colorValue),
});

const font = z.strictObject({
  family: z.record(z.enum(fontFamilyNames), z.string().min(1)),
  size: z.record(z.enum(textSizeNames), z.number().positive()),
  leading: z.record(z.enum(textSizeNames), z.number().positive()),
  weight: z.record(z.enum(fontWeightNames), z.number().min(1).max(1000)),
  lineHeight: z.record(z.enum(lineHeightNames), z.number().positive()),
  letterSpacing: z.record(z.enum(letterSpacingNames), z.number()),
  display: z.strictObject({
    size: z.string().min(1),
    lineHeight: z.number().positive(),
    letterSpacing: z.number(),
  }),
});

const spacing = z.strictObject({
  unit: z.number().positive(),
  scale: z.record(z.enum(spacingNames), z.number().min(0)),
});

const motion = z.strictObject({
  tier: z.enum(motionTiers),
  duration: z.record(z.enum(durationNames), z.number().min(0)),
  easing: z.record(z.enum(easingNames), z.string().min(1)),
  spring: z.record(
    z.enum(springNames),
    z.strictObject({
      stiffness: z.number().positive(),
      damping: z.number().positive(),
      mass: z.number().positive(),
    }),
  ),
});

const GLASS_EDGE_FALLBACK = {
  band: "rgba(128, 128, 128, 0.10)",
  control: "rgba(128, 128, 128, 0.20)",
  subtle: "rgba(128, 128, 128, 0.16)",
  default: "rgba(128, 128, 128, 0.20)",
  strong: "rgba(128, 128, 128, 0.24)",
} as const satisfies Record<GlassLevel, string>;

const glassSurfaceRecipe = z.strictObject({
  background: colorValue,
  backdropFilter: z.string().min(1),
  borderColor: colorValue.optional(),
});

const glassSurface = z.record(z.enum(glassLevels), glassSurfaceRecipe).transform(
  (surface) =>
    Object.fromEntries(
      glassLevels.map((level) => {
        const recipe = surface[level];
        return [
          level,
          { ...recipe, borderColor: recipe?.borderColor ?? GLASS_EDGE_FALLBACK[level] },
        ];
      }),
    ) as Record<GlassLevel, GlassSurfaceRecipe>,
);

const dualShadow = z.strictObject({
  web: z.string().min(1),
  native: z.strictObject({
    elevation: z.number().min(0),
    shadowColor: colorValue,
    shadowOpacity: z.number().min(0).max(1),
    shadowRadius: z.number().min(0),
    shadowOffset: z.strictObject({ width: z.number(), height: z.number() }),
  }),
});

const gradientToken = z.strictObject({
  type: z.enum(gradientTypes),
  angle: z.number(),
  stops: z
    .array(
      z.strictObject({
        color: colorValue,
        position: z.number().min(0).max(100),
      }),
    )
    .min(2),
});

const effects = z.strictObject({
  blur: z.record(z.enum(blurLevels), z.string().min(1)),
  glass: z.strictObject({
    surface: glassSurface,
    noiseOpacity: z.number().min(0).max(1),
    enabled: z.boolean(),
  }),
  shadows: z.record(z.enum(shadowLevels), dualShadow),
  gradients: z.record(z.enum(gradientRoles), gradientToken),
});

export const themeSchema = z.strictObject({
  meta,
  palettes: z.record(z.enum(paletteNames), scale11),
  colors,
  font,
  radius: z.record(z.enum(radiusNames), z.number().min(0)),
  spacing,
  sizes: z.strictObject({
    control: z.record(z.enum(sizeNames), z.number().positive()),
    compact: z.record(z.enum(sizeNames), z.number().positive()),
  }),
  motion,
  effects,
  variantMap: z.record(z.enum(variants), variantRecipe),
  zIndex: z.record(z.enum(zIndexNames), z.number()),
  breakpoints: z.record(z.enum(breakpointNames), z.number().positive()),
});
