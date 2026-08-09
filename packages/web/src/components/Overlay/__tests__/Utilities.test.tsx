import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Affix } from "../../Affix/Affix.js";
import { Burger } from "../../Burger/Burger.js";
import { Dialog } from "../../Dialog/Dialog.js";
import { HoverCard } from "../../HoverCard/HoverCard.js";
import { LoadingOverlay } from "../../LoadingOverlay/LoadingOverlay.js";
import { NProgress } from "../../NProgress/NProgress.js";
import { Button } from "../../Button/Button.js";
import { Overlay } from "../Overlay.js";

afterEach(cleanup);

describe("Burger", () => {
  it("anuncia su estado y alterna al pulsar", async () => {
    const on_change = vi.fn();
    render(<Burger onChange={on_change} />);
    const button = screen.getByRole("button", { name: "Open menu" });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    await userEvent.click(button);
    expect(on_change).toHaveBeenCalledWith(true);
    expect(screen.getByRole("button", { name: "Close menu" }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  it("controlado no cambia por su cuenta", async () => {
    render(<Burger opened={false} onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("button", { name: "Open menu" })).toBeDefined();
  });

  it("responde a Enter, no solo al ratón", async () => {
    const on_change = vi.fn();
    render(<Burger onChange={on_change} />);
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(on_change).toHaveBeenCalledWith(true);
  });

  it("deshabilitado no alterna", async () => {
    const on_change = vi.fn();
    render(<Burger onChange={on_change} disabled />);
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(on_change).not.toHaveBeenCalled();
  });
});

describe("Overlay", () => {
  it("sin contenido es decorativo", () => {
    const { container } = render(<Overlay />);
    expect(container.querySelector("[aria-hidden='true']")).not.toBeNull();
  });

  it("con contenido deja de estar oculto y lo centra", () => {
    render(<Overlay>contenido</Overlay>);
    const node = screen.getByText("contenido");
    expect(node.closest("[aria-hidden='true']")).toBeNull();
  });
});

describe("Affix", () => {
  it("no renderiza cuando no es visible", () => {
    render(<Affix visible={false}>fijo</Affix>);
    expect(screen.queryByText("fijo")).toBeNull();
  });

  it("coloca por la esquina indicada", () => {
    render(
      <Affix withinPortal={false} position={{ top: 10, left: 20 }}>
        fijo
      </Affix>,
    );
    const style = screen.getByText("fijo").getAttribute("style");
    expect(style).toContain("top: 10px");
    expect(style).toContain("left: 20px");
  });
});

describe("LoadingOverlay", () => {
  it("oculto no monta nada", () => {
    render(<LoadingOverlay visible={false} />);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("visible anuncia en una región viva", () => {
    render(<LoadingOverlay visible label="Cargando facturas" />);
    expect(screen.getByRole("status").textContent).toContain("Cargando facturas");
  });
});

describe("NProgress", () => {
  it("sin loading ni valor no monta nada", () => {
    render(<NProgress />);
    expect(screen.queryByRole("progressbar")).toBeNull();
  });

  it("controlado publica el valor con nombre accesible", () => {
    render(<NProgress loading value={42} label="Cargando el informe" withinPortal={false} />);
    const meter = screen.getByRole("progressbar", { name: "Cargando el informe" });
    expect(meter.getAttribute("aria-valuenow")).toBe("42");
  });
});

describe("HoverCard", () => {
  it("no monta el contenido en reposo", () => {
    render(
      <HoverCard trigger={<Button>Perfil</Button>}>
        <p>Ada Lovelace</p>
      </HoverCard>,
    );
    expect(screen.queryByText("Ada Lovelace")).toBeNull();
  });

  it("se abre también con el foco, no solo con el ratón", async () => {
    render(
      <HoverCard trigger={<Button>Perfil</Button>} openDelay={0}>
        <p>Ada Lovelace</p>
      </HoverCard>,
    );
    await userEvent.tab();
    expect(await screen.findByText("Ada Lovelace")).toBeDefined();
  });
});

describe("Dialog", () => {
  it("cerrado no monta nada", () => {
    render(<Dialog opened={false}>aviso</Dialog>);
    expect(screen.queryByText("aviso")).toBeNull();
  });

  it("abierto es una región viva con título", () => {
    render(
      <Dialog opened title="Sesión a punto de expirar" withinPortal={false}>
        Quedan 2 minutos.
      </Dialog>,
    );
    expect(screen.getByRole("status").textContent).toContain("Sesión a punto de expirar");
  });

  it("el botón de cerrar solo existe si hay onClose", async () => {
    const on_close = vi.fn();
    const { unmount } = render(
      <Dialog opened withinPortal={false}>
        aviso
      </Dialog>,
    );
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
    unmount();

    render(
      <Dialog opened onClose={on_close} withinPortal={false}>
        aviso
      </Dialog>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(on_close).toHaveBeenCalledTimes(1);
  });
});
