"use client";

import { forwardRef } from "react";

import { ActionIcon } from "../ActionIcon/ActionIcon.js";

import type { ButtonCloseProps } from "./ButtonClose.types.js";

const CLOSE_ICON = (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const ButtonClose = forwardRef<HTMLButtonElement, ButtonCloseProps>(
  function ButtonClose(props, ref) {
    const { variant = "ghost", color = "gray", ...rest } = props;
    const aria_label = props["aria-label"] ?? "Cerrar";

    return (
      <ActionIcon ref={ref} variant={variant} color={color} {...rest} aria-label={aria_label}>
        {CLOSE_ICON}
      </ActionIcon>
    );
  },
);

ButtonClose.displayName = "ButtonClose";
