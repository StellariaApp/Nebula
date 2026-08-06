import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function Paperclip(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="M21.44 11.05l-8.49 8.49a6 6 0 0 1-8.49-8.49l8.49-8.49a4 4 0 0 1 5.66 5.66l-8.5 8.49a2 2 0 0 1-2.83-2.83l7.79-7.78" />
    </Glyph>
  );
}
