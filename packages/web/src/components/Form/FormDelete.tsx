"use client";

import type { ReactElement } from "react";

import { Alert } from "../Alert/Alert.js";
import { Button } from "../Button/Button.js";

import { FormContent, FormFooter, FormRoot } from "./Form.js";
import type { FormDeleteProps } from "./FormDelete.types.js";

export function FormDelete(props: FormDeleteProps): ReactElement {
  const {
    children,
    alert,
    onSubmit,
    onCancel,
    isPending = false,
    disabled = false,
    submitText = "Delete",
    cancelText = "Cancel",
    error,
    className,
    ...style_rest
  } = props;

  return (
    <FormRoot
      color="error"
      isPending={isPending}
      disabled={disabled}
      {...(onSubmit === undefined ? {} : { onSubmit })}
      {...(className === undefined ? {} : { className })}
      {...style_rest}
    >
      {alert === undefined ? null : (
        <Alert variant="light" color="error" title={alert.title}>
          {alert.description}
        </Alert>
      )}
      {children === undefined ? null : <FormContent>{children}</FormContent>}
      <FormFooter error={error}>
        {onCancel === undefined ? null : (
          <Button variant="ghost" color="gray" onPress={onCancel} disabled={isPending}>
            {cancelText}
          </Button>
        )}
        <Button
          type="submit"
          variant="filled"
          color="error"
          loading={isPending}
          disabled={disabled}
        >
          {submitText}
        </Button>
      </FormFooter>
    </FormRoot>
  );
}

FormDelete.displayName = "FormDelete";
