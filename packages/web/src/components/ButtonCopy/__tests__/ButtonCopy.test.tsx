import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { NebulaProvider } from "../../../provider/nebula-provider.js";
import { ButtonCopy } from "../ButtonCopy.js";

function Wrap(ui: ReactNode) {
  return render(
    <NebulaProvider defaultTheme="nebula-dark" storage={null}>
      {ui}
    </NebulaProvider>,
  );
}

const writeText = vi.fn(() => Promise.resolve());

beforeEach(() => {
  Object.assign(navigator, { clipboard: { writeText: writeText } });
  writeText.mockClear();
});

afterEach(cleanup);

describe("ButtonCopy", () => {
  it("copia el valor al portapapeles y cambia el label a Copiado", async () => {
    Wrap(<ButtonCopy value="hola mundo" />);
    const button = screen.getByRole("button", { name: "Copiar" });
    await userEvent.click(button);
    expect(writeText).toHaveBeenCalledWith("hola mundo");
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Copiado" })).toBeDefined();
    });
  });
});
