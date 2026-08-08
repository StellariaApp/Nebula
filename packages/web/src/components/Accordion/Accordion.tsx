"use client";

import { useId, useMemo, useRef, type KeyboardEvent, type ReactElement } from "react";

import { useTheme, useUncontrolled } from "@stellaria/nebula-hooks";
import { m, useReducedMotion } from "motion/react";

import { Spring } from "../../utils/motion.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Collapse } from "../Collapse/Collapse.js";

import * as styles from "./Accordion.css.js";
import type { AccordionProps, AccordionValue } from "./Accordion.types.js";
import { ChevronDown } from "../../glyphs/index.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

const CHEVRON = <ChevronDown />;

function ToList(value: string | readonly string[] | undefined): string[] {
  if (value === undefined) return [];
  return typeof value === "string" ? [value] : [...value];
}

export function Accordion<Multiple extends boolean = false>(
  props: AccordionProps<Multiple>,
): ReactElement {
  const {
    data,
    multiple,
    value,
    defaultValue,
    onChange,
    disabled = false,
    chevronPosition = "end",
    className,
    itemProps,
    triggerProps,
    iconProps,
    labelProps,
    panelProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const is_multiple = multiple === true;

  const base_id = useId();
  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();
  const chevron_transition = Spring("default", { theme, reduced: prefers_reduced === true });

  const controlled = useMemo(() => (value === undefined ? undefined : ToList(value)), [value]);
  const initial = useMemo(() => ToList(defaultValue), [defaultValue]);

  const Emit = (next: string[]): void => {
    if (onChange === undefined) return;
    onChange((is_multiple ? next : next[0]) as AccordionValue<Multiple>);
  };

  const [open, set_open] = useUncontrolled<string[]>(controlled, initial, Emit);

  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  const Enabled = (index: number): boolean => {
    const item = data[index];
    return item !== undefined && item.disabled !== true && !disabled;
  };

  const Toggle = (item_value: string): void => {
    const is_open = open.includes(item_value);
    if (is_multiple) {
      set_open(is_open ? open.filter((entry) => entry !== item_value) : [...open, item_value]);
      return;
    }
    set_open(is_open ? [] : [item_value]);
  };

  const Step = (from: number, direction: 1 | -1): number => {
    const total = data.length;
    for (let step = 1; step <= total; step += 1) {
      const next = (from + direction * step + total * total) % total;
      if (Enabled(next)) return next;
    }
    return from;
  };

  const HandleKeyDown =
    (index: number) =>
    (event: KeyboardEvent<HTMLButtonElement>): void => {
      const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowDown") next = Step(index, 1);
      if (event.key === "ArrowUp") next = Step(index, -1);
      if (event.key === "Home") next = Enabled(0) ? 0 : Step(0, 1);
      if (event.key === "End")
        next = Enabled(data.length - 1) ? data.length - 1 : Step(data.length - 1, -1);
      triggers.current[next]?.focus();
    };

  return (
    <div
      className={cx(styles.root, sprinkle_class, className)}
      style={sprinkle_style}
      data-disabled={disabled ? "true" : undefined}
    >
      {data.map((item, index) => {
        const item_disabled = disabled || item.disabled === true;
        const is_open = open.includes(item.value);
        const trigger_id = `${base_id}-trigger-${item.value}`;
        const panel_id = `${base_id}-panel-${item.value}`;

        return (
          <Box key={item.value} {...itemProps} className={cx(styles.item, itemProps?.className)}>
            <h3>
              <button
                ref={(node) => {
                  triggers.current[index] = node;
                }}
                type="button"

                disabled={item_disabled}
                data-open={is_open ? "true" : undefined}
                {...triggerProps}
                id={trigger_id}
                aria-expanded={is_open}
                aria-controls={panel_id}
                onClick={() => {
                  Toggle(item.value);
                }}
                onKeyDown={HandleKeyDown(index)}
                className={cx(styles.trigger, triggerProps?.className)}
              >
                {chevronPosition === "start" ? (
                  <m.span
                    className={styles.chevron}
                    animate={{ rotate: is_open ? 180 : 0 }}
                    transition={chevron_transition}
                  >
                    {CHEVRON}
                  </m.span>
                ) : null}
                {item.icon === undefined || item.icon === null ? null : (
                  <Box
                    component="span"
                    aria-hidden="true"
                    {...iconProps}
                    className={cx(styles.icon, iconProps?.className)}
                  >
                    {item.icon}
                  </Box>
                )}
                <Text
                  component="span"
                  {...labelProps}
                  className={cx(styles.label, labelProps?.className)}
                >
                  {item.label}
                </Text>
                {chevronPosition === "end" ? (
                  <m.span
                    className={styles.chevron}
                    animate={{ rotate: is_open ? 180 : 0 }}
                    transition={chevron_transition}
                  >
                    {CHEVRON}
                  </m.span>
                ) : null}
              </button>
            </h3>
            <Collapse in={is_open}>
              <Box
                {...panelProps}
                id={panel_id}
                aria-labelledby={trigger_id}
                className={cx(styles.panel, panelProps?.className)}
              >
                {item.content}
              </Box>
            </Collapse>
          </Box>
        );
      })}
    </div>
  );
}

Accordion.displayName = "Accordion";
