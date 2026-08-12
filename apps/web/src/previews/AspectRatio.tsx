import { AspectRatio, Skeleton } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <AspectRatio ratio={16 / 9} w={240}>
      <Skeleton h="100%" />
    </AspectRatio>
  ),
};

export default preview;
