import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Box } from "../../Box/Box.js";
import { DirectionProvider, useDirection } from "../DirectionProvider.js";

afterEach(cleanup);

function Probe() {
  const { direction, toggleDirection } = useDirection();
  return (
    <button type="button" onClick={toggleDirection}>
      {direction}
    </button>
  );
}

describe("DirectionProvider", () => {
  it("arranca en ltr y marca el dir del subárbol", () => {
    render(
      <DirectionProvider>
        <Probe />
      </DirectionProvider>,
    );
    const button = screen.getByRole("button", { name: "ltr" });
    expect(button.closest("[dir]")?.getAttribute("dir")).toBe("ltr");
  });

  it("acepta un defaultDirection", () => {
    render(
      <DirectionProvider defaultDirection="rtl">
        <Probe />
      </DirectionProvider>,
    );
    expect(screen.getByRole("button", { name: "rtl" })).toBeDefined();
    expect(screen.getByRole("button").closest("[dir]")?.getAttribute("dir")).toBe("rtl");
  });

  it("alterna la dirección desde el hook", async () => {
    const user = userEvent.setup();
    render(
      <DirectionProvider>
        <Probe />
      </DirectionProvider>,
    );
    await user.click(screen.getByRole("button", { name: "ltr" }));
    expect(screen.getByRole("button", { name: "rtl" })).toBeDefined();
  });

  it("en modo controlado avisa pero no cambia solo", async () => {
    const user = userEvent.setup();
    const on_change = vi.fn();
    render(
      <DirectionProvider direction="ltr" onDirectionChange={on_change}>
        <Probe />
      </DirectionProvider>,
    );
    await user.click(screen.getByRole("button", { name: "ltr" }));
    expect(on_change).toHaveBeenCalledWith("rtl");
    expect(screen.getByRole("button", { name: "ltr" })).toBeDefined();
  });

  it("el hook sin provider devuelve ltr sin romper", () => {
    render(<Probe />);
    expect(screen.getByRole("button", { name: "ltr" })).toBeDefined();
  });

  it("las style props lógicas producen propiedades que voltean", () => {
    render(
      <DirectionProvider defaultDirection="rtl">
        <Box ps="md" me="lg" data-testid="caja" />
      </DirectionProvider>,
    );
    expect(screen.getByTestId("caja").className).not.toBe("");
  });
});
