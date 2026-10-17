import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import type { SelectOption } from "../../../collections/options.js";
import { Combobox } from "../Combobox.js";

afterEach(cleanup);

const DATA: SelectOption[] = [
  { value: "mx", label: "México" },
  { value: "co", label: "Colombia" },
];

describe("Combobox: botón de despliegue", () => {
  it("no pasa props de React Aria al DOM", () => {
    const OnConsoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    render(<Combobox label="País" data={DATA} disabled />);
    const warnings = OnConsoleError.mock.calls
      .map((call) => call.map(String).join(" "))
      .filter((message) => message.includes("does not recognize"));
    OnConsoleError.mockRestore();
    expect(warnings).toEqual([]);
    expect(screen.getByRole<HTMLButtonElement>("button", { name: /País/ }).disabled).toBe(true);
  });
});
