import { Transition, Card, Text } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Transition mounted>
      <Card withBorder r="lg" p="md" w={240}>
        <Text fz="body3">Mounted with its preset.</Text>
      </Card>
    </Transition>
  ),
};

export default preview;
