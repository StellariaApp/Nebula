"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { Box } from "../../Box/Box.js";

import * as styles from "../AppShell.css.js";
import type { AppShellSectionProps } from "../AppShell.types.js";

export function AppShellSection(props: AppShellSectionProps): ReactElement {
  const { children, hanging, hangingHeight, hangingProps, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  const has_hanging = hanging !== undefined && hanging !== null;

  return (
    <>
      <section
        className={cx(styles.section, sprinkle_class, className)}
        style={style}
        data-hanging={has_hanging ? "true" : undefined}
        {...rest}
      >
        {children}
        {has_hanging ? (
          <Box
            data-floating="header"
            {...hangingProps}
            className={cx(styles.section_hanging, hangingProps?.className)}
          >
            {hanging}
          </Box>
        ) : null}
      </section>
      {has_hanging && hangingHeight !== undefined ? (
        <div
          aria-hidden="true"
          className={styles.section_spacer}
          style={{ height: `${String(hangingHeight)}px` }}
        />
      ) : null}
    </>
  );
}
