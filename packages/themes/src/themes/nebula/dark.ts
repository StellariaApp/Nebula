import type { NebulaTheme } from "@stellaria/nebula-tokens";

import { BuildProduct } from "../../utils/build-product.js";
import { THEMES_SEEDS } from "../_seed/index.js";

export const nebulaDark: NebulaTheme = BuildProduct(THEMES_SEEDS.nebula, "dark");
