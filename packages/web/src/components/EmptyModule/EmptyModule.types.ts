import type { ReactNode } from "react";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { StyleProps } from "../../utils/style-props.js";
import type { EmptyStateProps } from "../EmptyState/EmptyState.types.js";

export type EmptyModuleSurface = "none" | "paper" | "outline" | "dashed";

export interface EmptyModuleProps extends StyleProps {
  title: ReactNode;
  description?: ReactNode | undefined;
  illustration?: ReactNode | undefined;
  icon?: ReactNode | undefined;
  action?: ReactNode | undefined;
  secondaryAction?: ReactNode | undefined;
  footer?: ReactNode | undefined;
  size?: "sm" | "md" | "lg" | undefined;
  surface?: EmptyModuleSurface | undefined;
  className?: string | undefined;
  /** El titulo, reenviado a la ranura del `EmptyState` que el modulo monta dentro. */
  titleProps?: EmptyStateProps["titleProps"] | undefined;
  /** La descripcion, reenviada al `EmptyState`. Solo se pinta con `description`. */
  descriptionProps?: EmptyStateProps["descriptionProps"] | undefined;
  /** El glifo, reenviado al `EmptyState`. Solo se pinta con `icon`. */
  iconProps?: EmptyStateProps["iconProps"] | undefined;
  /** La ilustracion, que es propia del modulo y va antes del `EmptyState`. Solo con `illustration`, va `aria-hidden` y su tamano sale de `size`. */
  illustrationProps?: BoxSlotProps | undefined;
  /** La banda que junta `action` y `secondaryAction`. Cae DENTRO de la fila de acciones del `EmptyState`, no la sustituye, y no existe si no hay ninguna de las dos. */
  actionsProps?: BoxSlotProps | undefined;
  /** El pie del modulo, fuera del `EmptyState`. Solo se pinta con `footer`. */
  footerProps?: BoxSlotProps | undefined;
}
