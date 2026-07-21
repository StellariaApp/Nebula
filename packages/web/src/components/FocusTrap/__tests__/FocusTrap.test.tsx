import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { FocusTrap } from "../FocusTrap.js";

afterEach(cleanup);

describe("FocusTrap", () => {
  it("renderiza su contenido", () => {
    render(
      <FocusTrap>
        <button type="button">dentro</button>
      </FocusTrap>,
    );
    expect(screen.getByRole("button", { name: "dentro" })).toBeDefined();
  });

  it("autoFocus enfoca el primer elemento focusable", async () => {
    render(
      <FocusTrap autoFocus>
        <button type="button">primero</button>
      </FocusTrap>,
    );
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "primero" })).toBe(document.activeElement);
    });
  });
});
