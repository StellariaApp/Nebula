import type { ThemeSchemes } from "../registry.js";

import { rigelDark } from "./dark.js";
import { rigelLight } from "./light.js";

export { rigelDark, rigelLight };

export const zenit: ThemeSchemes = { dark: rigelDark, light: rigelLight };
