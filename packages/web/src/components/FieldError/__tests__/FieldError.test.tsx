import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { NebulaField } from "@stellaria/nebula-tokens";

import { FieldError } from "../FieldError.js";

afterEach(cleanup);

function Field(overrides: Partial<NebulaField<string>> = {}): NebulaField<string> {
  return {
    value: "",
    setValue: vi.fn(),
    status: "idle",
    error: undefined,
    touched: false,
    ...overrides,
  };
}

describe("FieldError", () => {
  it("renderiza siempre a sus hijos", () => {
    render(
      <FieldError>
        <input data-testid="control" />
      </FieldError>,
    );
    expect(screen.getByTestId("control")).toBeDefined();
  });

  it("muestra el mensaje con role=alert cuando el field es inválido + touched", () => {
    render(
      <FieldError field={Field({ status: "invalid", error: "requerido", touched: true })}>
        <input />
      </FieldError>,
    );
    const alert = screen.getByRole("alert");
    expect(alert.textContent).toBe("requerido");
    expect(alert.getAttribute("data-open")).toBe("true");
  });

  it("no abre la burbuja si el field es inválido pero no touched", () => {
    render(
      <FieldError field={Field({ status: "invalid", error: "requerido", touched: false })}>
        <input />
      </FieldError>,
    );
    expect(screen.getByRole("alert", { hidden: true }).getAttribute("data-open")).toBeNull();
  });

  it("acepta message/status resueltos por el input", () => {
    render(
      <FieldError message="Correo no válido">
        <input />
      </FieldError>,
    );
    expect(screen.getByRole("alert").textContent).toBe("Correo no válido");
  });

  it("muestra 'Validando…' tras el retardo", async () => {
    render(
      <FieldError field={Field({ status: "validating" })} validatingLabel="Validando…">
        <input />
      </FieldError>,
    );
    expect(screen.getByRole("alert", { hidden: true }).getAttribute("data-open")).toBeNull();
    await waitFor(
      () => {
        expect(screen.getByRole("alert").textContent).toBe("Validando…");
      },
      { timeout: 1500 },
    );
  });
});
