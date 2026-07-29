import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { PinInput } from "../PinInput.js";

afterEach(cleanup);

describe("PinInput", () => {
  it("renderiza una celda etiquetada por posición", () => {
    render(<PinInput label="Código" length={4} />);
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
    expect(screen.getByLabelText("Dígito 1 de 4")).toBeDefined();
  });

  it("avanza el foco al escribir y emite el valor acumulado", async () => {
    const on_change = vi.fn();
    render(<PinInput label="Código" length={4} onChange={on_change} />);
    const cells = screen.getAllByRole("textbox");
    (cells[0] as HTMLElement).focus();
    await userEvent.keyboard("12");
    expect(on_change).toHaveBeenLastCalledWith("12");
    expect(document.activeElement).toBe(cells[2]);
  });

  it("dispara onComplete al llenar la última celda", async () => {
    const on_complete = vi.fn();
    render(<PinInput label="Código" length={4} onComplete={on_complete} />);
    (screen.getAllByRole("textbox")[0] as HTMLElement).focus();
    await userEvent.keyboard("1234");
    expect(on_complete).toHaveBeenCalledWith("1234");
  });

  it("ignora caracteres no numéricos en modo numeric", async () => {
    const on_change = vi.fn();
    render(<PinInput label="Código" length={4} type="numeric" onChange={on_change} />);
    (screen.getAllByRole("textbox")[0] as HTMLElement).focus();
    await userEvent.keyboard("a1");
    expect(on_change).toHaveBeenLastCalledWith("1");
  });

  it("retrocede con Backspace", async () => {
    render(<PinInput label="Código" length={4} defaultValue="12" />);
    const cells = screen.getAllByRole("textbox");
    (cells[2] as HTMLElement).focus();
    await userEvent.keyboard("{Backspace}");
    expect(document.activeElement).toBe(cells[1]);
  });

  it("navega con flechas, Home y End", async () => {
    render(<PinInput label="Código" length={4} />);
    const cells = screen.getAllByRole("textbox");
    (cells[0] as HTMLElement).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(cells[1]);
    await userEvent.keyboard("{End}");
    expect(document.activeElement).toBe(cells[3]);
    await userEvent.keyboard("{Home}");
    expect(document.activeElement).toBe(cells[0]);
  });

  it("reparte un pegado entre las celdas", async () => {
    const on_change = vi.fn();
    render(<PinInput label="Código" length={6} onChange={on_change} />);
    const first = screen.getAllByRole("textbox")[0] as HTMLElement;
    first.focus();
    await userEvent.paste("482913");
    expect(on_change).toHaveBeenLastCalledWith("482913");
  });

  it("enmascara con mask", () => {
    render(<PinInput label="Código" length={4} mask defaultValue="12" />);
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    expect(screen.getByLabelText("Dígito 1 de 4").getAttribute("type")).toBe("password");
  });
});
