import { afterEach, describe, expect, it } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen } from "../../../__tests__/render.js";

import { FormField } from "../FormField.js";

afterEach(cleanup);

describe("FormField · accesibilidad", () => {
  it("etiqueta, descripción, requerido y error en texto: sin violaciones de axe", async () => {
    const { container } = render(
      <>
        <FormField label="Correo" description="Usa tu correo de trabajo">
          {(control) => <input {...control} />}
        </FormField>
        <FormField label="Clave" required error="Muy corta" errorDisplay="text">
          {(control) => <input type="password" {...control} />}
        </FormField>
      </>,
    );
    await ExpectNoViolations(container);
  });

  it("la etiqueta nombra al control y el error en texto se anuncia y lo describe", () => {
    render(
      <FormField label="Clave" error="Muy corta" errorDisplay="text">
        {(control) => <input type="password" {...control} />}
      </FormField>,
    );
    const input = screen.getByLabelText("Clave");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("alert").textContent).toBe("Muy corta");
    expect(input.getAttribute("aria-describedby")).toContain(screen.getByRole("alert").id);
  });

  it("el asterisco de requerido es decorativo: el atributo lo comunica", () => {
    render(
      <FormField label="Nombre" required>
        {(control) => <input {...control} />}
      </FormField>,
    );
    expect(screen.getByText("*").getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByLabelText(/Nombre/).getAttribute("aria-required")).toBe("true");
  });
});
