import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { DragDropContext } from "../DragDropContext.js";
import { Draggable } from "../Draggable.js";
import { Droppable } from "../Droppable.js";
import { DRAG_DROP_LABELS } from "../labels.js";
import { SortableList } from "../SortableList.js";

afterEach(cleanup);

const FRUITS = ["manzana", "pera", "uva"];

function Board() {
  return (
    <DragDropContext>
      <Droppable id="zona" label="Zona de destino">
        <Draggable id="ficha">Ficha</Draggable>
      </Droppable>
    </DragDropContext>
  );
}

function List() {
  const [items, set_items] = useState(FRUITS);
  return (
    <SortableList
      items={items}
      getKey={(item) => item}
      renderItem={(item) => <span>{item}</span>}
      onReorder={set_items}
      label="Fruta"
    />
  );
}

describe("DragDropContext", () => {
  it("publica las instrucciones de teclado en una región de lectura", () => {
    render(<Board />);
    expect(screen.getByText(DRAG_DROP_LABELS.instructions)).toBeDefined();
  });

  it("no monta overlay si no se pide", () => {
    render(<Board />);
    expect(document.querySelectorAll("[data-dnd-overlay]")).toHaveLength(0);
  });
});

describe("Draggable", () => {
  it("es alcanzable por teclado y se anuncia como arrastrable", () => {
    render(<Board />);
    const node = screen.getByRole("button", { name: "Ficha" });
    expect(node.getAttribute("tabindex")).toBe("0");
    expect(node.getAttribute("aria-roledescription")).toBe(DRAG_DROP_LABELS.item);
  });

  it("se marca deshabilitado sin perder el nombre accesible", () => {
    render(
      <DragDropContext>
        <Draggable id="x" disabled>
          Bloqueada
        </Draggable>
      </DragDropContext>,
    );
    const node = screen.getByText("Bloqueada");
    expect(node.getAttribute("data-disabled")).toBe("true");
  });

  it("con withHandle el asa es el único control, no la tarjeta", () => {
    render(
      <DragDropContext>
        <Draggable id="x" withHandle>
          Contenido
        </Draggable>
      </DragDropContext>,
    );
    const handle = screen.getByRole("button", { name: DRAG_DROP_LABELS.handle });
    expect(handle.tagName).toBe("BUTTON");
    expect(screen.getByText("Contenido").closest("[data-dragging]")?.getAttribute("tabindex")).toBe(
      null,
    );
  });
});

describe("Droppable", () => {
  it("empieza sin resaltar y conserva su etiqueta", () => {
    render(<Board />);
    const zone = screen.getByLabelText("Zona de destino");
    expect(zone.getAttribute("data-over")).toBe("false");
  });
});

describe("SortableList", () => {
  it("renderiza una lista semántica con un asa por elemento", () => {
    render(<List />);
    expect(screen.getByRole("list", { name: "Fruta" })).toBeDefined();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getAllByRole("button", { name: DRAG_DROP_LABELS.handle })).toHaveLength(3);
  });

  it("conserva el orden de los items que recibe", () => {
    render(<List />);
    const texts = screen.getAllByRole("listitem").map((node) => node.textContent);
    expect(texts).toStrictEqual(FRUITS);
  });

  it("muestra el vacío cuando no hay items", () => {
    render(
      <SortableList
        items={[]}
        getKey={(item: string) => item}
        renderItem={(item: string) => <span>{item}</span>}
        onReorder={vi.fn()}
        empty="No items"
      />,
    );
    expect(screen.getByText("No items")).toBeDefined();
  });

  it("permite arrastrar la fila entera cuando withHandle es false", () => {
    render(
      <SortableList
        items={FRUITS}
        getKey={(item) => item}
        renderItem={(item) => <span>{item}</span>}
        onReorder={vi.fn()}
        withHandle={false}
      />,
    );
    expect(screen.queryAllByRole("button", { name: DRAG_DROP_LABELS.handle })).toHaveLength(0);
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("acepta etiquetas propias para el anuncio de teclado", () => {
    render(
      <SortableList
        items={FRUITS}
        getKey={(item) => item}
        renderItem={(item) => <span>{item}</span>}
        onReorder={vi.fn()}
        labels={{ handle: "Mover" }}
      />,
    );
    expect(screen.getAllByRole("button", { name: "Mover" })).toHaveLength(3);
  });
});
