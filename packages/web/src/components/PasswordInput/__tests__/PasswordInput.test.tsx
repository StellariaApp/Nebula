import { cleanup, render, screen } from "../../../__tests__/render.js";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { PasswordInput } from "../PasswordInput.js";

afterEach(cleanup);

describe("PasswordInput", () => {
  it("oculta el valor por defecto y lo revela con el toggle", async () => {
    render(<PasswordInput label="Clave" defaultValue="secreto" />);
    const input = screen.getByLabelText<HTMLInputElement>("Clave");
    expect(input.type).toBe("password");
    const toggle = screen.getByRole("button", { name: "Mostrar contraseña" });
    await userEvent.click(toggle);
    expect(input.type).toBe("text");
    expect(screen.getByRole("button", { name: "Ocultar contraseña" })).toBeDefined();
  });
});
