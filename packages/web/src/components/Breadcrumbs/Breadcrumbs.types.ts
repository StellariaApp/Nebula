import type { ElementType, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

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
}
