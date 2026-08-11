import {
  Anchor,
  Blockquote,
  Code,
  CodeHighlight,
  Divider,
  List,
  Table,
  Text,
  Title,
} from "@stellaria/nebula-web";
import type { ReactElement, ReactNode } from "react";

import { Plain, Slug } from "../lib/headings";
import { CHROME_HEIGHT } from "../lib/layout";
import { Install } from "./install";

interface CodeChild {
  props?: { className?: string | undefined; children?: ReactNode | undefined } | undefined;
}

const LONG = 12;

/** La medida de línea de la prosa. El código y las tablas no la llevan: se leen en bloque. */
const MEASURE = "72ch";

interface Wrap {
  children: ReactNode;
}

function Section({
  order,
  size,
  children,
}: Wrap & { order: 2 | 3; size: "h3" | "h5" }): ReactElement {
  const text = Plain(children);
  return (
    <Title
      id={Slug(text)}
      order={order}
      fz={size}
      c="text.primary"
      ls="tight"
      mt={order === 2 ? "xxl" : "xl"}
      mb="xs"
      style={{ scrollMarginTop: `${String(CHROME_HEIGHT + 24)}px` }}
    >
      {children}
    </Title>
  );
}

function Fence({ children }: Wrap): ReactElement {
  const child = children as CodeChild | undefined;
  const source = child?.props?.children;
  const language = /language-(\w+)/.exec(child?.props?.className ?? "")?.[1];

  if (typeof source !== "string") return <Code>{source}</Code>;

  const body = source.replace(/\n$/, "");

  return (
    <CodeHighlight
      code={body}
      {...(language === undefined ? {} : { lang: language })}
      variant="glass"
      withCopy
      expandable={body.split("\n").length > LONG}
      r="lg"
      my="md"
    />
  );
}

export const MDX_COMPONENTS = {
  Install,
  h1: (props: Wrap) => <Section order={2} size="h3" {...props} />,
  h2: (props: Wrap) => <Section order={2} size="h3" {...props} />,
  h3: (props: Wrap) => <Section order={3} size="h5" {...props} />,
  h4: (props: object) => <Title order={4} fz="h6" c="text.primary" mt="lg" {...props} />,
  p: (props: object) => <Text c="text.secondary" lh="relaxed" maw={MEASURE} {...props} />,
  a: (props: object) => <Anchor {...props} />,
  code: (props: object) => <Code {...props} />,
  pre: Fence,
  ul: (props: object) => <List c="text.secondary" maw={MEASURE} {...props} />,
  ol: (props: object) => <List type="ordered" c="text.secondary" maw={MEASURE} {...props} />,
  li: (props: object) => <List.Item {...props} />,
  blockquote: (props: object) => <Blockquote my="md" {...props} />,
  hr: () => <Divider my="lg" />,
  table: (props: Wrap) => (
    <Table.ScrollContainer minWidth={520} my="md">
      <Table {...props} />
    </Table.ScrollContainer>
  ),
  thead: (props: Wrap) => <Table.Head {...props} />,
  tbody: (props: Wrap) => <Table.Body {...props} />,
  tr: (props: Wrap) => <Table.Row {...props} />,
  th: (props: Wrap) => <Table.Title {...props} />,
  td: (props: Wrap) => <Table.Cell {...props} />,
};
