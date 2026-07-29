import { cleanup, render, screen } from "../../../__tests__/render.js";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FIELD_SURFACES } from "../../../styles/field-surface.js";
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

  it("resuelve una clase distinta por cada superficie y outline es el default", () => {
    const ClassOf = (node: HTMLElement): string => node.parentElement?.className ?? "";

    const { unmount } = render(<TextInput label="Base" />);
    const implicit = ClassOf(screen.getByLabelText("Base"));
    unmount();

    const seen = new Map<string, string>();
    for (const surface of FIELD_SURFACES) {
      const view = render(<TextInput label="S" surface={surface} />);
      seen.set(surface, ClassOf(screen.getByLabelText("S")));
      view.unmount();
    }

    expect(seen.get("outline")).toBe(implicit);
    expect(new Set(seen.values()).size).toBe(FIELD_SURFACES.length);
  });
});
