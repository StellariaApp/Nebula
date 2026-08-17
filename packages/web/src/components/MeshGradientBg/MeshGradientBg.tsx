import type { ElementType, ReactElement } from "react";

import type { MeshGradientBgOwnProps, MeshGradientBgProps } from "./MeshGradientBg.types.js";
import { MeshGradientBgSurface } from "./components/Surface.js";

function MeshGradientBgComponent(props: MeshGradientBgOwnProps): ReactElement {
  return <MeshGradientBgSurface {...props} />;
}

interface MeshGradientBgComponent {
  <C extends ElementType = "div">(props: MeshGradientBgProps<C>): ReactElement;
  displayName?: string;
}

export const MeshGradientBg = MeshGradientBgComponent as unknown as MeshGradientBgComponent;
MeshGradientBg.displayName = "MeshGradientBg";
