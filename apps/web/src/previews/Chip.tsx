import { Chip } from "@stellaria/nebula-web";
import { SOLID, ByVariant } from "./kit";
import type { Preview } from "./types";

const preview: Preview = {
  base: <Chip>Chip</Chip>,
  groups: [ByVariant(SOLID, (variant) => <Chip variant={variant}>Chip</Chip>)],
};

export default preview;
