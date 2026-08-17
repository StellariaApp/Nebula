import type { ElementType, ReactElement } from "react";

import type { PaperOwnProps, PaperProps } from "./Paper.types.js";
import { PaperRoot } from "./components/Surface.js";

function PaperComponent(props: PaperOwnProps): ReactElement {
  return <PaperRoot {...props} />;
}

interface PaperComponent {
  <C extends ElementType = "div">(props: PaperProps<C>): ReactElement;
  displayName?: string;
}

export const Paper = PaperComponent as unknown as PaperComponent;
Paper.displayName = "Paper";
