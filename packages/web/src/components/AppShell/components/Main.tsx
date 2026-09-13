"use client";

import type { ReactElement, Ref } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";

import type { BoxSlotProps } from "../../Box/Box.types.js";
import * as styles from "../AppShell.css.js";

export function AppShellMain(
  props: BoxSlotProps & { ref?: Ref<HTMLElement | null> | undefined },
): ReactElement {
  const { children, className, ref, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <main ref={ref} className={cx(styles.main, sprinkle_class, className)} style={style} {...rest}>
      {children}
    </main>
  );
}
