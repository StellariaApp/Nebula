import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen } from "../../../__tests__/render.js";

import { Alert } from "../Alert.js";

afterEach(cleanup);

describe("Alert · accesibilidad", () => {
  it("informativa, de riesgo y descartable: sin violaciones de axe", async () => {
    const { container } = render(
      <>
        <Alert title="Guardado">Los cambios se aplicaron.</Alert>
        <Alert color="error" title="No se pudo guardar">
          Revisa tu conexión.
        </Alert>
        <Alert color="warning" title="Vence pronto" withCloseButton onClose={() => {}}>
          Tu plan vence en 3 días.
        </Alert>
      </>,
    );
    await ExpectNoViolations(container);
  });

  it("el botón de descartar es alcanzable con Tab y cierra con Enter y con Espacio", async () => {
    const user = userEvent.setup();
    const on_close = vi.fn();
    render(<Alert title="Aviso" withCloseButton onClose={on_close} />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Dismiss notice" }));
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(on_close).toHaveBeenCalledTimes(2);
  });

  it("un aviso informativo se anuncia con cortesía y uno de error con urgencia", () => {
    render(
      <>
        <Alert title="Info">Texto</Alert>
        <Alert color="error" title="Falla">
          Texto
        </Alert>
      </>,
    );
    expect(screen.getByRole("status", { name: "Info" })).toBeDefined();
    expect(screen.getByRole("alert", { name: "Falla" })).toBeDefined();
  });

  it("el nombre del botón de cerrar es configurable para otro idioma", () => {
    render(<Alert title="Aviso" withCloseButton onClose={() => {}} closeLabel="Descartar aviso" />);
    expect(screen.getByRole("button", { name: "Descartar aviso" })).toBeDefined();
  });
});
