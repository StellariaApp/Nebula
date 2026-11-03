import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";

import { Button } from "../Button.js";

afterEach(cleanup);

describe("Button · accesibilidad", () => {
  it("texto, solo icono con aria-label, deshabilitado y cargando: sin violaciones de axe", async () => {
    const { container } = render(
      <>
        <Button>Guardar</Button>
        <Button
          aria-label="Cerrar"
          leftSection={<svg aria-hidden="true" width="12" height="12" />}
        />
        <Button disabled>Enviar</Button>
        <Button loading>Procesando</Button>
      </>,
    );
    await ExpectNoViolations(container);
  });

  it("se activa con Enter y con Espacio", async () => {
    const user = userEvent.setup();
    const on_press = vi.fn();
    render(<Button onPress={on_press}>Guardar</Button>);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Guardar" }));
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(on_press).toHaveBeenCalledTimes(2);
  });

  it("deshabilitado no recibe foco ni dispara", async () => {
    const user = userEvent.setup();
    const on_press = vi.fn();
    render(
      <Button disabled onPress={on_press}>
        Guardar
      </Button>,
    );
    await user.tab();
    expect(document.activeElement).toBe(document.body);
    await user.click(screen.getByRole("button", { name: "Guardar" }));
    expect(on_press).not.toHaveBeenCalled();
  });

  it("cargando no dispara y se anuncia como ocupado", async () => {
    const user = userEvent.setup();
    const on_press = vi.fn();
    render(
      <Button loading onPress={on_press}>
        Procesando
      </Button>,
    );
    await user.click(screen.getByRole("button", { name: /Procesando/ }));
    expect(on_press).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Procesando/ }).hasAttribute("disabled")).toBe(
        true,
      );
    });
  });
});
