import type { ThemeSchemes } from "../registry.js";

import { eclipseDark } from "./dark.js";
import { eclipseLight } from "./light.js";

export { eclipseDark, eclipseLight };

export const eclipse: ThemeSchemes = { dark: eclipseDark, light: eclipseLight };
