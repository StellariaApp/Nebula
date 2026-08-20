import type { ReactNode } from "react";

import type { Unit } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { RevealProps } from "../Reveal/Reveal.types.js";

/**
 * Los mandos de la entrada de una banda: los de `Reveal` menos lo que `Section` ya decide por su
 * cuenta —el elemento, los hijos, la clase y el estilo—, que no tendria sentido duplicar aqui.
 */
/** Que elemento se anima con `reveal`: la banda entera o solo su rail. */
export type SectionRevealTarget = "surface" | "content";

export type SectionRevealProps = Pick<
  RevealProps,
  "preset" | "spring" | "duration" | "once" | "amount" | "rootMargin" | "index" | "distance" | "initial"
>;

export type SectionSize = "sm" | "md" | "lg" | "xl";

export type SectionOrder = 2 | 3 | 4 | 5 | 6;

/** Props of any `Section` part: children, `className` and the system style props. */
export interface SectionSlotProps extends StyleProps {
  /**
   * The part's content. Every part is a plain band inside the rail — it claims no region and no
   * heading level of its own, so the structure comes from the `Section` around it.
   */
  children?: ReactNode | undefined;
  /** Lands on the part's own element, after the classes the style props generate. */
  className?: string | undefined;
}

export type SectionHeadingProps = SectionSlotProps;

export interface SectionProps extends Omit<StyleProps, "order"> {
  /**
   * The body. A `Section.Header` among the children replaces the header built from `title`,
   * `description`, `aside` and `actions`; a `Section.Footer` replaces `footer` (ADR-111).
   */
  children?: ReactNode | undefined;
  /**
   * Names the region through `aria-labelledby`, which is why it beats `aria-label`. Without it, and
   * without a `Section.Title` among the children, the band falls back to `aria-label`.
   */
  title?: ReactNode | undefined;
  description?: ReactNode | undefined;
  actions?: ReactNode | undefined;
  /** What sits beside the actions on the header row, to their left. Equivalent to `Section.Aside`. */
  aside?: ReactNode | undefined;
  footer?: ReactNode | undefined;
  /** Lays the loading veil over the content WITHOUT removing it, so the page does not jump when it ends. */
  loading?: boolean | undefined;
  /** Replaces the content. A string is wrapped in an error `Alert` that announces itself. */
  error?: ReactNode | undefined;
  /** What renders in place of the content when `isEmpty`. Without `isEmpty` it never renders. */
  empty?: ReactNode | undefined;
  /** Turns on the `empty` branch. `error` wins over it: with an error, the empty state does not render. */
  isEmpty?: boolean | undefined;
  /** Heading level of the title, 2 to 6. Structure, not size: the size is `fz`. */
  order?: SectionOrder | undefined;
  /** A rule inside the rail, so it does not cross the band from edge to edge of the screen. */
  divided?: boolean | undefined;
  /** The glass band of ADR-082, the lowest step. Use it ALTERNATING sections: turning it on everywhere gives you a uniform background, which is the opposite of the effect. */
  glass?: boolean | undefined;
  /** Reveal on entering the viewport. Swaps the root element for the motion one, it does not add a node (see `Reveal.md`). */
  /**
   * Animates the band in when it first scrolls into view. `true` takes the catalogue entrance —
   * `slide-up` over 24 px on the `gentle` spring — and an object tunes it.
   *
   * It takes an object rather than a sibling `revealProps` for two reasons: it is the same shape
   * `Box` accepts, so a band and a card are configured alike; and a name ending in `Props` promises
   * a slot that gets spread onto an element, which this is not — it is read by a hook.
   */
  reveal?: boolean | SectionRevealProps | undefined;
  /**
   * What actually moves when `reveal` is on.
   *
   * - `"surface"` animates the whole band, its background and its glass included, so the strip
   *   slides in as one piece.
   * - `"content"` leaves the band where it is and lifts only the rail — the header, the body and
   *   the footer — into it. On a band with `glass` this is usually what you want: the band is the
   *   page's structure and the content is what should arrive.
   *
   * @default "surface"
   */
  revealTarget?: SectionRevealTarget | undefined;
  /**
   * Mounts the body on first intersection instead of on load. Header and footer always render, so
   * the heading stays in the served HTML for search and assistive tech. Unlike `reveal`, it does NOT
   * turn off with reduced motion: mounting is not an enhancement, it is the page.
   */
  /** Maximum width of the inner rail; the band still spans the full width. @default 1180 */
  contentWidth?: Unit | undefined;
  id?: string | undefined;
  size?: SectionSize | undefined;
  className?: string | undefined;
  /** Only used when there is no `title` and no `Section.Title`: the title, when present, names the region. */
  "aria-label"?: string | undefined;
}

export interface SectionRailProps extends SectionSlotProps {
  size?: SectionSize | undefined;
}
