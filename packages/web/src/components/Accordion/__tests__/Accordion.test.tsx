import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Accordion } from "../Accordion.js";
import type { AccordionItemData } from "../Accordion.types.js";

afterEach(cleanup);

const DATA: AccordionItemData[] = [
  { value: "envio", label: "Envío", content: "Llega en 3 días." },
  { value: "pago", label: "Pago", content: "Aceptamos tarjeta." },
  { value: "cerrado", label: "Cerrado", content: "No disponible.", disabled: true },
  { value: "devolucion", label: "Devolución", content: "30 días." },
];

describe("Accordion", () => {
  it("cada cabecera es un botón con aria-expanded y aria-controls", () => {
    render(<Accordion data={DATA} />);
    const trigger = screen.getByRole("button", { name: "Envío" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("aria-controls")).not.toBeNull();
  });

  it("abre el panel y lo vincula con su cabecera", async () => {
    const user = userEvent.setup();
    render(<Accordion data={DATA} />);
    await user.click(screen.getByRole("button", { name: "Envío" }));

    const trigger = screen.getByRole("button", { name: "Envío" });
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    const panel_id = trigger.getAttribute("aria-controls");
    const panel = panel_id === null ? null : document.getElementById(panel_id);
    expect(panel).not.toBeNull();
    expect(panel?.getAttribute("aria-labelledby")).toBe(trigger.id);
    expect(panel?.getAttribute("role")).toBeNull();
  });

  it("en modo simple cerrar el anterior al abrir otro", async () => {
    const OnChange = vi.fn();
    const user = userEvent.setup();
    render(<Accordion data={DATA} onChange={OnChange} />);

    await user.click(screen.getByRole("button", { name: "Envío" }));
    expect(OnChange).toHaveBeenLastCalledWith("envio");

    await user.click(screen.getByRole("button", { name: "Pago" }));
    expect(OnChange).toHaveBeenLastCalledWith("pago");
  });

  it("en simple emite undefined al cerrar el único abierto", async () => {
    const OnChange = vi.fn();
    const user = userEvent.setup();
    render(<Accordion data={DATA} defaultValue="envio" onChange={OnChange} />);

    await user.click(screen.getByRole("button", { name: "Envío" }));
    expect(OnChange).toHaveBeenLastCalledWith(undefined);
  });

  it("multiple acumula los abiertos", async () => {
    const OnChange = vi.fn();
    const user = userEvent.setup();
    render(<Accordion data={DATA} multiple onChange={OnChange} />);

    await user.click(screen.getByRole("button", { name: "Envío" }));
    await user.click(screen.getByRole("button", { name: "Pago" }));
    expect(OnChange).toHaveBeenLastCalledWith(["envio", "pago"]);
  });

  it("las flechas mueven el foco saltando deshabilitados", async () => {
    const user = userEvent.setup();
    render(<Accordion data={DATA} />);

    screen.getByRole("button", { name: "Envío" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Pago" }));

    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Devolución" }));
  });

  it("Home y End llevan a los extremos", async () => {
    const user = userEvent.setup();
    render(<Accordion data={DATA} />);
    screen.getByRole("button", { name: "Pago" }).focus();

    await user.keyboard("{End}");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Devolución" }));

    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Envío" }));
  });

  it("el item deshabilitado no se abre", async () => {
    const OnChange = vi.fn();
    const user = userEvent.setup();
    render(<Accordion data={DATA} onChange={OnChange} />);
    await user.click(screen.getByRole("button", { name: "Cerrado" }));
    expect(OnChange).not.toHaveBeenCalled();
  });

  it("respeta el modo controlado", () => {
    render(<Accordion data={DATA} value="pago" onChange={() => undefined} />);
    expect(screen.getByRole("button", { name: "Pago" }).getAttribute("aria-expanded")).toBe("true");
  });
});
