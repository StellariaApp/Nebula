import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Textarea } from "../Textarea.js";

afterEach(cleanup);

describe("Textarea", () => {
  it("renderiza un textarea vinculado al label", () => {
    render(<Textarea label="Comentario" rows={4} />);
    const el = screen.getByLabelText("Comentario");
    expect(el.tagName).toBe("TEXTAREA");
    expect(el.getAttribute("rows")).toBe("4");
  });

  it("edita el valor", async () => {
    const on_change = vi.fn();
    render(<Textarea label="C" onChange={on_change} />);
    await userEvent.type(screen.getByLabelText("C"), "hola");
    expect(on_change).toHaveBeenCalled();
  });
});
