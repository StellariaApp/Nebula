import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Omit } from "../Omit.js";

afterEach(cleanup);

describe("Omit", () => {
  it("renderiza children por defecto", () => {
    render(
      <Omit>
        <span>visible</span>
      </Omit>,
    );
    expect(screen.getByText("visible")).toBeDefined();
  });

  it("no renderiza nada cuando omit", () => {
    render(
      <Omit omit>
        <span>visible</span>
      </Omit>,
    );
    expect(screen.queryByText("visible")).toBeNull();
  });
});
