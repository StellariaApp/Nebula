import type { ElementType, ReactElement } from "react";

import type { GradientBorderOwnProps, GradientBorderProps } from "./GradientBorder.types.js";
import { GradientBorderSurface } from "./components/Surface.js";

function GradientBorderComponent(props: GradientBorderOwnProps): ReactElement {
  return <GradientBorderSurface {...props} />;
}

interface GradientBorderComponent {
  <C extends ElementType = "div">(props: GradientBorderProps<C>): ReactElement;
  displayName?: string;
}

export const GradientBorder = GradientBorderComponent as unknown as GradientBorderComponent;
GradientBorder.displayName = "GradientBorder";
