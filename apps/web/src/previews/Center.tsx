import { Center, Text } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Center w={240} h={80} bdw={1} bds="solid" bdc="border.subtle" r="md">
      <Text fz="body3">Centred</Text>
    </Center>
  ),
};

export default preview;
