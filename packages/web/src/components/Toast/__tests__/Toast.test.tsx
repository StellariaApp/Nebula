import { act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { fireEvent } from "@testing-library/react";

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
    expect(screen.getByRole("region", { name: "Notifications" })).toBeDefined();
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
    await user.click(screen.getByRole("button", { name: "Dismiss notification" }));
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

  it("con el puntero encima no expira, y al salir retoma la cuenta", async () => {
    render(<ToastProvider />);
    act(() => {
      nebulaToast.info("Pausado", { duration: 80 });
    });
    const toast = (await screen.findByText("Pausado")).closest("[role='status']") as HTMLElement;
    fireEvent.mouseEnter(toast);
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(screen.queryByText("Pausado")).not.toBeNull();
    fireEvent.mouseLeave(toast);
    await waitFor(
      () => {
        expect(screen.queryByText("Pausado")).toBeNull();
      },
      { timeout: 1500 },
    );
  });

  it("con el foco dentro no expira", async () => {
    render(<ToastProvider />);
    act(() => {
      nebulaToast.info("Enfocado", { duration: 80 });
    });
    await screen.findByText("Enfocado");
    act(() => {
      screen.getByRole("button", { name: "Dismiss notification" }).focus();
    });
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(screen.queryByText("Enfocado")).not.toBeNull();
  });

  it("dismissible=false no renderiza botón de cierre", async () => {
    render(<ToastProvider />);
    act(() => {
      nebulaToast.info("Persistente", { duration: 0, dismissible: false });
    });
    await screen.findByText("Persistente");
    expect(screen.queryByRole("button", { name: "Dismiss notification" })).toBeNull();
  });
});
