import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen } from "../../../__tests__/render.js";

import { Checkbox } from "../Checkbox.js";
import { CheckboxGroup } from "../Group.js";

afterEach(cleanup);

describe("Checkbox · accesibilidad", () => {
  it("suelto, indeterminado, con error, deshabilitado y en grupo: sin violaciones de axe", async () => {
    const { container } = render(
      <>
        <Checkbox label="Acepto los términos" />
        <Checkbox label="Todos" indeterminate />
        <Checkbox label="Condiciones" error />
        <Checkbox label="Bloqueado" disabled />
        <CheckboxGroup label="Notificaciones">
          <Checkbox value="mail" label="Correo" />
          <Checkbox value="sms" label="SMS" />
        </CheckboxGroup>
      </>,
    );
    await ExpectNoViolations(container);
  });

  it("indeterminado se publica en la propiedad nativa que los lectores anuncian como mixto", () => {
    render(<Checkbox label="Todos" indeterminate />);
    expect(screen.getByRole("checkbox", { name: "Todos" })).toHaveProperty("indeterminate", true);
  });

  it("el grupo es un group con nombre y Espacio alterna cada casilla", async () => {
    const user = userEvent.setup();
    const on_change = vi.fn();
    render(
      <CheckboxGroup label="Notificaciones" onChange={on_change}>
        <Checkbox value="mail" label="Correo" />
        <Checkbox value="sms" label="SMS" />
      </CheckboxGroup>,
    );
    expect(screen.getByRole("group", { name: "Notificaciones" })).toBeDefined();
    await user.tab();
    await user.keyboard(" ");
    await user.tab();
    await user.keyboard(" ");
    expect(on_change).toHaveBeenLastCalledWith(["mail", "sms"]);
  });

  it("deshabilitado se salta con Tab", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Checkbox label="Bloqueado" disabled />
        <Checkbox label="Libre" />
      </>,
    );
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("checkbox", { name: "Libre" }));
  });
});
