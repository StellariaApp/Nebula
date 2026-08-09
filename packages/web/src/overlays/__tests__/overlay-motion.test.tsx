import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../__tests__/render.js";
import { Drawer } from "../../components/Drawer/Drawer.js";
import { Modal } from "../../components/Modal/Modal.js";
import { Popover } from "../../components/Popover/Popover.js";
import { Tooltip } from "../../components/Tooltip/Tooltip.js";

afterEach(cleanup);

function Panel(): HTMLElement {
  const dialog = screen.getByRole("dialog");
  const panel = dialog.firstElementChild;
  if (!(panel instanceof HTMLElement)) throw new Error("el diálogo no tiene panel");
  return panel;
}

describe("los overlays con presencia animan también al entrar", () => {
  it("el tooltip arranca en su estado inicial, no en el final", () => {
    render(<Tooltip label="ayuda" opened trigger={<button type="button">t</button>} />);
    expect(screen.getByRole("tooltip").style.opacity).toBe("0");
  });

  it("el popover arranca en su estado inicial", () => {
    render(
      <Popover opened aria-label="panel" trigger={<button type="button">abrir</button>}>
        <p>contenido</p>
      </Popover>,
    );
    expect(screen.getByRole("dialog").style.opacity).toBe("0");
  });
});

describe("Modal y Drawer animan el panel, no su contenido", () => {
  it("el nodo animado es el panel, no el <dialog>", () => {
    render(
      <Modal opened onClose={() => undefined} title="Confirmar">
        <p>contenido</p>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog");
    const panel = Panel();

    expect(panel.className).toContain("surface");
    expect(panel.style.transform).toContain("scale");
    expect(dialog.style.transform).toBe("");
  });

  it("el drawer entra deslizando por su borde, no fundiéndose", () => {
    render(
      <Drawer opened onClose={() => undefined} title="Filters">
        <p>contenido</p>
      </Drawer>,
    );
    const panel = Panel();

    expect(panel.style.transform).toBe("translateX(100%)");
    expect(panel.style.opacity).toBe("");
  });

  it("el lado del drawer decide la dirección del deslizamiento", () => {
    render(
      <Drawer opened side="start" onClose={() => undefined} title="Filters">
        <p>contenido</p>
      </Drawer>,
    );
    expect(Panel().style.transform).toBe("translateX(-100%)");
  });
});
