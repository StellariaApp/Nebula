import { fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { vars } from "../../../theme/contract.css.js";
import { Avatar, Initials, ResolveAvatarSize } from "../Avatar.js";
import { AvatarGroup } from "../Group.js";

afterEach(cleanup);

describe("Initials", () => {
  it("toma la primera y la última palabra", () => {
    expect(Initials("Ana Rivera")).toBe("AR");
    expect(Initials("Ana Sofía Rivera Luna")).toBe("AL");
  });

  it("con una sola palabra usa una inicial", () => {
    expect(Initials("Ana")).toBe("A");
  });

  it("tolera espacios sobrantes y cadena vacía", () => {
    expect(Initials("   Ana   Rivera  ")).toBe("AR");
    expect(Initials("   ")).toBe("");
  });
});

describe("ResolveAvatarSize", () => {
  it("los tamaños del contrato salen por var, no horneados", () => {
    expect(ResolveAvatarSize(undefined)).toBe(vars.size.control.md);
    expect(ResolveAvatarSize("xs")).toBe(vars.size.control.xs);
    expect(ResolveAvatarSize("xl")).toBe(vars.size.control.xl);
  });

  it("comparte la escala con el resto de controles", () => {
    expect(ResolveAvatarSize("sm")).toBe(vars.size.control.sm);
    expect(ResolveAvatarSize("md")).toBe(vars.size.control.md);
  });

  it("acepta una longitud libre", () => {
    expect(ResolveAvatarSize(96)).toBe("96px");
  });
});

describe("Avatar", () => {
  it("sin imagen expone role=img con el nombre accesible", () => {
    render(<Avatar name="Ana Rivera" />);
    expect(screen.getByRole("img", { name: "Ana Rivera" })).toBeDefined();
  });

  it("las iniciales son decorativas: no duplican el nombre accesible", () => {
    render(<Avatar name="Ana Rivera" />);
    expect(screen.getByText("AR").getAttribute("aria-hidden")).toBe("true");
  });

  it("con imagen usa el alt y no envuelve en un role redundante", () => {
    render(<Avatar src="/ana.png" alt="Ana Rivera" />);
    const img = screen.getByRole("img", { name: "Ana Rivera" });
    expect(img.tagName).toBe("IMG");
  });

  it("si la imagen falla cae a las iniciales sin perder el nombre", () => {
    render(<Avatar src="/rota.png" name="Ana Rivera" />);
    fireEvent.error(screen.getByRole("img", { name: "Ana Rivera" }));
    expect(screen.getByText("AR")).toBeDefined();
    expect(screen.getByRole("img", { name: "Ana Rivera" }).tagName).toBe("SPAN");
  });

  it("sin nombre ni alt no anuncia nada al lector de pantalla", () => {
    render(<Avatar />);
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("resuelve el tamaño por var, no por estilo horneado", () => {
    const { container } = render(<Avatar name="Ana Rivera" size="lg" />);
    const root = container.querySelector("span");
    expect(root?.getAttribute("style")).toContain(vars.size.control.lg);
  });
});

describe("AvatarGroup", () => {
  it("recorta a max y publica el resto completo, no solo su primer carácter", () => {
    render(
      <AvatarGroup max={2} aria-label="Equipo">
        <Avatar name="Ana Rivera" />
        <Avatar name="Beto Cruz" />
        <Avatar name="Carla Díaz" />
        <Avatar name="Dan Ortiz" />
      </AvatarGroup>,
    );
    expect(screen.getByText("+2")).toBeDefined();
    expect(screen.getByRole("img", { name: "+2" })).toBeDefined();
  });

  it("total permite contar más allá de los hijos renderizados", () => {
    render(
      <AvatarGroup max={2} total={40} aria-label="Equipo">
        <Avatar name="Ana Rivera" />
        <Avatar name="Beto Cruz" />
        <Avatar name="Carla Díaz" />
      </AvatarGroup>,
    );
    expect(screen.getByText("+38")).toBeDefined();
  });

  it("sin exceso no muestra contador", () => {
    render(
      <AvatarGroup max={4} aria-label="Equipo">
        <Avatar name="Ana Rivera" />
        <Avatar name="Beto Cruz" />
      </AvatarGroup>,
    );
    expect(screen.queryByText(/^\+/)).toBeNull();
  });
});
