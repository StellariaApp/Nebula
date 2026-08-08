"use client";

import { useState, type ReactElement, type ReactNode } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveAccent } from "../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
import { FormField } from "../FormField/FormField.js";

import * as styles from "./Rating.css.js";
import * as variables from "./Rating.vars.css.js";
import type { RatingProps } from "./Rating.types.js";
import { Star } from "../../glyphs/index.js";

const STAR = <Star fill="currentColor" stroke="none" />;

const EMPTY_STAR = <Star strokeWidth={1.6} />;

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
    labelProps,
    descriptionProps,
    requiredProps,
    headerProps,
    bodyProps,
    errorProps,
    groupProps,
    itemProps,
    partialProps,
    ...style_rest
  } = props;
  const field_slots = {
    labelProps,
    descriptionProps,
    requiredProps,
    headerProps,
    bodyProps,
    errorProps,
  };
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
  const css_vars = assignInlineVars({ [variables.color]: ResolveAccent(color, "500") });

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
      {...field_slots}
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
        <Box
          {...control}
          id={id}
          role={readOnly ? "img" : "radiogroup"}
          aria-label={readOnly ? `${String(fp.value)} de ${String(count)}` : undefined}
          data-disabled={fp.isDisabled ? "true" : undefined}
          onMouseLeave={() => {
            Hover(null);
          }}
          {...groupProps}
          className={cx(styles.group, className, groupProps?.className)}
          style={{ ...css_vars, ...groupProps?.style }}
        >
          {name === undefined ? null : <input type="hidden" name={name} value={String(fp.value)} />}
          {[...new Array(count).keys()].map((index) => {
            const position = index + 1;
            const filled = displayed >= position;
            const ratio = Math.min(1, Math.max(0, displayed - index));
            const partial = !filled && ratio > 0;

            if (readOnly) {
              return (
                <Box
                  key={position}
                  component="span"
                  data-active={filled ? "true" : undefined}
                  data-readonly="true"
                  aria-hidden="true"
                  {...itemProps}
                  className={cx(styles.item, styles.item_size[size], itemProps?.className)}
                >
                  {Symbol(filled)}
                  {partial ? (
                    <Box
                      component="span"
                      {...partialProps}
                      className={cx(styles.partial, partialProps?.className)}
                      style={{ ...partialProps?.style, width: `${String(ratio * 100)}%` }}
                    >
                      {Symbol(true)}
                    </Box>
                  ) : null}
                </Box>
              );
            }

            return (
              <Box
                key={position}
                component="button"
                type="button"
                role="radio"
                aria-checked={Round(fp.value, fractions) === position}
                aria-label={Label(position)}
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
                {...itemProps}
                className={cx(styles.item, styles.item_size[size], itemProps?.className)}
              >
                {Symbol(filled)}
                {partial ? (
                  <Box
                    component="span"
                    {...partialProps}
                    className={cx(styles.partial, partialProps?.className)}
                    style={{ ...partialProps?.style, width: `${String(ratio * 100)}%` }}
                  >
                    {Symbol(true)}
                  </Box>
                ) : null}
              </Box>
            );
          })}
        </Box>
      )}
    </FormField>
  );
}

Rating.displayName = "Rating";
