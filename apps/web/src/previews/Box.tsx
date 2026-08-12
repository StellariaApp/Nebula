import { Box, Text } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Box w={240} p="md" r="md" bdw={1} bds="solid" bdc="border.subtle">
      <Text fz="body3">Every style prop lands here.</Text>
    </Box>
  ),
};

export default preview;
