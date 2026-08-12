import { GradientBorder, Text } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <GradientBorder r="lg" p="md" w={240}>
      <Text fz="body3">A border painted by the theme.</Text>
    </GradientBorder>
  ),
};

export default preview;
