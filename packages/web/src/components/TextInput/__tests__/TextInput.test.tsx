import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TextInput } from "../TextInput.js";

afterEach(cleanup);

describe("TextInput", () => {
  it("vincula el label al input y edita el valor", async () => {
    const on_change = vi.fn();
    render(<TextInput label="Nombre" onChange={on_change} />);
    const input = screen.getByLabelText("Nombre");
    await userEvent.type(input, "Ana");
    expect(on_change).toHaveBeenCalled();
  });

  it("muestra el error con role=alert y marca aria-invalid", () => {
    render(<TextInput label="Correo" error="Formato inválido" />);
    const input = screen.getByLabelText("Correo");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("alert").textContent).toBe("Formato inválido");
  });

  it("lee el estado de un NebulaField (touched + invalid)", () => {
    render(
      <TextInput
        label="Campo"
        field={{
          value: "x",
          setValue: vi.fn(),
          status: "invalid",
          error: "requerido",
          touched: true,
        }}
      />,
    );
    expect(screen.getByLabelText("Campo").getAttribute("value")).toBe("x");
    expect(screen.getByRole("alert").textContent).toBe("requerido");
  });

  it("renderiza secciones laterales", () => {
    render(<TextInput label="X" leftSection={<span data-testid="left">@</span>} />);
    expect(screen.getByTestId("left")).toBeDefined();
  });
});
