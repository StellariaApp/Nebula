import { forwardRef, type ElementType, type ReactElement, type Ref } from "react";

import { Box } from "../Box/Box.js";

import type { CenterOwnProps, CenterProps } from "./Center.types.js";

const CenterImpl = forwardRef<HTMLElement, CenterOwnProps>(function Center(props, ref) {
  const { component, inline = false, align, justify, ...rest } = props;
  return (
    <Box
      ref={ref}
      component={component ?? "div"}
      display={inline ? "inline-flex" : "flex"}
      align={align ?? "center"}
      justify={justify ?? "center"}
      {...rest}
    />
  );
});

interface CenterComponent {
  <C extends ElementType = "div">(props: CenterProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const Center = CenterImpl as unknown as CenterComponent;
Center.displayName = "Center";
