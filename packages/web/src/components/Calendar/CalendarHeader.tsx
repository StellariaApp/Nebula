"use client";

import { useRef, type ComponentPropsWithoutRef, type ReactElement } from "react";

import { useButton, useFocusRing, mergeProps } from "react-aria";
import type { AriaButtonProps } from "react-aria";

import type { Size } from "@stellaria/nebula-tokens";

import { cx } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

import * as styles from "./Calendar.css.js";
import type { CalendarLabels, CalendarSlotProps } from "./Calendar.types.js";
import { ChevronLeft, ChevronRight } from "../../glyphs/index.js";

const CHEVRON_LEFT = <ChevronLeft />;

const CHEVRON_RIGHT = <ChevronRight />;

interface NavButtonProps {
  buttonProps: AriaButtonProps<"button">;
  size: Size;
  label: string;
  slotProps: ComponentPropsWithoutRef<"button"> | undefined;
  children: ReactElement;
}

function NavButton(props: NavButtonProps): ReactElement {
  const { buttonProps, size, label, slotProps, children } = props;
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps: dom } = useButton(buttonProps, ref);
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <button
      {...mergeProps(dom, focusProps)}
      ref={ref}
      type="button"
      aria-label={label}
      data-focus-visible={isFocusVisible ? "true" : undefined}
      {...slotProps}
      className={cx(styles.nav, styles.nav_size[size], slotProps?.className)}
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
  slots?: CalendarSlotProps | undefined;
}

export function CalendarHeader(props: CalendarHeaderProps): ReactElement {
  const { title, size, prevButtonProps, nextButtonProps, labels, slots } = props;

  return (
    <Box {...slots?.headerProps} className={cx(styles.header, slots?.headerProps?.className)}>
      <NavButton
        buttonProps={prevButtonProps}
        size={size}
        label={labels?.previousMonth ?? "Mes anterior"}
        slotProps={slots?.previousProps}
      >
        {CHEVRON_LEFT}
      </NavButton>
      <Text
        component="h2"
        {...slots?.headingProps}
        className={cx(styles.heading, slots?.headingProps?.className)}
      >
        {title}
      </Text>
      <NavButton
        buttonProps={nextButtonProps}
        size={size}
        label={labels?.nextMonth ?? "Mes siguiente"}
        slotProps={slots?.nextProps}
      >
        {CHEVRON_RIGHT}
      </NavButton>
    </Box>
  );
}

CalendarHeader.displayName = "CalendarHeader";
