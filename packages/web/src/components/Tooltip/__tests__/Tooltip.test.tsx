import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import { Button } from "../../Button/Button.js";
import { Tooltip } from "../Tooltip.js";

afterEach(cleanup);

describe("Tooltip", () => {
  it("no monta el tooltip en reposo", () => {
    render(<Tooltip trigger={<Button>Guardar</Button>} label="Guarda los cambios" />);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("aparece al enfocar por teclado", async () => {
    const user = userEvent.setup();
    render(<Tooltip trigger={<Button>Guardar</Button>} label="Guarda los cambios" delay={0} />);
    await user.tab();
    expect(await screen.findByRole("tooltip")).toBeDefined();
    expect(screen.getByRole("tooltip").textContent).toBe("Guarda los cambios");
  });

  it("se oculta al salir el foco", async () => {
    const user = userEvent.setup();
    render(<Tooltip trigger={<Button>Guardar</Button>} label="Guarda los cambios" delay={0} />);
    await user.tab();
    await screen.findByRole("tooltip");
    await user.tab();
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).toBeNull();
    });
  });

  it("respeta disabled", async () => {
    const user = userEvent.setup();
    render(<Tooltip trigger={<Button>Guardar</Button>} label="No visible" delay={0} disabled />);
    await user.tab();
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("modo controlado con opened", () => {
    render(<Tooltip trigger={<Button>Guardar</Button>} label="Siempre" opened />);
    expect(screen.getByRole("tooltip").textContent).toBe("Siempre");
  });
});
