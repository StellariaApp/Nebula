import { ThemeIcon } from "@stellaria/nebula-web";
import { NO_GLASS, ByVariant, STAR } from "./kit";
import type { Preview } from "./types";

const preview: Preview = {
  base: <ThemeIcon>{STAR}</ThemeIcon>,
  groups: [ByVariant(NO_GLASS, (variant) => <ThemeIcon variant={variant}>{STAR}</ThemeIcon>)],
};

export default preview;
