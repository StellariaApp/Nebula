import { SimpleGrid, Skeleton } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <SimpleGrid cols={3} gap="sm" w={320}>
      <Skeleton h={40} />
      <Skeleton h={40} />
      <Skeleton h={40} />
    </SimpleGrid>
  ),
};

export default preview;
