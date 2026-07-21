import { afterEach, describe, expect, it } from "vitest";

import {
  ClearIcons,
  HasIcon,
  RegisteredIconNames,
  RegisterIcons,
  ResolveIcon,
} from "./registry.js";
function Dummy(): null {
  return null;
}

afterEach(() => {
  ClearIcons();
});

describe("registry", () => {
  it("registra y resuelve un icono por nombre", () => {
    RegisterIcons({ heart: Dummy });
    expect(HasIcon("heart")).toBe(true);
    expect(ResolveIcon("heart")).toBe(Dummy);
  });

  it("un nombre no registrado resuelve undefined", () => {
    expect(ResolveIcon("nope")).toBeUndefined();
    expect(HasIcon("nope")).toBe(false);
  });

  it("lista los nombres registrados", () => {
    RegisterIcons({ a: Dummy, b: Dummy });
    expect(RegisteredIconNames().sort()).toEqual(["a", "b"]);
  });

  it("ClearIcons vacía el registry", () => {
    RegisterIcons({ a: Dummy });
    ClearIcons();
    expect(RegisteredIconNames()).toEqual([]);
  });
});
