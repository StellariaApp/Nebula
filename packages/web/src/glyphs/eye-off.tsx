import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function EyeOff(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" />
      <path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a17.6 17.6 0 0 1-2.9 3.9M6.6 6.6A17.7 17.7 0 0 0 2 11s3.5 7 10 7a10.7 10.7 0 0 0 3.1-.5" />
    </Glyph>
  );
}
