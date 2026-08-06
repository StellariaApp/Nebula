import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function Refresh(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5" />
    </Glyph>
  );
}
