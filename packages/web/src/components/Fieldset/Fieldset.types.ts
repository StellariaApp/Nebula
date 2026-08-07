import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { TextSlotProps } from "../Text/Text.types.js";

export type FieldsetSurface = Exclude<FieldSurface, "underline">;

export interface FieldsetProps
  extends Omit<ComponentPropsWithoutRef<"fieldset">, "color" | "disabled">, StyleProps {
  legend?: ReactNode | undefined;
  description?: ReactNode | undefined;
  surface?: FieldsetSurface | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
  /** La leyenda. Solo se pinta si hay `legend`. */
  legendProps?: TextSlotProps | undefined;
  /** La descripcion. Lleva el id al que apunta el `aria-describedby` del grupo. */
  descriptionProps?: TextSlotProps | undefined;
}
