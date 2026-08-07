import { useState } from "react";

import { fireEvent } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import type { SelectOption } from "../../../collections/options.js";
import { Select } from "../../Select/Select.js";
import { Modal } from "../Modal.js";

afterEach(cleanup);

const EXIT_TIMEOUT = 5000;

const ROLES: SelectOption[] = [
  { value: "admin", label: "Administrador" },
  { value: "op", label: "Operador" },
];

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

  it("el footer se renderiza fuera del cuerpo y no se anida en él", () => {
    render(
      <Modal
        opened
        onClose={() => {}}
        title="Confirmar"
        footer={<button type="button">Guardar</button>}
      >
        <p>Contenido</p>
      </Modal>,
    );
    const guardar = screen.getByRole("button", { name: "Guardar" });
    const contenido = screen.getByText("Contenido");
    expect(guardar).toBeDefined();
    expect(contenido.parentElement?.contains(guardar)).toBe(false);
  });

  it("sin footer no se renderiza la región", () => {
    render(<Controlled />);
    expect(screen.queryByRole("button", { name: "Guardar" })).toBeNull();
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
    await waitFor(
      () => {
        expect(screen.queryByRole("dialog")).toBeNull();
      },
      { timeout: EXIT_TIMEOUT },
    );
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

  it("el cierre diferido por la animación de salida termina", async () => {
    function Controlled(): React.ReactElement {
      const [opened, set_opened] = useState(true);
      return (
        <>
          <button type="button" onClick={() => set_opened(false)}>
            cerrar
          </button>
          <Modal opened={opened} onClose={() => set_opened(false)} title="Salida">
            <span>contenido</span>
          </Modal>
        </>
      );
    }

    const user = userEvent.setup();
    render(<Controlled />);
    expect(screen.getByRole("dialog", { name: "Salida" })).toBeDefined();

    await user.click(screen.getByRole("button", { name: "cerrar" }));

    await waitFor(
      () => {
        expect(screen.queryByRole("dialog")).toBeNull();
      },
      { timeout: EXIT_TIMEOUT },
    );
  });

  it("el overlay de un hijo se portalea dentro del diálogo, no a document.body", async () => {
    const user = userEvent.setup();
    render(
      <Modal opened onClose={() => undefined} title="Invitar">
        <Select label="Papel" data={ROLES} />
      </Modal>,
    );

    await user.click(screen.getByRole("button", { name: /Papel/ }));
    const listbox = await screen.findByRole("listbox");

    expect(screen.getByRole("dialog").contains(listbox)).toBe(true);
  });

  it("cierra cuando el click empieza fuera del panel", () => {
    const OnClose = vi.fn();
    render(
      <Modal opened onClose={OnClose} title="X">
        <span>contenido</span>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog");
    fireEvent.pointerDown(dialog, { clientX: 5, clientY: 5 });
    fireEvent.click(dialog, { clientX: 5, clientY: 5 });
    expect(OnClose).toHaveBeenCalledTimes(1);
  });

  it("un click que empieza dentro del panel no cierra aunque el target acabe en el diálogo", () => {
    const OnClose = vi.fn();
    render(
      <Modal opened onClose={OnClose} title="X">
        <button type="button">Aceptar</button>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog");
    fireEvent.pointerDown(screen.getByRole("button", { name: "Aceptar" }));
    fireEvent.click(dialog);
    expect(OnClose).not.toHaveBeenCalled();
  });

  it("con un overlay encima (panel inert) el click fuera no cierra el diálogo", () => {
    const OnClose = vi.fn();
    const { container } = render(
      <Modal opened onClose={OnClose} title="X">
        <span>contenido</span>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog");
    const panel = container.ownerDocument.querySelector("dialog > div");
    panel?.setAttribute("inert", "");

    fireEvent.pointerDown(dialog, { clientX: 5, clientY: 5 });
    fireEvent.click(dialog, { clientX: 5, clientY: 5 });
    expect(OnClose).not.toHaveBeenCalled();

    panel?.removeAttribute("inert");
    fireEvent.pointerDown(dialog, { clientX: 5, clientY: 5 });
    fireEvent.click(dialog, { clientX: 5, clientY: 5 });
    expect(OnClose).toHaveBeenCalledTimes(1);
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
