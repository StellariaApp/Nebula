import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import { Segment } from "../index.js";
import type { SegmentContentProps } from "../Segment.types.js";

afterEach(cleanup);
afterEach(() => {
  vi.restoreAllMocks();
  Reflect.deleteProperty(HTMLElement.prototype, "scrollTo");
});

const DATA = [
  { value: "resumen", label: "Resumen" },
  { value: "detalle", label: "Detalle" },
  { value: "auditoria", label: "Auditoría", disabled: true },
  { value: "notas", label: "Notas" },
];

const PANEL_WIDTH = 400;

function IsPanel(node: HTMLElement): boolean {
  return node.getAttribute("role") === "tabpanel";
}

function StubRects(height: number): void {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function Rect(
    this: HTMLElement,
  ): DOMRect {
    const tall = IsPanel(this) ? height : 0;
    return {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: PANEL_WIDTH,
      bottom: tall,
      width: PANEL_WIDTH,
      height: tall,
      toJSON: () => ({}),
    };
  });
}

const TAB_WIDTH = 100;

const BAR_WIDTH = 250;

const TAB_HEIGHT = 32;

function IndexOf(node: HTMLElement): number {
  const parent = node.parentElement;
  if (parent === null) return 0;
  return Array.prototype.indexOf.call(parent.children, node) - 1;
}

function StubBar(): ReturnType<typeof vi.fn> {
  const ScrollTo = vi.fn();
  Object.defineProperty(HTMLElement.prototype, "scrollTo", {
    configurable: true,
    writable: true,
    value: ScrollTo,
  });
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(BAR_WIDTH);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function Rect(
    this: HTMLElement,
  ): DOMRect {
    const tab = this.getAttribute("role") === "radio" || this.getAttribute("role") === "tab";
    const left = tab ? IndexOf(this) * TAB_WIDTH : 0;
    const width = tab ? TAB_WIDTH : BAR_WIDTH;
    return {
      x: left,
      y: 0,
      top: 0,
      left,
      right: left + width,
      bottom: TAB_HEIGHT,
      width,
      height: TAB_HEIGHT,
      toJSON: () => ({}),
    };
  });
  return ScrollTo;
}

function Bar(): HTMLElement {
  return screen.getByRole("radiogroup", { name: "Secciones" });
}

function Indicator(): HTMLElement {
  const node = Bar().firstElementChild;
  if (node === null) throw new Error("el indicador no existe");
  return node as HTMLElement;
}

type ContentOptions = Omit<SegmentContentProps, "children">;

function WithPanels(
  props: { onChange?: (value: string) => void } & ContentOptions,
): React.ReactElement {
  const { onChange, ...content } = props;
  return (
    <Segment defaultValue="resumen" {...(onChange === undefined ? {} : { onChange })}>
      <Segment.Control data={DATA} aria-label="Secciones" />
      <Segment.Content {...content}>
        {DATA.map((item) => (
          <Segment.Content.Item key={item.value} value={item.value}>
            <p>Contenido de {item.label}</p>
          </Segment.Content.Item>
        ))}
      </Segment.Content>
    </Segment>
  );
}

function Rail(): HTMLElement {
  const rail = screen.getByRole("tabpanel").parentElement;
  if (rail === null) throw new Error("el carril del contenido no existe");
  return rail;
}

function Viewport(): HTMLElement {
  const box = Rail().parentElement;
  if (box === null) throw new Error("la caja del contenido no existe");
  return box;
}

function RailX(): number {
  const found = /translateX\((-?[\d.]+)px\)/.exec(Rail().style.transform);
  return found === null ? Number.NaN : Number(found[1]);
}

