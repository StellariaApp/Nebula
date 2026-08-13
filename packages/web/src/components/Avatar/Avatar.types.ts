import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { ColorExtended, Size, Unit, Variant } from "@stellaria/nebula-tokens";
import type { StyleProps } from "../../utils/style-props.js";

export type AvatarVariant = Extract<Variant, "filled" | "outline" | "light">;

export interface AvatarProps extends StyleProps {
  /**
   * The picture. A load failure is remembered for the life of the component, so it falls back to
   * the initials once and does not flicker between the two on later renders.
   */
  src?: string | undefined;
  /**
   * The image's alt text, and the accessible name of the whole avatar when there is no image. It
   * falls back to `name`; with neither, the avatar says nothing at all — which is what you want
   * beside a name already written out, and not what you want when it stands alone.
   */
  alt?: string | undefined;
  /**
   * Where the initials come from: the first letter of the first and last words, uppercased. It also
   * names the avatar when there is no `alt`.
   */
  name?: string | undefined;
  /**
   * Replaces the initials — a glyph, a status mark. It never shows over an image, so it is the
   * fallback's fallback and not a layer on top.
   */
  children?: ReactNode | undefined;
  /**
   * The avatar's square, as a control step or as any length. Unlike the rest of the sizes here it
   * takes a raw value, which is what lets it line up with a row of arbitrary height.
   * @default "md"
   */
  size?: Size | Unit | undefined;
  /** How round it is. `"sm"` and `"md"` are what turn it into a squircle for a team or an org. @default "full" */
  radius?: "sm" | "md" | "full" | undefined;
  /**
   * How the fallback is filled. It only ever shows when there is no image, so it dresses the
   * initials and nothing else.
   * @default "light"
   */
  variant?: AvatarVariant | undefined;
  /**
   * The scale the fallback draws from. Deriving it from the name is the consumer's job — the same
   * `color` here gives every avatar in a list the same tint.
   * @default "primary"
   */
  color?: ColorExtended | undefined;
  className?: string | undefined;
  /** The image. Only rendered with a `src` that has not failed to load; on failure the initials take over. */
  imageProps?: ComponentPropsWithoutRef<"img"> | undefined;
}

export interface AvatarGroupProps extends StyleProps {
  /** The avatars, overlapped in the order given: the first sits on top. */
  children: ReactNode;
  /**
   * How many avatars are shown before the rest become a count. The overflow avatar is added by this
   * component, so do not leave a `+N` of your own among the children.
   */
  max?: number | undefined;
  /**
   * The true size of the set, when it is larger than the children you passed. This is what makes the
   * count honest for a list that was paginated before it got here — without it the count can only
   * describe the avatars actually rendered.
   */
  total?: number | undefined;
  /**
   * The square every avatar in the set takes, overriding their own. It also sets the overlap, which
   * is derived from it.
   */
  size?: Size | Unit | undefined;
  /**
   * How far each avatar slides over the one before it. Left out it is 30 % of `size`, so the overlap
   * scales with the set instead of needing a new value per size.
   */
  spacing?: Unit | undefined;
  className?: string | undefined;
  /**
   * Names the set, which also makes it a `group` for assistive tech. Without it the avatars are
   * announced one after another with nothing saying they belong together.
   */
  "aria-label"?: string | undefined;
}
