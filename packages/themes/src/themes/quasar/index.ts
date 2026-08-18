import type { ThemeSchemes } from "../registry.js";

import { quasarDark } from "./dark.js";
import { quasarLight } from "./light.js";

export { quasarDark, quasarLight };

export const quasar: ThemeSchemes = { dark: quasarDark, light: quasarLight };
