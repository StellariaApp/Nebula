import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Valid } from "../Valid.js";

afterEach(cleanup);

describe("Valid", () => {
  it("renderiza children cuando valid", () => {
    render(
      <Valid valid invalid={<span>err</span>}>
        <span>ok</span>
      </Valid>,
    );
    expect(screen.getByText("ok")).toBeDefined();
    expect(screen.queryByText("err")).toBeNull();
  });

  it("renderiza invalid cuando no valid", () => {
    render(
      <Valid valid={false} invalid={<span>err</span>}>
        <span>ok</span>
      </Valid>,
    );
    expect(screen.getByText("err")).toBeDefined();
  });

  it("sin invalid no renderiza nada cuando no valid", () => {
    render(
      <Valid valid={false}>
        <span>ok</span>
      </Valid>,
    );
    expect(screen.queryByText("ok")).toBeNull();
  });
});
