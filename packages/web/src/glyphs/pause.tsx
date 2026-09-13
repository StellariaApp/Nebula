import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function Pause(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="M7 4v16M17 4v16" />
    </Glyph>
  );
}
