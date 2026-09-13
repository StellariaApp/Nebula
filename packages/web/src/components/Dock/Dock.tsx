"use client";

import type { ReactElement, ReactNode } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ActionIcon } from "../ActionIcon/ActionIcon.js";
import { Affix } from "../Affix/Affix.js";
import { Box } from "../Box/Box.js";
import { GlassSurface } from "../GlassSurface/GlassSurface.js";
import { Popover } from "../Popover/Popover.js";
import { DotsHorizontal } from "../../glyphs/index.js";

import * as styles from "./Dock.css.js";
import type { DockProps } from "./Dock.types.js";

const FLOATING = "dock";

export function Dock(props: DockProps): ReactElement | null {
  const {
    children,
    "aria-label": aria_label,
    compactBelow = "phone",
    trigger,
    triggerLabel,
    width = 220,
    placement = "top end",
    offset = 12,
    level = "strong",
    position,
    zIndex,
    withinPortal,
    visible = true,
    className,
    surfaceProps,
    compactProps,
    triggerProps,
    popoverProps,
    stackProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  if (!visible) return null;

  const Render = (stacked: boolean): ReactNode =>
    typeof children === "function" ? children(stacked) : children;

  return (
    <Affix
      {...(position === undefined ? {} : { position })}
      {...(zIndex === undefined ? {} : { zIndex })}
      {...(withinPortal === undefined ? {} : { withinPortal })}
      className={cx(sprinkle_class, className)}
      {...(sprinkle_style === undefined ? {} : { style: sprinkle_style })}
    >
      <GlassSurface
        component="aside"
        aria-label={aria_label}
        data-floating={FLOATING}
        level={level}
        r="lg"
        {...surfaceProps}
        className={cx(
          styles.row,
          compactBelow === false ? undefined : styles.row_folds[compactBelow],
          surfaceProps?.className,
        )}
      >
        {Render(false)}
      </GlassSurface>
      {compactBelow === false ? null : (
        <GlassSurface
          component="aside"
          aria-label={aria_label}
          data-floating={FLOATING}
          level={level}
          r="lg"
          {...compactProps}
          className={cx(
            styles.compact,
            styles.compact_shows[compactBelow],
            compactProps?.className,
          )}
        >
          <Popover
            aria-label={aria_label}
            placement={placement}
            offset={offset}
            width={width}
            trigger={
              <ActionIcon
                aria-label={triggerLabel ?? aria_label}
                size="lg"
                variant="ghost"
                {...triggerProps}
              >
                {trigger ?? <DotsHorizontal />}
              </ActionIcon>
            }
            {...popoverProps}
          >
            <Box {...stackProps} className={cx(styles.stack, stackProps?.className)}>
              {Render(true)}
            </Box>
          </Popover>
        </GlassSurface>
      )}
    </Affix>
  );
}

Dock.displayName = "Dock";
