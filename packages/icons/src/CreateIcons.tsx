import { type ReactElement, type SVGProps } from "react";

import { RenderIcon } from "./render.js";
import type { IconComponent } from "./types.js";

export interface CreatedIconProps<Name extends string> extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: Name;
  size?: number | string | undefined;
  label?: string | undefined;
}

export interface IconSet<Name extends string> {
  Icon: (props: CreatedIconProps<Name>) => ReactElement | null;
  names: readonly Name[];
  has: (name: string) => name is Name;
}

export function CreateIcons<M extends Record<string, IconComponent>>(
  icons: M,
): IconSet<Extract<keyof M, string>> {
  type Name = Extract<keyof M, string>;
  const names = Object.keys(icons) as Name[];

  function Icon(props: CreatedIconProps<Name>): ReactElement | null {
    const { name, size = "1em", label, ...rest } = props;
    return RenderIcon(icons[name], size, label, rest);
  }
  Icon.displayName = "Icon";

  return {
    Icon,
    names,
    has: (name: string): name is Name => Object.prototype.hasOwnProperty.call(icons, name),
  };
}
