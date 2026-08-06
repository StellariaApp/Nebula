"use client";

import { useRef, type ReactElement } from "react";

import { useButton, useFocusRing, mergeProps } from "react-aria";
import type { AriaButtonProps } from "react-aria";

import type { Size } from "@stellaria/nebula-tokens";

import { cx } from "../../utils/style-props.js";

import * as styles from "./Calendar.css.js";
import type { CalendarLabels } from "./Calendar.types.js";
import { ChevronLeft, ChevronRight } from "../../glyphs/index.js";

const CHEVRON_LEFT = <ChevronLeft />;

const CHEVRON_RIGHT = <ChevronRight />;

interface NavButtonProps {
  buttonProps: AriaButtonProps<"button">;
  size: Size;
  label: string;
  children: ReactElement;
}

function NavButton(props: NavButtonProps): ReactElement {
  const { buttonProps, size, label, children } = props;
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps: dom } = useButton(buttonProps, ref);
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <button
      {...mergeProps(dom, focusProps)}
      ref={ref}
      type="button"
      aria-label={label}
      className={cx(styles.nav, styles.nav_size[size])}
      data-focus-visible={isFocusVisible ? "true" : undefined}
    >
      {children}
    </button>
  );
}

export interface CalendarHeaderProps {
  title: string;
  size: Size;
  prevButtonProps: AriaButtonProps<"button">;
  nextButtonProps: AriaButtonProps<"button">;
  labels?: CalendarLabels | undefined;
}

export function CalendarHeader(props: CalendarHeaderProps): ReactElement {
  const { title, size, prevButtonProps, nextButtonProps, labels } = props;

  return (
    <div className={styles.header}>
      <NavButton
        buttonProps={prevButtonProps}
        size={size}
        label={labels?.previousMonth ?? "Mes anterior"}
      >
        {CHEVRON_LEFT}
      </NavButton>
      <h2 className={styles.heading}>{title}</h2>
      <NavButton
        buttonProps={nextButtonProps}
        size={size}
        label={labels?.nextMonth ?? "Mes siguiente"}
      >
        {CHEVRON_RIGHT}
      </NavButton>
    </div>
  );
}

CalendarHeader.displayName = "CalendarHeader";
