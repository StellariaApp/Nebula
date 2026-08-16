import type { ReactElement } from "react";

import { IsSemanticScale } from "../../theme/resolve-variant.js";

import * as styles from "./Tag.css.js";
import type { TagProps } from "./Tag.types.js";
import { TagBody } from "./components/Body.js";
import { TagFlat } from "./components/Flat.js";

export function Tag(props: TagProps): ReactElement {
  const { variant = "light", color = "primary", ...rest } = props;

  if (!IsSemanticScale(color)) return <TagFlat {...props} />;

  return <TagBody {...rest} variant={variant} tone={styles.tone[`${variant}-${color}`]} />;
}

Tag.displayName = "Tag";
