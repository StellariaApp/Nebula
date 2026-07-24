import { cleanup, render, screen } from "../../../__tests__/render.js";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Checkbox } from "../Checkbox.js";
import { CheckboxGroup } from "../Group.js";

afterEach(cleanup);

describe("Checkbox", () => {
  it("renderiza un checkbox accesible por su label", async () => {
    const on_change = vi.fn();
    render(<Checkbox label="Acepto" onChange={on_change} />);
    const box = screen.getByRole("checkbox", { name: "Acepto" });
    await userEvent.click(box);
    expect(on_change).toHaveBeenCalledWith(true);
  });

  it("se activa con teclado (Space)", async () => {
    const on_change = vi.fn();
    render(<Checkbox label="X" onChange={on_change} />);
    await userEvent.tab();
    await userEvent.keyboard(" ");
    expect(on_change).toHaveBeenCalledWith(true);
  });

  it("en grupo gestiona un array de valores", async () => {
    const on_change = vi.fn();
    render(
      <CheckboxGroup label="Frutas" onChange={on_change}>
        <Checkbox value="a" label="Manzana" />
        <Checkbox value="b" label="Banana" />
      </CheckboxGroup>,
    );
    await userEvent.click(screen.getByRole("checkbox", { name: "Banana" }));
    expect(on_change).toHaveBeenCalledWith(["b"]);
    expect(screen.getByRole("group", { name: "Frutas" })).toBeDefined();
  });
});
