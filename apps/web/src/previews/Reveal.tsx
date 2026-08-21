import { Reveal, Card, Text } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Reveal>
      <Card withBorder r="lg" p="md" w={240}>
        <Text fz="body3">Enters when it comes into view.</Text>
      </Card>
    </Reveal>
  ),
};

export default preview;
