import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Avatar } from "../../Avatar/Avatar.js";
import { AvatarGroup } from "../../Avatar/Group.js";
import { Badge } from "../../Badge/Badge.js";
import { EmptyState } from "../../EmptyState/EmptyState.js";
import { Image } from "../../Image/Image.js";
import { Card } from "../index.js";

afterEach(cleanup);

describe("Badge", () => {
  it("renderiza su contenido y expone la variante", () => {
    render(<Badge variant="filled">Nuevo</Badge>);
    const badge = screen.getByText("Nuevo");
    expect(badge.getAttribute("data-variant")).toBe("filled");
  });

  it("el punto no aporta texto adicional al lector", () => {
    render(<Badge dot>Activo</Badge>);
    expect(screen.getByText("Activo").textContent).toBe("Activo");
  });
});

describe("Avatar", () => {
  it("con imagen usa alt como texto alternativo", () => {
    render(<Avatar src="/foto.png" alt="Ana García" />);
    expect(screen.getByRole("img", { name: "Ana García" })).toBeDefined();
  });

  it("sin imagen expone las iniciales con nombre accesible", () => {
    render(<Avatar name="Ana García" />);
    const avatar = screen.getByRole("img", { name: "Ana García" });
    expect(avatar.textContent).toBe("AG");
  });

  it("el grupo indica cuántos quedan fuera", () => {
    render(
      <AvatarGroup max={2} total={5} aria-label="Equipo">
        <Avatar name="Ana García" />
        <Avatar name="Beto Ruiz" />
        <Avatar name="Carla Díaz" />
      </AvatarGroup>,
    );
    expect(screen.getByRole("group", { name: "Equipo" })).toBeDefined();
    expect(screen.getByRole("img", { name: "+3" })).toBeDefined();
  });
});

describe("Image", () => {
  it("expone el alt de la imagen", () => {
    render(<Image src="/foto.png" alt="Paisaje" />);
    expect(screen.getByRole("img", { name: "Paisaje" })).toBeDefined();
  });

  it("sin src muestra el fallback en vez de una imagen rota", () => {
    render(<Image alt="Sin foto" fallback="No disponible" />);
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("No disponible")).toBeDefined();
  });
});

describe("Card", () => {
  it("por defecto no es interactiva", () => {
    render(
      <Card>
        <p>Contenido</p>
      </Card>,
    );
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("con onPress es un botón accesible", async () => {
    const OnPress = vi.fn();
    const user = userEvent.setup();
    render(
      <Card onPress={OnPress} aria-label="Abrir ficha">
        <p>Contenido</p>
      </Card>,
    );
    await user.click(screen.getByRole("button", { name: "Abrir ficha" }));
    expect(OnPress).toHaveBeenCalledTimes(1);
  });

  it("con href es un enlace", () => {
    render(
      <Card href="/detalle" aria-label="Ver detalle">
        <p>Contenido</p>
      </Card>,
    );
    expect(screen.getByRole("link", { name: "Ver detalle" }).getAttribute("href")).toBe("/detalle");
  });

  it("compone sus slots", () => {
    render(
      <Card>
        <Card.Image src="/foto.png" alt="Portada" />
        <Card.Badges>
          <Badge>Nuevo</Badge>
        </Card.Badges>
        <Card.Meta>Hace 2 días</Card.Meta>
        <Card.Actions>
          <button type="button">Ver</button>
        </Card.Actions>
      </Card>,
    );
    expect(screen.getByRole("img", { name: "Portada" })).toBeDefined();
    expect(screen.getByText("Nuevo")).toBeDefined();
    expect(screen.getByText("Hace 2 días")).toBeDefined();
    expect(screen.getByRole("button", { name: "Ver" })).toBeDefined();
  });
});

describe("EmptyState", () => {
  it("muestra título, descripción y acciones", () => {
    render(
      <EmptyState
        title="Sin resultados"
        description="Prueba con otros filtros."
        actions={<button type="button">Limpiar</button>}
      />,
    );
    expect(screen.getByText("Sin resultados")).toBeDefined();
    expect(screen.getByText("Prueba con otros filtros.")).toBeDefined();
    expect(screen.getByRole("button", { name: "Limpiar" })).toBeDefined();
  });
});
