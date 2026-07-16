import { KeysAnimations, type AnimationsProps } from "./animations.js";
import { KeysBorder, type BorderProps } from "./border.js";
import { KeysColors, type ColorsProps } from "./colors.js";
import { KeysDimensions, type DimensionsProps } from "./dimensions.js";
import { KeysEffects, type EffectsProps } from "./effects.js";
import { KeysLayouts, type LayoutsProps } from "./layouts.js";
import { KeysSpacing, type SpacingProps } from "./spacing.js";
import { KeysTypography, type TypographyProps } from "./typography.js";
import { KeysVariants, type VariantsProps } from "./variants.js";

export type BaseProps = AnimationsProps &
  SpacingProps &
  DimensionsProps &
  ColorsProps &
  TypographyProps &
  BorderProps &
  EffectsProps &
  LayoutsProps &
  VariantsProps;

/** Fix del bug de Stellaria (04 §1): ahora incluye KeysEffects. */
export const KeysBase = [
  ...KeysAnimations,
  ...KeysSpacing,
  ...KeysDimensions,
  ...KeysColors,
  ...KeysTypography,
  ...KeysBorder,
  ...KeysEffects,
  ...KeysLayouts,
  ...KeysVariants,
] as const;
