import type { ThemeSchemes } from "../registry.js";

import { rosetaDark } from "./dark.js";
import { rosetaLight } from "./light.js";

export { rosetaDark, rosetaLight };

export const roseta: ThemeSchemes = { dark: rosetaDark, light: rosetaLight };
