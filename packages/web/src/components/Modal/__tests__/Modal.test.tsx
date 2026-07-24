import { useState } from "react";

import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import { Modal } from "../Modal.js";

afterEach(cleanup);

function Controlled(props: { closeOnEscape?: boolean }): React.ReactElement {
  const [opened, set_opened] = useState(true);
  return (
    <Modal
      opened={opened}
      onClose={() => set_opened(false)}
      title="Confirmar"
      subtitle="Esta acción no se puede deshacer"
      {...(props.closeOnEscape === undefined ? {} : { closeOnEscape: props.closeOnEscape })}
    >
      <button type="button">Aceptar</button>
    </Modal>
  );
}

describe("Modal", () => {
  it("vincula el título como nombre accesible del diálogo", () => {
    render(<Controlled />);
    expect(screen.getByRole("dialog", { name: "Confirmar" })).toBeDefined();
  });

  it("renderiza subtítulo y botón de cierre", () => {
    render(<Controlled />);
    expect(screen.getByText("Esta acción no se puede deshacer")).toBeDefined();
    expect(screen.getByRole("button", { name: "Cerrar" })).toBeDefined();
  });

  it("cierra al pulsar el botón de cierre", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    await user.click(screen.getByRole("button", { name: "Cerrar" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("Escape cierra por onClose y no por el DOM (estado sigue mandando)", async () => {
    const OnClose = vi.fn();
    render(
      <Modal opened onClose={OnClose} title="X">
        <span>contenido</span>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog");
    dialog.dispatchEvent(new Event("cancel", { cancelable: true, bubbles: true }));
    await waitFor(() => {
      expect(OnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("closeOnEscape=false no propaga el cierre", async () => {
    const OnClose = vi.fn();
    render(
      <Modal opened onClose={OnClose} title="X" closeOnEscape={false}>
        <span>contenido</span>
      </Modal>,
    );
    screen
      .getByRole("dialog")
      .dispatchEvent(new Event("cancel", { cancelable: true, bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(OnClose).not.toHaveBeenCalled();
  });

  it("no expone diálogo cuando opened=false", () => {
    render(
      <Modal opened={false} onClose={() => undefined} title="X">
        <span>contenido</span>
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
