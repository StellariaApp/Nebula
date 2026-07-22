"use client";

import { forwardRef, useRef, type MouseEvent as ReactMouseEvent } from "react";

import { mergeProps, useButton, useFocusRing, useHover, useObjectRef } from "react-aria";

import { cx } from "../../utils/style-props.js";

import * as styles from "./UnstyledButton.css.js";
import type { UnstyledButtonProps } from "./UnstyledButton.types.js";

export const UnstyledButton = forwardRef<HTMLButtonElement, UnstyledButtonProps>(
  function UnstyledButton(props, forwardedRef) {
    const { disabled = false, className, onClick, onPress, type, children, ...dom_rest } = props;

    const local_ref = useRef<HTMLButtonElement>(null);
    const ref = useObjectRef(forwardedRef ?? local_ref);

    const { buttonProps, isPressed } = useButton(
      {
        isDisabled: disabled,
        elementType: "button",
        type: type ?? "button",
        ...(onClick === undefined
          ? {}
          : {
              onClick: (event: ReactMouseEvent<Element>) => {
                onClick(event as ReactMouseEvent<HTMLButtonElement>);
              },
            }),
        ...(onPress === undefined ? {} : { onPress }),
      },
      ref,
    );
    const { hoverProps, isHovered } = useHover({ isDisabled: disabled });
    const { focusProps, isFocusVisible } = useFocusRing();

    const dom_props = mergeProps(buttonProps, hoverProps, focusProps, dom_rest);

    return (
      <button
        {...dom_props}
        ref={ref}
        className={cx(styles.unstyled, className)}
        data-hovered={isHovered ? "true" : undefined}
        data-pressed={isPressed ? "true" : undefined}
        data-focus-visible={isFocusVisible ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
      >
        {children}
      </button>
    );
  },
);

UnstyledButton.displayName = "UnstyledButton";
