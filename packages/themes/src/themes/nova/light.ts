import type { NebulaTheme } from "@stellaria/nebula-tokens";

import { THEMES_SEEDS } from "../_seed/index.js";
import { BuildProduct } from "../../utils/build-product.js";

export const novaLight: NebulaTheme = BuildProduct(THEMES_SEEDS.nova, "light");
