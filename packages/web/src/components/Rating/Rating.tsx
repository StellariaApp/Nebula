"use client";

import { useState, type ReactElement, type ReactNode } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveAccent } from "../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { FormField } from "../FormField/FormField.js";

import * as styles from "./Rating.css.js";
import { ratingColor } from "./Rating.vars.css.js";
import type { RatingProps } from "./Rating.types.js";

const STAR = (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden="true">
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01z" />
  </svg>
);

const EMPTY_STAR = (
  <svg
    viewBox="0 0 24 24"
    width="100%"
    height="100%"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01z" />
  </svg>
);

function Round(value: number, fractions: number): number {
  return Math.round(value * fractions) / fractions;
}

export function Rating(props: RatingProps): ReactElement {
  const {
    label,
    description,
    error,
    errorDisplay = "tooltip",
    required = false,
    disabled = false,
    readOnly = false,
    size = "md",
    color = "warning",
    count = 5,
    fractions = 1,
    field: nebula_field,
    value,
    defaultValue = 0,
    onChange,
    onHoverChange,
    emptySymbol,
    fullSymbol,
    itemLabel,
    name,
    className,
    rootClassName,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const fp = useFieldProps<number>({
    field: nebula_field,
    value,
    defaultValue,
    onChange,
    error,
    disabled,
    required,
  });

  const [hovered, set_hovered] = useState<number | null>(null);
  const displayed = hovered ?? fp.value;
  const form_error = fp.errorMessage ?? (fp.isInvalid ? true : undefined);
  const interactive = !fp.isDisabled && !readOnly;
  const css_vars = assignInlineVars({ [ratingColor]: ResolveAccent(color, "500") });

  const Hover = (next: number | null): void => {
    if (!interactive) return;
    set_hovered(next);
    if (next !== null) onHoverChange?.(next);
  };

  const Label = (index: number): string =>
    itemLabel === undefined ? `${String(index)} de ${String(count)}` : itemLabel(index);

  const Symbol = (filled: boolean): ReactNode => {
    if (filled) return fullSymbol ?? STAR;
    return emptySymbol ?? EMPTY_STAR;
  };

  return (
    <FormField
      label={label}
      description={description}
      error={form_error}
      errorDisplay={errorDisplay}
      status={fp.status}
      required={required}
      className={cx(sprinkle_class, rootClassName)}
      style={sprinkle_style}
    >
      {({ id, ...control }) => (
        <div
          {...control}
          id={id}
          role={readOnly ? "img" : "radiogroup"}
          aria-label={readOnly ? `${String(fp.value)} de ${String(count)}` : undefined}
          className={cx(styles.group, className)}
          style={css_vars}
          data-disabled={fp.isDisabled ? "true" : undefined}
          onMouseLeave={() => {
            Hover(null);
          }}
        >
          {name === undefined ? null : <input type="hidden" name={name} value={String(fp.value)} />}
          {[...new Array(count).keys()].map((index) => {
            const position = index + 1;
            const filled = displayed >= position;
            const ratio = Math.min(1, Math.max(0, displayed - index));
            const partial = !filled && ratio > 0;

            if (readOnly) {
              return (
                <span
                  key={position}
                  className={cx(styles.item, styles.itemSize[size])}
                  data-active={filled ? "true" : undefined}
                  data-readonly="true"
                  aria-hidden="true"
                >
                  {Symbol(filled)}
                  {partial ? (
                    <span className={styles.partial} style={{ width: `${String(ratio * 100)}%` }}>
                      {Symbol(true)}
                    </span>
                  ) : null}
                </span>
              );
            }

            return (
              <button
                key={position}
                type="button"
                role="radio"
                aria-checked={Round(fp.value, fractions) === position}
                aria-label={Label(position)}
                className={cx(styles.item, styles.itemSize[size])}
                disabled={fp.isDisabled}
                data-active={filled ? "true" : undefined}
                data-disabled={fp.isDisabled ? "true" : undefined}
                onClick={() => {
                  fp.onChange(position);
                }}
                onMouseEnter={() => {
                  Hover(position);
                }}
                onFocus={() => {
                  Hover(position);
                }}
                onBlur={() => {
                  Hover(null);
                }}
              >
                {Symbol(filled)}
                {partial ? (
                  <span className={styles.partial} style={{ width: `${String(ratio * 100)}%` }}>
                    {Symbol(true)}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </FormField>
  );
}

Rating.displayName = "Rating";
