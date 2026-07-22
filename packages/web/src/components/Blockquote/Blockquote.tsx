import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type Ref,
} from "react";

import type { SemanticScaleName } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "../../theme/contract.css.js";
import { cx } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./Blockquote.css.js";
import { accent } from "./Blockquote.vars.css.js";
import type { BlockquoteOwnProps, BlockquoteProps } from "./Blockquote.types.js";

const SCALE: Record<SemanticScaleName, Record<string, string>> = {
  primary: vars.color.primary,
  accent: vars.color.accent,
  gray: vars.color.gray,
  success: vars.color.semantic.success,
  warning: vars.color.semantic.warning,
  error: vars.color.semantic.error,
  info: vars.color.semantic.info,
};

const BlockquoteImpl = forwardRef<HTMLElement, BlockquoteOwnProps>(function Blockquote(props, ref) {
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

  const css_vars = assignInlineVars({ [accent]: SCALE[color]["500"] ?? "" });

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
      className={cx(styles.blockquote, icon === undefined ? undefined : styles.withIcon, className)}
      style={{ ...css_vars, ...style }}
      {...rest}
    >
      {icon === undefined || icon === null ? (
        content
      ) : (
        <>
          <span className={styles.iconWrap} aria-hidden="true">
            {icon}
          </span>
          {content}
        </>
      )}
    </Box>
  );
});

interface BlockquoteComponent {
  <C extends ElementType = "blockquote">(
    props: BlockquoteProps<C> & { ref?: Ref<Element> },
  ): ReactElement;
  displayName?: string;
}

export const Blockquote = BlockquoteImpl as unknown as BlockquoteComponent;
Blockquote.displayName = "Blockquote";
