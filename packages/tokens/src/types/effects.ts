import type { BlurLevel, GlassLevel, ShadowLevel } from "../theme/primitives";
import type { Units } from "./dimensions";

export type BlurToken = BlurLevel;
export type ShadowToken = ShadowLevel;
export type GlassSurface = GlassLevel;

export type BlurValue = BlurToken | Units | number;
/** Loose string: admite sombras CSS libres sin perder el autocomplete de tokens. */
export type ShadowValue = ShadowToken | (string & Record<never, never>);

export type ShadowProps = {
  shadow?: ShadowValue;
};

export type BlurProps = {
  blur?: BlurValue;
};

export type EffectsProps = ShadowProps & BlurProps;

export const KeysEffects = ["shadow", "blur"] as const;
