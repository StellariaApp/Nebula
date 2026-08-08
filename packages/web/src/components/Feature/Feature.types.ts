import type { ReactNode } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";

import type { TextSlotProps } from "../Text/Text.types.js";
import type { StyleProps } from "../../utils/style-props.js";
import type { AnchorSlotProps } from "../Anchor/Anchor.types.js";
import type { ThemeIconProps } from "../ThemeIcon/ThemeIcon.types.js";

export interface FeatureProps extends Omit<StyleProps, "align"> {
  title: ReactNode;
  description?: ReactNode | undefined;
  icon?: ReactNode | undefined;
  color?: ColorExtended | undefined;
  href?: string | undefined;
  linkText?: ReactNode | undefined;
  align?: "start" | "center" | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
  /** El titulo. Es el unico nodo que se pinta siempre, porque `title` es obligatorio. */
  titleProps?: TextSlotProps | undefined;
  /** La descripcion. Solo se pinta con `description`. */
  descriptionProps?: TextSlotProps | undefined;
  /** El `ThemeIcon` que envuelve al glifo. Solo existe con `icon`, y se esparce DESPUES del tamano, la variante y el color que fija el componente, asi que los sustituye. */
  iconProps?: ThemeIconProps | undefined;
  /**
   * El enlace del pie. Solo existe con `href`, y `linkText` es su contenido. Se esparce DESPUES del
   * `href`, asi que puede sustituirlo.
   */
  linkProps?: AnchorSlotProps | undefined;
}
