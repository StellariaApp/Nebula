import { Anchor, HoverCard, Text } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <HoverCard trigger={<Anchor href="#preview">@stellaria</Anchor>}>
      <Text fz="body3" p="sm">
        Opens on hover and on focus, never on click.
      </Text>
    </HoverCard>
  ),
};

export default preview;
