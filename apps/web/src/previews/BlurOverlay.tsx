import { BlurOverlay, Box, Skeleton, Text } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Box position="relative" w={300} h={140} r="md" overflow="hidden">
      <Skeleton w={300} h={140} />
      <BlurOverlay blur="md">
        <Text fz="body3">Behind the glass</Text>
      </BlurOverlay>
    </Box>
  ),
};

export default preview;
