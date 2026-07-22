import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { UnstyledButton } from "../UnstyledButton.js";

afterEach(cleanup);

describe("UnstyledButton", () => {
  it("renderiza un button con type=button por defecto", () => {
    render(<UnstyledButton>x</UnstyledButton>);
    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("se activa con ratón y teclado (Enter/Space)", async () => {
    const on_press = vi.fn();
    render(<UnstyledButton onPress={on_press}>go</UnstyledButton>);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    button.focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(on_press).toHaveBeenCalledTimes(3);
  });

  it("disabled no dispara la acción", async () => {
    const on_press = vi.fn();
    render(
      <UnstyledButton disabled onPress={on_press}>
        off
      </UnstyledButton>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(on_press).not.toHaveBeenCalled();
    expect(screen.getByRole("button").dataset["disabled"]).toBe("true");
  });
});
