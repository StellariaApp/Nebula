import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { useDisclosure } from "../use-disclosure.js";

afterEach(cleanup);

describe("useDisclosure", () => {
  it("arranca cerrado y respeta el estado inicial", () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.opened).toBe(false);

    const { result: opened } = renderHook(() => useDisclosure(true));
    expect(opened.current.opened).toBe(true);
  });

  it("open / close / toggle mutan el estado", () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => {
      result.current.open();
    });
    expect(result.current.opened).toBe(true);

    act(() => {
      result.current.close();
    });
    expect(result.current.opened).toBe(false);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.opened).toBe(true);
  });
});
