import type { ThemeSchemes } from "../registry.js";

import { helixDark } from "./dark.js";
import { helixLight } from "./light.js";

export { helixDark, helixLight };

export const helix: ThemeSchemes = { dark: helixDark, light: helixLight };
