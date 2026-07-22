import { cleanup, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FileButton } from "../FileButton.js";

afterEach(cleanup);

describe("FileButton", () => {
  it("abre el selector desde el render-prop y entrega el archivo", async () => {
    const on_change = vi.fn();
    render(
      <FileButton onChange={on_change}>
        {(control) => (
          <button type="button" onClick={control.onClick}>
            Subir
          </button>
        )}
      </FileButton>,
    );

    const file = new File(["contenido"], "doc.txt", { type: "text/plain" });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    await userEvent.upload(input, file);

    expect(on_change).toHaveBeenCalledTimes(1);
    expect(on_change.mock.calls[0]?.[0]).toBe(file);
  });

  it("con multiple entrega un array", async () => {
    const on_change = vi.fn();
    render(
      <FileButton multiple onChange={on_change}>
        {(control) => (
          <button type="button" onClick={control.onClick}>
            Subir
          </button>
        )}
      </FileButton>,
    );
    const files = [new File(["a"], "a.txt"), new File(["b"], "b.txt")];
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, files);
    expect(Array.isArray(on_change.mock.calls[0]?.[0])).toBe(true);
  });
});
