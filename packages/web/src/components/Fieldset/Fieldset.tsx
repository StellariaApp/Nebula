import { forwardRef, useId } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Fieldset.css.js";
import type { FieldsetProps } from "./Fieldset.types.js";
import { Text } from "../Text/Text.js";

export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(
  function Fieldset(props, ref) {
    const {
      legend,
      description,
      surface = "outline",
      disabled = false,
      children,
      className,
      legendProps,
      descriptionProps,
      ...rest_and_style
    } = props;
    const {
      className: sprinkle_class,
      style: sprinkle_style,
      rest,
    } = ExtractStyleProps(rest_and_style);

    const auto_id = useId();
    const description_id = `${auto_id}-description`;

    return (
      <fieldset
        {...rest}
        ref={ref}
        className={cx(styles.root({ surface }), sprinkle_class, className)}
        style={sprinkle_style}
        disabled={disabled}
        aria-describedby={
          description === undefined || description === null ? undefined : description_id
        }
      >
        {legend === undefined || legend === null ? null : (
          <Text
            component="legend"
            {...legendProps}
            className={cx(styles.legend, legendProps?.className)}
          >
            {legend}
          </Text>
        )}
        {description === undefined || description === null ? null : (
          <Text
            id={description_id}
            {...descriptionProps}
            className={cx(styles.description, descriptionProps?.className)}
          >
            {description}
          </Text>
        )}
        {children}
      </fieldset>
    );
  },
);

Fieldset.displayName = "Fieldset";
