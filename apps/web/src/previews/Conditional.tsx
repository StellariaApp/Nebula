import { Conditional, Text } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Conditional when fallback={<Text fz="body3">Hidden</Text>}>
      <Text fz="body3">Rendered because `when` is true.</Text>
    </Conditional>
  ),
};

export default preview;
