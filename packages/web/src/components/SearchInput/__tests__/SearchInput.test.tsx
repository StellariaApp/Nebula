import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SearchInput } from "../SearchInput.js";

afterEach(cleanup);

describe("SearchInput", () => {
  it("dispara onSearch con debounce", () => {
    vi.useFakeTimers();
    const on_search = vi.fn();
    render(<SearchInput label="Buscar" onSearch={on_search} debounce={50} />);
    fireEvent.change(screen.getByLabelText("Buscar"), { target: { value: "abc" } });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(on_search).toHaveBeenCalledWith("abc");
    vi.useRealTimers();
  });

  it("permite limpiar el valor", async () => {
    render(<SearchInput label="B" defaultValue="hola" />);
    const input = screen.getByLabelText<HTMLInputElement>("B");
    expect(input.value).toBe("hola");
    await userEvent.click(screen.getByRole("button", { name: "Limpiar" }));
    expect(input.value).toBe("");
  });
});
