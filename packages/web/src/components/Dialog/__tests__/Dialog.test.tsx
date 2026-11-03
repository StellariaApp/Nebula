import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import { Dialog } from "../Dialog.js";

afterEach(cleanup);

const EXIT_TIMEOUT = 5000;

describe("Dialog", () => {
  it("no monta nada mientras está cerrado", () => {
    render(<Dialog opened={false} title="Sincronizando" />);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("es un panel no modal: se anuncia como status y no atrapa el foco", () => {
    render(
      <>
        <button type="button">Fuera</button>
        <Dialog opened title="Sincronizando" aria-label="Estado de sincronización">
          Subiendo 3 archivos
        </Dialog>
      </>,
    );
    const panel = screen.getByRole("status", { name: "Estado de sincronización" });
    expect(panel.getAttribute("aria-live")).toBe("polite");
    expect(panel.getAttribute("aria-modal")).toBeNull();
    expect(screen.getByText("Subiendo 3 archivos")).toBeDefined();
  });

  it("live permite anunciarlo como assertive", () => {
    render(<Dialog opened live="assertive" title="Conexión perdida" />);
    expect(screen.getByRole("status").getAttribute("aria-live")).toBe("assertive");
  });

  it("el botón de cerrar tiene nombre accesible, es alcanzable con Tab y cierra con Enter", async () => {
    const user = userEvent.setup();
    const on_close = vi.fn();
    render(<Dialog opened title="Sincronizando" onClose={on_close} closeLabel="Cerrar aviso" />);

    await user.tab();
    const close = screen.getByRole("button", { name: "Cerrar aviso" });
    expect(document.activeElement).toBe(close);
    await user.keyboard("{Enter}");
    expect(on_close).toHaveBeenCalledTimes(1);
  });

  it("sin onClose no ofrece un botón que no hace nada", () => {
    render(<Dialog opened title="Sincronizando" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("withCloseButton=false lo quita aunque haya onClose", () => {
    render(<Dialog opened title="Sincronizando" onClose={() => {}} withCloseButton={false} />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("se monta dentro de un portal por defecto y en el sitio con withinPortal=false", () => {
    const { unmount } = render(<Dialog opened title="Portal" />);
    expect(screen.getByRole("status").closest("[data-nebula-portal]")).not.toBeNull();
    unmount();
    render(<Dialog opened withinPortal={false} title="Inline" />);
    expect(screen.getByRole("status").closest("[data-nebula-portal]")).toBeNull();
  });

  it("se coloca en la esquina pedida con su margen", () => {
    render(<Dialog opened corner="top-start" offset={8} title="Esquina" />);
    const style = screen.getByRole("status").getAttribute("style") ?? "";
    expect(style).toContain("top: 8px");
    expect(style).toContain("left: 8px");
  });

  it("se desmonta al cerrarse", async () => {
    const { rerender } = render(<Dialog opened title="Adiós" />);
    expect(screen.getByRole("status")).toBeDefined();
    rerender(<Dialog opened={false} title="Adiós" />);
    await waitFor(() => expect(screen.queryByRole("status")).toBeNull(), {
      timeout: EXIT_TIMEOUT,
    });
  });

  it("no tiene violaciones de axe abierto", async () => {
    render(
      <Dialog opened title="Sincronizando" onClose={() => {}} aria-label="Estado">
        Subiendo 3 archivos
      </Dialog>,
    );
    await ExpectNoViolations();
  });
});
