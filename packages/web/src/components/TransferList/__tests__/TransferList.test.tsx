import { useState } from "react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { TRANSFER_LIST_LABELS } from "../labels.js";
import { TransferList } from "../TransferList.js";

afterEach(cleanup);

const DATA = [
  { value: "read", label: "Lectura" },
  { value: "write", label: "Escritura" },
  { value: "admin", label: "Administración" },
  { value: "audit", label: "Auditoría", disabled: true },
];

function Controlled(props: { onChange?: (next: string[]) => void }) {
  const [value, set_value] = useState<string[]>([]);
  return (
    <TransferList
      data={DATA}
      value={value}
      onChange={(next) => {
        set_value(next);
        props.onChange?.(next);
      }}
      source={{ title: "Disponibles" }}
      target={{ title: "Asignados" }}
    />
  );
}

describe("TransferList", () => {
  it("monta dos listas multiseleccionables con su etiqueta", () => {
    render(<Controlled />);
    expect(screen.getByRole("listbox", { name: "Disponibles" })).toBeDefined();
    expect(screen.getByRole("listbox", { name: "Asignados" })).toBeDefined();
  });

  it("arranca con todo en el origen", () => {
    render(<Controlled />);
    const source = screen.getByRole("listbox", { name: "Disponibles" });
    expect(source.querySelectorAll("[role='option']")).toHaveLength(4);
  });

  it("mueve lo marcado al pulsar añadir", async () => {
    const user = userEvent.setup();
    const on_change = vi.fn();
    render(<Controlled onChange={on_change} />);

    await user.click(screen.getByRole("option", { name: "Lectura" }));
    await user.click(screen.getByRole("button", { name: TRANSFER_LIST_LABELS.add }));

    expect(on_change).toHaveBeenCalledWith(["read"]);
    const target = screen.getByRole("listbox", { name: "Asignados" });
    expect(target.querySelectorAll("[role='option']")).toHaveLength(1);
  });

  it("marca la opción con aria-selected antes de moverla", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    const option = screen.getByRole("option", { name: "Lectura" });
    expect(option.getAttribute("aria-selected")).toBe("false");
    await user.click(option);
    expect(screen.getByRole("option", { name: "Lectura" }).getAttribute("aria-selected")).toBe(
      "true",
    );
  });

  it("añadir todo respeta las opciones deshabilitadas", async () => {
    const user = userEvent.setup();
    const on_change = vi.fn();
    render(<Controlled onChange={on_change} />);
    await user.click(screen.getByRole("button", { name: TRANSFER_LIST_LABELS.addAll }));
    expect(on_change).toHaveBeenCalledWith(["read", "write", "admin"]);
  });

  it("los botones de mover arrancan deshabilitados", () => {
    render(<Controlled />);
    const add = screen.getByRole("button", { name: TRANSFER_LIST_LABELS.add });
    expect(add.getAttribute("data-disabled")).toBe("true");
  });

  it("la opción deshabilitada no se puede marcar", () => {
    render(<Controlled />);
    const option = screen.getByRole("option", { name: "Auditoría" });
    expect(option.hasAttribute("disabled")).toBe(true);
  });

  it("muestra el buscador solo si se pide", () => {
    const view = render(<TransferList data={DATA} source={{ title: "A" }} />);
    expect(screen.queryByLabelText(TRANSFER_LIST_LABELS.search)).toBeNull();
    view.unmount();
    render(<TransferList data={DATA} searchable source={{ title: "A" }} target={{ title: "B" }} />);
    expect(screen.getAllByLabelText(TRANSFER_LIST_LABELS.search)).toHaveLength(2);
  });

  it("respeta un valor inicial no controlado", () => {
    render(
      <TransferList
        data={DATA}
        defaultValue={["write"]}
        source={{ title: "Disponibles" }}
        target={{ title: "Asignados" }}
      />,
    );
    const target = screen.getByRole("listbox", { name: "Asignados" });
    expect(target.textContent).toContain("Escritura");
  });

  it("muestra el vacío de cada panel", () => {
    render(
      <TransferList
        data={[]}
        source={{ title: "Disponibles", empty: "Nada disponible" }}
        target={{ title: "Asignados", empty: "Nada asignado" }}
      />,
    );
    expect(screen.getByText("Nada disponible")).toBeDefined();
    expect(screen.getByText("Nada asignado")).toBeDefined();
  });
});
