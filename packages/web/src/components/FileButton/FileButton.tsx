"use client";

import { useRef, type ChangeEvent, type ReactElement } from "react";

import type { FileButtonPayload, FileButtonProps } from "./FileButton.types.js";

export function FileButton(props: FileButtonProps): ReactElement {
  const { onChange, children, accept, multiple = false, name, capture, disabled = false } = props;

  const input_ref = useRef<HTMLInputElement>(null);

  const Open = (): void => {
    input_ref.current?.click();
  };

  const HandleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    const payload: FileButtonPayload = multiple ? Array.from(files ?? []) : (files?.[0] ?? null);
    onChange(payload);
    event.target.value = "";
  };

  return (
    <>
      {children({ onClick: Open })}
      <input
        ref={input_ref}
        type="file"
        accept={accept}
        multiple={multiple}
        name={name}
        disabled={disabled}
        {...(capture === undefined ? {} : { capture })}
        onChange={HandleChange}
        style={{ display: "none" }}
        aria-hidden="true"
        tabIndex={-1}
      />
    </>
  );
}

FileButton.displayName = "FileButton";
