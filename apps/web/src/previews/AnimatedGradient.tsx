import { AnimatedGradient, Box } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Box position="relative" w={300} h={140} r="md" overflow="hidden">
      <AnimatedGradient h="100%" />
    </Box>
  ),
};

export default preview;
