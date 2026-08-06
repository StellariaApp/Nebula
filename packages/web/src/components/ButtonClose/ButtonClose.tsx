"use client";

import { forwardRef } from "react";

import { ActionIcon } from "../ActionIcon/ActionIcon.js";

import type { ButtonCloseProps } from "./ButtonClose.types.js";
import { Close } from "../../glyphs/index.js";

const CLOSE_ICON = <Close />;

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
