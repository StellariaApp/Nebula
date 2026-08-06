import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function Clock(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Glyph>
  );
}
