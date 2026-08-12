import { Box, Overlay, Skeleton, Text } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Box position="relative" w={240} h={100} r="md" overflow="hidden">
      <Skeleton w={240} h={100} />
      <Overlay blur="sm" center>
        <Text fz="body3">Over it</Text>
      </Overlay>
    </Box>
  ),
};

export default preview;
