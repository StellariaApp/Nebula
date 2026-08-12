import { Loader } from "@stellaria/nebula-web";
import { SIZES, BySize } from "./kit";
import type { Preview } from "./types";

const preview: Preview = {
  base: <Loader />,
  groups: [BySize(SIZES, (size) => <Loader size={size} />)],
};

export default preview;
