import { type ReactElement, type SVGProps } from "react";

import type { IconComponent } from "./types.js";

export function RenderIcon(
  Svg: IconComponent | undefined,
  size: number | string,
  label: string | undefined,
  rest: SVGProps<SVGSVGElement>,
): ReactElement | null {
  if (Svg === undefined) return null;

  if (label === undefined) {
    return <Svg width={size} height={size} aria-hidden focusable={false} {...rest} />;
  }

  return <Svg width={size} height={size} role="img" aria-label={label} {...rest} />;
}
