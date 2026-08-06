import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function Eye(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </Glyph>
  );
}
