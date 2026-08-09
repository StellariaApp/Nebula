import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Alert } from "../Alert.js";

afterEach(cleanup);

describe("Alert", () => {
  it("por defecto se anuncia como status", () => {
    render(<Alert title="Guardado">Los cambios se aplicaron.</Alert>);
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("los colores de riesgo se anuncian como alert", () => {
    render(<Alert color="error" title="Error" />);
    expect(screen.getByRole("alert")).toBeDefined();
  });

  it("live permite forzar el rol", () => {
    render(<Alert color="error" live="status" title="Error" />);
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("el título nombra la región", () => {
    render(<Alert title="Sin conexión">Reintentando…</Alert>);
    expect(screen.getByRole("status", { name: "Sin conexión" })).toBeDefined();
  });

  it("cierra desde el botón cuando es descartable", async () => {
    const OnClose = vi.fn();
    const user = userEvent.setup();
    render(<Alert title="Aviso" withCloseButton onClose={OnClose} />);
    await user.click(screen.getByRole("button", { name: "Dismiss notice" }));
    expect(OnClose).toHaveBeenCalledTimes(1);
  });

  it("sin withCloseButton no hay botón", () => {
    render(<Alert title="Aviso" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("expone la variante como data-variant", () => {
    render(<Alert title="Aviso" variant="filled" />);
    expect(screen.getByRole("status").getAttribute("data-variant")).toBe("filled");
  });
});
