import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";

import { act } from "@testing-library/react";

import { ToastProvider } from "../ToastProvider.js";
import { nebulaToast } from "../toast-store.js";

afterEach(() => {
  cleanup();
  nebulaToast.clear();
});

describe("Toast · accesibilidad", () => {
  it("región con avisos de éxito y de error: sin violaciones de axe", async () => {
    render(<ToastProvider />);
    act(() => {
      nebulaToast.success("Guardado correctamente", { duration: 0 });
      nebulaToast.error("No se pudo enviar", { title: "Error", duration: 0 });
    });
    await screen.findByRole("alert");
    await ExpectNoViolations();
  });

  it("el éxito se anuncia con cortesía y el error con urgencia", async () => {
    render(<ToastProvider />);
    act(() => {
      nebulaToast.success("Guardado", { duration: 0 });
      nebulaToast.error("Falló", { duration: 0 });
    });
    expect((await screen.findByRole("status")).textContent).toContain("Guardado");
    expect(screen.getByRole("alert").textContent).toContain("Falló");
  });

  it("el botón de cerrar es alcanzable con Tab y cierra con Enter", async () => {
    const user = userEvent.setup();
    render(<ToastProvider />);
    act(() => {
      nebulaToast.info("Aviso", { duration: 0 });
    });
    await screen.findByRole("status");
    await user.tab();
    const close = document.activeElement as HTMLElement;
    expect(close.tagName).toBe("BUTTON");
    expect(close.getAttribute("aria-label")).not.toBeNull();
    await user.keyboard("{Enter}");
    await waitFor(() => expect(screen.queryByRole("status")).toBeNull());
  });

  it("un aviso con duración se retira solo", async () => {
    render(<ToastProvider />);
    act(() => {
      nebulaToast.info("Efímero", { duration: 50 });
    });
    await screen.findByRole("status");
    await waitFor(() => expect(screen.queryByRole("status")).toBeNull(), { timeout: 5000 });
  });

  it("no roba el foco al aparecer", async () => {
    render(
      <>
        <button type="button">Guardar</button>
        <ToastProvider />
      </>,
    );
    const button = screen.getByRole("button", { name: "Guardar" });
    button.focus();
    act(() => {
      nebulaToast.success("Listo", { duration: 0 });
    });
    await screen.findByRole("status");
    expect(document.activeElement).toBe(button);
  });
});
