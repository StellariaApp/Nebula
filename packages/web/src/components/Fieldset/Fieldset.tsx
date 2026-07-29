import { forwardRef, useId } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Fieldset.css.js";
import type { FieldsetProps } from "./Fieldset.types.js";

export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(
  function Fieldset(props, ref) {
    const {
      legend,
      description,
      variant = "default",
      disabled = false,
      children,
      className,
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
        className={cx(styles.root({ variant }), sprinkle_class, className)}
        style={sprinkle_style}
        disabled={disabled}
        aria-describedby={
          description === undefined || description === null ? undefined : description_id
        }
      >
        {legend === undefined || legend === null ? null : (
          <legend className={styles.legend}>{legend}</legend>
        )}
        {description === undefined || description === null ? null : (
          <p id={description_id} className={styles.description}>
            {description}
          </p>
        )}
        {children}
      </fieldset>
    );
  },
);

Fieldset.displayName = "Fieldset";
