import type { ReactNode } from "react";

import type { ColorExtended, Size } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";
import type { BadgeVariant } from "../Badge/Badge.types.js";

export type StatusBadgeVariant = BadgeVariant;

export interface StatusDescriptor {
  label: ReactNode;
  color?: ColorExtended | undefined;
  variant?: StatusBadgeVariant | undefined;
  icon?: ReactNode | undefined;
  dot?: boolean | undefined;
  description?: string | undefined;
}

export type StatusMap<S extends string = string> = Readonly<Record<S, StatusDescriptor>>;

export interface StatusBadgeProps<S extends string = string> extends StyleProps {
  /**
   * The status key. It is looked up in the map to get the label, the colour and the rest — the key
   * itself is never shown, so a key with no entry in the map has nothing to render.
   */
  status: S;
  /**
   * The lookup table, overriding the one from `StatusMapProvider`. Pass it here for a one-off set of
   * statuses; put it on the provider when a whole screen shares the same vocabulary.
   */
  map?: StatusMap<S> | undefined;
  /**
   * Overrides the variant the map entry asks for. The point of the map is that the status decides
   * its own look, so reach for this only to make one badge sit differently in its surroundings.
   */
  variant?: StatusBadgeVariant | undefined;
  /**
   * Overrides the colour the map entry asks for. Colour is the status's main signal, so overriding
   * it per call is how two badges end up saying the same word in different colours.
   */
  color?: ColorExtended | undefined;
  /** Height, padding and type of the pill together. @default "md" */
  size?: Size | undefined;
  /** How round the pill is. @default "full" */
  radius?: "sm" | "md" | "full" | undefined;
  /** Overrides whether the map entry shows its dot. */
  dot?: boolean | undefined;
  /** Stretches the pill to its container instead of hugging the label. @default false */
  fullWidth?: boolean | undefined;
  className?: string | undefined;
}

export interface StatusMapProviderProps<S extends string = string> {
  /**
   * The status vocabulary for everything below. It is what keeps one status looking and reading the
   * same across a screen; a `map` on an individual badge overrides it.
   */
  map: StatusMap<S>;
  /** The subtree that inherits the map. */
  children: ReactNode;
}
