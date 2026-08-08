import type { ReactNode } from "react";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";
import type { StyleProps } from "../../utils/style-props.js";

export interface EmptyStateProps extends StyleProps {
  title: ReactNode;
  description?: ReactNode | undefined;
  icon?: ReactNode | undefined;
  actions?: ReactNode | undefined;
  size?: "sm" | "md" | "lg" | undefined;
  className?: string | undefined;
  /** El titulo. Es el unico nodo que se pinta siempre, porque `title` es obligatorio. */
  titleProps?: TextSlotProps | undefined;
  /** La descripcion. Solo se pinta con `description`. */
  descriptionProps?: TextSlotProps | undefined;
  /** El glifo. Solo se pinta con `icon`, y va `aria-hidden`. */
  iconProps?: BoxSlotProps | undefined;
  /** La fila de acciones. Solo se pinta con `actions`. */
  actionsProps?: BoxSlotProps | undefined;
}
