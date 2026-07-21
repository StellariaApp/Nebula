import { type ReactElement, type SVGProps } from "react";

import { RenderIcon } from "./render.js";
import { ResolveIcon } from "./registry.js";
import type { IconName } from "./types.js";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number | string | undefined;
  label?: string | undefined;
}

export function Icon(props: IconProps): ReactElement | null {
  const { name, size = "1em", label, ...rest } = props;
  return RenderIcon(ResolveIcon(name), size, label, rest);
}

Icon.displayName = "Icon";
