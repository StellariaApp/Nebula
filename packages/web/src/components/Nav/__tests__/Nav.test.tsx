import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { NebulaTheme } from "@stellaria/nebula-tokens";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { GlassOff, MotionAt } from "../../../__tests__/theme-tweaks.js";
import { NebulaProvider } from "../../../provider/nebula-provider.js";
import { NAV_LABELS } from "../labels.js";
import { Nav } from "../index.js";
import { BestPathMatch, NormalizePath, ResolveMode } from "../use-nav-active.js";

function RenderIn(ui: ReactNode, theme: NebulaTheme) {
  return render(
    <NebulaProvider defaultTheme={theme} storage={null}>
      {ui}
    </NebulaProvider>,
  );
}

function Path(pathname: string): void {
  window.history.replaceState(null, "", pathname);
}

beforeEach(() => {
  Path("/");
});

afterEach(cleanup);

const ANCHORS = (
  <Nav.Links>
    <Nav.Links.Link href="#solucion">Solución</Nav.Links.Link>
    <Nav.Links.Link href="#precios">Precios</Nav.Links.Link>
  </Nav.Links>
);

describe("Nav", () => {
  it("rinde la composición del ejemplo canónico", () => {
    render(
      <Nav>
        <Nav.Logo href="#inicio" aria-label="Inicio">
          Rosette
        </Nav.Logo>
        {ANCHORS}
        <Nav.Actions>
          <span>en línea</span>
        </Nav.Actions>
      </Nav>,
    );

    expect(screen.getByRole("link", { name: "Inicio" })).toBeDefined();
    expect(screen.getByRole("navigation", { name: NAV_LABELS.links })).toBeDefined();
    expect(screen.getByRole("link", { name: "Solución" })).toBeDefined();
    expect(screen.getByText("en línea")).toBeDefined();
  });

  it("no emite un landmark banner por defecto", () => {
    const { container } = render(<Nav>{ANCHORS}</Nav>);
    expect(container.querySelector("header")).toBeNull();
    expect(screen.queryByRole("banner")).toBeNull();
  });

  it("se eleva a landmark con component y acepta su etiqueta", () => {
    render(
      <Nav component="header" aria-label="Cabecera del sitio">
        {ANCHORS}
      </Nav>,
    );
    expect(screen.getByRole("banner", { name: "Cabecera del sitio" })).toBeDefined();
  });

  it("los enlaces viven dentro de un nav propio, no en la raíz", () => {
    const { container } = render(<Nav className="raiz">{ANCHORS}</Nav>);
    const root = container.querySelector(".raiz");
    const nav = container.querySelector("nav");

    expect(nav).not.toBeNull();
    expect(root?.tagName).not.toBe("NAV");
    expect(root?.contains(nav as Node)).toBe(true);
  });

  it("el contenido va en un contenedor propio, no suelto en la raíz", () => {
    const { container } = render(<Nav className="raiz">{ANCHORS}</Nav>);
    const root = container.querySelector(".raiz");
    const inner = root?.firstElementChild;

    expect(root?.children).toHaveLength(1);
    expect(inner?.tagName).toBe("DIV");
    expect(inner?.contains(container.querySelector("nav") as Node)).toBe(true);
  });

  it("contentWidth viaja como var y no como valor horneado", () => {
    const { container } = render(
      <Nav className="raiz" contentWidth={960}>
        {ANCHORS}
      </Nav>,
    );
    const inline = container.querySelector(".raiz")?.getAttribute("style") ?? "";

    expect(inline).toContain("960px");
    expect(inline).not.toContain("max-width");
  });

  it("topa el contenido a 1180 por defecto, con y sin floating", () => {
    const plain = render(<Nav className="raiz">{ANCHORS}</Nav>);
    expect(plain.container.querySelector(".raiz")?.getAttribute("style") ?? "").toContain("1180px");
    plain.unmount();

    const fixed = render(
      <Nav className="raiz" floating>
        {ANCHORS}
      </Nav>,
    );
    expect(fixed.container.querySelector(".raiz")?.getAttribute("style") ?? "").toContain("1180px");
  });

  it('contentWidth="none" quita el tope', () => {
    const { container } = render(
      <Nav className="raiz" contentWidth="none">
        {ANCHORS}
      </Nav>,
    );
    const inline = container.querySelector(".raiz")?.getAttribute("style") ?? "";

    expect(inline).toContain("none");
    expect(inline).not.toContain("1180px");
  });

  it("contentWidth es independiente de floatingWidth", () => {
    const { container } = render(
      <Nav className="raiz" floating floatingWidth={1024} contentWidth={860}>
        {ANCHORS}
      </Nav>,
    );
    const inline = container.querySelector(".raiz")?.getAttribute("style") ?? "";

    expect(inline).toContain("1024px");
    expect(inline).toContain("860px");
  });

  it("la geometría flotante viaja por una sola progresión, no por dos juegos de valores", () => {
    const off = render(<Nav className="raiz">{ANCHORS}</Nav>);
    expect(off.container.querySelector(".raiz")?.getAttribute("style") ?? "").not.toContain(
      "nav-progress",
    );
    off.unmount();

    const on = render(
      <Nav className="raiz" floating scrolled>
        {ANCHORS}
      </Nav>,
    );
    const inline = on.container.querySelector(".raiz")?.getAttribute("style") ?? "";

    expect(inline).toContain("--nebula-nav-progress");
    expect(inline).not.toContain("border-radius");
    expect(inline).not.toContain("inset");
  });

  it("labels sustituye el nombre del grupo de enlaces", () => {
    render(
      <Nav>
        <Nav.Links labels={{ links: "Secciones" }}>
          <Nav.Links.Link href="#uno">Uno</Nav.Links.Link>
        </Nav.Links>
      </Nav>,
    );
    expect(screen.getByRole("navigation", { name: "Secciones" })).toBeDefined();
  });

  it("aplica style props y className del consumidor a la misma raíz", () => {
    const { container } = render(
      <Nav mt="lg" className="propia">
        {ANCHORS}
      </Nav>,
    );
    const root = container.querySelector(".propia");

    expect(root).not.toBeNull();
    expect(root?.contains(screen.getByRole("navigation"))).toBe(true);
    expect(root?.className.split(" ").length).toBeGreaterThan(2);
  });

  it("no hornea tokens en estilo inline", () => {
    const { container } = render(<Nav>{ANCHORS}</Nav>);
    expect(container.innerHTML).not.toContain("#0");
  });

  it("los tres size rinden y ninguno hornea altura inline", () => {
    for (const size of ["sm", "md", "lg"] as const) {
      const { container, unmount } = render(<Nav size={size}>{ANCHORS}</Nav>);
      const style = container.firstElementChild?.getAttribute("style") ?? "";

      expect(style).not.toContain("min-height");
      unmount();
    }
  });
});

