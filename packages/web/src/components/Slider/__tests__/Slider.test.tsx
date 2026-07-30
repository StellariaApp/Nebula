import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Chip } from "../../Chip/Chip.js";
import { ChipGroup } from "../../Chip/ChipGroup.js";
import { NativeSelect } from "../../NativeSelect/NativeSelect.js";
import { RangeSlider } from "../RangeSlider.js";
import { Slider } from "../Slider.js";

afterEach(cleanup);

const OPCIONES = [
  { value: "mx", label: "México" },
  { value: "co", label: "Colombia" },
  { value: "ar", label: "Argentina", disabled: true },
];

describe("Slider", () => {
  it("expone un slider con el valor y los límites", () => {
    render(<Slider label="Volumen" value={40} min={0} max={100} />);
    const input = screen.getByRole<HTMLInputElement>("slider");
    expect(input.type).toBe("range");
    expect(input.value).toBe("40");
    expect(input.min).toBe("0");
    expect(input.max).toBe("100");
  });

  it("oculta visualmente el input nativo y deja el thumb como única pieza pintada", () => {
    render(<Slider label="Volumen" value={40} />);
    const input = screen.getByRole<HTMLInputElement>("slider");
    const hidden = input.parentElement;
    expect(hidden?.getAttribute("style")).toMatch(/clip(-path)?/);

    const thumb = hidden?.parentElement;
    expect(thumb?.getAttribute("style")).toMatch(/translate\(-50%, ?-50%\)/);
    expect(thumb?.getAttribute("style")).toMatch(/left: ?40%/);
  });

  it("mueve el valor con las flechas respetando step", async () => {
    const on_change = vi.fn();
    render(<Slider label="Volumen" defaultValue={40} step={5} onChange={on_change} />);
    screen.getByRole("slider").focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(on_change).toHaveBeenLastCalledWith(45);
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(on_change).toHaveBeenLastCalledWith(35);
  });

  it("salta a los extremos con Home y End", async () => {
    const on_change = vi.fn();
    render(<Slider label="V" defaultValue={40} min={10} max={90} onChange={on_change} />);
    screen.getByRole("slider").focus();
    await userEvent.keyboard("{End}");
    expect(on_change).toHaveBeenLastCalledWith(90);
    await userEvent.keyboard("{Home}");
    expect(on_change).toHaveBeenLastCalledWith(10);
  });

  it("no se mueve deshabilitado", async () => {
    const on_change = vi.fn();
    render(<Slider label="V" defaultValue={40} disabled onChange={on_change} />);
    screen.getByRole("slider").focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(on_change).not.toHaveBeenCalled();
  });

  it("formatea el valor mostrado", () => {
    render(<Slider label="Precio" value={40} formatValue={(v) => `${String(v)} €`} />);
    expect(screen.getByText("40 €")).toBeDefined();
  });

  it("lee el valor de un NebulaField", () => {
    render(
      <Slider label="V" field={{ value: 75, setValue: vi.fn(), status: "valid", touched: true }} />,
    );
    expect(screen.getByRole<HTMLInputElement>("slider").value).toBe("75");
  });
});

describe("RangeSlider", () => {
  it("expone dos thumbs etiquetados", () => {
    render(<RangeSlider label="Precio" value={{ start: 20, end: 80 }} />);
    const thumbs = screen.getAllByRole<HTMLInputElement>("slider");
    expect(thumbs).toHaveLength(2);
    expect(thumbs[0]?.value).toBe("20");
    expect(thumbs[1]?.value).toBe("80");
    expect(thumbs[0]?.getAttribute("aria-label")).toBe("Mínimo");
    expect(thumbs[1]?.getAttribute("aria-label")).toBe("Máximo");
  });

  it("emite {start,end} al mover un thumb", async () => {
    const on_change = vi.fn();
    render(
      <RangeSlider label="Precio" defaultValue={{ start: 20, end: 80 }} onChange={on_change} />,
    );
    (screen.getAllByRole("slider")[0] as HTMLElement).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(on_change).toHaveBeenLastCalledWith({ start: 21, end: 80 });
  });
});

