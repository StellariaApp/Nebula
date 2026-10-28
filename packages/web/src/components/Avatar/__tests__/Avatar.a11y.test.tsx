import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen } from "../../../__tests__/render.js";

import { Avatar } from "../Avatar.js";
import { AvatarGroup } from "../Group.js";

afterEach(cleanup);

describe("Avatar · accesibilidad", () => {
  it("con imagen, con iniciales, anónimo y en grupo: sin violaciones de axe", async () => {
    const { container } = render(
      <>
        <Avatar src="/ana.png" alt="Ana Rivera" />
        <Avatar name="Beto Ruiz" />
        <Avatar />
        <AvatarGroup aria-label="Equipo" max={2} total={4}>
          <Avatar name="Ana Rivera" />
          <Avatar name="Beto Ruiz" />
          <Avatar name="Carla Díaz" />
        </AvatarGroup>
      </>,
    );
    await ExpectNoViolations(container);
  });

  it("las iniciales no duplican el nombre: el nombre accesible es el nombre completo", () => {
    render(<Avatar name="Ana Rivera" />);
    expect(screen.getByRole("img", { name: "Ana Rivera" })).toBeDefined();
    expect(screen.getByText("AR").getAttribute("aria-hidden")).toBe("true");
  });

  it("un avatar sin nombre ni alt es decorativo y no se anuncia", () => {
    render(<Avatar />);
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("no es focusable", async () => {
    const user = userEvent.setup();
    render(<Avatar name="Ana Rivera" />);
    await user.tab();
    expect(document.activeElement).toBe(document.body);
  });
});
