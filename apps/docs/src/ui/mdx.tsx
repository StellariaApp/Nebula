import { Anchor, Code, Divider, List, Text, Title } from "@stellaria/nebula-web";

export const MDX_COMPONENTS = {
  h1: (props: object) => <Title order={1} c="text.primary" {...props} />,
  h2: (props: object) => <Title order={2} c="text.primary" mt="lg" {...props} />,
  h3: (props: object) => <Title order={3} c="text.primary" mt="md" {...props} />,
  p: (props: object) => <Text c="text.secondary" {...props} />,
  a: (props: object) => <Anchor {...props} />,
  code: (props: object) => <Code {...props} />,
  ul: (props: object) => <List {...props} />,
  hr: () => <Divider my="lg" />,
};
