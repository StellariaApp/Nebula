import { Button, ButtonGroup } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <ButtonGroup>
      <Button variant="light">Day</Button>
      <Button variant="light">Week</Button>
      <Button variant="light">Month</Button>
    </ButtonGroup>
  ),
};

export default preview;
