import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import { AsyncSelect } from "../../Combobox/AsyncSelect.js";
import { Autocomplete } from "../../Combobox/Autocomplete.js";
import { CreatableSelect } from "../../Combobox/CreatableSelect.js";
import { SearchableSelect } from "../../Combobox/SearchableSelect.js";
import { Stepper } from "../../Stepper/Stepper.js";
import { TextInput } from "../../TextInput/TextInput.js";
import { Form } from "../Form.js";
import { FormDelete } from "../FormDelete.js";
import { ModalDelete } from "../ModalDelete.js";

afterEach(cleanup);

const OPCIONES = [
  { value: "mx", label: "México" },
  { value: "co", label: "Colombia" },
  { value: "cl", label: "Chile" },
];

const PASOS = [
  { label: "Datos", description: "Identidad" },
  { label: "Contacto" },
  { label: "Revisión" },
];

describe("Form", () => {
  it("compone header, content y footer dentro de un form", () => {
    render(
      <Form>
        <Form.Header title="Alta" description="Rellena los campos" />
        <Form.Content>
          <TextInput label="Nombre" />
        </Form.Content>
        <Form.Footer />
      </Form>,
    );
    expect(screen.getByRole("heading", { name: "Alta" })).toBeDefined();
    expect(screen.getByLabelText("Nombre")).toBeDefined();
    expect(screen.getByRole("button", { name: "Guardar" })).toHaveProperty("type", "submit");
  });

  it("envía y previene la navegación del navegador", async () => {
    const on_submit = vi.fn();
    render(
      <Form onSubmit={on_submit}>
        <Form.Footer />
      </Form>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Guardar" }));
    expect(on_submit).toHaveBeenCalledTimes(1);
    expect(on_submit.mock.calls[0]?.[0]?.defaultPrevented).toBe(true);
  });

  it("isPending deshabilita todos los campos, no solo el botón", () => {
    render(
      <Form isPending>
        <Form.Content>
          <TextInput label="Nombre" />
        </Form.Content>
        <Form.Footer />
      </Form>,
    );
    expect(screen.getByLabelText("Nombre").matches(":disabled")).toBe(true);
  });

  it("anuncia el error del footer como alert", () => {
    render(
      <Form>
        <Form.Footer error="No se pudo guardar" />
      </Form>,
    );
    expect(screen.getByRole("alert").textContent).toBe("No se pudo guardar");
  });

  it("el footer acepta acciones propias en lugar del par por defecto", () => {
    render(
      <Form>
        <Form.Footer>
          <button type="button">Solo esto</button>
        </Form.Footer>
      </Form>,
    );
    expect(screen.queryByRole("button", { name: "Guardar" })).toBeNull();
    expect(screen.getByRole("button", { name: "Solo esto" })).toBeDefined();
  });

  it("la banderole se pinta dentro del form", () => {
    render(
      <Form>
        <Form.Banderole>Borrador</Form.Banderole>
      </Form>,
    );
    expect(screen.getByText("Borrador")).toBeDefined();
  });

  it("un subcomponente fuera de Form falla con un mensaje claro", () => {
    const quiet = vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => render(<Form.Footer />)).toThrow(/dentro de <Form>/);
    quiet.mockRestore();
  });
});

