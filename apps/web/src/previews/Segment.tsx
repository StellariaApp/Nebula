import { Segment } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Segment defaultValue="preview">
      <Segment.Control aria-label="View">
        <Segment.Control.Item value="preview">Preview</Segment.Control.Item>
        <Segment.Control.Item value="code">Code</Segment.Control.Item>
      </Segment.Control>
    </Segment>
  ),
};

export default preview;
