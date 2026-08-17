import type { ElementType, ReactElement } from "react";

import type { AnimatedGradientOwnProps, AnimatedGradientProps } from "./AnimatedGradient.types.js";
import { AnimatedGradientSurface } from "./components/Surface.js";

function AnimatedGradientComponent(props: AnimatedGradientOwnProps): ReactElement {
  return <AnimatedGradientSurface {...props} />;
}

interface AnimatedGradientComponent {
  <C extends ElementType = "div">(props: AnimatedGradientProps<C>): ReactElement;
  displayName?: string;
}

export const AnimatedGradient = AnimatedGradientComponent as unknown as AnimatedGradientComponent;
AnimatedGradient.displayName = "AnimatedGradient";
