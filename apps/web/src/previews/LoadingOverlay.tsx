import { Box, LoadingOverlay, Skeleton } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Box position="relative" w={240} h={100} r="md" overflow="hidden">
      <Skeleton w={240} h={100} />
      <LoadingOverlay visible label="Loading" />
    </Box>
  ),
};

export default preview;
