import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen } from "../../../__tests__/render.js";

import { TextInput } from "../TextInput.js";

afterEach(cleanup);

describe("TextInput · accesibilidad", () => {
  it("con etiqueta, descripción, requerido, error y deshabilitado: sin violaciones de axe", async () => {
    const { container } = render(
      <>
        <TextInput label="Nombre" description="Como aparece en tu INE" />
        <TextInput label="Correo" required error="Formato inválido" />
        <TextInput label="Teléfono" disabled />
      </>,
    );
    await ExpectNoViolations(container);
  });

  it("la descripción y el error cuelgan del campo por aria-describedby", () => {
    render(
      <TextInput
        label="Correo"
        description="Usa tu correo de trabajo"
        error="Formato inválido"
        errorDisplay="text"
      />,
    );
    const input = screen.getByLabelText("Correo");
    const described = (input.getAttribute("aria-describedby") ?? "").split(" ");
    const texts = described.map((id) => document.getElementById(id)?.textContent);
    expect(texts).toContain("Usa tu correo de trabajo");
    expect(texts).toContain("Formato inválido");
    expect(input.getAttribute("aria-invalid")).toBe("true");
  });

  it("con la burbuja por defecto el error se anuncia como alert y el campo queda inválido", () => {
    render(<TextInput label="Correo" error="Formato inválido" />);
    expect(screen.getByRole("alert").textContent).toBe("Formato inválido");
    expect(screen.getByLabelText("Correo").getAttribute("aria-invalid")).toBe("true");
  });

  it("requerido marca el campo para tecnologías de apoyo", () => {
    render(<TextInput label="Correo" required />);
    expect(screen.getByLabelText(/Correo/).hasAttribute("required")).toBe(true);
  });

  it("el foco entra con Tab y deshabilitado se salta", async () => {
    const user = userEvent.setup();
    render(
      <>
        <TextInput label="Uno" disabled />
        <TextInput label="Dos" />
      </>,
    );
    await user.tab();
    expect(document.activeElement).toBe(screen.getByLabelText("Dos"));
  });
});
