import { userEvent } from "@testing-library/user-event";
import { useState, type ReactElement } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Chip } from "../Chip.js";
import { ChipGroup } from "../ChipGroup.js";

afterEach(cleanup);

function Controlled(): ReactElement {
  const [value, set_value] = useState<string[]>(["a"]);
  const [ticks, set_ticks] = useState(0);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          set_ticks(ticks + 1);
        }}
      >
        tick {ticks}
      </button>
      <output>{value.join(",")}</output>
      <ChipGroup multiple value={value} onChange={set_value}>
        <Chip value="a">A</Chip>
        <Chip value="b">B</Chip>
      </ChipGroup>
    </>
  );
}

describe("ChipGroup controlado", () => {
  it("sobrevive a un re-render del padre y sigue el valor", async () => {
    render(<Controlled />);
    await userEvent.click(screen.getByRole("button", { name: /tick/ }));
    expect(screen.getByRole("button", { name: "tick 1" })).toBeDefined();
    await userEvent.click(screen.getByText("B"));
    expect(screen.getByRole("status").textContent).toBe("a,b");
  });
});
