import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { ColorExtended, NebulaField, Size } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { FormFieldSlotProps } from "../FormField/FormField.types.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export type DropzoneKind = "image" | "file" | "pdf" | "video";

export interface DropzoneLabels {
  idle: string;
  hint: string;
  accept: string;
  reject: string;
  remove: string;
}

export interface DropzoneProps extends StyleProps, FormFieldSlotProps {
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  size?: Size | undefined;
  color?: ColorExtended | undefined;
  field?: NebulaField<File[]> | undefined;
  value?: readonly File[] | undefined;
  defaultValue?: readonly File[] | undefined;
  onChange?: ((files: File[]) => void) | undefined;
  kind?: DropzoneKind | undefined;
  accept?: string | undefined;
  multiple?: boolean | undefined;
  replace?: boolean | undefined;
  maxFiles?: number | undefined;
  maxSize?: number | undefined;
  withPreview?: boolean | undefined;
  height?: number | undefined;
  icon?: ReactNode | undefined;
  labels?: Partial<DropzoneLabels> | undefined;
  name?: string | undefined;
  className?: string | undefined;
  /** The drop zone, which is the button. It carries `data-drag`, which is where its highlight comes from. */
  zoneProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** The zone icon. `icon` replaces it whole. */
  iconProps?: BoxSlotProps | undefined;
  /** The title, which changes with the drag state. */
  titleProps?: TextSlotProps | undefined;
  /** The hint below the title. */
  hintProps?: TextSlotProps | undefined;
  /** The list of chosen files. Only rendered when there are any. */
  listProps?: BoxSlotProps | undefined;
  rootClassName?: string | undefined;
}
