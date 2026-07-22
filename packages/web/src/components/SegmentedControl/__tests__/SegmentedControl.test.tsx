import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SegmentedControl } from "../SegmentedControl.js";

afterEach(cleanup);

describe("SegmentedControl", () => {
  it("es un radiogroup y selecciona por opción", async () => {
    const on_change = vi.fn();
    render(
      <SegmentedControl
        aria-label="Vista"
        data={["Lista", "Cuadrícula"]}
        onChange={on_change}
      />,
    );
    expect(screen.getByRole("radiogroup", { name: "Vista" })).toBeDefined();
    await userEvent.click(screen.getByRole("radio", { name: "Cuadrícula" }));
    expect(on_change).toHaveBeenCalledWith("Cuadrícula");
  });

  it("marca el segmento activo por defecto", () => {
    render(<SegmentedControl data={[{ value: "d", label: "Día" }, { value: "n", label: "Noche" }]} defaultValue="n" />);
    expect(screen.getByRole<HTMLInputElement>("radio", { name: "Noche" }).checked).toBe(true);
  });
});
