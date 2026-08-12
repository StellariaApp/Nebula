import { Paper, Text } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Paper withBorder p="md" w={240}>
      <Text fz="body3">A plain surface.</Text>
    </Paper>
  ),
};

export default preview;
