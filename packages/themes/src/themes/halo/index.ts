import type { ThemeSchemes } from "../registry.js";

import { vegaDark } from "./dark.js";
import { vegaLight } from "./light.js";

export { vegaDark, vegaLight };

export const halo: ThemeSchemes = { dark: vegaDark, light: vegaLight };
