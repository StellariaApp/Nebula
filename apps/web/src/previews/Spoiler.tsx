import { Spoiler, Text } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Spoiler w={320} maxHeight={40} showLabel="Show more" hideLabel="Show less">
      <Text fz="body3">
        The contract lives in the tokens package and each platform implements only the visual layer,
        which is what lets two products share one catalogue.
      </Text>
    </Spoiler>
  ),
};

export default preview;
