import { Box, NoiseOverlay, Skeleton } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Box position="relative" w={300} h={140} r="md" overflow="hidden">
      <Skeleton w={300} h={140} />
      <NoiseOverlay />
    </Box>
  ),
};

export default preview;
