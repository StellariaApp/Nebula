"use client";

import { type ReactElement } from "react";

import { FocusScope } from "react-aria";

import type { FocusTrapProps } from "./FocusTrap.types.js";

export function FocusTrap(props: FocusTrapProps): ReactElement {
  const { active = true, restoreFocus = false, autoFocus = false, children } = props;
  return (
    <FocusScope contain={active} restoreFocus={restoreFocus} autoFocus={autoFocus}>
      {children}
    </FocusScope>
  );
}

FocusTrap.displayName = "FocusTrap";
