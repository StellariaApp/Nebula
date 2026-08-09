import type { ReactNode } from "react";

import type { ColorExtended, Size, Unit, Variant } from "@stellaria/nebula-tokens";
import type { StyleProps } from "../../utils/style-props.js";

import type { TextSlotProps } from "../Text/Text.types.js";
import type { BoxSlotProps } from "../Box/Box.types.js";

export type ProgressVariant = Extract<Variant, "light" | "outline" | "ghost">;

export interface ProgressSegment {
  value: number;
  color?: ColorExtended | undefined;
  label?: string | undefined;
}

export interface ProgressProps extends StyleProps {
  /**
   * Every segment of the bar. It spreads over ALL of them. Their width and colour are written AFTER
   * the slot, because they are the data; everything else can be adjusted. It does not exist with
   * `type="ring"` nor with `indeterminate`, which is a separate animated layer.
   */
  fillProps?: BoxSlotProps | undefined;
  /**
   * The label at the centre of the ring, which is the node wrapping `children`. It only exists with
   * `type="ring"` and only with `children`; on the bar nothing is rendered.
   */
  ringLabelProps?: TextSlotProps | undefined;
  value?: number | undefined;
  segments?: readonly ProgressSegment[] | undefined;
  max?: number | undefined;
  type?: "bar" | "ring" | undefined;
  variant?: ProgressVariant | undefined;
  color?: ColorExtended | undefined;
  size?: Size | Unit | undefined;
  thickness?: number | undefined;
  radius?: Unit | undefined;
  striped?: boolean | undefined;
  indeterminate?: boolean | undefined;
  label?: string | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
}
