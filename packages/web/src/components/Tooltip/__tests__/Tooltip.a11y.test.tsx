import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";

import { Button } from "../../Button/Button.js";
import { Tooltip } from "../Tooltip.js";

afterEach(cleanup);

describe("Tooltip · accesibilidad", () => {
  it("abierto: sin violaciones de axe", async () => {
    render(<Tooltip trigger={<Button>Guardar</Button>} label="Guarda los cambios" opened />);
    await ExpectNoViolations();
  });

  it("el disparador queda descrito por el tooltip mientras está abierto", async () => {
    const user = userEvent.setup();
    render(<Tooltip trigger={<Button>Guardar</Button>} label="Guarda los cambios" delay={0} />);
    await user.tab();
    const tooltip = await screen.findByRole("tooltip");
    const trigger = screen.getByRole("button", { name: "Guardar" });
    expect(trigger.getAttribute("aria-describedby")).toBe(tooltip.id);
  });

  it("Escape lo cierra sin mover el foco del disparador", async () => {
    const user = userEvent.setup();
    render(<Tooltip trigger={<Button>Guardar</Button>} label="Guarda los cambios" delay={0} />);
    await user.tab();
    await screen.findByRole("tooltip");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Guardar" }));
  });

  it("el contenido no es focusable: Tab pasa de largo", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Tooltip trigger={<Button>Guardar</Button>} label="Guarda los cambios" delay={0} />
        <Button>Cancelar</Button>
      </>,
    );
    await user.tab();
    await screen.findByRole("tooltip");
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Cancelar" }));
  });
});
