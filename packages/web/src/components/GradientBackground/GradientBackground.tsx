import type { ElementType, ReactElement } from "react";

import type {
  GradientBackgroundOwnProps,
  GradientBackgroundProps,
} from "./GradientBackground.types.js";
import { GradientBackgroundSurface } from "./components/Surface.js";

function GradientBackgroundComponent(props: GradientBackgroundOwnProps): ReactElement {
  return <GradientBackgroundSurface {...props} />;
}

interface GradientBackgroundComponent {
  <C extends ElementType = "div">(props: GradientBackgroundProps<C>): ReactElement;
  displayName?: string;
}

export const GradientBackground =
  GradientBackgroundComponent as unknown as GradientBackgroundComponent;
GradientBackground.displayName = "GradientBackground";
