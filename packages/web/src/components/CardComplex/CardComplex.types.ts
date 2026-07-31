import type { ReactNode } from "react";

import type {
  ColorExtended,
  PermissionDeniedMode,
  PermissionKey,
  Unit,
} from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";
import type { CardVariant } from "../Card/Card.types.js";

export type CardActionSlot = "header" | "media" | "footer";

export interface CardAction {
  key: string;
  label: string;
  slot?: CardActionSlot | undefined;
  icon?: ReactNode | undefined;
  onPress?: (() => void) | undefined;
  href?: string | undefined;
  color?: ColorExtended | undefined;
  disabled?: boolean | undefined;
  permission?: PermissionKey | undefined;
  permissionMode?: PermissionDeniedMode | undefined;
}

export interface CardBadge {
  key: string;
  label: ReactNode;
  color?: ColorExtended | undefined;
  variant?: "filled" | "outline" | "light" | "ghost" | "gradient" | undefined;
}

export interface CardMedia {
  image?: string | undefined;
  alt?: string | undefined;
  height?: Unit | undefined;
  component?: ReactNode | undefined;
  hidden?: boolean | undefined;
}

export interface CardBadgeGroups {
  title?: readonly CardBadge[] | undefined;
  main?: readonly CardBadge[] | undefined;
  footer?: readonly CardBadge[] | undefined;
  grow?: boolean | undefined;
  wrap?: boolean | undefined;
}

export interface CardPerson {
  name: string;
  avatar?: string | undefined;
}

export interface CardMetaData {
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
  createdAtLabel?: string | undefined;
  updatedAtLabel?: string | undefined;
  responsible?: CardPerson | undefined;
  responsibleLabel?: string | undefined;
  locale?: string | undefined;
}

export interface CardComplexProps extends Omit<StyleProps, "color"> {
  title?: ReactNode | undefined;
  description?: ReactNode | undefined;
  media?: CardMedia | undefined;
  badges?: CardBadgeGroups | undefined;
  actions?: readonly CardAction[] | undefined;
  meta?: CardMetaData | undefined;
  href?: string | undefined;
  onPress?: (() => void) | undefined;
  selected?: boolean | undefined;
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
  variant?: CardVariant | undefined;
  color?: ColorExtended | undefined;
  lines?: number | undefined;
  footer?: ReactNode | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}
