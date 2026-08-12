import { Flex, Skeleton } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Flex gap="sm">
      <Skeleton w={60} h={32} />
      <Skeleton w={60} h={32} />
      <Skeleton w={60} h={32} />
    </Flex>
  ),
};

export default preview;
