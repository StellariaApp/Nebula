import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen } from "../../../__tests__/render.js";

import { Card } from "../index.js";

afterEach(cleanup);

describe("Card · accesibilidad", () => {
  it("estática, con acción y como enlace: sin violaciones de axe", async () => {
    const { container } = render(
      <>
        <Card aria-label="Resumen">
          <Card.Section>Saldo disponible</Card.Section>
        </Card>
        <Card interactive onPress={() => {}} aria-label="Abrir cuenta">
          <Card.Section>Cuenta corriente</Card.Section>
        </Card>
        <Card href="/cuentas" aria-label="Ver cuentas">
          <Card.Section>Cuentas</Card.Section>
        </Card>
      </>,
    );
    await ExpectNoViolations(container);
  });

  it("una tarjeta con onPress se alcanza con Tab y se activa con Enter", async () => {
    const user = userEvent.setup();
    const on_press = vi.fn();
    render(
      <Card interactive onPress={on_press} aria-label="Abrir cuenta">
        <Card.Section>Cuenta corriente</Card.Section>
      </Card>,
    );
    await user.tab();
    expect(document.activeElement).toBe(screen.getByLabelText("Abrir cuenta"));
    await user.keyboard("{Enter}");
    expect(on_press).toHaveBeenCalledTimes(1);
  });

  it("una tarjeta estática no entra en el orden de Tab", async () => {
    const user = userEvent.setup();
    render(
      <Card aria-label="Resumen">
        <Card.Section>Saldo disponible</Card.Section>
      </Card>,
    );
    await user.tab();
    expect(document.activeElement).toBe(document.body);
  });

  it("una tarjeta con href es un enlace", () => {
    render(
      <Card href="/cuentas" aria-label="Ver cuentas">
        <Card.Section>Cuentas</Card.Section>
      </Card>,
    );
    expect(screen.getByRole("link", { name: "Ver cuentas" }).getAttribute("href")).toBe("/cuentas");
  });
});
