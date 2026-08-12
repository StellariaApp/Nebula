import { Avatar } from "@stellaria/nebula-web";
import { SIZES, BySize } from "./kit";
import type { Preview } from "./types";

const preview: Preview = {
  base: <Avatar>NB</Avatar>,
  groups: [BySize(SIZES, (size) => <Avatar size={size}>NB</Avatar>)],
};

export default preview;
