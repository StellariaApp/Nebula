import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import { Button } from "../../Button/Button.js";
import { Popover } from "../Popover.js";

afterEach(cleanup);

function Sample(): React.ReactElement {
  return (
    <Popover trigger={<Button>Abrir</Button>} aria-label="Panel">
      <button type="button">Interno</button>
    </Popover>
  );
}

describe("Popover", () => {
  it("no renderiza el contenido mientras está cerrado", () => {
    render(<Sample />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("abre con el trigger y marca aria-expanded", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    const trigger = screen.getByRole("button", { name: "Abrir" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    await user.click(trigger);
    expect(await screen.findByRole("dialog")).toBeDefined();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("se abre con teclado (Enter sobre el trigger)", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Abrir" }));
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("dialog")).toBeDefined();
  });

  it("cierra con Escape", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("respeta el modo controlado", () => {
    render(
      <Popover trigger={<Button>Abrir</Button>} opened aria-label="Panel">
        <span>Contenido</span>
      </Popover>,
    );
    expect(screen.getByRole("dialog")).toBeDefined();
  });
});
