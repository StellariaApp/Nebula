import type { BlurLevel, GlassLevel, ShadowLevel } from "../theme/primitives.js";
import type { Units } from "./dimensions.js";

export type BlurToken = BlurLevel;
export type ShadowToken = ShadowLevel;
export type GlassSurface = GlassLevel;

export type BlurValue = BlurToken | Units | number;
export type ShadowValue = ShadowToken | (string & Record<never, never>);

export type ShadowProps = {
  shadow?: ShadowValue;
};

export type BlurProps = {
  blur?: BlurValue;
};

export type EffectsProps = ShadowProps & BlurProps;

export const KeysEffects = ["shadow", "blur"] as const;
