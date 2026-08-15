import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { CurrencyDisplay } from "../../CurrencyDisplay/CurrencyDisplay.js";
import { DateDisplay } from "../../DateDisplay/DateDisplay.js";
import { EmptyModule } from "../../EmptyModule/EmptyModule.js";
import { QuickAction } from "../../QuickAction/QuickAction.js";
import { StatusBadge } from "../StatusBadge.js";
import { StatusMapProvider } from "../StatusMapProvider.js";
import type { StatusMap } from "../StatusBadge.types.js";

afterEach(cleanup);

type Shipment = "pending" | "shipped" | "returned";

const SHIPMENT_MAP: StatusMap<Shipment> = {
  pending: { label: "Pendiente", color: "warning" },
  shipped: { label: "En ruta", color: "info", variant: "filled" },
  returned: { label: "Devuelto", color: "error", dot: true },
};

describe("StatusBadge", () => {
  it("lee la etiqueta del mapa del provider", () => {
    render(
      <StatusMapProvider<Shipment> map={SHIPMENT_MAP}>
        <StatusBadge<Shipment> status="pending" />
      </StatusMapProvider>,
    );
    expect(screen.getByText("Pendiente")).toBeDefined();
  });

  it("la prop map sustituye al provider en el punto de uso", () => {
    render(
      <StatusMapProvider<Shipment> map={SHIPMENT_MAP}>
        <StatusBadge<Shipment>
          status="pending"
          map={{ ...SHIPMENT_MAP, pending: { label: "En revisión", color: "info" } }}
        />
      </StatusMapProvider>,
    );
    expect(screen.getByText("En revisión")).toBeDefined();
    expect(screen.queryByText("Pendiente")).toBeNull();
  });

  it("las props del punto de uso ganan al descriptor", () => {
    const mapped = render(<StatusBadge<Shipment> status="shipped" map={SHIPMENT_MAP} />);
    const with_descriptor = screen.getByText("En ruta").getAttribute("class");
    mapped.unmount();

    render(<StatusBadge<Shipment> status="shipped" map={SHIPMENT_MAP} color="success" />);
    expect(screen.getByText("En ruta").getAttribute("class")).not.toBe(with_descriptor);
  });

  it("un estado sin mapear pinta la clave cruda, no un gris silencioso", () => {
    const partial: StatusMap = { pendiente: { label: "Pendiente", color: "warning" } };
    render(<StatusBadge status="conciliado" map={partial} />);
    expect(screen.getByText("conciliado")).toBeDefined();
  });

  it("un mapa tipado obliga a declarar todos los estados de la unión", () => {
    const complete: StatusMap<Shipment> = SHIPMENT_MAP;
    expect(Object.keys(complete)).toHaveLength(3);
  });

  it("sin provider y sin map también falla de forma visible", () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText("pending")).toBeDefined();
  });

  it("el descriptor puede añadir una descripción solo para lectores", () => {
    render(
      <StatusBadge
        status="held"
        map={{ held: { label: "Retenido", description: "Retenido por revisión antifraude" } }}
      />,
    );
    expect(screen.getByText("Retenido por revisión antifraude")).toBeDefined();
  });
});

describe("CurrencyDisplay", () => {
  it("formatea con Intl según locale y divisa", () => {
    render(<CurrencyDisplay amount={12345.5} currency="EUR" locale="es-ES" />);
    expect(screen.getByText(/12\.345,50/)).toBeDefined();
  });

  it("acepta el importe como string numérica", () => {
    render(<CurrencyDisplay amount="99.9" currency="USD" locale="en-US" decimals={2} />);
    expect(screen.getByText("$99.90")).toBeDefined();
  });

  it("cae al fallback cuando el importe no es un número", () => {
    render(<CurrencyDisplay amount={null} fallback="sin dato" />);
    expect(screen.getByText("sin dato")).toBeDefined();
  });

  it("hideSymbol quita la divisa y conserva el formato", () => {
    render(<CurrencyDisplay amount={1000} currency="USD" locale="en-US" hideSymbol />);
    expect(screen.getByText("1,000")).toBeDefined();
  });

  it("transform se aplica sobre el texto ya formateado", () => {
    render(
      <CurrencyDisplay
        amount={10}
        currency="USD"
        locale="en-US"
        decimals={0}
        transform={(formatted) => `${formatted} MXN`}
      />,
    );
    expect(screen.getByText("$10 MXN")).toBeDefined();
  });
});

