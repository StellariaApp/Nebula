import type { ReactNode } from "react";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { StyleProps } from "../../utils/style-props.js";
import type { EmptyStateProps } from "../EmptyState/EmptyState.types.js";

export type EmptyModuleSurface = "none" | "paper" | "outline" | "dashed" | "glass";

/** Where the illustration goes: over the text, or beside it (ADR-192). */
export type EmptyModuleLayout = "stack" | "side";

export interface EmptyModuleProps extends StyleProps {
  title: ReactNode;
  description?: ReactNode | undefined;
  illustration?: ReactNode | undefined;
  icon?: ReactNode | undefined;
  action?: ReactNode | undefined;
  secondaryAction?: ReactNode | undefined;
  footer?: ReactNode | undefined;
  size?: "sm" | "md" | "lg" | undefined;
  /**
   * The pane behind it. `"glass"` is the product sheet of ADR-192: the same pane as a
   * `Card variant="glass" glass="strong"` with its hairline and `lg` corners, which is what a
   * state that stands in for a whole screen wants.
   * @default "dashed"
   */
  surface?: EmptyModuleSurface | undefined;
  /**
   * `"side"` puts the illustration to the left of the text and the text starts flush against it;
   * it stacks again below `tablet`. `"stack"` is the illustration over the text.
   * @default "stack"
   */
  layout?: EmptyModuleLayout | undefined;
  /**
   * Takes the room its parent gives it — `flex: 1; align-self: stretch` — and centres the content
   * inside. A state that stands in for what could not be painted should BE the screen, not a card
   * floating at the top of an empty one.
   * @default false
   */
  fill?: boolean | undefined;
  className?: string | undefined;
  /** The title, forwarded to the slot of the `EmptyState` the module mounts inside. */
  titleProps?: EmptyStateProps["titleProps"] | undefined;
  /** The description, forwarded to the `EmptyState`. Only rendered with `description`. */
  descriptionProps?: EmptyStateProps["descriptionProps"] | undefined;
  /** The glyph, forwarded to the `EmptyState`. Only rendered with `icon`. */
  iconProps?: EmptyStateProps["iconProps"] | undefined;
  /** The illustration, which belongs to the module and goes before the `EmptyState`. Only with `illustration`; it is `aria-hidden` and its size comes from `size`. */
  illustrationProps?: BoxSlotProps | undefined;
  /** The band that joins `action` and `secondaryAction`. It lands INSIDE the `EmptyState` action row, it does not replace it, and it does not exist without at least one of the two. */
  actionsProps?: BoxSlotProps | undefined;
  /** The module footer, outside the `EmptyState`. Only rendered with `footer`. */
  footerProps?: BoxSlotProps | undefined;
}
