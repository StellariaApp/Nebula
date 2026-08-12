import { Badge, Group, Text } from "@stellaria/nebula-web";
import { NO_GLASS, SIZES, ByVariant, BySize } from "./kit";
import type { Preview } from "./types";

const preview: Preview = {
  base: <Badge>Badge</Badge>,
  groups: [
    ByVariant(NO_GLASS, (variant) => <Badge variant={variant}>Badge</Badge>),
    BySize(SIZES, (size) => <Badge size={size}>Badge</Badge>),
  ],
  usage: {
    code: `<Group gap="xs">
<Text fw="medium">CodeHighlight</Text>
<Badge variant="light" size="xs">compound</Badge>
</Group>`,
    node: (
      <Group gap="xs">
        <Text fw="medium">CodeHighlight</Text>
        <Badge variant="light" size="xs">
          compound
        </Badge>
      </Group>
    ),
  },
};

export default preview;
