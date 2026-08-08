import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

export interface BreadcrumbItem {
  key: string;
  label: ReactNode;
  href?: string | undefined;
  onSelect?: (() => void) | undefined;
  icon?: ReactNode | undefined;
  /** Adapter de router: el componente no depende de Next ni de ningún enrutador. */
  component?: ElementType | undefined;
}

export interface BreadcrumbsLabels {
  nav: string;
  collapsed: string;
}

export interface BreadcrumbsProps extends StyleProps {
  items: readonly BreadcrumbItem[];
  separator?: ReactNode | undefined;
  /** A partir de cuántos items se colapsan los intermedios. `0` desactiva el colapso. */
  collapseFrom?: number | undefined;
  size?: "sm" | "md" | undefined;
  labels?: Partial<BreadcrumbsLabels> | undefined;
  className?: string | undefined;
  /** La lista. */
  listProps?: BoxSlotProps | undefined;
  /** Cada migaja. Se esparce sobre TODAS, incluida la de los puntos suspensivos. */
  itemProps?: BoxSlotProps | undefined;
  /** El boton que despliega las migajas ocultas. Solo aparece si la ruta se colapsa. */
  expandProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** El separador. Se esparce sobre todos; el ultimo no se pinta. */
  separatorProps?: BoxSlotProps | undefined;
  /** La migaja actual, que lleva `aria-current` y no es enlace. */
  currentProps?: BoxSlotProps | undefined;
  /**
   * Las migajas navegables. No cae sobre la actual. Su elemento sale del `component` de cada item,
   * o de su `href`: con `href` es un `a` y sin el un `button`. No pasa por `Box`, asi que no acepta
   * style props.
   */
  linkProps?: ComponentPropsWithoutRef<"a"> | undefined;
}
