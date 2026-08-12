import { Collapse, Text } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Collapse in>
      <Text fz="body3" maw={320}>
        The height animates from zero, and it does not animate with reduced motion.
      </Text>
    </Collapse>
  ),
};

export default preview;
