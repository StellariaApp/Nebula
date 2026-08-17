import type { ElementType, ReactElement } from "react";

import type { GlassSurfaceOwnProps, GlassSurfaceProps } from "./GlassSurface.types.js";
import { GlassSurfaceRoot } from "./components/Surface.js";

function GlassSurfaceComponent(props: GlassSurfaceOwnProps): ReactElement {
  return <GlassSurfaceRoot {...props} />;
}

interface GlassSurfaceComponent {
  <C extends ElementType = "div">(props: GlassSurfaceProps<C>): ReactElement;
  displayName?: string;
}

export const GlassSurface = GlassSurfaceComponent as unknown as GlassSurfaceComponent;
GlassSurface.displayName = "GlassSurface";
