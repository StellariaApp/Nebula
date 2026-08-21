import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type {
  ColorExtended,
  GlassLevel,
  ShadowLevel,
  Unit,
  Variant,
} from "@stellaria/nebula-tokens";

import type { GradientProp } from "@stellaria/nebula-themes/web";

import type { StyleProps } from "../../utils/style-props.js";
import type { UseRevealOptions } from "../Reveal/use-reveal.js";
import type { GradientBorderOwnProps } from "../GradientBorder/GradientBorder.types.js";

/**
 * Lo que `Card` deja configurar del anillo cuando se lo pide por `gradientBorder`.
 *
 * Es un recorte de `GradientBorder` y no toda su superficie: el radio, el relleno y el elemento los
 * decide la tarjeta, y dejarlos aqui abriria la puerta a un anillo con otras esquinas que la carta
 * que envuelve.
 */
export type CardGradientBorder = Pick<
  GradientBorderOwnProps,
  "gradient" | "beam" | "width" | "edges"
>;

export type CardVariant = Extract<
  Variant,
  "filled" | "outline" | "light" | "glass" | "glow" | "gradient"
>;

interface CardOwnProps extends Omit<StyleProps, "shadow"> {
  /** The card's content, usually assembled from its parts. */
  children: ReactNode;
  /**
   * Animates the card in when it first scrolls into view. `true` takes the catalogue entrance; an
   * object tunes it.
   *
   * It is declared here and forwarded to the root `Box` rather than inherited: `reveal` lives on
   * `BoxOwnProps`, and `Card` — like most of the catalogue — types its props over `StyleProps`, so
   * nothing arrives on its own.
   */
  reveal?: boolean | UseRevealOptions | undefined;
  /**
   * Draws a gradient ring around the card, without a wrapper in the consumer's markup.
   *
   * `<GradientBorder><Card /></GradientBorder>` is the pattern this replaces, and the wrapper had a
   * trap in it: the ring's corner radius and the card's had to be kept in step by hand, and they
   * drift the moment one of the two changes. Here the ring takes the card's `r`.
   *
   * `true` takes the brand gradient. A role name or a literal `{ from, to }` picks the gradient. An
   * object configures the ring — `beam` sends the travelling arc round it.
   */
  gradientBorder?:
    boolean | CardGradientBorder["gradient"] | GradientProp | CardGradientBorder | undefined;
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
  /** The band's content. */
  children: ReactNode;
  /**
   * Cancels the card's padding for this band so it reaches both edges — what an image, a table or a
   * divider needs. It is on by default because that is the reason a section exists at all.
   * @default true
   */
  inset?: boolean | undefined;
  /** Draws a rule separating this band from the one before it. @default false */
  withBorder?: boolean | undefined;
  className?: string | undefined;
}

export interface CardImageProps {
  /** The image source. Without it the band still reserves its height, so the card does not reflow. */
  src?: string | undefined;
  /**
   * Required, unlike everywhere else: a card image is usually the only picture of what the card is
   * about. Pass an empty string deliberately when it truly is decoration the card's text repeats.
   */
  alt: string;
  /**
   * How tall the band is. The image covers it, so the aspect is cropped rather than letterboxed —
   * which is why this is a height and not a ratio.
   * @default 180
   */
  height?: Unit | undefined;
  /** Lands on the image, not on the section that wraps it. */
  className?: string | undefined;
}

/** Props of the `Card` parts — `Badges`, `Meta` and `Actions`: children, `className` and style props. */
export interface CardSlotProps extends StyleProps {
  children: ReactNode;
  className?: string | undefined;
}
