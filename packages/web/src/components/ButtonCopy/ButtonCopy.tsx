"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

import { ActionIcon } from "../ActionIcon/ActionIcon.js";

import type { ButtonCopyProps } from "./ButtonCopy.types.js";
import { Check, Clipboard } from "../../glyphs/index.js";

const COPY_ICON = <Clipboard />;

const CHECK_ICON = <Check />;

export const ButtonCopy = forwardRef<HTMLButtonElement, ButtonCopyProps>(
  function ButtonCopy(props, ref) {
    const {
      value,
      timeout = 1500,
      copyIcon = COPY_ICON,
      copiedIcon = CHECK_ICON,
      copyLabel = "Copy",
      copiedLabel = "Copied",
      variant = "light",
      color = "gray",
      ...rest
    } = props;

    const [copied, set_copied] = useState(false);
    const timer_ref = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
      return () => {
        if (timer_ref.current) clearTimeout(timer_ref.current);
      };
    }, []);

    const HandleCopy = useCallback(() => {
      void navigator.clipboard.writeText(value).then(() => {
        set_copied(true);
        if (timer_ref.current) clearTimeout(timer_ref.current);
        timer_ref.current = setTimeout(() => {
          set_copied(false);
        }, timeout);
      });
    }, [value, timeout]);

    return (
      <ActionIcon
        ref={ref}
        variant={variant}
        color={copied ? "success" : color}
        {...rest}
        onPress={HandleCopy}
        aria-label={copied ? copiedLabel : copyLabel}
      >
        {copied ? copiedIcon : copyIcon}
      </ActionIcon>
    );
  },
);

ButtonCopy.displayName = "ButtonCopy";
