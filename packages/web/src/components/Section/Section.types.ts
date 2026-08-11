import type { ReactNode } from "react";

import type { Unit } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type SectionSize = "sm" | "md" | "lg" | "xl";

export type SectionOrder = 2 | 3 | 4 | 5 | 6;

/** Props of any `Section` part: children, `className` and the system style props. */
export interface SectionSlotProps extends StyleProps {
  children?: ReactNode | undefined;
  className?: string | undefined;
}

export type SectionHeadingProps = SectionSlotProps;

export interface SectionProps extends StyleProps {
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
  reveal?: boolean | undefined;
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
