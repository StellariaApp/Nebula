import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { FileInput } from "../../FileInput/FileInput.js";
import { JsonInput } from "../../JsonInput/JsonInput.js";
import { TagsInput } from "../TagsInput.js";

afterEach(cleanup);

describe("TagsInput", () => {
  it("pinta un item por tag con su botón de quitar", () => {
    render(<TagsInput label="Etiquetas" value={["react", "aria"]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Remove react" })).toBeDefined();
  });

  it("añade un tag con Enter", async () => {
    const on_change = vi.fn();
    render(<TagsInput label="Etiquetas" defaultValue={[]} onChange={on_change} />);
    await userEvent.type(screen.getByLabelText("Etiquetas"), "nebula{Enter}");
    expect(on_change).toHaveBeenLastCalledWith(["nebula"]);
  });

  it("separa por coma", async () => {
    const on_change = vi.fn();
    render(<TagsInput label="Etiquetas" defaultValue={[]} onChange={on_change} />);
    await userEvent.type(screen.getByLabelText("Etiquetas"), "uno,");
    expect(on_change).toHaveBeenLastCalledWith(["uno"]);
  });

  it("quita el último tag con Backspace en input vacío", async () => {
    const on_change = vi.fn();
    render(<TagsInput label="Etiquetas" defaultValue={["a", "b"]} onChange={on_change} />);
    screen.getByLabelText("Etiquetas").focus();
    await userEvent.keyboard("{Backspace}");
    expect(on_change).toHaveBeenLastCalledWith(["a"]);
  });

  it("rechaza duplicados salvo que se permitan", async () => {
    const on_change = vi.fn();
    render(<TagsInput label="Etiquetas" defaultValue={["a"]} onChange={on_change} />);
    await userEvent.type(screen.getByLabelText("Etiquetas"), "a{Enter}");
    expect(on_change).not.toHaveBeenCalled();
  });

  it("respeta maxTags y validate", async () => {
    const on_change = vi.fn();
    render(
      <TagsInput
        label="Etiquetas"
        defaultValue={[]}
        maxTags={1}
        validate={(tag) => tag.length > 2}
        onChange={on_change}
      />,
    );
    const input = screen.getByLabelText("Etiquetas");
    await userEvent.type(input, "ab{Enter}");
    expect(on_change).not.toHaveBeenCalled();
    await userEvent.clear(input);
    await userEvent.type(input, "abc{Enter}");
    expect(on_change).toHaveBeenLastCalledWith(["abc"]);
  });

  it("en readOnly no ofrece quitar", () => {
    render(<TagsInput label="Etiquetas" value={["a"]} readOnly />);
    expect(screen.queryByRole("button", { name: "Remove a" })).toBeNull();
  });
});

describe("FileInput", () => {
  it("muestra el placeholder sin archivos", () => {
    render(<FileInput label="Adjunto" placeholder="Sin archivo" />);
    expect(screen.getByRole("button").textContent).toBe("Sin archivo");
  });

  it("muestra el nombre del archivo seleccionado", () => {
    const file = new File(["x"], "contrato.pdf", { type: "application/pdf" });
    render(<FileInput label="Adjunto" value={[file]} />);
    expect(screen.getByRole("button", { name: /contrato\.pdf/ })).toBeDefined();
  });

  it("resume varios archivos", () => {
    const files = [new File(["a"], "a.png"), new File(["b"], "b.png")];
    render(<FileInput label="Adjuntos" multiple value={files} />);
    expect(screen.getByText("2 archivos seleccionados")).toBeDefined();
  });

  it("permite limpiar la selección", async () => {
    const on_change = vi.fn();
    const file = new File(["x"], "a.png");
    render(<FileInput label="Adjunto" value={[file]} onChange={on_change} />);
    await userEvent.click(screen.getByRole("button", { name: "Remove files" }));
    expect(on_change).toHaveBeenCalledWith([]);
  });

  it("propaga accept y multiple al input nativo", () => {
    render(<FileInput label="Adjunto" accept="image/*" multiple />);
    const input = screen.getByLabelText<HTMLInputElement>("Adjunto");
    expect(input.getAttribute("accept")).toBe("image/*");
    expect(input.multiple).toBe(true);
  });
});

describe("JsonInput", () => {
  it("acepta JSON válido sin marcar error", async () => {
    render(<JsonInput label="Payload" defaultValue='{"a":1}' />);
    const area = screen.getByLabelText("Payload");
    await userEvent.click(area);
    await userEvent.tab();
    expect(area.getAttribute("aria-invalid")).toBeNull();
  });

  it("marca aria-invalid y anuncia el error al salir con JSON roto", async () => {
    render(<JsonInput label="Payload" defaultValue="{roto" errorDisplay="text" />);
    const area = screen.getByLabelText("Payload");
    await userEvent.click(area);
    await userEvent.tab();
    expect(area.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("alert")).toBeDefined();
  });

  it("formatea al perder el foco", async () => {
    const on_change = vi.fn();
    render(<JsonInput label="Payload" defaultValue='{"a":1}' onChange={on_change} />);
    await userEvent.click(screen.getByLabelText("Payload"));
    await userEvent.tab();
    expect(on_change).toHaveBeenCalledWith('{\n  "a": 1\n}');
  });

  it("no formatea si formatOnBlur es false", async () => {
    const on_change = vi.fn();
    render(
      <JsonInput
        label="Payload"
        defaultValue='{"a":1}'
        formatOnBlur={false}
        onChange={on_change}
      />,
    );
    await userEvent.click(screen.getByLabelText("Payload"));
    await userEvent.tab();
    expect(on_change).not.toHaveBeenCalled();
  });

  it("notifica los cambios de validez", async () => {
    const on_validation = vi.fn();
    render(<JsonInput label="Payload" defaultValue="{}" onValidationChange={on_validation} />);
    await userEvent.type(screen.getByLabelText("Payload"), "{{");
    expect(on_validation).toHaveBeenCalledWith(false);
  });
});
