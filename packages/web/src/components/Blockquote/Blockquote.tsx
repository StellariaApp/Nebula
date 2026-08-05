import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type Ref,
} from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveAccent } from "../../utils/scale.js";
import { cx } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./Blockquote.css.js";
import * as variables from "./Blockquote.vars.css.js";
import type { BlockquoteOwnProps, BlockquoteProps } from "./Blockquote.types.js";

const BlockquoteComponent = forwardRef<HTMLElement, BlockquoteOwnProps>(
  function Blockquote(props, ref) {
    const {
      component,
      color = "primary",
      cite,
      icon,
      className,
      style,
      children,
      ...rest
    } = props as BlockquoteOwnProps & { style?: CSSProperties };

    const css_vars = assignInlineVars({ [variables.accent]: ResolveAccent(color, "500") });

    const content = (
      <div>
        {children}
        {cite === undefined || cite === null ? null : <cite className={styles.cite}>{cite}</cite>}
      </div>
    );

    return (
      <Box
        ref={ref}
        component={component ?? "blockquote"}
        className={cx(
          styles.blockquote,
          icon === undefined ? undefined : styles.with_icon,
          className,
        )}
        style={{ ...css_vars, ...style }}
        {...rest}
      >
        {icon === undefined || icon === null ? (
          content
        ) : (
          <>
            <span className={styles.icon_wrap} aria-hidden="true">
              {icon}
            </span>
            {content}
          </>
        )}
      </Box>
    );
  },
);

interface BlockquoteComponent {
  <C extends ElementType = "blockquote">(
    props: BlockquoteProps<C> & { ref?: Ref<Element> },
  ): ReactElement;
  displayName?: string;
}

export const Blockquote = BlockquoteComponent as unknown as BlockquoteComponent;
Blockquote.displayName = "Blockquote";
