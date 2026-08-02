import { PermissionProvider } from "@stellaria/nebula-hooks";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { CommandScore } from "../command-score.js";
import { CommandPalette } from "../CommandPalette.js";
import { Matches, ParseHotkey } from "../use-hotkey.js";
import type { CommandItem } from "../CommandPalette.types.js";

afterEach(cleanup);

const ITEMS: readonly CommandItem[] = [
  { key: "nuevo", label: "Nuevo cobro", group: "Cobros", shortcut: "N" },
  { key: "conciliar", label: "Conciliar extracto", group: "Cobros" },
  { key: "exportar", label: "Exportar reporte", keywords: ["csv", "descargar"] },
  { key: "ajustes", label: "Abrir ajustes", disabled: true },
];

describe("CommandScore", () => {
  it("ordena exacto > prefijo > inicio de palabra > contiene", () => {
    expect(CommandScore("nuevo", "nuevo")).toBeGreaterThan(CommandScore("nuevo cobro", "nuevo"));
    expect(CommandScore("nuevo cobro", "nuevo")).toBeGreaterThan(
      CommandScore("crear nuevo", "nuevo"),
    );
    expect(CommandScore("crear nuevo", "nuevo")).toBeGreaterThan(
      CommandScore("crearnuevocobro", "nuevo"),
    );
  });

  it("una consulta vacía deja pasar todo con puntuación mínima", () => {
    expect(CommandScore("lo que sea", "")).toBe(1);
  });

  it("ignora acentos y mayúsculas", () => {
    expect(CommandScore("Exportación", "exportacion")).toBeGreaterThan(0);
  });

  it("puntúa subsecuencias y descarta lo que no encaja", () => {
    expect(CommandScore("Nuevo cobro", "nc")).toBeGreaterThan(0);
    expect(CommandScore("Nuevo cobro", "zzz")).toBe(0);
  });
});

describe("ParseHotkey", () => {
  it("entiende mod, shift y alt", () => {
    expect(ParseHotkey("mod+k")).toEqual({ mod: true, shift: false, alt: false, key: "k" });
    expect(ParseHotkey("mod+shift+p")).toEqual({ mod: true, shift: true, alt: false, key: "p" });
  });

  it("exige que los modificadores coincidan exactamente", () => {
    const combo = ParseHotkey("mod+k");
    expect(
      Matches(
        {
          key: "k",
          metaKey: true,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
        } as KeyboardEvent,
        combo,
      ),
    ).toBe(true);
    expect(
      Matches(
        {
          key: "k",
          metaKey: false,
          ctrlKey: true,
          shiftKey: false,
          altKey: false,
        } as KeyboardEvent,
        combo,
      ),
    ).toBe(true);
    expect(
      Matches(
        {
          key: "k",
          metaKey: false,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
        } as KeyboardEvent,
        combo,
      ),
    ).toBe(false);
    expect(
      Matches(
        { key: "k", metaKey: true, ctrlKey: false, shiftKey: true, altKey: false } as KeyboardEvent,
        combo,
      ),
    ).toBe(false);
  });
});

describe("CommandPalette", () => {
  it("cerrada no monta el diálogo", () => {
    render(<CommandPalette items={ITEMS} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("abierta expone un combobox y la lista de comandos", async () => {
    render(<CommandPalette items={ITEMS} defaultOpened />);
    expect(await screen.findByRole("dialog")).toBeDefined();
    expect(screen.getByRole("combobox", { name: "Buscar comandos" })).toBeDefined();
    expect(screen.getAllByRole("option")).toHaveLength(4);
  });

  it("filtra por etiqueta al escribir", async () => {
    render(<CommandPalette items={ITEMS} defaultOpened />);
    await screen.findByRole("dialog");
    await userEvent.type(screen.getByRole("combobox"), "concil");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option").textContent).toContain("Conciliar extracto");
  });

  it("filtra también por keywords", async () => {
    render(<CommandPalette items={ITEMS} defaultOpened />);
    await screen.findByRole("dialog");
    await userEvent.type(screen.getByRole("combobox"), "csv");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option").textContent).toContain("Exportar reporte");
  });

  it("sin coincidencias avisa en vez de dejar la lista vacía", async () => {
    render(<CommandPalette items={ITEMS} defaultOpened />);
    await screen.findByRole("dialog");
    await userEvent.type(screen.getByRole("combobox"), "zzzz");
    expect(screen.getByText("Sin resultados")).toBeDefined();
  });

  it("el atajo global abre la paleta", async () => {
    render(<CommandPalette items={ITEMS} hotkey="mod+k" />);
    expect(screen.queryByRole("dialog")).toBeNull();
    await userEvent.keyboard("{Control>}k{/Control}");
    expect(await screen.findByRole("dialog")).toBeDefined();
  });

  it("hotkey false no registra atajo", async () => {
    render(<CommandPalette items={ITEMS} hotkey={false} />);
    await userEvent.keyboard("{Control>}k{/Control}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("un item sin permiso no aparece", async () => {
    render(
      <PermissionProvider resolver={(key) => key !== "cobros.crear"}>
        <CommandPalette
          items={[
            { key: "nuevo", label: "Nuevo cobro", permission: "cobros.crear" },
            { key: "exportar", label: "Exportar reporte" },
          ]}
          defaultOpened
        />
      </PermissionProvider>,
    );
    await screen.findByRole("dialog");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option").textContent).toContain("Exportar reporte");
  });

  it("maxResults acota la lista", async () => {
    const many = Array.from({ length: 30 }, (_, index) => ({
      key: `k${String(index)}`,
      label: `Comando ${String(index)}`,
    }));
    render(<CommandPalette items={many} defaultOpened maxResults={5} />);
    await screen.findByRole("dialog");
    expect(screen.getAllByRole("option")).toHaveLength(5);
  });
});
