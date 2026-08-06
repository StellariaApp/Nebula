import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function ArrowUp(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="M12 21V5" />
      <path d="m6 11 6-6 6 6" />
    </Glyph>
  );
}
