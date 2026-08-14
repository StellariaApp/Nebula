import type { CSSProperties, ReactNode } from "react";

import type { ColorExtended, Unit, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type HeroVariant = Extract<Variant, "filled" | "outline" | "light" | "glass">;

export type HeroSize = "sm" | "md" | "lg" | "xl";

export type HeroOrder = 1 | 2 | 3 | 4 | 5 | 6;

/** Props of any `Hero` part: children, `className` and the system style props. */
export interface HeroSlotProps extends Omit<StyleProps, "color" | "left" | "right" | "bottom"> {
  children?: ReactNode | undefined;
  className?: string | undefined;
}

export interface HeroPartsProps {
  titleProps?: HeroSlotProps | undefined;
  subtitleProps?: HeroSlotProps | undefined;
  headerProps?: HeroSlotProps | undefined;
  hiperProps?: HeroSlotProps | undefined;
  descriptionProps?: HeroSlotProps | undefined;
  actionsProps?: HeroSlotProps | undefined;
  leftProps?: HeroSlotProps | undefined;
  rightProps?: HeroSlotProps | undefined;
  bottomProps?: HeroSlotProps | undefined;
  bodyProps?: HeroSlotProps | undefined;
}

export interface HeroProps
  extends HeroPartsProps, Omit<StyleProps, "color" | "align" | "left" | "right" | "bottom"> {
  /**
   * Names the region through `aria-labelledby`. Without it, and without a `Hero.Title` among the
   * children, the band never becomes a named landmark.
   */
  title?: ReactNode | undefined;
  subtitle?: ReactNode | undefined;
  /** The small label above the title — the announcement, the category. It sits on top of the whole text block. */
  hiper?: ReactNode | undefined;
  description?: ReactNode | undefined;
  /** Full-bleed background image. The text reads on its veil, not on the image: `overlayOpacity` grades it. */
  image?: string | undefined;
  /** Empty leaves it decorative, which is right when the image adds nothing the text does not already say. */
  imageAlt?: string | undefined;
  /** Opacity of the veil over `image`. Without `image` there is no veil, so it has no effect. */
  overlayOpacity?: number | undefined;
  variant?: HeroVariant | undefined;
  /** With `transparent` — the default — the band paints no background of its own and inherits the page. */
  color?: ColorExtended | undefined;
  size?: HeroSize | undefined;
  align?: "start" | "center" | "end" | "stretch" | undefined;
  /** Heading level of the title, 1 to 6. Structure, not size: the size comes from `size`. */
  order?: HeroOrder | undefined;
  /** Maximum width of the inner rail; the band still spans the full width. @default 1400 */
  contentWidth?: Unit | undefined;
  id?: string | undefined;
  style?: CSSProperties | undefined;
  actions?: ReactNode | undefined;
  /** Region to the left of the body. Equivalent to `Hero.Left`, which is how you reorder it. */
  left?: ReactNode | undefined;
  /** Region to the right of the body. Equivalent to `Hero.Right`. */
  right?: ReactNode | undefined;
  /** Region below the body, across the rail. Equivalent to `Hero.Bottom`. */
  bottom?: ReactNode | undefined;

  /**
   * Lands IN THE MIDDLE of the body, between the description and the actions, not at the end. If the
   * children include compound parts — `Hero.Header`, `Hero.Title`… — the body becomes entirely yours
   * and the text props stop being mounted (ADR-111).
   */
  children?: ReactNode | undefined;
  className?: string | undefined;
}