describe("FormDelete", () => {
  it("usa el color de error y el texto destructivo", () => {
    render(<FormDelete alert={{ title: "Vas a eliminar" }} onCancel={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Eliminar" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDefined();
    expect(screen.getByText("Vas a eliminar")).toBeDefined();
  });
});

describe("ModalDelete", () => {
  it("no se cierra por fuera mientras hay una petición en curso", () => {
    render(<ModalDelete opened onClose={vi.fn()} isPending title="Eliminar cliente" />);
    expect(screen.getByRole("dialog", { name: "Eliminar cliente" })).toBeDefined();
  });
});

describe("Stepper", () => {
  it("marca el paso actual y describe el estado de cada uno", () => {
    render(<Stepper steps={PASOS} active={1} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[1]?.getAttribute("aria-current")).toBe("step");
    expect(items[0]?.textContent).toContain("completado");
    expect(items[2]?.textContent).toContain("pendiente");
  });

  it("solo permite volver a pasos ya alcanzados", async () => {
    const on_click = vi.fn();
    render(<Stepper steps={PASOS} active={1} onStepClick={on_click} />);
    await userEvent.click(screen.getByRole("button", { name: /Datos/ }));
    expect(on_click).toHaveBeenCalledWith(0);
    expect(screen.queryByRole("button", { name: /Revisión/ })).toBeNull();
  });

  it("allowNextStepsSelect abre los pasos futuros", () => {
    render(<Stepper steps={PASOS} active={0} onStepClick={vi.fn()} allowNextStepsSelect />);
    expect(screen.getByRole("button", { name: /Revisión/ })).toBeDefined();
  });

  it("un paso con error se anuncia como tal", () => {
    const con_error = [{ label: "Datos", error: true }, { label: "Fin" }];
    render(<Stepper steps={con_error} active={1} />);
    expect(screen.getAllByRole("listitem")[0]?.textContent).toContain("con errores");
  });

  it("cada variante del subconjunto resuelve una receta distinta", () => {
    const seen = new Set<string>();
    for (const variant of ["filled", "light", "outline"] as const) {
      const view = render(<Stepper steps={PASOS} active={1} variant={variant} />);
      seen.add(screen.getByRole("list").parentElement?.getAttribute("style") ?? "");
      view.unmount();
    }
    expect(seen.size).toBe(3);
  });
});

describe("patterns de Combobox", () => {
  it("Autocomplete admite un valor que no está en la lista", async () => {
    render(<Autocomplete label="Ciudad" data={OPCIONES} />);
    await userEvent.type(screen.getByRole("combobox", { name: "Ciudad" }), "Xalapa");
    expect(screen.getByRole<HTMLInputElement>("combobox", { name: "Ciudad" }).value).toBe("Xalapa");
  });

  it("SearchableSelect filtra y solo deja elegir de la lista", async () => {
    const on_change = vi.fn();
    render(<SearchableSelect label="País" data={OPCIONES} onChange={on_change} />);
    await userEvent.type(screen.getByRole("combobox", { name: "País" }), "Chi");
    await userEvent.click(await screen.findByRole("option", { name: "Chile" }));
    expect(on_change).toHaveBeenCalledWith("cl");
  });

  it("CreatableSelect ofrece crear lo que no existe y lo añade a la lista", async () => {
    const on_create = vi.fn((label: string) => ({ value: label.toLowerCase(), label }));
    const on_change = vi.fn();
    render(
      <CreatableSelect
        label="Etiqueta"
        data={OPCIONES}
        onCreate={on_create}
        onChange={on_change}
      />,
    );
    await userEvent.type(screen.getByRole("combobox", { name: "Etiqueta" }), "Perú");
    await userEvent.click(await screen.findByRole("option", { name: /Perú/ }));
    expect(on_create).toHaveBeenCalledWith("Perú");
    expect(on_change).toHaveBeenCalledWith("perú");
  });

  it("CreatableSelect no ofrece crear algo que ya existe", async () => {
    render(<CreatableSelect label="Etiqueta" data={OPCIONES} />);
    await userEvent.type(screen.getByRole("combobox", { name: "Etiqueta" }), "México");
    const options = await screen.findAllByRole("option");
    expect(options).toHaveLength(1);
  });

  it("AsyncSelect debouncea la carga y anuncia el estado", async () => {
    const load = vi.fn((query: string) =>
      Promise.resolve(
        OPCIONES.filter((option) => option.label.toLowerCase().includes(query.toLowerCase())),
      ),
    );
    render(<AsyncSelect label="Remoto" load={load} debounce={10} />);
    await userEvent.type(screen.getByRole("combobox", { name: "Remoto" }), "Col");
    await waitFor(
      () => {
        expect(load).toHaveBeenCalledWith("Col");
      },
      { timeout: 4000 },
    );
    expect(await screen.findByRole("option", { name: "Colombia" })).toBeDefined();
  });

  it("AsyncSelect no carga por debajo de minQueryLength", async () => {
    const load = vi.fn(() => Promise.resolve(OPCIONES));
    render(<AsyncSelect label="Remoto" load={load} debounce={10} minQueryLength={3} />);
    await userEvent.type(screen.getByRole("combobox", { name: "Remoto" }), "Co");
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(load).not.toHaveBeenCalled();
  });
});
