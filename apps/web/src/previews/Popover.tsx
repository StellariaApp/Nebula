import { Popover, Button, Text } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Popover trigger={<Button variant="light">Open popover</Button>}>
      <Text fz="body3" p="sm">
        Anchored to its trigger, and React Aria moves it if it does not fit.
      </Text>
    </Popover>
  ),
};

export default preview;
