import { PermissionProvider } from "@stellaria/nebula-hooks";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { CardComplex } from "../CardComplex.js";
import type { CardAction } from "../CardComplex.types.js";

afterEach(cleanup);

const ACTIONS: readonly CardAction[] = [
  { key: "editar", label: "Editar", slot: "header" },
  { key: "descargar", label: "Descargar", slot: "media" },
  { key: "ver", label: "Ver detalle", slot: "footer" },
];

describe("CardComplex", () => {
  it("pinta título, descripción y badges por grupo", () => {
    render(
      <CardComplex
        title="Factura F-1042"
        description="Aurora S.A."
        badges={{
          title: [{ key: "t", label: "Urgente" }],
          main: [{ key: "m", label: "Conciliada" }],
          footer: [{ key: "f", label: "SPEI" }],
        }}
      />,
    );
    expect(screen.getByText("Factura F-1042")).toBeDefined();
    expect(screen.getByText("Aurora S.A.")).toBeDefined();
    expect(screen.getByText("Urgente")).toBeDefined();
    expect(screen.getByText("Conciliada")).toBeDefined();
    expect(screen.getByText("SPEI")).toBeDefined();
  });

  it("cada acción cae en su ranura", () => {
    const { container } = render(<CardComplex title="F-1042" media={{ image: "x.png", alt: "" }} actions={ACTIONS} />);
    expect(screen.getByRole("button", { name: "Editar" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Ver detalle" })).toBeDefined();
    const media = container.querySelector("[class*='mediaActions']");
    expect(media?.textContent).toBeDefined();
    expect(media?.querySelectorAll("button")).toHaveLength(1);
  });

  it("sin slot, la acción va a la cabecera", () => {
    const { container } = render(
      <CardComplex title="F-1042" actions={[{ key: "a", label: "Suelta" }]} />,
    );
    const header = container.querySelector("[class*='CardComplex_header']");
    expect(header?.querySelector("button")?.getAttribute("aria-label")).toBe("Suelta");
  });

  it("una acción dispara su onPress", async () => {
    const on_press = vi.fn();
    render(<CardComplex title="F-1042" actions={[{ key: "a", label: "Editar", onPress: on_press }]} />);
    await userEvent.click(screen.getByRole("button", { name: "Editar" }));
    expect(on_press).toHaveBeenCalledTimes(1);
  });

  it("una acción sin permiso no se renderiza", () => {
    render(
      <PermissionProvider resolver={(key) => key !== "cards.anular"}>
        <CardComplex
          title="F-1042"
          actions={[
            { key: "ver", label: "Ver" },
            { key: "anular", label: "Anular", permission: "cards.anular" },
          ]}
        />
      </PermissionProvider>,
    );
    expect(screen.getByRole("button", { name: "Ver" })).toBeDefined();
    expect(screen.queryByRole("button", { name: "Anular" })).toBeNull();
  });

  it("permissionMode disable la deja visible pero deshabilitada", () => {
    render(
      <PermissionProvider resolver={() => false}>
        <CardComplex
          title="F-1042"
          actions={[
            { key: "anular", label: "Anular", permission: "cards.anular", permissionMode: "disable" },
          ]}
        />
      </PermissionProvider>,
    );
    expect(
      screen.getByRole("button", { name: "Anular" }).getAttribute("data-disabled"),
    ).toBe("true");
  });

  it("meta formatea fechas y nombra al responsable", () => {
    render(
      <CardComplex
        title="F-1042"
        meta={{
          createdAt: "2026-07-30",
          responsible: { name: "Ada Lovelace" },
          locale: "es-MX",
        }}
      />,
    );
    expect(screen.getByText(/Creado/)).toBeDefined();
    expect(screen.getByText(/Ada Lovelace/)).toBeDefined();
  });

  it("media.hidden retira la imagen", () => {
    const { container } = render(
      <CardComplex title="F-1042" media={{ image: "x.png", alt: "foto", hidden: true }} />,
    );
    expect(container.querySelector("img")).toBeNull();
  });

  it("loading pinta esqueleto en vez de contenido", () => {
    render(<CardComplex title="F-1042" loading />);
    expect(screen.queryByText("F-1042")).toBeNull();
  });

  it("con href la tarjeta entera es un enlace", () => {
    render(<CardComplex title="F-1042" href="/facturas/1042" aria-label="Factura F-1042" />);
    expect(screen.getByRole("link", { name: "Factura F-1042" }).getAttribute("href")).toBe(
      "/facturas/1042",
    );
  });

  it("disabled retira la navegación", () => {
    render(<CardComplex title="F-1042" href="/x" disabled aria-label="Factura" />);
    expect(screen.queryByRole("link")).toBeNull();
  });
});
