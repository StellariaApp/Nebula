"use client";

import { useId, useMemo, useRef, type KeyboardEvent, type ReactElement } from "react";

import { useTheme, useUncontrolled } from "@stellaria/nebula-hooks";
import { m, useReducedMotion } from "motion/react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Collapse } from "../Collapse/Collapse.js";

import * as styles from "./Accordion.css.js";
import type { AccordionProps } from "./Accordion.types.js";

const CHEVRON = (
  <svg
    viewBox="0 0 24 24"
    width="1.1em"
    height="1.1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const EMPTY: readonly string[] = [];

export function Accordion(props: AccordionProps): ReactElement {
  const {
    data,
    multiple = false,
    value,
    defaultValue = EMPTY,
    onChange,
    disabled = false,
    chevronPosition = "end",
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const base_id = useId();
  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();
  const is_off = prefers_reduced === true || theme.motion.tier === "minimal";
  const spring = theme.motion.spring.default;

  const controlled = useMemo(() => (value === undefined ? undefined : [...value]), [value]);
  const initial = useMemo(() => [...defaultValue], [defaultValue]);
  const [open, set_open] = useUncontrolled<string[]>(controlled, initial, onChange);

  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  const Enabled = (index: number): boolean => {
    const item = data[index];
    return item !== undefined && item.disabled !== true && !disabled;
  };

  const Toggle = (item_value: string): void => {
    const is_open = open.includes(item_value);
    if (multiple) {
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
          <div key={item.value} className={styles.item}>
            <h3>
              <button
                ref={(node) => {
                  triggers.current[index] = node;
                }}
                type="button"
                id={trigger_id}
                className={styles.trigger}
                aria-expanded={is_open}
                aria-controls={panel_id}
                disabled={item_disabled}
                data-open={is_open ? "true" : undefined}
                onClick={() => {
                  Toggle(item.value);
                }}
                onKeyDown={HandleKeyDown(index)}
              >
                {chevronPosition === "start" ? (
                  <m.span
                    className={styles.chevron}
                    animate={{ rotate: is_open ? 180 : 0 }}
                    transition={
                      is_off
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: spring.stiffness,
                            damping: spring.damping,
                            mass: spring.mass,
                          }
                    }
                  >
                    {CHEVRON}
                  </m.span>
                ) : null}
                {item.icon === undefined || item.icon === null ? null : (
                  <span className={styles.icon} aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                <span className={styles.label}>{item.label}</span>
                {chevronPosition === "end" ? (
                  <m.span
                    className={styles.chevron}
                    animate={{ rotate: is_open ? 180 : 0 }}
                    transition={
                      is_off
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: spring.stiffness,
                            damping: spring.damping,
                            mass: spring.mass,
                          }
                    }
                  >
                    {CHEVRON}
                  </m.span>
                ) : null}
              </button>
            </h3>
            <Collapse in={is_open}>
              <div
                id={panel_id}
                role="region"
                aria-labelledby={trigger_id}
                className={styles.panel}
              >
                {item.content}
              </div>
            </Collapse>
          </div>
        );
      })}
    </div>
  );
}

Accordion.displayName = "Accordion";
