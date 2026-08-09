import { Anchor, Code, Divider, List, Text, Title } from "@stellaria/nebula-web";

export const MDX_COMPONENTS = {
  h1: (props: object) => <Title order={2} fz="h4" c="text.primary" mt="lg" {...props} />,
  h2: (props: object) => <Title order={2} fz="h4" c="text.primary" mt="lg" {...props} />,
  h3: (props: object) => <Title order={3} fz="h5" c="text.primary" mt="md" {...props} />,
  h4: (props: object) => <Title order={4} fz="h6" c="text.primary" mt="md" {...props} />,
  p: (props: object) => <Text c="text.secondary" {...props} />,
  a: (props: object) => <Anchor {...props} />,
  code: (props: object) => <Code {...props} />,
  ul: (props: object) => <List {...props} />,
  hr: () => <Divider my="lg" />,
};
