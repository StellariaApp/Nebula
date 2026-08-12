import { Badge, Card, Group, Text } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Card withBorder r="lg" padding="md" w={240}>
      <Text fz="body3">A surface with a border and its own padding.</Text>
    </Card>
  ),
  usage: {
    code: `<Card withBorder r="lg" padding="md">
<Group justify="space-between">
  <Text fw="semibold">Reconciliation</Text>
  <Badge variant="light" color="warning">24 pending</Badge>
</Group>
</Card>`,
    node: (
      <Card withBorder r="lg" padding="md" w={320}>
        <Group justify="space-between">
          <Text fw="semibold">Reconciliation</Text>
          <Badge variant="light" color="warning">
            24 pending
          </Badge>
        </Group>
      </Card>
    ),
  },
};

export default preview;
