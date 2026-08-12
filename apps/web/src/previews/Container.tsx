import { Container, Text } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Container w={360} bdw={1} bds="solid" bdc="border.subtle" r="md" p="md">
      <Text fz="body3">Bounded and centred.</Text>
    </Container>
  ),
};

export default preview;
