import { Box, Scroll, Text } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Scroll h={120} w={280} shadows>
      <Box display="flex" direction="column" gap="sm" p="sm">
        {["Button", "Badge", "Card", "Table", "Alert", "Chip"].map((name) => (
          <Text key={name} fz="body3">
            {name}
          </Text>
        ))}
      </Box>
    </Scroll>
  ),
};

export default preview;
