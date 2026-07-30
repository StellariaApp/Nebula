import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import {
  CountryName,
  DialByCode,
  DialCodes,
  FlagEmoji,
  FlagImageUrl,
} from "../../../collections/dial-codes.js";
import { Dropzone } from "../../Dropzone/Dropzone.js";
import { ParseAmount } from "../../InputCurrency/currency-format.js";
import { InputCurrency } from "../../InputCurrency/InputCurrency.js";
import { InputDial } from "../../InputDial/InputDial.js";
import { Signature } from "../../Signature/Signature.js";
import { InputPhone } from "../InputPhone.js";

afterEach(cleanup);

describe("dial-codes", () => {
  it("expone los 227 países con prefijo y sin duplicados", () => {
    const codes = DialCodes();
    expect(codes).toHaveLength(227);
    expect(new Set(codes.map((entry) => entry.code)).size).toBe(227);
    expect(codes.every((entry) => entry.dial.startsWith("+"))).toBe(true);
  });

  it("normaliza los prefijos NANP sin espacios y deja uno solo por país", () => {
    expect(DialByCode("JM")?.dial).toBe("+1876");
    expect(DialByCode("DO")?.dial).toBe("+1809");
    expect(DialCodes().every((entry) => !entry.dial.includes(" "))).toBe(true);
  });

  it("deriva bandera y URL del código ISO", () => {
    expect(FlagEmoji("MX")).toBe("🇲🇽");
    expect(FlagEmoji("mx")).toBe("🇲🇽");
    expect(FlagEmoji("no-iso")).toBe("");
    expect(FlagImageUrl("mx")).toMatch(/\/MX\.svg$/);
  });

  it("traduce el nombre del país con el locale", () => {
    expect(CountryName("MX", "es")).toBe("México");
    expect(CountryName("MX", "en")).toBe("Mexico");
  });
});

describe("InputDial", () => {
  it("vincula la etiqueta y anuncia el prefijo elegido", () => {
    render(<InputDial label="Prefijo" value="MX" />);
    const input = screen.getByLabelText<HTMLInputElement>("Prefijo");
    expect(input.value).toBe("+52");
  });

  it("filtra por nombre de país y emite el código ISO", async () => {
    const on_change = vi.fn();
    render(<InputDial label="Prefijo" onChange={on_change} />);
    await userEvent.type(screen.getByLabelText("Prefijo"), "Colomb");
    await userEvent.click(await screen.findByRole("option", { name: /Colombia/ }));
    expect(on_change).toHaveBeenCalledWith("CO");
  });

  it("acepta un dataset propio", () => {
    render(<InputDial label="Prefijo" data={[{ code: "MX", dial: "+52" }]} value="MX" />);
    expect(screen.getByLabelText<HTMLInputElement>("Prefijo").value).toBe("+52");
  });
});

describe("InputPhone", () => {
  it("expone dos controles: número y prefijo", () => {
    render(<InputPhone label="Teléfono" dialValue="MX" />);
    expect(screen.getByLabelText("Teléfono")).toHaveProperty("type", "tel");
    expect(screen.getByLabelText("Prefijo telefónico")).toBeDefined();
  });

  it("emite número y prefijo por separado", async () => {
    const on_change = vi.fn();
    const on_dial = vi.fn();
    render(<InputPhone label="Teléfono" onChange={on_change} onDialChange={on_dial} />);
    await userEvent.type(screen.getByLabelText("Teléfono"), "5512");
    expect(on_change).toHaveBeenLastCalledWith("5512");
  });

  it("descarta lo que no sea dígito, espacio o guion", async () => {
    const on_change = vi.fn();
    render(<InputPhone label="Teléfono" onChange={on_change} />);
    await userEvent.type(screen.getByLabelText("Teléfono"), "5a5b");
    expect(on_change).toHaveBeenLastCalledWith("55");
  });

  it("lee ambos NebulaField", () => {
    render(
      <InputPhone
        label="Teléfono"
        field={{ value: "5512345678", setValue: vi.fn(), status: "valid", touched: true }}
        fieldDial={{ value: "CO", setValue: vi.fn(), status: "valid", touched: true }}
      />,
    );
    expect(screen.getByLabelText<HTMLInputElement>("Teléfono").value).toBe("5512345678");
    expect(screen.getByLabelText<HTMLInputElement>("Prefijo telefónico").value).toBe("+57");
  });
});

