import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Radio } from "../Radio.js";
import { RadioGroup } from "../Group.js";

afterEach(cleanup);

describe("Radio / RadioGroup", () => {
  it("selecciona un valor único dentro del grupo", async () => {
    const on_change = vi.fn();
    render(
      <RadioGroup label="Plan" onChange={on_change}>
        <Radio value="free" label="Gratis" />
        <Radio value="pro" label="Pro" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeDefined();
    await userEvent.click(screen.getByRole("radio", { name: "Pro" }));
    expect(on_change).toHaveBeenCalledWith("pro");
  });

  it("comparte name para la navegación por flechas nativa", () => {
    render(
      <RadioGroup label="P" defaultValue="a">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    const a = screen.getByRole<HTMLInputElement>("radio", { name: "A" });
    const b = screen.getByRole<HTMLInputElement>("radio", { name: "B" });
    expect(a.name).toBe(b.name);
    expect(a.checked).toBe(true);
  });
});
