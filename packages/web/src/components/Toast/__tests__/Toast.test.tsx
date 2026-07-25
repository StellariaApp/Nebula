import { act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import { ToastProvider } from "../ToastProvider.js";
import { nebulaToast } from "../toast-store.js";

afterEach(() => {
  cleanup();
  nebulaToast.clear();
});

describe("Toast", () => {
  it("la región es un landmark con nombre", () => {
    render(<ToastProvider />);
    expect(screen.getByRole("region", { name: "Notificaciones" })).toBeDefined();
  });

  it("nebulaToast.success publica un status sin prop-drilling", async () => {
    render(<ToastProvider />);
    act(() => {
      nebulaToast.success("Guardado correctamente");
    });
    expect(await screen.findByRole("status")).toBeDefined();
    expect(screen.getByText("Guardado correctamente")).toBeDefined();
  });

  it("los errores se anuncian como alert", async () => {
    render(<ToastProvider />);
    act(() => {
      nebulaToast.error("No se pudo guardar");
    });
    expect(await screen.findByRole("alert")).toBeDefined();
  });

  it("se cierra desde su botón", async () => {
    const user = userEvent.setup();
    render(<ToastProvider />);
    act(() => {
      nebulaToast.info("Aviso", { duration: 0 });
    });
    await screen.findByRole("status");
    await user.click(screen.getByRole("button", { name: "Cerrar notificación" }));
    await waitFor(() => {
      expect(screen.queryByRole("status")).toBeNull();
    });
  });

  it("dismiss por id retira solo ese toast", async () => {
    render(<ToastProvider />);
    act(() => {
      nebulaToast.info("Uno", { id: "uno", duration: 0 });
      nebulaToast.info("Dos", { id: "dos", duration: 0 });
    });
    await screen.findByText("Uno");
    act(() => {
      nebulaToast.dismiss("uno");
    });
    await waitFor(() => {
      expect(screen.queryByText("Uno")).toBeNull();
    });
    expect(screen.getByText("Dos")).toBeDefined();
  });

  it("max limita los visibles conservando los más recientes", async () => {
    render(<ToastProvider max={2} />);
    act(() => {
      nebulaToast.info("Uno", { id: "uno", duration: 0 });
      nebulaToast.info("Dos", { id: "dos", duration: 0 });
      nebulaToast.info("Tres", { id: "tres", duration: 0 });
    });
    await screen.findByText("Tres");
    expect(screen.queryByText("Uno")).toBeNull();
    expect(screen.getByText("Dos")).toBeDefined();
  });

  it("expira solo tras su duración", async () => {
    render(<ToastProvider />);
    act(() => {
      nebulaToast.info("Efímero", { duration: 60 });
    });
    await screen.findByText("Efímero");
    await waitFor(
      () => {
        expect(screen.queryByText("Efímero")).toBeNull();
      },
      { timeout: 1500 },
    );
  });

  it("dismissible=false no renderiza botón de cierre", async () => {
    render(<ToastProvider />);
    act(() => {
      nebulaToast.info("Persistente", { duration: 0, dismissible: false });
    });
    await screen.findByText("Persistente");
    expect(screen.queryByRole("button", { name: "Cerrar notificación" })).toBeNull();
  });
});
