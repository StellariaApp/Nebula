import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Footer } from "../index.js";

afterEach(cleanup);

describe("Footer", () => {
  it("emite el landmark contentinfo", () => {
    render(<Footer>pie</Footer>);
    expect(screen.getByRole("contentinfo")).toBeDefined();
  });

  it("component eleva o baja el elemento sin perder el resto", () => {
    const { container } = render(<Footer component="div">pie</Footer>);

    expect(container.querySelector("footer")).toBeNull();
    expect(screen.getByText("pie")).toBeDefined();
  });

  it("el carril vale 1180 por defecto y viaja como var", () => {
    render(<Footer>pie</Footer>);
    const inline = screen.getByRole("contentinfo").getAttribute("style") ?? "";

    expect(inline).toContain("1180px");
    expect(inline).not.toContain("max-width");
  });

  it('contentWidth="none" quita el tope', () => {
    render(<Footer contentWidth="none">pie</Footer>);
    const inline = screen.getByRole("contentinfo").getAttribute("style") ?? "";

    expect(inline).toContain("none");
    expect(inline).not.toContain("1180px");
  });

  it("sticky publica su estado y por defecto no lo hace", () => {
    const plain = render(<Footer>pie</Footer>);
    expect(screen.getByRole("contentinfo").getAttribute("data-sticky")).toBeNull();
    plain.unmount();

    render(<Footer sticky>pie</Footer>);
    expect(screen.getByRole("contentinfo").getAttribute("data-sticky")).toBe("true");
  });
});

describe("Footer.Group", () => {
  it("los enlaces salen en una lista, que es lo que anuncia el lector", () => {
    render(
      <Footer>
        <Footer.Group title="Producto">
          <Footer.Group.Link href="/precios">Precios</Footer.Group.Link>
          <Footer.Group.Link href="/docs">Docs</Footer.Group.Link>
        </Footer.Group>
      </Footer>,
    );

    const list = screen.getByRole("list");
    expect(list.tagName).toBe("UL");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Precios" }).getAttribute("href")).toBe("/precios");
  });

  it("sin enlaces no inventa una lista", () => {
    const { container } = render(
      <Footer>
        <Footer.Group title="Contacto">
          <span>hola@rosette.dev</span>
        </Footer.Group>
      </Footer>,
    );

    expect(container.querySelector("ul")).toBeNull();
    expect(screen.getByText("hola@rosette.dev")).toBeDefined();
  });

  it("un enlace sin href es un botón y dispara onPress", async () => {
    const user = userEvent.setup();
    const on_press = vi.fn();
    render(
      <Footer>
        <Footer.Group>
          <Footer.Group.Link onPress={on_press}>Preferencias</Footer.Group.Link>
        </Footer.Group>
      </Footer>,
    );

    const button = screen.getByRole("button", { name: "Preferencias" });
    expect(button.getAttribute("type")).toBe("button");

    await user.click(button);
    expect(on_press).toHaveBeenCalledTimes(1);
  });
});

describe("Footer.Brand y Footer.Legal", () => {
  it("la marca enlaza y describe", () => {
    render(
      <Footer>
        <Footer.Brand
          href="/"
          aria-label="Inicio"
          logo={<span>R</span>}
          description="Conciliación"
        />
      </Footer>,
    );

    expect(screen.getByRole("link", { name: "Inicio" })).toBeDefined();
    expect(screen.getByText("Conciliación")).toBeDefined();
  });

  it("la marca sin href no emite aria-label sobre un span sin rol", () => {
    render(
      <Footer>
        <Footer.Brand aria-label="Inicio" logo={<span>R</span>} />
      </Footer>,
    );

    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("R").parentElement?.getAttribute("aria-label")).toBeNull();
  });

  it("Legal se separa de las columnas y va al final", () => {
    const { container } = render(
      <Footer>
        <Footer.Group title="Producto">
          <Footer.Group.Link href="/a">A</Footer.Group.Link>
        </Footer.Group>
        <Footer.Legal>© 2026</Footer.Legal>
      </Footer>,
    );

    const inner = screen.getByRole("contentinfo").firstElementChild;
    expect(inner?.children).toHaveLength(2);
    expect(inner?.lastElementChild?.textContent).toBe("© 2026");
    expect(container.querySelector("ul")?.closest("div")).not.toBe(inner?.lastElementChild);
  });
});
