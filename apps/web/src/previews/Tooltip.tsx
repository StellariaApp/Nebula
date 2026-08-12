import { Button, Tooltip } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Tooltip
      label="It reads the theme at runtime"
      trigger={<Button variant="light">Hover me</Button>}
    />
  ),
};

export default preview;