describe("DateDisplay", () => {
  const now = new Date("2026-07-30T12:00:00Z");

  it("una fecha sin hora no se corre de día por zona horaria", () => {
    render(<DateDisplay value="2026-07-30" locale="es-ES" timeZone="UTC" />);
    expect(screen.getByText("30/07/2026")).toBeDefined();
  });

  it("emite dateTime sin hora cuando la entrada no la tenía", () => {
    render(<DateDisplay value="2026-07-30" locale="es-ES" timeZone="UTC" />);
    expect(screen.getByText("30/07/2026").getAttribute("datetime")).toBe("2026-07-30");
  });

  it("mode relative usa Intl.RelativeTimeFormat contra el now inyectado", () => {
    render(<DateDisplay value="2026-07-27T12:00:00Z" mode="relative" locale="en-US" now={now} />);
    expect(screen.getByText("3 days ago")).toBeDefined();
  });

  it("mode auto cae a absoluto pasado el umbral", () => {
    render(
      <DateDisplay
        value="2026-01-01T12:00:00Z"
        mode="auto"
        locale="es-ES"
        timeZone="UTC"
        now={now}
      />,
    );
    expect(screen.getByText(/01\/01\/2026/).getAttribute("data-mode")).toBe("absolute");
  });

  it("en relativo el absoluto viaja en title, no en aria-label", () => {
    render(<DateDisplay value="2026-07-29T12:00:00Z" mode="relative" locale="en-US" now={now} />);
    const node = screen.getByText("yesterday");
    expect(node.getAttribute("title")).toBeTruthy();
    expect(node.getAttribute("aria-label")).toBeNull();
  });

  it("un valor ilegible cae al fallback", () => {
    render(<DateDisplay value="no es una fecha" fallback="—" />);
    expect(screen.getByText("—")).toBeDefined();
  });
});

describe("EmptyModule", () => {
  it("compone título, descripción y acciones", () => {
    render(
      <EmptyModule
        title="Sin facturas"
        description="Cuando emitas la primera aparecerá aquí"
        action={<button type="button">Crear factura</button>}
      />,
    );
    expect(screen.getByText("Sin facturas")).toBeDefined();
    expect(screen.getByText("Cuando emitas la primera aparecerá aquí")).toBeDefined();
    expect(screen.getByRole("button", { name: "Crear factura" })).toBeDefined();
  });

  it("la ilustración es decorativa", () => {
    render(<EmptyModule title="Vacío" illustration={<svg role="img" aria-label="dibujo" />} />);
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("cada superficie produce una clase distinta", () => {
    const seen = new Set<string>();
    for (const surface of ["none", "paper", "outline", "dashed"] as const) {
      const view = render(<EmptyModule title="Vacío" surface={surface} />);
      seen.add(screen.getByText("Vacío").closest("section")?.className ?? "");
      view.unmount();
    }
    expect(seen.size).toBe(4);
  });
});

describe("QuickAction", () => {
  it("su nombre accesible sale de label y el icono es decorativo", () => {
    render(<QuickAction label="Nuevo cobro" icon={<span>+</span>} />);
    expect(screen.getByRole("button", { name: "Nuevo cobro" })).toBeDefined();
  });

  it("responde a Enter, no solo al ratón", async () => {
    const on_press = vi.fn();
    render(<QuickAction label="Subir" onPress={on_press} />);
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(on_press).toHaveBeenCalledTimes(1);
  });

  it("deshabilitado no dispara la acción", async () => {
    const on_press = vi.fn();
    render(<QuickAction label="Cobrar" onPress={on_press} disabled />);
    await userEvent.click(screen.getByRole("button", { name: "Cobrar" }));
    expect(on_press).not.toHaveBeenCalled();
  });

  it("loading anuncia aria-busy y conserva el nombre accesible", () => {
    render(<QuickAction label="Sincronizar" loading />);
    const tile = screen.getByRole("button", { name: "Sincronizar" });
    expect(tile.getAttribute("aria-busy")).toBe("true");
  });

  it("con href es un enlace", () => {
    render(<QuickAction label="Ver reporte" href="/reportes" />);
    expect(screen.getByRole("link", { name: "Ver reporte" }).getAttribute("href")).toBe(
      "/reportes",
    );
  });

  it("cada variante de la unión resuelve una receta distinta", () => {
    const seen = new Set<string>();
    for (const variant of ["filled", "outline", "light", "ghost", "gradient", "glow"] as const) {
      const view = render(<QuickAction label="X" variant={variant} />);
      seen.add(screen.getByRole("button", { name: "X" }).getAttribute("style") ?? "");
      view.unmount();
    }
    expect(seen.size).toBe(6);
  });

  it("unstyled deja la superficie transparente sin romper la geometría", () => {
    render(<QuickAction label="Plano" variant="unstyled" />);
    const tile = screen.getByRole("button", { name: "Plano" });
    expect(tile.getAttribute("style")).toMatch(/transparent/);
    expect(tile.getAttribute("data-variant")).toBe("unstyled");
  });
});
