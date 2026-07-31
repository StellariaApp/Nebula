import { useCallback, useRef, type KeyboardEvent, type RefObject } from "react";

const CELL = "[data-grid-cell='true']";

export interface GridKeyboard {
  gridRef: RefObject<HTMLTableElement | null>;
  OnKeyDown: (event: KeyboardEvent<HTMLTableElement>) => void;
  CellProps: (row: number, col: number) => {
    "data-grid-cell": "true";
    "data-row": number;
    "data-col": number;
    tabIndex: number;
  };
}

interface Position {
  row: number;
  col: number;
}

function Clamp(value: number, max: number): number {
  return Math.min(Math.max(value, 0), Math.max(0, max));
}

/**
 * Patrón de teclado de grid (APG): una sola parada de tabulación para toda la tabla y navegación
 * por celda con las flechas. El foco se mueve con `focus()` sobre el DOM, no con estado de React:
 * mover el foco no debe re-renderizar una tabla de mil filas.
 */
export function useGridKeyboard(enabled: boolean, pageStep: number): GridKeyboard {
  const grid_ref = useRef<HTMLTableElement>(null);
  const active = useRef<Position>({ row: 0, col: 0 });

  const Focus = useCallback((row: number, col: number): void => {
    const grid = grid_ref.current;
    if (grid === null) return;
    const target = grid.querySelector<HTMLElement>(
      `${CELL}[data-row="${String(row)}"][data-col="${String(col)}"]`,
    );
    if (target === null) return;
    active.current = { row, col };
    for (const cell of grid.querySelectorAll<HTMLElement>(CELL)) cell.tabIndex = -1;
    target.tabIndex = 0;
    target.focus();
  }, []);

  const Bounds = useCallback((): { rows: number; cols: number } => {
    const grid = grid_ref.current;
    if (grid === null) return { rows: 0, cols: 0 };
    const cells = [...grid.querySelectorAll<HTMLElement>(CELL)];
    let rows = 0;
    let cols = 0;
    for (const cell of cells) {
      rows = Math.max(rows, Number(cell.dataset.row ?? 0));
      cols = Math.max(cols, Number(cell.dataset.col ?? 0));
    }
    return { rows, cols };
  }, []);

  const OnKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTableElement>): void => {
      if (!enabled) return;

      const cell = (event.target as HTMLElement).closest<HTMLElement>(CELL);
      if (cell === null) return;

      const row = Number(cell.dataset.row ?? 0);
      const col = Number(cell.dataset.col ?? 0);
      const { rows, cols } = Bounds();

      const Go = (next_row: number, next_col: number): void => {
        event.preventDefault();
        Focus(Clamp(next_row, rows), Clamp(next_col, cols));
      };

      switch (event.key) {
        case "ArrowRight":
          Go(row, col + 1);
          return;
        case "ArrowLeft":
          Go(row, col - 1);
          return;
        case "ArrowDown":
          Go(row + 1, col);
          return;
        case "ArrowUp":
          Go(row - 1, col);
          return;
        case "Home":
          Go(event.ctrlKey ? 0 : row, 0);
          return;
        case "End":
          Go(event.ctrlKey ? rows : row, cols);
          return;
        case "PageDown":
          Go(row + pageStep, col);
          return;
        case "PageUp":
          Go(row - pageStep, col);
          return;
        default:
          return;
      }
    },
    [enabled, pageStep, Bounds, Focus],
  );

  const CellProps = useCallback(
    (row: number, col: number) => ({
      "data-grid-cell": "true" as const,
      "data-row": row,
      "data-col": col,
      tabIndex: row === active.current.row && col === active.current.col ? 0 : -1,
    }),
    [],
  );

  return { gridRef: grid_ref, OnKeyDown, CellProps };
}
