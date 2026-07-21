import type { ComponentType, SVGProps } from "react";

export interface IconComponentProps extends SVGProps<SVGSVGElement> {
  size?: string | number;
  absoluteStrokeWidth?: boolean;
}

export type IconComponent = ComponentType<IconComponentProps>;

export type IconName = string;
