import { cleanup, render, screen } from "../../../__tests__/render.js";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Switch } from "../Switch.js";

afterEach(cleanup);

describe("Switch", () => {
  it("expone role=switch y alterna su estado", async () => {
    const on_change = vi.fn();
    render(<Switch label="Notificaciones" onChange={on_change} />);
    const control = screen.getByRole("switch", { name: "Notificaciones" });
    await userEvent.click(control);
    expect(on_change).toHaveBeenCalledWith(true);
  });

  it("se activa con teclado", async () => {
    const on_change = vi.fn();
    render(<Switch label="X" onChange={on_change} />);
    await userEvent.tab();
    await userEvent.keyboard(" ");
    expect(on_change).toHaveBeenCalledWith(true);
  });
});
