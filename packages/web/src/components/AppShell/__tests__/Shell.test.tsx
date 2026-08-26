import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Panel } from "../../Panel/Panel.js";
import { AppShell } from "../index.js";

afterEach(cleanup);

describe("AppShell", () => {
  it("expone los cinco landmarks cuando se le dan las cinco partes", () => {
    render(
      <AppShell
        header={<AppShell.Header>cabecera</AppShell.Header>}
        navbar={<AppShell.Nav>navegación</AppShell.Nav>}
        aside={<AppShell.Aside>lateral</AppShell.Aside>}
        footer={<AppShell.Footer>pie</AppShell.Footer>}
      >
        contenido
      </AppShell>,
    );
    expect(screen.getByRole("banner")).toBeDefined();
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeDefined();
    expect(screen.getByRole("main")).toBeDefined();
    expect(screen.getByRole("complementary", { name: "Side panel" })).toBeDefined();
    expect(screen.getByRole("contentinfo")).toBeDefined();
  });

  it("las regiones que no se pasan no se montan", () => {
    render(<AppShell>contenido</AppShell>);
    expect(screen.queryByRole("banner")).toBeNull();
    expect(screen.queryByRole("navigation")).toBeNull();
    expect(screen.queryByRole("complementary")).toBeNull();
    expect(screen.queryByRole("contentinfo")).toBeNull();
    expect(screen.getByRole("main")).toBeDefined();
  });

  it("Footer.Content es un div que compone className y props de Box", () => {
    render(
      <AppShell
        footer={
          <AppShell.Footer>
            <AppShell.Footer.Content className="propio" p="sm" data-testid="pie">
              bloque
            </AppShell.Footer.Content>
          </AppShell.Footer>
        }
      >
        contenido
      </AppShell>,
    );
    const node = screen.getByTestId("pie");
    expect(node.tagName).toBe("DIV");
    expect(node.className).toContain("propio");
    expect(node.className.split(" ").length).toBeGreaterThan(2);
  });

  it("el skip-link apunta al main y el main puede recibir el foco", () => {
    render(
      <AppShell contentId="principal" header={<span>c</span>}>
        contenido
      </AppShell>,
    );
    expect(screen.getByRole("link", { name: "Skip to content" }).getAttribute("href")).toBe(
      "#principal",
    );
    const main = screen.getByRole("main");
    expect(main.getAttribute("id")).toBe("principal");
    expect(main.getAttribute("tabindex")).toBe("-1");
  });

  it("la navbar colapsada queda inerte, no solo estrecha", () => {
    render(
      <AppShell
        navbar={
          <AppShell.Nav>
            <a href="/x">Inicio</a>
          </AppShell.Nav>
        }
        navbarOpened={false}
      >
        contenido
      </AppShell>,
    );
    const nav = screen.getByRole("navigation");
    expect(nav.hasAttribute("inert")).toBe(true);
  });

  it("abierta no está inerte", () => {
    render(
      <AppShell
        navbar={
          <AppShell.Nav>
            <a href="/x">Inicio</a>
          </AppShell.Nav>
        }
        navbarOpened
      >
        contenido
      </AppShell>,
    );
    expect(screen.getByRole("navigation").hasAttribute("inert")).toBe(false);
  });
});

describe("Panel", () => {
  it("el separador publica su valor y sus topes", () => {
    render(
      <Panel master={<p>lista</p>} detail={<p>detalle</p>} defaultSize={320} min={160} max={640} />,
    );
    const separator = screen.getByRole("separator", { name: "Resize panels" });
    expect(separator.getAttribute("aria-valuenow")).toBe("320");
    expect(separator.getAttribute("aria-valuemin")).toBe("160");
    expect(separator.getAttribute("aria-valuemax")).toBe("640");
    expect(separator.getAttribute("aria-orientation")).toBe("vertical");
  });

  it("se redimensiona con las flechas", async () => {
    const on_change = vi.fn();
    render(
      <Panel
        master={<p>lista</p>}
        detail={<p>detalle</p>}
        defaultSize={320}
        step={20}
        onSizeChange={on_change}
      />,
    );
    const separator = screen.getByRole("separator");
    separator.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(on_change).toHaveBeenCalledWith(340);
    await userEvent.keyboard("{ArrowLeft}");
    expect(on_change).toHaveBeenLastCalledWith(320);
  });

  it("Home y End llevan a los topes", async () => {
    const on_change = vi.fn();
    render(
      <Panel
        master={<p>lista</p>}
        detail={<p>detalle</p>}
        min={200}
        max={500}
        onSizeChange={on_change}
      />,
    );
    screen.getByRole("separator").focus();
    await userEvent.keyboard("{Home}");
    expect(on_change).toHaveBeenCalledWith(200);
    await userEvent.keyboard("{End}");
    expect(on_change).toHaveBeenLastCalledWith(500);
  });

  it("no pasa de los topes", async () => {
    const on_change = vi.fn();
    render(
      <Panel
        master={<p>lista</p>}
        detail={<p>detalle</p>}
        defaultSize={640}
        max={640}
        onSizeChange={on_change}
      />,
    );
    screen.getByRole("separator").focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(on_change).toHaveBeenCalledWith(640);
  });

  it("no redimensionable saca el separador del orden de tabulación", () => {
    render(<Panel master={<p>lista</p>} detail={<p>detalle</p>} resizable={false} />);
    expect(screen.getByRole("separator").getAttribute("tabindex")).toBe("-1");
  });

  it("vertical cambia la orientación anunciada y las teclas", async () => {
    const on_change = vi.fn();
    render(
      <Panel
        master={<p>lista</p>}
        detail={<p>detalle</p>}
        orientation="vertical"
        defaultSize={300}
        step={10}
        onSizeChange={on_change}
      />,
    );
    const separator = screen.getByRole("separator");
    expect(separator.getAttribute("aria-orientation")).toBe("horizontal");
    separator.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(on_change).toHaveBeenCalledWith(310);
  });
});
