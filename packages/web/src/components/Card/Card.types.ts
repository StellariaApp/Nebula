import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type {
  ColorExtended,
  GlassLevel,
  ShadowLevel,
  Unit,
  Variant,
} from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type CardVariant = Extract<
  Variant,
  "filled" | "outline" | "light" | "glass" | "glow" | "gradient"
>;

interface CardOwnProps extends Omit<StyleProps, "shadow"> {
  /** The card's content, usually assembled from its parts. */
  children: ReactNode;
  /**
   * How the surface is filled. Leaving it out is a real choice, not a missing one: the card then
   * resolves no variant at all and keeps the plain surface, which is what most cards want. With it
   * left out, `color` and `glass` are read by nothing.
   */
  variant?: CardVariant | undefined;
  /**
   * The scale the variant draws from. Only read when there is a `variant`.
   * @default "primary"
   */
  color?: ColorExtended | undefined;
  /**
   * Depth of the drop shadow. Flat by default because a grid of raised cards reads as noise; lift
   * the one card that has to come forward, not all of them.
   * @default "none"
   */
  shadow?: ShadowLevel | "none" | undefined;
  /**
   * Inner padding. `"none"` is for a card whose parts bring their own — an edge-to-edge image, a
   * section with its own inset.
   * @default "lg"
   */
  padding?: "none" | "md" | "lg" | "xl" | undefined;
  /**
   * Whether the hairline is drawn. Turning it off is not always enough: a variant that resolves a
   * border of its own puts it back, because the fill needs the edge to sit against.
   * @default true
   */
  withBorder?: boolean | undefined;
  /** Glass step when `variant="glass"`. `subtle` by default (ADR-078). */
  glass?: GlassLevel | undefined;
  /**
   * Whether the card lifts on hover and gives on press. Left out it decides for itself, turning on
   * as soon as there is an `onPress` or an `href`; set it by hand only to lift a card that does
   * nothing, or to still one that does.
   */
  interactive?: boolean | undefined;
  /**
   * Makes the whole card a `button` and runs on press. `href` beats it: with both, the card is an
   * anchor and this never fires.
   */
  onPress?: (() => void) | undefined;
  /**
   * Makes the whole card an anchor. It wins the root element over `onPress`, and it is what lets a
   * card be opened in a new tab — a card built on `onPress` cannot be.
   */
  href?: string | undefined;
  className?: string | undefined;
  /**
   * Names the card. An actionable card needs it whenever its content does not already say where it
   * leads, since everything inside is read as one long link name otherwise.
   */
  "aria-label"?: string | undefined;
}

/**
 * The attributes of the root come on top of the card's own props. Which element they land on depends
 * on the card: `href` makes it an anchor, `onPress` a button, and neither leaves a `div` — so an
 * attribute that only makes sense on one of the three is the consumer's call, not the type's.
 */
export type CardProps = CardOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof CardOwnProps | "color">;

export interface CardSectionProps {
  children: ReactNode;
  inset?: boolean | undefined;
  withBorder?: boolean | undefined;
  className?: string | undefined;
}

export interface CardImageProps {
  src?: string | undefined;
  alt: string;
  height?: Unit | undefined;
  className?: string | undefined;
}

/** Props of the `Card` parts — `Badges`, `Meta` and `Actions`: children, `className` and style props. */
export interface CardSlotProps extends StyleProps {
  children: ReactNode;
  className?: string | undefined;
}