describe("Segment", () => {
  it("con paneles emite tablist y vincula cada tab con su panel", async () => {
    render(<WithPanels />);
    await waitFor(() => {
      expect(screen.getByRole("tablist", { name: "Secciones" })).toBeDefined();
    });
    const tab = screen.getByRole("tab", { name: "Resumen" });
    const panel = screen.getByRole("tabpanel");
    expect(tab.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(tab.id);
  });

  it("sin paneles cae a radiogroup", () => {
    render(
      <Segment defaultValue="resumen">
        <Segment.Control data={DATA} aria-label="Secciones" />
      </Segment>,
    );
    expect(screen.getByRole("radiogroup", { name: "Secciones" })).toBeDefined();
    expect(screen.getAllByRole("radio")).toHaveLength(4);
  });

  it("marca el tab activo y solo él es tabbable", async () => {
    render(<WithPanels />);
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: "Resumen" }).getAttribute("aria-selected")).toBe(
        "true",
      );
    });
    expect(screen.getByRole("tab", { name: "Resumen" }).getAttribute("tabindex")).toBe("0");
    expect(screen.getByRole("tab", { name: "Detalle" }).getAttribute("tabindex")).toBe("-1");
  });

  it("cambia de sección al hacer click", async () => {
    const OnChange = vi.fn();
    const user = userEvent.setup();
    render(<WithPanels onChange={OnChange} />);
    await waitFor(() => {
      expect(screen.getByRole("tablist")).toBeDefined();
    });
    await user.click(screen.getByRole("tab", { name: "Detalle" }));
    expect(OnChange).toHaveBeenCalledWith("detalle");
  });

  it("navega con flechas saltando los deshabilitados", async () => {
    const OnChange = vi.fn();
    const user = userEvent.setup();
    render(<WithPanels onChange={OnChange} />);
    await waitFor(() => {
      expect(screen.getByRole("tablist")).toBeDefined();
    });

    screen.getByRole("tab", { name: "Resumen" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(OnChange).toHaveBeenLastCalledWith("detalle");

    await user.keyboard("{ArrowRight}");
    expect(OnChange).toHaveBeenLastCalledWith("notas");
  });

  it("Home y End van a los extremos", async () => {
    const OnChange = vi.fn();
    const user = userEvent.setup();
    render(<WithPanels onChange={OnChange} />);
    await waitFor(() => {
      expect(screen.getByRole("tablist")).toBeDefined();
    });

    screen.getByRole("tab", { name: "Resumen" }).focus();
    await user.keyboard("{End}");
    expect(OnChange).toHaveBeenLastCalledWith("notas");

    await user.keyboard("{Home}");
    expect(OnChange).toHaveBeenLastCalledWith("resumen");
  });

  it("el tab deshabilitado no se activa", async () => {
    const OnChange = vi.fn();
    const user = userEvent.setup();
    render(<WithPanels onChange={OnChange} />);
    await waitFor(() => {
      expect(screen.getByRole("tablist")).toBeDefined();
    });
    await user.click(screen.getByRole("tab", { name: "Auditoría" }));
    expect(OnChange).not.toHaveBeenCalled();
  });

  it("solo el panel activo queda visible para AT", async () => {
    render(<WithPanels />);
    await waitFor(() => {
      expect(screen.getByRole("tablist")).toBeDefined();
    });
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
    expect(screen.getByRole("tabpanel").textContent).toContain("Resumen");
  });

  it("con auto la caja toma la altura del panel activo", async () => {
    StubRects(240);
    render(<WithPanels auto />);
    await waitFor(() => {
      expect(screen.getByRole("tabpanel")).toBeDefined();
    });
    expect(Viewport().style.height).toBe("240px");
  });

  it("sin auto la caja no fija altura", async () => {
    StubRects(240);
    render(<WithPanels />);
    await waitFor(() => {
      expect(screen.getByRole("tabpanel")).toBeDefined();
    });
    expect(Viewport().style.height).toBe("");
  });

  it("con autoWidth la caja toma el ancho del panel activo, acotado al hueco", async () => {
    StubRects(240);
    render(<WithPanels autoWidth />);
    await waitFor(() => {
      expect(screen.getByRole("tabpanel")).toBeDefined();
    });
    expect(Viewport().style.width).toContain(`${String(PANEL_WIDTH)}px`);
  });

  it("sin autoWidth la caja no fija ancho", async () => {
    StubRects(240);
    render(<WithPanels />);
    await waitFor(() => {
      expect(screen.getByRole("tabpanel")).toBeDefined();
    });
    expect(Viewport().style.width).toBe("");
  });

  it("fill gana sobre auto", async () => {
    StubRects(240);
    render(<WithPanels fill auto />);
    await waitFor(() => {
      expect(screen.getByRole("tabpanel")).toBeDefined();
    });
    expect(Viewport().style.height).toBe("");
  });

  it("con loop el último panel se alcanza por el camino corto", async () => {
    StubRects(0);
    const user = userEvent.setup();
    render(<WithPanels loop />);
    await waitFor(() => {
      expect(screen.getByRole("tablist")).toBeDefined();
    });
    await user.click(screen.getByRole("tab", { name: "Notas" }));
    await waitFor(
      () => {
        expect(RailX()).toBeCloseTo(PANEL_WIDTH, 0);
      },
      { timeout: 3000 },
    );
  });

  it("sin loop el último panel se alcanza recorriendo los de en medio", async () => {
    StubRects(0);
    const user = userEvent.setup();
    render(<WithPanels />);
    await waitFor(() => {
      expect(screen.getByRole("tablist")).toBeDefined();
    });
    await user.click(screen.getByRole("tab", { name: "Notas" }));
    await waitFor(
      () => {
        expect(RailX()).toBeCloseTo(-PANEL_WIDTH * 3, 0);
      },
      { timeout: 3000 },
    );
  });

  it("con loop el último panel se coloca a la izquierda del primero", async () => {
    StubRects(0);
    const view = render(<WithPanels loop />);
    await waitFor(() => {
      expect(screen.getByRole("tabpanel")).toBeDefined();
    });
    const last = view.container.querySelectorAll<HTMLElement>("[role='tabpanel']")[DATA.length - 1];
    await waitFor(() => {
      expect(last?.style.transform).toContain(
        `translateX(-${String(PANEL_WIDTH * DATA.length)}px)`,
      );
    });
  });

  it("sin loop ningún panel se recoloca", async () => {
    StubRects(0);
    const view = render(<WithPanels />);
    await waitFor(() => {
      expect(screen.getByRole("tabpanel")).toBeDefined();
    });
    const last = view.container.querySelectorAll<HTMLElement>("[role='tabpanel']")[DATA.length - 1];
    expect(last?.style.transform).toBe("none");
  });

  it("panelProps llega a todos los paneles", async () => {
    const view = render(<WithPanels panelProps={{ title: "panel", p: "md" }} />);
    await waitFor(() => {
      expect(screen.getByRole("tabpanel")).toBeDefined();
    });
    expect(view.container.querySelectorAll("[title='panel']")).toHaveLength(DATA.length);
  });

  it("con scroll trae a la vista el tab activo que cae fuera de la ventana", async () => {
    const ScrollTo = StubBar();
    render(
      <Segment value="notas" overflowMode="scroll" onChange={() => undefined}>
        <Segment.Control data={DATA} aria-label="Secciones" />
      </Segment>,
    );
    await waitFor(() => {
      expect(ScrollTo).toHaveBeenCalledWith(
        expect.objectContaining({ left: TAB_WIDTH * 4 - BAR_WIDTH }),
      );
    });
  });

  it("con scroll no mueve la barra si el tab activo ya se ve", async () => {
    const ScrollTo = StubBar();
    render(
      <Segment value="resumen" overflowMode="scroll" onChange={() => undefined}>
        <Segment.Control data={DATA} aria-label="Secciones" />
      </Segment>,
    );
    await waitFor(() => {
      expect(Bar()).toBeDefined();
    });
    expect(ScrollTo).not.toHaveBeenCalled();
  });

  it("sin overflowMode la barra nunca se desplaza sola", async () => {
    const ScrollTo = StubBar();
    render(
      <Segment value="notas" onChange={() => undefined}>
        <Segment.Control data={DATA} aria-label="Secciones" />
      </Segment>,
    );
    await waitFor(() => {
      expect(Bar()).toBeDefined();
    });
    expect(ScrollTo).not.toHaveBeenCalled();
  });

  it("con wrap el indicador se posiciona también en vertical", async () => {
    StubBar();
    render(
      <Segment value="notas" overflowMode="wrap" onChange={() => undefined}>
        <Segment.Control data={DATA} aria-label="Secciones" />
      </Segment>,
    );
    await waitFor(() => {
      expect(Indicator().style.height).toBe(`${String(TAB_HEIGHT)}px`);
    });
  });

  it("sin wrap el indicador no fija alto en línea", async () => {
    StubBar();
    render(
      <Segment value="notas" onChange={() => undefined}>
        <Segment.Control data={DATA} aria-label="Secciones" />
      </Segment>,
    );
    await waitFor(() => {
      expect(Bar()).toBeDefined();
    });
    expect(Indicator().style.height).toBe("");
  });

  it("respeta el modo controlado", async () => {
    render(
      <Segment value="notas" onChange={() => undefined}>
        <Segment.Control data={DATA} aria-label="Secciones" />
        <Segment.Content>
          {DATA.map((item) => (
            <Segment.Content.Item key={item.value} value={item.value}>
              <p>Contenido de {item.label}</p>
            </Segment.Content.Item>
          ))}
        </Segment.Content>
      </Segment>,
    );
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: "Notas" }).getAttribute("aria-selected")).toBe("true");
    });
  });
});
