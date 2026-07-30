"use client";

import type { ReactElement } from "react";

import { Alert } from "../Alert/Alert.js";
import { Button } from "../Button/Button.js";

import { Form } from "./Form.js";
import type { FormDeleteProps } from "./FormDelete.types.js";

export function FormDelete(props: FormDeleteProps): ReactElement {
  const {
    children,
    alert,
    onSubmit,
    onCancel,
    isPending = false,
    disabled = false,
    submitText = "Eliminar",
    cancelText = "Cancelar",
    error,
    className,
    ...style_rest
  } = props;

  return (
    <Form
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
      {children === undefined ? null : <Form.Content>{children}</Form.Content>}
      <Form.Footer error={error}>
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
      </Form.Footer>
    </Form>
  );
}

FormDelete.displayName = "FormDelete";
