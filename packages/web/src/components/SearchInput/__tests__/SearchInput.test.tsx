import { cleanup, render, screen, waitFor } from "../../../__tests__/render.js";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SearchInput } from "../SearchInput.js";

afterEach(cleanup);

describe("SearchInput", () => {
  it("dispara onSearch con debounce", async () => {
    const on_search = vi.fn();
    render(<SearchInput label="Search" onSearch={on_search} debounce={50} />);
    await userEvent.type(screen.getByLabelText("Search"), "abc");
    await waitFor(() => {
      expect(on_search).toHaveBeenCalledWith("abc");
    });
  });

  it("permite limpiar el valor", async () => {
    render(<SearchInput label="B" defaultValue="hola" />);
    const input = screen.getByLabelText<HTMLInputElement>("B");
    expect(input.value).toBe("hola");
    await userEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(input.value).toBe("");
  });
});
