import type { DurationName, EasingName } from "../theme/primitives.js";
import type { animation } from "../tokens/animation.js";

export type DurationToken = DurationName;
export type EasingToken = EasingName;
export type TransitionToken = keyof typeof animation.transition;
export type KeyframeToken = keyof typeof animation.keyframes;

export type AnimationsProps = {
  transition?: TransitionToken;
  duration?: DurationToken;
  easing?: EasingToken;
};

export const KeysAnimations = ["transition", "duration", "easing"] as const;
