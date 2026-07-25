import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import { Segment } from "../index.js";

afterEach(cleanup);

const DATA = [
  { value: "resumen", label: "Resumen" },
  { value: "detalle", label: "Detalle" },
  { value: "auditoria", label: "Auditoría", disabled: true },
  { value: "notas", label: "Notas" },
];

function WithPanels(props: { onChange?: (value: string) => void }): React.ReactElement {
  return (
    <Segment
      defaultValue="resumen"
      {...(props.onChange === undefined ? {} : { onChange: props.onChange })}
    >
      <Segment.Control data={DATA} aria-label="Secciones" />
      <Segment.Content>
        {DATA.map((item) => (
          <Segment.Content.Item key={item.value} value={item.value}>
            <p>Contenido de {item.label}</p>
          </Segment.Content.Item>
        ))}
      </Segment.Content>
    </Segment>
  );
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
