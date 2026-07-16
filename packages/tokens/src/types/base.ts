import { KeysAnimations, type AnimationsProps } from "./animations";
import { KeysBorder, type BorderProps } from "./border";
import { KeysColors, type ColorsProps } from "./colors";
import { KeysDimensions, type DimensionsProps } from "./dimensions";
import { KeysEffects, type EffectsProps } from "./effects";
import { KeysLayouts, type LayoutsProps } from "./layouts";
import { KeysSpacing, type SpacingProps } from "./spacing";
import { KeysTypography, type TypographyProps } from "./typography";
import { KeysVariants, type VariantsProps } from "./variants";

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
