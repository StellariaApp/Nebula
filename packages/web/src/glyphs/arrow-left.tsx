import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function ArrowLeft(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="M15 5l-7 7 7 7" />
    </Glyph>
  );
}
