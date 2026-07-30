"use client";

import { createContext, useContext } from "react";

import type { FormContextValue } from "./Form.types.js";

export const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext(): FormContextValue {
  const value = useContext(FormContext);
  if (value === null) {
    throw new Error("Los subcomponentes de Form solo funcionan dentro de <Form>.");
  }
  return value;
}
