import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { PinInput } from "../PinInput.js";

afterEach(cleanup);

describe("PinInput", () => {
  it("renderiza una celda etiquetada por posición", () => {
    render(<PinInput label="Código" length={4} />);
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
    expect(screen.getByLabelText("Digit 1 of 4")).toBeDefined();
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

  it("pega un código entero desde la primera celda aunque el foco esté en otra", async () => {
    const on_change = vi.fn();
    render(<PinInput label="Clave" length={12} type="alphanumeric" onChange={on_change} />);
    (screen.getAllByRole("textbox")[4] as HTMLElement).focus();
    await userEvent.paste("K56P-M89P-4484");
    expect(on_change).toHaveBeenLastCalledWith("K56PM89P4484");
  });

  it("un pegado corto tras el final entra detrás de lo que hay, sin huecos", async () => {
    const on_change = vi.fn();
    render(<PinInput label="Código" length={6} defaultValue="12" onChange={on_change} />);
    (screen.getAllByRole("textbox")[4] as HTMLElement).focus();
    await userEvent.paste("34");
    expect(on_change).toHaveBeenLastCalledWith("1234");
  });

  it("escribir en una celda vacía más allá del final no deja huecos", async () => {
    const on_change = vi.fn();
    render(<PinInput label="Código" length={6} onChange={on_change} />);
    const cells = screen.getAllByRole("textbox");
    (cells[3] as HTMLElement).focus();
    await userEvent.keyboard("7");
    expect(on_change).toHaveBeenLastCalledWith("7");
    expect(document.activeElement).toBe(cells[1]);
  });

  it("escribir sobre una celda llena la reemplaza", async () => {
    const on_change = vi.fn();
    render(<PinInput label="Código" length={4} defaultValue="1234" onChange={on_change} />);
    await userEvent.click(screen.getAllByRole("textbox")[1] as HTMLElement);
    await userEvent.keyboard("9");
    expect(on_change).toHaveBeenLastCalledWith("1934");
  });

  it("escribir sobre una celda llena sin selección también la reemplaza", async () => {
    const on_change = vi.fn();
    render(<PinInput label="Código" length={4} defaultValue="1234" onChange={on_change} />);
    const cell = screen.getAllByRole("textbox")[2] as HTMLInputElement;
    cell.focus();
    cell.setSelectionRange(1, 1);
    await userEvent.keyboard("7");
    expect(on_change).toHaveBeenLastCalledWith("1274");
  });

  it("enmascara con mask", () => {
    render(<PinInput label="Código" length={4} mask defaultValue="12" />);
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    expect(screen.getByLabelText("Digit 1 of 4").getAttribute("type")).toBe("password");
  });
});
