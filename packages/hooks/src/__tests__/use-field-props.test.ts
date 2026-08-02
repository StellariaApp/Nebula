import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { NebulaField } from "@stellaria/nebula-tokens";

import { useFieldProps } from "../use-field-props.js";

afterEach(() => {
  vi.restoreAllMocks();
});

function MakeField(overrides: Partial<NebulaField<string>> = {}): NebulaField<string> {
  return {
    value: "hola",
    setValue: vi.fn(),
    status: "idle",
    error: undefined,
    touched: false,
    ...overrides,
  };
}

describe("useFieldProps", () => {
  it("lee value/onChange del field cuando se pasa", () => {
    const field = MakeField({ value: "abc" });
    const { result } = renderHook(() => useFieldProps({ field, defaultValue: "" }));
    expect(result.current.value).toBe("abc");
    result.current.onChange("nuevo");
    expect(field.setValue).toHaveBeenCalledWith("nuevo");
  });

  it("usa el valor controlado cuando no hay field", () => {
    const on_change = vi.fn();
    const { result } = renderHook(() =>
      useFieldProps({ value: "x", defaultValue: "", onChange: on_change }),
    );
    expect(result.current.value).toBe("x");
    expect(result.current.status).toBe("idle");
  });

  it("marca inválido y expone el mensaje del field solo si touched + invalid", () => {
    const touched_invalid = MakeField({ status: "invalid", error: "requerido", touched: true });
    const { result } = renderHook(() =>
      useFieldProps({ field: touched_invalid, defaultValue: "" }),
    );
    expect(result.current.isInvalid).toBe(true);
    expect(result.current.errorMessage).toBe("requerido");

    const untouched = MakeField({ status: "invalid", error: "requerido", touched: false });
    const { result: r2 } = renderHook(() => useFieldProps({ field: untouched, defaultValue: "" }));
    expect(r2.current.isInvalid).toBe(false);
    expect(r2.current.errorMessage).toBeUndefined();
  });

  it("el error explícito (string) tiene prioridad", () => {
    const { result } = renderHook(() =>
      useFieldProps({ value: "", defaultValue: "", error: "campo obligatorio" }),
    );
    expect(result.current.isInvalid).toBe(true);
    expect(result.current.errorMessage).toBe("campo obligatorio");
  });

  it("error=true marca inválido sin mensaje", () => {
    const { result } = renderHook(() =>
      useFieldProps({ value: "", defaultValue: "", error: true }),
    );
    expect(result.current.isInvalid).toBe(true);
    expect(result.current.errorMessage).toBeUndefined();
  });
});
