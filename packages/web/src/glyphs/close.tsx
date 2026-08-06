import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function Close(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Glyph>
  );
}
