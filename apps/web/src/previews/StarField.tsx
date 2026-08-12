import { Box, StarField } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Box
      position="relative"
      w={300}
      h={140}
      r="md"
      overflow="hidden"
      bdw={1}
      bds="solid"
      bdc="border.subtle"
    >
      <StarField aurora />
    </Box>
  ),
};

export default preview;
