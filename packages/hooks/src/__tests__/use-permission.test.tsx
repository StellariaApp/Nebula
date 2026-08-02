import { renderHook } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { PermissionProvider } from "../permission/permission-provider.js";
import { usePermission, usePermissionResolver } from "../permission/use-permission.js";

type AppPermission = "orders.read" | "orders.write";

function Wrapper(resolver: (key: AppPermission) => boolean) {
  return function Provider(props: { children: ReactNode }): ReactElement {
    return (
      <PermissionProvider<AppPermission> resolver={resolver}>{props.children}</PermissionProvider>
    );
  };
}

describe("usePermission", () => {
  it("sin provider deniega en vez de conceder", () => {
    const { result } = renderHook(() => usePermission("orders.read"));
    expect(result.current).toBe(false);
  });

  it("delega en el resolver de la app", () => {
    const resolver = vi.fn((key: AppPermission) => key === "orders.read");
    const { result } = renderHook(() => usePermission<AppPermission>("orders.read"), {
      wrapper: Wrapper(resolver),
    });
    expect(result.current).toBe(true);
    expect(resolver).toHaveBeenCalledWith("orders.read");
  });

  it("una key que el resolver no concede devuelve false", () => {
    const { result } = renderHook(() => usePermission<AppPermission>("orders.write"), {
      wrapper: Wrapper((key) => key === "orders.read"),
    });
    expect(result.current).toBe(false);
  });
});

describe("usePermissionResolver", () => {
  it("sin provider devuelve un resolver que deniega todo", () => {
    const { result } = renderHook(() => usePermissionResolver<AppPermission>());
    expect(result.current("orders.read")).toBe(false);
    expect(result.current("orders.write")).toBe(false);
  });

  it("permite resolver varias keys en un solo render", () => {
    const { result } = renderHook(() => usePermissionResolver<AppPermission>(), {
      wrapper: Wrapper((key) => key === "orders.write"),
    });
    expect(result.current("orders.read")).toBe(false);
    expect(result.current("orders.write")).toBe(true);
  });
});
