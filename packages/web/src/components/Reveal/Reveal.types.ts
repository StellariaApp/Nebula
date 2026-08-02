import type { CSSProperties, ElementType, ReactNode } from "react";

import type { SpringName } from "@stellaria/nebula-tokens";

import type { TransitionPreset } from "../Transition/Transition.types.js";

import type { StyleProps } from "../../utils/style-props.js";

export type RevealPreset = TransitionPreset;

export interface RevealProps extends StyleProps {
  children?: ReactNode | undefined;
  component?: ElementType | undefined;
  preset?: RevealPreset | undefined;
  spring?: SpringName | undefined;
  duration?: number | undefined;
  once?: boolean | undefined;
  amount?: number | undefined;
  rootMargin?: string | undefined;
  index?: number | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}
