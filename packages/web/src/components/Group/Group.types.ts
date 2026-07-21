import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { SpacingValue } from "@stellaria/nebula-tokens";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface GroupOwnProps extends Omit<BoxOwnProps, "component" | "gap" | "wrap"> {
  component?: ElementType | undefined;
  gap?: SpacingValue | undefined;
  wrap?: boolean | undefined;
  grow?: boolean | undefined;
  preventGrowOverflow?: boolean | undefined;
}

export type GroupProps<C extends ElementType = "div"> = GroupOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof GroupOwnProps | "component">;