describe("Nav flotante", () => {
  it("sin floating no publica ningún data de scroll", () => {
    const { container } = render(<Nav>{ANCHORS}</Nav>);
    expect(container.querySelector("[data-floating]")).toBeNull();
  });

  it("floating publica el estado y arranca sin condensar", () => {
    const { container } = render(<Nav floating>{ANCHORS}</Nav>);
    const root = container.querySelector("[data-floating='true']");

    expect(root).not.toBeNull();
    expect(root?.getAttribute("data-scrolled")).toBe("false");
  });

  it("scrolled controlado gana al listener", () => {
    const { container } = render(
      <Nav floating scrolled>
        {ANCHORS}
      </Nav>,
    );
    expect(container.querySelector("[data-floating='true']")?.getAttribute("data-scrolled")).toBe(
      "true",
    );
  });

  it("expone la geometría como vars y no como valores horneados", () => {
    const { container } = render(
      <Nav floating floatingWidth={960} floatingGap={8}>
        {ANCHORS}
      </Nav>,
    );
    const inline = container.querySelector("[data-floating='true']")?.getAttribute("style") ?? "";

    expect(inline).toContain("960px");
    expect(inline).toContain("8px");
    expect(inline).not.toContain("max-width");
  });

  it("el cristal sale del contrato del tema, nunca de un hex", () => {
    const { container } = render(<Nav floating>{ANCHORS}</Nav>);
    const inline = container.querySelector("[data-floating='true']")?.getAttribute("style") ?? "";

    expect(inline).toContain("var(--");
    expect(inline).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });

  it("anima cuando el tier del tema lo permite", () => {
    const { container } = render(<Nav floating>{ANCHORS}</Nav>);
    expect(container.querySelector("[data-floating='true']")?.getAttribute("data-animated")).toBe(
      "true",
    );
  });

  it("degrada las dos cosas: sin transición y sin cristal", () => {
    const { container } = RenderIn(<Nav floating>{ANCHORS}</Nav>, GlassOff(MotionAt("minimal")));
    const root = container.querySelector("[data-floating='true']");
    const inline = root?.getAttribute("style") ?? "";

    expect(root?.getAttribute("data-animated")).toBe("false");
    expect(inline).toContain("none");
    expect(inline).not.toContain("blur");
  });

  it("sticky publica su estado y rastrea el scroll sin ser floating", () => {
    const { container } = render(
      <Nav sticky scrolled>
        {ANCHORS}
      </Nav>,
    );
    const root = container.querySelector("[data-sticky='true']");

    expect(root).not.toBeNull();
    expect(root?.getAttribute("data-floating")).toBeNull();
    expect(root?.getAttribute("data-scrolled")).toBe("true");
    expect(root?.getAttribute("style") ?? "").toContain("var(--");
  });

  it("floating gana a sticky: no se aplican los dos a la vez", () => {
    const { container } = render(
      <Nav floating sticky>
        {ANCHORS}
      </Nav>,
    );

    expect(container.querySelector("[data-floating='true']")).not.toBeNull();
    expect(container.querySelector("[data-sticky='true']")).toBeNull();
  });

  it("sin floating ni sticky no publica estado de scroll", () => {
    const { container } = render(<Nav>{ANCHORS}</Nav>);

    expect(container.querySelector("[data-scrolled]")).toBeNull();
    expect(container.querySelector("[data-sticky]")).toBeNull();
  });

  it("floating no cambia el contrato de a11y de los enlaces", () => {
    render(<Nav floating>{ANCHORS}</Nav>);
    expect(screen.getByRole("navigation", { name: NAV_LABELS.links })).toBeDefined();
    expect(screen.getByRole("link", { name: "Precios" })).toBeDefined();
  });
});

