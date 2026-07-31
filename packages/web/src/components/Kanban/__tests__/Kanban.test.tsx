import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { KanbanBoard } from "../KanbanBoard.js";
import { KanbanCard } from "../KanbanCard.js";
import { ColumnOf, GroupKeys, MoveKey } from "../useKanbanBoard.js";

afterEach(cleanup);

interface Task {
  id: string;
  title: string;
  status: string;
}

const COLUMNS = [
  { id: "todo", title: "Por hacer" },
  { id: "doing", title: "En curso", limit: 2 },
  { id: "done", title: "Hecho", empty: "Nada terminado" },
];

const TASKS: Task[] = [
  { id: "t1", title: "Migrar tokens", status: "todo" },
  { id: "t2", title: "Cerrar W4.1", status: "todo" },
  { id: "t3", title: "Escribir ADR", status: "doing" },
];

function Board(props: { onMove?: () => void }) {
  return (
    <KanbanBoard
      columns={COLUMNS}
      items={TASKS}
      getKey={(task) => task.id}
      getColumn={(task) => task.status}
      renderCard={(task) => <KanbanCard title={task.title} />}
      onMove={props.onMove ?? vi.fn()}
      label="Tablero"
    />
  );
}

describe("Kanban — reparto de claves", () => {
  it("agrupa por columna respetando el orden de entrada", () => {
    const groups = GroupKeys(
      ["a", "b"],
      [
        { key: "1", column: "a" },
        { key: "2", column: "b" },
        { key: "3", column: "a" },
      ],
    );
    expect(groups).toStrictEqual({ a: ["1", "3"], b: ["2"] });
  });

  it("descarta claves de columnas que no existen", () => {
    const groups = GroupKeys(["a"], [{ key: "1", column: "fantasma" }]);
    expect(groups).toStrictEqual({ a: [] });
  });

  it("encuentra la columna de una clave y devuelve null si no está", () => {
    const groups = { a: ["1"], b: ["2"] };
    expect(ColumnOf(groups, "2")).toBe("b");
    expect(ColumnOf(groups, "9")).toBeNull();
  });

  it("mueve una clave entre columnas en la posición pedida", () => {
    const groups = { a: ["1", "2"], b: ["3"] };
    expect(MoveKey(groups, "1", "b", 0)).toStrictEqual({ a: ["2"], b: ["1", "3"] });
  });

  it("reordena dentro de la misma columna sin duplicar", () => {
    const groups = { a: ["1", "2", "3"] };
    expect(MoveKey(groups, "3", "a", 0)).toStrictEqual({ a: ["3", "1", "2"] });
  });

  it("un índice fuera de rango cae al final", () => {
    const groups = { a: ["1"], b: ["2"] };
    expect(MoveKey(groups, "1", "b", 99)).toStrictEqual({ a: [], b: ["2", "1"] });
  });
});

describe("KanbanBoard", () => {
  it("pinta una región por columna con su cabecera", () => {
    render(<Board />);
    expect(screen.getByRole("region", { name: "Por hacer" })).toBeDefined();
    expect(screen.getByRole("region", { name: "En curso" })).toBeDefined();
    expect(screen.getByRole("region", { name: "Hecho" })).toBeDefined();
  });

  it("reparte las tarjetas por getColumn", () => {
    render(<Board />);
    const todo = screen.getByRole("region", { name: "Por hacer" });
    expect(todo.querySelectorAll("li")).toHaveLength(2);
    expect(screen.getByText("Migrar tokens")).toBeDefined();
  });

  it("cuenta las tarjetas y muestra el límite de la columna", () => {
    render(<Board />);
    const doing = screen.getByRole("region", { name: "En curso" });
    expect(doing.textContent).toContain("1/2");
  });

  it("muestra el vacío declarado por la columna", () => {
    render(<Board />);
    expect(screen.getByText("Nada terminado")).toBeDefined();
  });

  it("cada tarjeta es alcanzable por teclado", () => {
    render(<Board />);
    const cards = screen.getAllByRole("button");
    expect(cards.length).toBeGreaterThanOrEqual(3);
    for (const card of cards) expect(card.getAttribute("tabindex")).toBe("0");
  });

  it("no rompe con una columna sin tarjetas ni vacío declarado", () => {
    render(
      <KanbanBoard
        columns={[{ id: "solo", title: "Sola" }]}
        items={[]}
        getKey={(task: Task) => task.id}
        getColumn={(task: Task) => task.status}
        renderCard={(task: Task) => <KanbanCard title={task.title} />}
        onMove={vi.fn()}
      />,
    );
    expect(screen.getByRole("region", { name: "Sola" })).toBeDefined();
  });
});

describe("KanbanCard", () => {
  it("compone título, descripción y meta", () => {
    render(<KanbanCard title="Tarea" description="Detalle" meta={<span>2 días</span>} />);
    expect(screen.getByText("Tarea")).toBeDefined();
    expect(screen.getByText("Detalle")).toBeDefined();
    expect(screen.getByText("2 días")).toBeDefined();
  });

  it("no pinta cabecera si no hay título ni badge", () => {
    render(<KanbanCard description="Solo texto" data-testid="kc" />);
    expect(screen.getByTestId("kc").children).toHaveLength(1);
  });
});
