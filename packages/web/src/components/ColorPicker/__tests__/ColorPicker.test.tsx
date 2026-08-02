import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { ColorInput } from "../ColorInput.js";
import { ColorPicker } from "../ColorPicker.js";

afterEach(cleanup);

const SWATCHES = ["#3f37c9", "#9d4edd", "#22b8cf"];

describe("ColorPicker", () => {
  it("expone área, tono y muestras con nombre accesible", () => {
    render(<ColorPicker label="Color" defaultValue="#3f37c9" swatches={SWATCHES} />);
    expect(screen.getByRole("group", { name: "Color" })).toBeDefined();
    expect(screen.getByRole("group", { name: "Muestras" })).toBeDefined();
    expect(screen.getAllByRole("button")).toHaveLength(SWATCHES.length);
  });

  it("emite el color de la muestra en el formato pedido", async () => {
    const on_change = vi.fn();
    render(
      <ColorPicker label="Color" defaultValue="#000000" swatches={SWATCHES} onChange={on_change} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "#9d4edd" }));
    expect(on_change).toHaveBeenCalledWith("#9D4EDD");
  });

  it("marca la muestra activa con aria-pressed", () => {
    render(<ColorPicker label="Color" value="#3f37c9" swatches={SWATCHES} />);
    expect(screen.getByRole("button", { name: "#3f37c9" }).getAttribute("aria-pressed")).toBe(
      "true",
    );
  });

  it("añade el canal alpha solo con withAlpha", () => {
    const { unmount } = render(<ColorPicker label="Color" defaultValue="#3f37c9" />);
    expect(screen.queryByLabelText("Opacidad")).toBeNull();
    unmount();
    render(<ColorPicker label="Color" defaultValue="#3f37c9" withAlpha format="hexa" />);
    expect(screen.getByLabelText("Opacidad")).toBeDefined();
  });

  it("no rompe con un color malformado", () => {
    render(<ColorPicker label="Color" value="no-es-un-color" />);
    expect(screen.getByRole("group", { name: "Color" })).toBeDefined();
  });
});

describe("ColorInput", () => {
  it("vincula el label al campo de texto", () => {
    render(<ColorInput label="Color de marca" defaultValue="#3f37c9" />);
    expect(screen.getByLabelText<HTMLInputElement>("Color de marca").value).toBe("#3f37c9");
  });

  it("emite lo que se escribe", async () => {
    const on_change = vi.fn();
    render(<ColorInput label="Color" defaultValue="" onChange={on_change} />);
    await userEvent.type(screen.getByLabelText("Color"), "#fff");
    expect(on_change).toHaveBeenCalled();
  });

  it("marca aria-invalid con un color no reconocido", async () => {
    render(<ColorInput label="Color" defaultValue="" errorDisplay="text" />);
    const input = screen.getByLabelText("Color");
    await userEvent.type(input, "rojo");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("alert").textContent).toBe("Color no reconocido");
  });

  it("abre el picker desde el trigger", async () => {
    render(<ColorInput label="Color" defaultValue="#3f37c9" swatches={SWATCHES} />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir selector de color" }));
    expect(screen.getByRole("group", { name: "Muestras" })).toBeDefined();
  });

  it("oculta el trigger con withPicker={false}", () => {
    render(<ColorInput label="Color" defaultValue="#3f37c9" withPicker={false} />);
    expect(screen.queryByRole("button", { name: "Abrir selector de color" })).toBeNull();
  });

  it("lee el valor de un NebulaField", () => {
    render(
      <ColorInput
        label="Color"
        field={{ value: "#22b8cf", setValue: vi.fn(), status: "valid", touched: true }}
      />,
    );
    expect(screen.getByLabelText<HTMLInputElement>("Color").value).toBe("#22b8cf");
  });
});