describe("Nav.Links — resolución del enlace activo", () => {
  it("con todo anclas resuelve el modo hash", () => {
    const { container } = render(<Nav>{ANCHORS}</Nav>);
    expect(container.querySelector("nav")?.getAttribute("data-mode")).toBe("hash");
  });

  it("con rutas resuelve el modo pathname", () => {
    const { container } = render(
      <Nav>
        <Nav.Links>
          <Nav.Links.Link href="/">Inicio</Nav.Links.Link>
          <Nav.Links.Link href="/precios">Precios</Nav.Links.Link>
        </Nav.Links>
      </Nav>,
    );
    expect(container.querySelector("nav")?.getAttribute("data-mode")).toBe("pathname");
  });

  it("active en el grupo fuerza el modo manual y marca el enlace", () => {
    const { container } = render(
      <Nav>
        <Nav.Links active="/precios">
          <Nav.Links.Link href="/">Inicio</Nav.Links.Link>
          <Nav.Links.Link href="/precios">Precios</Nav.Links.Link>
        </Nav.Links>
      </Nav>,
    );

    expect(container.querySelector("nav")?.getAttribute("data-mode")).toBe("manual");
    expect(screen.getByRole("link", { name: "Precios" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Inicio" }).getAttribute("aria-current")).toBeNull();
  });

  it("activeMode explícito gana a la deducción", () => {
    const { container } = render(
      <Nav>
        <Nav.Links activeMode="manual">
          <Nav.Links.Link href="#uno">Uno</Nav.Links.Link>
        </Nav.Links>
      </Nav>,
    );
    expect(container.querySelector("nav")?.getAttribute("data-mode")).toBe("manual");
  });

  it("marca por pathname el enlace de la ruta en curso", () => {
    Path("/precios");
    render(
      <Nav>
        <Nav.Links>
          <Nav.Links.Link href="/">Inicio</Nav.Links.Link>
          <Nav.Links.Link href="/precios">Precios</Nav.Links.Link>
        </Nav.Links>
      </Nav>,
    );

    expect(screen.getByRole("link", { name: "Precios" }).getAttribute("data-active")).toBe("true");
    expect(screen.getByRole("link", { name: "Inicio" }).getAttribute("data-active")).toBeNull();
  });

  it("en una subruta gana el prefijo más largo, no la raíz", () => {
    Path("/docs/api/v2");
    render(
      <Nav>
        <Nav.Links>
          <Nav.Links.Link href="/">Inicio</Nav.Links.Link>
          <Nav.Links.Link href="/docs">Docs</Nav.Links.Link>
          <Nav.Links.Link href="/docs/api">API</Nav.Links.Link>
        </Nav.Links>
      </Nav>,
    );

    expect(screen.getByRole("link", { name: "API" }).getAttribute("data-active")).toBe("true");
    expect(screen.getByRole("link", { name: "Docs" }).getAttribute("data-active")).toBeNull();
    expect(screen.getByRole("link", { name: "Inicio" }).getAttribute("data-active")).toBeNull();
  });

  it("el active del propio enlace gana sobre el modo automático", () => {
    Path("/precios");
    render(
      <Nav>
        <Nav.Links>
          <Nav.Links.Link href="/">Inicio</Nav.Links.Link>
          <Nav.Links.Link href="/precios" active={false}>
            Precios
          </Nav.Links.Link>
        </Nav.Links>
      </Nav>,
    );

    expect(screen.getByRole("link", { name: "Precios" }).getAttribute("data-active")).toBeNull();
  });

  it("el aria-current es location en modo hash y page en pathname", () => {
    Path("/precios");
    render(
      <Nav>
        <Nav.Links>
          <Nav.Links.Link href="/precios">Precios</Nav.Links.Link>
        </Nav.Links>
        <Nav.Links aria-label="Anclas">
          <Nav.Links.Link href="#uno" active>
            Uno
          </Nav.Links.Link>
        </Nav.Links>
      </Nav>,
    );

    expect(screen.getByRole("link", { name: "Precios" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Uno" }).getAttribute("aria-current")).toBe("location");
  });

  it("los enlaces envueltos en un Fragment siguen contando para el modo", () => {
    const { container } = render(
      <Nav>
        <Nav.Links>
          <>
            <Nav.Links.Link href="#uno">Uno</Nav.Links.Link>
            <Nav.Links.Link href="#dos">Dos</Nav.Links.Link>
          </>
        </Nav.Links>
      </Nav>,
    );
    expect(container.querySelector("nav")?.getAttribute("data-mode")).toBe("hash");
  });
});

describe("Nav.Links.Link", () => {
  it("sin href rinde un botón y dispara onPress con ratón y con teclado", async () => {
    const user = userEvent.setup();
    const on_press = vi.fn();
    render(
      <Nav>
        <Nav.Links>
          <Nav.Links.Link onPress={on_press}>Abrir</Nav.Links.Link>
        </Nav.Links>
      </Nav>,
    );

    const button = screen.getByRole("button", { name: "Abrir" });
    expect(button.getAttribute("type")).toBe("button");

    await user.click(button);
    expect(on_press).toHaveBeenCalledTimes(1);

    button.focus();
    await user.keyboard("{Enter}");
    expect(on_press).toHaveBeenCalledTimes(2);
  });

  it("disabled no navega ni dispara", async () => {
    const user = userEvent.setup();
    const on_press = vi.fn();
    render(
      <Nav>
        <Nav.Links>
          <Nav.Links.Link href="/precios" disabled onPress={on_press}>
            Precios
          </Nav.Links.Link>
        </Nav.Links>
      </Nav>,
    );

    const link = screen.getByText("Precios");
    expect(link.getAttribute("href")).toBeNull();
    expect(link.getAttribute("aria-disabled")).toBe("true");

    await user.click(link);
    expect(on_press).not.toHaveBeenCalled();
  });

  it("acepta component para el enlace del router del consumidor", () => {
    function RouterLink(props: { href?: string; children?: ReactNode }) {
      return <a data-router="true" {...props} />;
    }

    render(
      <Nav>
        <Nav.Links active="/precios">
          <Nav.Links.Link component={RouterLink} href="/precios">
            Precios
          </Nav.Links.Link>
        </Nav.Links>
      </Nav>,
    );

    const link = screen.getByRole("link", { name: "Precios" });
    expect(link.getAttribute("data-router")).toBe("true");
    expect(link.getAttribute("aria-current")).toBe("page");
  });

  it("rinde las secciones laterales", () => {
    render(
      <Nav>
        <Nav.Links>
          <Nav.Links.Link
            href="#uno"
            leftSection={<span>izq</span>}
            rightSection={<span>der</span>}
          >
            Uno
          </Nav.Links.Link>
        </Nav.Links>
      </Nav>,
    );

    expect(screen.getByText("izq")).toBeDefined();
    expect(screen.getByText("der")).toBeDefined();
  });
});

describe("Nav.Divider y Nav.Logo", () => {
  it("el separador no entra en el árbol accesible", () => {
    const { container } = render(
      <Nav>
        <Nav.Logo>Rosette</Nav.Logo>
        <Nav.Divider />
        {ANCHORS}
      </Nav>,
    );
    expect(container.querySelector("[aria-hidden='true']")).not.toBeNull();
  });

  it("el logo sin href no es enlace", () => {
    render(
      <Nav>
        <Nav.Logo>Rosette</Nav.Logo>
      </Nav>,
    );
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("Rosette")).toBeDefined();
  });

  it("el logo sin rol no emite aria-label: sobre un span es aria-prohibited-attr", () => {
    render(
      <Nav>
        <Nav.Logo aria-label="Inicio">Rosette</Nav.Logo>
      </Nav>,
    );
    const span = screen.getByText("Rosette");

    expect(span.tagName).toBe("SPAN");
    expect(span.getAttribute("aria-label")).toBeNull();
  });

  it("el logo con href sí lo emite", () => {
    render(
      <Nav>
        <Nav.Logo href="/" aria-label="Inicio">
          Rosette
        </Nav.Logo>
      </Nav>,
    );
    expect(screen.getByRole("link", { name: "Inicio" })).toBeDefined();
  });

  it("la altura del logo viaja por var, no horneada en la imagen", () => {
    const { container } = render(
      <Nav>
        <Nav.Logo href="/" height={40}>
          Rosette
        </Nav.Logo>
      </Nav>,
    );
    const inline = screen.getByRole("link").getAttribute("style") ?? "";

    expect(inline).toContain("40px");
    expect(container.innerHTML).not.toContain('height: 40px;"><img');
  });
});

describe("Resolución de rutas", () => {
  it("NormalizePath limpia query, hash y barra final", () => {
    expect(NormalizePath("/precios/?a=1#x")).toBe("/precios");
    expect(NormalizePath("/")).toBe("/");
    expect(NormalizePath("#ancla")).toBe("");
  });

  it("BestPathMatch devuelve el prefijo más largo", () => {
    expect(BestPathMatch(["/", "/docs", "/docs/api"], "/docs/api/v2")).toBe("/docs/api");
    expect(BestPathMatch(["/", "/docs"], "/")).toBe("/");
    expect(BestPathMatch(["/docs"], "/otra")).toBeUndefined();
    expect(BestPathMatch(["/docs"], "")).toBeUndefined();
  });

  it("ResolveMode deduce hash solo si todos los href son anclas", () => {
    expect(ResolveMode("auto", undefined, ["#a", "#b"])).toBe("hash");
    expect(ResolveMode("auto", undefined, ["#a", "/b"])).toBe("pathname");
    expect(ResolveMode("auto", undefined, [])).toBe("pathname");
    expect(ResolveMode("auto", "/b", ["#a"])).toBe("manual");
    expect(ResolveMode("hash", undefined, ["/a"])).toBe("hash");
  });
});

describe("Nav — superficie de la barra estática (ADR-125)", () => {
  it("una barra estática viste desde el principio", () => {
    const view = render(
      <Nav>
        <Nav.Logo href="/">logo</Nav.Logo>
      </Nav>,
    );
    const root = view.container.querySelector("div[class*='Nav_solid']");
    expect(root).not.toBeNull();
    expect(root?.getAttribute("style")).toContain("--");
  });

  it("una barra que sigue al scroll no la lleva puesta de salida", () => {
    const view = render(
      <Nav sticky>
        <Nav.Logo href="/">logo</Nav.Logo>
      </Nav>,
    );
    expect(view.container.querySelector("div[class*='Nav_solid']")).toBeNull();
    expect(view.container.querySelector("[data-scrolled='false']")).not.toBeNull();
  });
});
