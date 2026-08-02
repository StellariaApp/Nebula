import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Fieldset } from "../../Fieldset/Fieldset.js";
import { Rating } from "../Rating.js";

afterEach(cleanup);

describe("Rating", () => {
  it("expone un radiogroup con una opción por estrella", () => {
    render(<Rating label="Valoración" defaultValue={3} />);
    expect(screen.getByRole("radiogroup")).toBeDefined();
    expect(screen.getAllByRole("radio")).toHaveLength(5);
  });

  it("marca como checked solo la estrella del valor", () => {
    render(<Rating label="Valoración" value={3} />);
    const checked = screen
      .getAllByRole("radio")
      .filter((n) => n.getAttribute("aria-checked") === "true");
    expect(checked).toHaveLength(1);
    expect(checked[0]?.getAttribute("aria-label")).toBe("3 de 5");
  });

  it("emite el valor al pulsar una estrella", async () => {
    const on_change = vi.fn();
    render(<Rating label="Valoración" defaultValue={0} onChange={on_change} />);
    await userEvent.click(screen.getByRole("radio", { name: "4 de 5" }));
    expect(on_change).toHaveBeenCalledWith(4);
  });

  it("respeta count y itemLabel", () => {
    render(<Rating label="V" count={3} itemLabel={(v) => `${String(v)} estrellas`} />);
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByRole("radio", { name: "2 estrellas" })).toBeDefined();
  });

  it("en readOnly deja de ser interactivo y anuncia el valor", () => {
    render(<Rating label="Valoración" value={4} readOnly />);
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
    expect(screen.getByRole("img", { name: "4 de 5" })).toBeDefined();
  });

  it("disabled no dispara la acción", async () => {
    const on_change = vi.fn();
    render(<Rating label="V" disabled defaultValue={0} onChange={on_change} />);
    await userEvent.click(screen.getByRole("radio", { name: "2 de 5" }));
    expect(on_change).not.toHaveBeenCalled();
  });

  it("lee el valor de un NebulaField", () => {
    render(
      <Rating label="V" field={{ value: 5, setValue: vi.fn(), status: "valid", touched: true }} />,
    );
    expect(screen.getByRole("radio", { name: "5 de 5" }).getAttribute("aria-checked")).toBe("true");
  });
});

describe("Fieldset", () => {
  it("agrupa con legend accesible", () => {
    render(
      <Fieldset legend="Datos de contacto">
        <input aria-label="Correo" />
      </Fieldset>,
    );
    expect(screen.getByRole("group", { name: "Datos de contacto" })).toBeDefined();
  });

  it("propaga el bloqueo por el fieldset nativo, no por prop en cada hijo", () => {
    render(
      <Fieldset legend="Bloqueado" disabled>
        <input aria-label="Correo" />
      </Fieldset>,
    );
    const group = screen.getByRole<HTMLFieldSetElement>("group", { name: "Bloqueado" });
    expect(group.disabled).toBe(true);
    expect(screen.getByLabelText("Correo").matches(":disabled")).toBe(true);
  });

  it("vincula la descripción con aria-describedby", () => {
    render(
      <Fieldset legend="Envío" description="Solo península">
        <input aria-label="Calle" />
      </Fieldset>,
    );
    const group = screen.getByRole("group", { name: "Envío" });
    const described = group.getAttribute("aria-describedby");
    expect(described).not.toBeNull();
    expect(document.getElementById(described as string)?.textContent).toBe("Solo península");
  });

  it("resuelve una clase distinta por variante", () => {
    const { unmount } = render(<Fieldset legend="A" surface="outline" />);
    const base = screen.getByRole("group", { name: "A" }).className;
    unmount();
    render(<Fieldset legend="A" surface="filled" />);
    expect(screen.getByRole("group", { name: "A" }).className).not.toBe(base);
  });
});
