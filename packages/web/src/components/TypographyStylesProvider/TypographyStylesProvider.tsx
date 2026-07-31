import { forwardRef, type ElementType, type ReactElement, type Ref } from "react";

import { cx } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./TypographyStylesProvider.css.js";
import type {
  TypographyStylesProviderOwnProps,
  TypographyStylesProviderProps,
} from "./TypographyStylesProvider.types.js";

const TypographyStylesProviderComponent = forwardRef<HTMLElement, TypographyStylesProviderOwnProps>(
  function TypographyStylesProvider(props, ref) {
    const { component, className, ...rest } = props;

    return (
      <Box
        ref={ref}
        component={component ?? "div"}
        className={cx(styles.typography, className)}
        {...rest}
      />
    );
  },
);

interface TypographyStylesProviderComponent {
  <C extends ElementType = "div">(
    props: TypographyStylesProviderProps<C> & { ref?: Ref<Element> },
  ): ReactElement;
  displayName?: string;
}

export const TypographyStylesProvider =
  TypographyStylesProviderComponent as unknown as TypographyStylesProviderComponent;
TypographyStylesProvider.displayName = "TypographyStylesProvider";
