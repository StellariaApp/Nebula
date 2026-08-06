import type { ReactElement } from "react";

import { Glyph, type GlyphProps } from "./glyph.js";

export function UploadCloud(props: GlyphProps): ReactElement {
  return (
    <Glyph {...props}>
      <path d="M12 13v8" />
      <path d="m8 17 4-4 4 4" />
      <path d="M20.9 18.4A5 5 0 0 0 18 9h-1.3A8 8 0 1 0 3 16.3" />
    </Glyph>
  );
}
