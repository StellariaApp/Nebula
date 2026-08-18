import type { ThemeSchemes } from "../registry.js";

import { coronaDark } from "./dark.js";
import { coronaLight } from "./light.js";

export { coronaDark, coronaLight };

export const corona: ThemeSchemes = { dark: coronaDark, light: coronaLight };
