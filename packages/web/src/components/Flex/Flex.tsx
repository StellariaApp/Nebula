import { forwardRef, type ElementType, type ReactElement, type Ref } from "react";

import { Box } from "../Box/Box.js";

import type { FlexOwnProps, FlexProps } from "./Flex.types.js";

const FlexComponent = forwardRef<HTMLElement, FlexOwnProps>(function Flex(props, ref) {
  const { component, inline = false, display, ...rest } = props;
  return (
    <Box
      ref={ref}
      component={component ?? "div"}
      display={display ?? (inline ? "inline-flex" : "flex")}
      {...rest}
    />
  );
});

interface FlexComponent {
  <C extends ElementType = "div">(props: FlexProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const Flex = FlexComponent as unknown as FlexComponent;
Flex.displayName = "Flex";
