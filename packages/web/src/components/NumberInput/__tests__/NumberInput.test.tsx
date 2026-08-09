import { cleanup, render, screen } from "../../../__tests__/render.js";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { NumberInput } from "../NumberInput.js";

afterEach(cleanup);

describe("NumberInput", () => {
  it("renderiza un spinbutton (type=number) vinculado al label", () => {
    render(<NumberInput label="Cantidad" defaultValue={3} />);
    const input = screen.getByRole<HTMLInputElement>("spinbutton", { name: "Cantidad" });
    expect(input.value).toBe("3");
  });

  it("incrementa/disminuye con los controles y aplica el clamp", async () => {
    const on_change = vi.fn();
    render(<NumberInput label="N" value={3} onChange={on_change} min={0} max={5} step={1} />);
    await userEvent.click(screen.getByRole("button", { name: "Increase" }));
    expect(on_change).toHaveBeenLastCalledWith(4);
    await userEvent.click(screen.getByRole("button", { name: "Decrease" }));
    expect(on_change).toHaveBeenLastCalledWith(2);
  });

  it("deshabilita el incremento al alcanzar el máximo", () => {
    render(<NumberInput label="N" value={5} onChange={() => undefined} max={5} />);
    expect(screen.getByRole<HTMLButtonElement>("button", { name: "Increase" }).disabled).toBe(
      true,
    );
  });
});
