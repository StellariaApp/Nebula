import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen } from "../../../__tests__/render.js";

import { Switch } from "../Switch.js";
import { SwitchGroup } from "../Group.js";

afterEach(cleanup);

describe("Switch · accesibilidad", () => {
  it("apagado, encendido, deshabilitado y en grupo: sin violaciones de axe", async () => {
    const { container } = render(
      <>
        <Switch label="Modo oscuro" />
        <Switch label="Sonidos" defaultChecked />
        <Switch label="Beta" disabled />
        <SwitchGroup label="Preferencias">
          <Switch value="a" label="Avisos" />
          <Switch value="b" label="Resumen semanal" />
        </SwitchGroup>
      </>,
    );
    await ExpectNoViolations(container);
  });

  it("expone aria-checked según su estado y lo actualiza al alternar", async () => {
    const user = userEvent.setup();
    render(<Switch label="Sonidos" />);
    const control = screen.getByRole("switch", { name: "Sonidos" });
    expect(
      control.getAttribute("aria-checked") ?? String((control as HTMLInputElement).checked),
    ).toBe("false");
    await user.click(control);
    expect(
      control.getAttribute("aria-checked") ?? String((control as HTMLInputElement).checked),
    ).toBe("true");
  });

  it("Espacio alterna y deshabilitado no recibe foco", async () => {
    const user = userEvent.setup();
    const on_change = vi.fn();
    render(
      <>
        <Switch label="Bloqueado" disabled />
        <Switch label="Libre" onChange={on_change} />
      </>,
    );
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("switch", { name: "Libre" }));
    await user.keyboard(" ");
    expect(on_change).toHaveBeenCalledWith(true);
  });

  it("el grupo se nombra y reparte los valores", async () => {
    const user = userEvent.setup();
    const on_change = vi.fn();
    render(
      <SwitchGroup label="Preferencias" onChange={on_change}>
        <Switch value="a" label="Avisos" />
        <Switch value="b" label="Resumen semanal" />
      </SwitchGroup>,
    );
    expect(screen.getByRole("group", { name: "Preferencias" })).toBeDefined();
    await user.click(screen.getByRole("switch", { name: "Resumen semanal" }));
    expect(on_change).toHaveBeenLastCalledWith(["b"]);
  });
});
