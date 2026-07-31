import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import { DEFAULT_TOOLBAR, RICH_TEXT_LABELS } from "../labels.js";
import { RichTextEditor } from "../RichTextEditor.js";

afterEach(cleanup);

describe("RichTextEditor", () => {
  it("monta la toolbar con su rol y etiqueta", async () => {
    render(<RichTextEditor label="Notas" />);
    await waitFor(() => {
      expect(screen.getByRole("toolbar", { name: RICH_TEXT_LABELS.toolbar })).toBeDefined();
    });
  });

  it("la toolbar por defecto trae los cinco grupos del catálogo", () => {
    expect(DEFAULT_TOOLBAR).toHaveLength(5);
    expect(DEFAULT_TOOLBAR.flat()).toContain("bold");
    expect(DEFAULT_TOOLBAR.flat()).toContain("undo");
  });

  it("cada acción de la toolbar tiene nombre accesible y estado", async () => {
    render(<RichTextEditor label="Notas" />);
    await waitFor(() => {
      const bold = screen.getByRole("button", { name: RICH_TEXT_LABELS.bold });
      expect(bold.getAttribute("aria-pressed")).toBe("false");
    });
  });

  it("acepta una toolbar propia", async () => {
    render(<RichTextEditor label="Notas" toolbar={[["bold", "italic"]]} />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: RICH_TEXT_LABELS.bold })).toBeDefined();
    });
    expect(screen.queryByRole("button", { name: RICH_TEXT_LABELS.undo })).toBeNull();
  });

  it("puede prescindir de la toolbar", async () => {
    render(<RichTextEditor label="Notas" withToolbar={false} />);
    await waitFor(() => {
      expect(screen.getByText("Notas")).toBeDefined();
    });
    expect(screen.queryByRole("toolbar")).toBeNull();
  });

  it("vincula la etiqueta con el campo", async () => {
    render(<RichTextEditor label="Descripción" />);
    await waitFor(() => {
      expect(screen.getByText("Descripción")).toBeDefined();
    });
  });

  it("marca el error en la superficie", async () => {
    render(<RichTextEditor label="Notas" error="Falta contenido" data-testid="rte" />);
    await waitFor(() => {
      expect(screen.getByText("Falta contenido")).toBeDefined();
    });
  });

  it("lee el valor y el estado de un NebulaField", async () => {
    const set_value = vi.fn();
    render(
      <RichTextEditor
        label="Notas"
        field={{
          value: "<p>Desde el field</p>",
          setValue: set_value,
          status: "idle",
          touched: false,
        }}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("Desde el field")).toBeDefined();
    });
  });

  it("muestra el placeholder mientras está vacío", async () => {
    render(<RichTextEditor label="Notas" placeholder="Escribe aquí…" />);
    await waitFor(() => {
      expect(screen.getByText("Escribe aquí…")).toBeDefined();
    });
  });

  it("acepta etiquetas propias", async () => {
    render(<RichTextEditor label="Notas" labels={{ bold: "Resaltar" }} />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Resaltar" })).toBeDefined();
    });
  });

  it("en solo lectura la toolbar queda deshabilitada", async () => {
    render(<RichTextEditor label="Notas" readOnly />);
    await waitFor(() => {
      const bold = screen.getByRole("button", { name: RICH_TEXT_LABELS.bold });
      expect(bold.getAttribute("data-disabled")).toBe("true");
    });
  });
});
