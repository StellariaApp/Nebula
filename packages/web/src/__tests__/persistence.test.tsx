import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { useTheme } from "@stellaria/nebula-hooks";

import { NebulaProvider, type ThemeStorage } from "../provider/nebula-provider.js";
import { themeClass } from "../theme/themes.css.js";

afterEach(cleanup);

interface MemoryStorage extends ThemeStorage {
  data: Record<string, string>;
}

function MakeMemoryStorage(initial: Record<string, string> = {}): MemoryStorage {
  const data: Record<string, string> = { ...initial };
  return {
    data,
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => {
      data[key] = value;
    },
  };
}

function Switcher() {
  const { setTheme, themeName } = useTheme();
  return (
    <button
      type="button"
      data-testid="s"
      data-name={themeName}
      onClick={() => {
        setTheme("playful");
      }}
    >
      x
    </button>
  );
}

describe("persistencia inyectable", () => {
  it("setTheme escribe el tema en el storage inyectado", () => {
    const storage = MakeMemoryStorage();
    const { getByTestId } = render(
      <NebulaProvider storage={storage} storageKey="k">
        <Switcher />
      </NebulaProvider>,
    );

    act(() => {
      getByTestId("s").click();
    });

    expect(storage.data.k).toBe("playful");
    expect(getByTestId("s").getAttribute("data-name")).toBe("playful");
  });

  it("aplica el tema persistido al montar", () => {
    const storage = MakeMemoryStorage({ k: "nebula-dark" });
    const { container } = render(
      <NebulaProvider storage={storage} storageKey="k" defaultTheme="nebula-light">
        <span>x</span>
      </NebulaProvider>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toBe(themeClass["nebula-dark"]);
  });
});