describe("InputCurrency", () => {
  it("formatea el valor en reposo y lo edita en crudo al enfocar", async () => {
    render(<InputCurrency label="Importe" currency="MXN" locale="es-MX" value={1234.5} />);
    const input = screen.getByLabelText<HTMLInputElement>("Importe");
    expect(input.value).toMatch(/1[,.]234[,.]5/);
    await userEvent.click(input);
    expect(input.value).toBe("1234.5");
  });

  it("respeta min y max", async () => {
    const on_change = vi.fn();
    render(
      <InputCurrency label="Importe" currency="USD" locale="en-US" max={100} onChange={on_change} />,
    );
    await userEvent.type(screen.getByLabelText("Importe"), "500");
    expect(on_change).toHaveBeenLastCalledWith(100);
  });

  it("vacía a NaN cuando se borra", async () => {
    const on_change = vi.fn();
    render(
      <InputCurrency
        label="Importe"
        currency="USD"
        locale="en-US"
        defaultValue={10}
        onChange={on_change}
      />,
    );
    await userEvent.clear(screen.getByLabelText("Importe"));
    expect(Number.isNaN(on_change.mock.calls.at(-1)?.[0])).toBe(true);
  });

  it("parsea según el separador decimal del locale", () => {
    expect(ParseAmount("1.234,56", "es-ES")).toBeCloseTo(1234.56);
    expect(ParseAmount("1,234.56", "en-US")).toBeCloseTo(1234.56);
  });
});

describe("Signature", () => {
  it("es un lienzo con nombre accesible y acciones deshabilitadas en vacío", () => {
    render(<Signature label="Firma" />);
    expect(screen.getByRole("img", { name: "Sin firma" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Deshacer trazo" })).toHaveProperty("disabled", true);
    expect(screen.getByRole("button", { name: "Borrar firma" })).toHaveProperty("disabled", true);
  });

  it("describe el lienzo con la pista de uso", () => {
    render(<Signature label="Firma" />);
    const canvas = screen.getByRole("img", { name: "Sin firma" });
    const described = canvas.getAttribute("aria-describedby");
    expect(described).not.toBeNull();
  });
});

describe("Dropzone", () => {
  it("es un botón operable con teclado, no solo un área de arrastre", () => {
    render(<Dropzone label="Adjuntos" />);
    const zone = screen.getByRole("button", { name: "Adjuntos" });
    expect(zone.tagName).toBe("BUTTON");
    expect(zone.textContent).toContain("Arrastra archivos");
  });

  it("lista los archivos del valor y ofrece quitarlos", () => {
    const file = new File(["x"], "contrato.pdf", { type: "application/pdf" });
    render(<Dropzone label="Adjuntos" kind="pdf" value={[file]} />);
    expect(screen.getByText("contrato.pdf")).toBeDefined();
    expect(screen.getByRole("button", { name: /Quitar archivo: contrato\.pdf/ })).toBeDefined();
  });

  it("quita el archivo indicado", async () => {
    const on_change = vi.fn();
    const a = new File(["a"], "a.pdf", { type: "application/pdf" });
    const b = new File(["b"], "b.pdf", { type: "application/pdf" });
    render(<Dropzone label="Adjuntos" kind="pdf" value={[a, b]} onChange={on_change} />);
    await userEvent.click(screen.getByRole("button", { name: /Quitar archivo: a\.pdf/ }));
    expect(on_change).toHaveBeenCalledWith([b]);
  });

  it("traduce el tipo a un accept nativo", () => {
    const { container } = render(<Dropzone label="Fotos" kind="image" />);
    const input = container.querySelector("input[type='file']");
    expect(input?.getAttribute("accept")).toBe("image/*");
  });
});
