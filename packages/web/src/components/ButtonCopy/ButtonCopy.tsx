"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

import { ActionIcon } from "../ActionIcon/ActionIcon.js";

import type { ButtonCopyProps } from "./ButtonCopy.types.js";

const COPY_ICON = (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </svg>
);

const CHECK_ICON = (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12l5 5L20 7" />
  </svg>
);

export const ButtonCopy = forwardRef<HTMLButtonElement, ButtonCopyProps>(
  function ButtonCopy(props, ref) {
    const {
      value,
      timeout = 1500,
      copyIcon = COPY_ICON,
      copiedIcon = CHECK_ICON,
      copyLabel = "Copiar",
      copiedLabel = "Copiado",
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
