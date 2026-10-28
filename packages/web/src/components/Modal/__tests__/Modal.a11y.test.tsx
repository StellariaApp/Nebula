import * as React from "react";

import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";

import { Modal } from "../Modal.js";

afterEach(cleanup);

const EXIT_TIMEOUT = 5000;

function Harness(): React.ReactElement {
  const [opened, set_opened] = React.useState(false);
  return (
    <>
      <button type="button" onClick={() => set_opened(true)}>
        Abrir
      </button>
      <Modal opened={opened} onClose={() => set_opened(false)} title="Confirmar envío">
        <input aria-label="Referencia" />
        <button type="button">Enviar</button>
      </Modal>
    </>
  );
}

describe("Modal · accesibilidad", () => {
  it("abierto: sin violaciones de axe", async () => {
    render(
      <Modal opened onClose={() => {}} title="Confirmar envío" subtitle="No se puede deshacer">
        <button type="button">Enviar</button>
      </Modal>,
    );
    await screen.findByRole("dialog", { name: "Confirmar envío" });
    await ExpectNoViolations();
  });

  it("el foco entra al diálogo al abrir y Escape lo cierra (el retorno del foco es del <dialog> nativo)", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Abrir" }));

    const dialog = await screen.findByRole("dialog", { name: "Confirmar envío" });
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));

    dialog.dispatchEvent(new Event("cancel", { cancelable: true, bubbles: true }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull(), {
      timeout: EXIT_TIMEOUT,
    });
  });

  it("es un dialog modal nativo con el título como nombre accesible", async () => {
    render(<Harness />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Abrir" }));
    const dialog = await screen.findByRole("dialog", { name: "Confirmar envío" });
    expect(dialog.tagName).toBe("DIALOG");
    expect(dialog.hasAttribute("open")).toBe(true);
  });
});
