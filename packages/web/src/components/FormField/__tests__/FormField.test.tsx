import { cleanup, render, screen } from "../../../__tests__/render.js";
import { afterEach, describe, expect, it } from "vitest";

import { FormField } from "../FormField.js";

afterEach(cleanup);

describe("FormField", () => {
  it("vincula el label al control por htmlFor/id", () => {
    render(
      <FormField label="Correo">
        {(control) => <input {...control} data-testid="input" />}
      </FormField>,
    );
    const input = screen.getByTestId("input");
    const label = screen.getByText("Correo");
    expect(label.getAttribute("for")).toBe(input.id);
  });

  it("referencia description y error por aria-describedby (errorDisplay=text)", () => {
    render(
      <FormField label="Clave" description="8+ caracteres" error="Muy corta" errorDisplay="text">
        {(control) => <input {...control} data-testid="input" />}
      </FormField>,
    );
    const input = screen.getByTestId("input");
    const described = input.getAttribute("aria-describedby") ?? "";
    const description = screen.getByText("8+ caracteres");
    const error = screen.getByRole("alert");
    expect(described.split(" ").length).toBe(2);
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(description.parentElement?.contains(screen.getByText("Clave"))).toBe(true);
    expect(error.parentElement?.contains(input)).toBe(true);
  });

  it("el error se anuncia con role=alert", () => {
    render(
      <FormField label="X" error="Error visible">
        {(control) => <input {...control} />}
      </FormField>,
    );
    expect(screen.getByRole("alert").textContent).toBe("Error visible");
  });

  it("required marca aria-required y el asterisco", () => {
    render(
      <FormField label="Nombre" required>
        {(control) => <input {...control} data-testid="input" />}
      </FormField>,
    );
    expect(screen.getByTestId("input").getAttribute("aria-required")).toBe("true");
  });

  it("error=true marca inválido sin mensaje", () => {
    render(
      <FormField label="X" error>
        {(control) => <input {...control} data-testid="input" />}
      </FormField>,
    );
    expect(screen.getByTestId("input").getAttribute("aria-invalid")).toBe("true");
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
