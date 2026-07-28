import { afterEach, describe, expect, it, vi } from "vitest";
import { userEvent } from "@testing-library/user-event";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Button } from "../../Button/Button.js";
import { EmptyState } from "../EmptyState.js";

afterEach(cleanup);

describe("EmptyState", () => {
  it("el título siempre se anuncia", () => {
    render(<EmptyState title="Sin movimientos" />);
    expect(screen.getByText("Sin movimientos")).toBeDefined();
  });

  it("descripción y acciones son opcionales", () => {
    render(<EmptyState title="Sin movimientos" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("explica qué falta y ofrece una salida", () => {
    render(
      <EmptyState
        title="Sin movimientos"
        description="Cuando recibas tu primer cobro aparecerá aquí."
        actions={<Button>Crear cobro</Button>}
      />,
    );
    expect(screen.getByText("Cuando recibas tu primer cobro aparecerá aquí.")).toBeDefined();
    expect(screen.getByRole("button", { name: "Crear cobro" })).toBeDefined();
  });

  it("el icono es decorativo", () => {
    render(<EmptyState title="Sin movimientos" icon={<span>glifo</span>} />);
    expect(screen.getByText("glifo").parentElement?.getAttribute("aria-hidden")).toBe("true");
  });

  it("la acción sigue siendo operable dentro del estado vacío", async () => {
    const OnPress = vi.fn();
    const user = userEvent.setup();
    render(
      <EmptyState title="Sin datos" actions={<Button onPress={OnPress}>Reintentar</Button>} />,
    );
    await user.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(OnPress).toHaveBeenCalledTimes(1);
  });

  it("acepta los tres tamaños", () => {
    for (const size of ["sm", "md", "lg"] as const) {
      const { unmount } = render(<EmptyState title="Vacío" size={size} />);
      expect(screen.getByText("Vacío")).toBeDefined();
      unmount();
    }
  });
});
