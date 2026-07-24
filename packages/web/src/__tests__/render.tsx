import {
  render as rtl_render,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

import { NebulaProvider } from "../provider/nebula-provider.js";

function Wrapper({ children }: { children: ReactNode }): ReactElement {
  return (
    <NebulaProvider defaultTheme="nebula-dark" storage={null}>
      {children}
    </NebulaProvider>
  );
}

export function render(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
): RenderResult {
  return rtl_render(ui, { wrapper: Wrapper, ...options });
}

export { cleanup, screen, waitFor } from "@testing-library/react";
