import { Space, Box, Skeleton } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Box display="flex" direction="column" w={200}>
      <Skeleton h={16} />
      <Space h="lg" />
      <Skeleton h={16} />
    </Box>
  ),
};

export default preview;
