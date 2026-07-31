"use client";

import { useId, type ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Main.css.js";
import type { MainProps } from "./Main.types.js";

export function Main(props: MainProps): ReactElement {
  const {
    children,
    header,
    footer,
    background,
    stickyHeader = false,
    stickyFooter = false,
    centered = false,
    padded = true,
    skipLabel = "Saltar al contenido",
    withSkipLink = false,
    id,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const auto_id = useId();
  const content_id = id ?? auto_id;

  return (
    <div className={cx(styles.root, sprinkle_class, className)} style={sprinkle_style}>
      {withSkipLink ? (
        <a href={`#${content_id}`} className={styles.skip}>
          {skipLabel}
        </a>
      ) : null}

      {background === undefined ? null : (
        <div className={styles.backdrop} aria-hidden="true">
          {background}
        </div>
      )}

      {header === undefined ? null : (
        <div className={styles.header} data-sticky={stickyHeader ? "true" : undefined}>
          {header}
        </div>
      )}

      <main
        id={content_id}
        tabIndex={-1}
        className={styles.content}
        data-padded={padded ? "true" : undefined}
        data-centered={centered ? "true" : undefined}
      >
        {children}
      </main>

      {footer === undefined ? null : (
        <div className={styles.footer} data-sticky={stickyFooter ? "true" : undefined}>
          {footer}
        </div>
      )}
    </div>
  );
}

Main.displayName = "Main";