describe("Chip", () => {
  it("es un checkbox accesible con su etiqueta", () => {
    render(<Chip>Destacado</Chip>);
    expect(screen.getByRole("checkbox", { name: "Destacado" })).toBeDefined();
  });

  it("alterna al pulsar", async () => {
    const on_change = vi.fn();
    render(<Chip onChange={on_change}>Activo</Chip>);
    await userEvent.click(screen.getByRole("checkbox", { name: "Activo" }));
    expect(on_change).toHaveBeenCalledWith(true);
  });

  it("no alterna deshabilitado", async () => {
    const on_change = vi.fn();
    render(
      <Chip disabled onChange={on_change}>
        Bloqueado
      </Chip>,
    );
    await userEvent.click(screen.getByRole("checkbox", { name: "Bloqueado" }));
    expect(on_change).not.toHaveBeenCalled();
  });
});

describe("ChipGroup", () => {
  it("en modo simple usa radios y deja un solo seleccionado", async () => {
    const on_change = vi.fn();
    render(
      <ChipGroup label="Plan" defaultValue={["free"]} onChange={on_change}>
        <Chip value="free">Gratuito</Chip>
        <Chip value="pro">Pro</Chip>
      </ChipGroup>,
    );
    expect(screen.getAllByRole("radio")).toHaveLength(2);
    await userEvent.click(screen.getByRole("radio", { name: "Pro" }));
    expect(on_change).toHaveBeenLastCalledWith(["pro"]);
  });

  it("en modo multiple acumula la selección", async () => {
    const on_change = vi.fn();
    render(
      <ChipGroup label="Etiquetas" multiple defaultValue={["a"]} onChange={on_change}>
        <Chip value="a">A</Chip>
        <Chip value="b">B</Chip>
      </ChipGroup>,
    );
    await userEvent.click(screen.getByRole("checkbox", { name: "B" }));
    expect(on_change).toHaveBeenLastCalledWith(["a", "b"]);
  });

  it("deselecciona al volver a pulsar en modo multiple", async () => {
    const on_change = vi.fn();
    render(
      <ChipGroup label="Etiquetas" multiple defaultValue={["a"]} onChange={on_change}>
        <Chip value="a">A</Chip>
      </ChipGroup>,
    );
    await userEvent.click(screen.getByRole("checkbox", { name: "A" }));
    expect(on_change).toHaveBeenLastCalledWith([]);
  });

  it("propaga size/color/disabled a los chips", () => {
    render(
      <ChipGroup label="G" disabled>
        <Chip value="a">A</Chip>
      </ChipGroup>,
    );
    expect(screen.getByRole("radio", { name: "A" })).toHaveProperty("disabled", true);
  });
});

describe("NativeSelect", () => {
  it("vincula el label a un select nativo", () => {
    render(<NativeSelect label="País" data={OPCIONES} defaultValue="mx" />);
    const select = screen.getByLabelText<HTMLSelectElement>("País");
    expect(select.tagName).toBe("SELECT");
    expect(select.value).toBe("mx");
  });

  it("emite el valor elegido", async () => {
    const on_change = vi.fn();
    render(<NativeSelect label="País" data={OPCIONES} defaultValue="mx" onChange={on_change} />);
    await userEvent.selectOptions(screen.getByLabelText("País"), "co");
    expect(on_change).toHaveBeenCalledWith("co");
  });

  it("respeta las opciones deshabilitadas", () => {
    render(<NativeSelect label="País" data={OPCIONES} defaultValue="mx" />);
    expect(screen.getByRole("option", { name: "Argentina" })).toHaveProperty("disabled", true);
  });

  it("agrupa con optgroup", () => {
    render(
      <NativeSelect
        label="Destino"
        groups={[
          { label: "América", options: OPCIONES.slice(0, 2) },
          { label: "Europa", options: [{ value: "es", label: "España" }] },
        ]}
        defaultValue="mx"
      />,
    );
    expect(screen.getByRole("group", { name: "América" })).toBeDefined();
    expect(screen.getByRole("option", { name: "España" })).toBeDefined();
  });

  it("anuncia el error", () => {
    render(
      <NativeSelect label="País" data={OPCIONES} error="Elige un país" errorDisplay="text" />,
    );
    expect(screen.getByLabelText("País").getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("alert").textContent).toBe("Elige un país");
  });
});
