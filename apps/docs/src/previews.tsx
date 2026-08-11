import {
  Accordion,
  ActionIcon,
  Alert,
  Anchor,
  AspectRatio,
  Breadcrumbs,
  ButtonCopy,
  Center,
  ColorSwatch,
  Container,
  CurrencyDisplay,
  DatePicker,
  EmptyState,
  Feature,
  Fieldset,
  FileInput,
  Flex,
  FormField,
  GradientBorder,
  Highlight,
  JsonInput,
  MultiSelect,
  NativeSelect,
  NavLink,
  NProgress,
  Pagination,
  QuickAction,
  Select,
  Space,
  Spoiler,
  Stat,
  StatusBadge,
  Stepper,
  Tabs,
  TagsInput,
  Timeline,
  TimeInput,
  Avatar,
  Badge,
  Box,
  Banderole,
  Blockquote,
  Burger,
  Button,
  ButtonClose,
  ButtonGroup,
  Card,
  Checkbox,
  Chip,
  Code,
  CodeHighlight,
  Divider,
  FieldError,
  GlassSurface,
  GradientText,
  Group,
  Indicator,
  Kbd,
  List,
  Loader,
  Mark,
  NumberInput,
  Paper,
  PasswordInput,
  PinInput,
  Progress,
  Radio,
  Rating,
  SearchInput,
  SimpleGrid,
  Skeleton,
  Slider,
  Switch,
  Table,
  Tag,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
  Tooltip,
  UnstyledButton,
} from "@stellaria/nebula-web";
import type { ReactElement, ReactNode } from "react";

import type { Size, Variant } from "@stellaria/nebula-tokens";

export interface PreviewSample {
  label: string;
  node: ReactNode;
}

export interface PreviewGroup {
  title: string;
  items: readonly PreviewSample[];
}

export interface Preview {
  /** El componente sin nada puesto: lo que sale al escribirlo tal cual. */
  base: ReactNode;
  /** Las variantes si las tiene; si no, los props que de verdad cambian cómo se lee. */
  groups?: readonly PreviewGroup[];
  /** Una composición de producto, con su código. */
  usage?: { code: string; node: ReactNode };
}

const FULL = [
  "filled",
  "light",
  "outline",
  "glass",
  "gradient",
  "ghost",
] as const satisfies readonly Variant[];

const NO_GLASS = [
  "filled",
  "light",
  "outline",
  "gradient",
  "ghost",
] as const satisfies readonly Variant[];

const SOLID = ["filled", "light", "outline"] as const satisfies readonly Variant[];

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const satisfies readonly Size[];

/** El listado manda: cada componente estrecha `Variant` a su manera y el tipo lo comprueba aquí. */
function ByVariant<V extends Variant>(
  list: readonly V[],
  Render: (variant: V) => ReactElement,
): PreviewGroup {
  return { title: "variant", items: list.map((v) => ({ label: v, node: Render(v) })) };
}

function BySize<S extends Size>(
  list: readonly S[],
  Render: (size: S) => ReactElement,
): PreviewGroup {
  return { title: "size", items: list.map((s) => ({ label: s, node: Render(s) })) };
}

function States(...items: readonly PreviewSample[]): PreviewGroup {
  return { title: "state", items };
}

const STAR = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L12 16.9 6.4 20l1.4-6.2L3 9.5l6.4-.6z" />
  </svg>
);

const CHECK = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 13l4 4L19 7" />
  </svg>
);

/**
 * La muestra viva de cada componente: base, variantes y uso. Es un mapa a mano a propósito — los
 * props de ejemplo no están en el registro—, y un componente sin muestra enseña su contrato igual.
 */
export const PREVIEWS: Record<string, Preview> = {
  Button: {
    base: <Button>Button</Button>,
    groups: [
      ByVariant(FULL, (variant) => <Button variant={variant}>Button</Button>),
      BySize(SIZES, (size) => <Button size={size}>Button</Button>),
      States(
        { label: "disabled", node: <Button disabled>Button</Button> },
        { label: "loading", node: <Button loading>Button</Button> },
        { label: "fullWidth", node: <Button fullWidth>Button</Button> },
      ),
    ],
    usage: {
      code: `<Button variant="gradient" size="lg" leftSection={<Check />}>
  Reconcile 24 movements
</Button>`,
      node: (
        <Button variant="gradient" size="lg" leftSection={CHECK}>
          Reconcile 24 movements
        </Button>
      ),
    },
  },

  ActionIcon: {
    base: <ActionIcon aria-label="Star">{STAR}</ActionIcon>,
    groups: [
      ByVariant(FULL, (variant) => (
        <ActionIcon variant={variant} aria-label="Star">
          {STAR}
        </ActionIcon>
      )),
      BySize(SIZES, (size) => (
        <ActionIcon size={size} aria-label="Star">
          {STAR}
        </ActionIcon>
      )),
    ],
    usage: {
      code: `<Tooltip label="Add to favourites" trigger={
  <ActionIcon variant="light" aria-label="Add to favourites">
    <Star />
  </ActionIcon>
} />`,
      node: (
        <Tooltip
          label="Add to favourites"
          trigger={
            <ActionIcon variant="light" aria-label="Add to favourites">
              {STAR}
            </ActionIcon>
          }
        />
      ),
    },
  },

  Badge: {
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
  },

  Alert: {
    base: <Alert title="Heads up">The API is being normalised until v1.</Alert>,
    groups: [
      ByVariant(SOLID, (variant) => (
        <Alert variant={variant} title="Heads up" w={280}>
          The API is being normalised until v1.
        </Alert>
      )),
    ],
    usage: {
      code: `<Alert variant="light" color="warning" title="Unsaved changes">
  Leaving now discards the draft.
</Alert>`,
      node: (
        <Alert variant="light" color="warning" title="Unsaved changes" w={320}>
          Leaving now discards the draft.
        </Alert>
      ),
    },
  },

  ThemeIcon: {
    base: <ThemeIcon>{STAR}</ThemeIcon>,
    groups: [ByVariant(NO_GLASS, (variant) => <ThemeIcon variant={variant}>{STAR}</ThemeIcon>)],
  },

  Chip: {
    base: <Chip>Chip</Chip>,
    groups: [ByVariant(SOLID, (variant) => <Chip variant={variant}>Chip</Chip>)],
  },

  TextInput: {
    base: <TextInput w={240} placeholder="you@example.com" />,
    groups: [
      BySize(SIZES, (size) => <TextInput size={size} w={200} placeholder="Email" />),
      States(
        { label: "label", node: <TextInput w={240} label="Email" placeholder="you@example.com" /> },
        { label: "disabled", node: <TextInput w={240} disabled placeholder="Email" /> },
        {
          label: "error",
          node: <TextInput w={240} label="Email" error="That address is taken" />,
        },
      ),
    ],
    usage: {
      code: `<TextInput
  label="Email"
  description="We only use it for the receipt."
  placeholder="you@example.com"
  required
/>`,
      node: (
        <TextInput
          w={320}
          label="Email"
          description="We only use it for the receipt."
          placeholder="you@example.com"
          required
        />
      ),
    },
  },

  Switch: {
    base: <Switch label="Reduced motion" />,
    groups: [
      States(
        { label: "checked", node: <Switch defaultChecked label="Reduced motion" /> },
        { label: "disabled", node: <Switch disabled label="Reduced motion" /> },
      ),
    ],
  },

  Checkbox: {
    base: <Checkbox label="Ship it" />,
    groups: [
      States(
        { label: "checked", node: <Checkbox defaultChecked label="Ship it" /> },
        { label: "indeterminate", node: <Checkbox indeterminate label="Ship it" /> },
        { label: "disabled", node: <Checkbox disabled label="Ship it" /> },
      ),
    ],
  },

  Radio: {
    base: <Radio name="preview" value="dark" label="Dark" />,
    groups: [
      States({ label: "disabled", node: <Radio name="p3" value="b" disabled label="Dark" /> }),
    ],
  },

  Avatar: {
    base: <Avatar>NB</Avatar>,
    groups: [BySize(SIZES, (size) => <Avatar size={size}>NB</Avatar>)],
  },

  Progress: {
    base: <Progress value={64} w={240} />,
    groups: [
      States(
        { label: "0", node: <Progress value={0} w={200} /> },
        { label: "64", node: <Progress value={64} w={200} /> },
        { label: "100", node: <Progress value={100} w={200} /> },
      ),
    ],
  },

  Loader: {
    base: <Loader />,
    groups: [BySize(SIZES, (size) => <Loader size={size} />)],
  },

  Card: {
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
  },

  Tooltip: {
    base: (
      <Tooltip
        label="It reads the theme at runtime"
        trigger={<Button variant="light">Hover me</Button>}
      />
    ),
  },

  Table: {
    base: (
      <Table w={420}>
        <Table.Head>
          <Table.Row>
            <Table.Title>Component</Table.Title>
            <Table.Title numeric>Budget</Table.Title>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Button</Table.Cell>
            <Table.Cell numeric>42.25 kB</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Badge</Table.Cell>
            <Table.Cell numeric>25.5 kB</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    ),
    groups: [
      States(
        {
          label: "striped",
          node: (
            <Table striped w={280}>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Button</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Badge</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Card</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          ),
        },
        {
          label: "withBorder",
          node: (
            <Table withBorder w={280}>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Button</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Badge</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          ),
        },
        {
          label: "density",
          node: (
            <Table density="compact" w={280}>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Button</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Badge</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          ),
        },
      ),
    ],
    usage: {
      code: `<Table.ScrollContainer minWidth={560}>
  <Table highlightOnHover stickyHeader>
    <Table.Head>…</Table.Head>
    <Table.Body>…</Table.Body>
  </Table>
</Table.ScrollContainer>`,
      node: (
        <Table.ScrollContainer minWidth={320}>
          <Table highlightOnHover w={420}>
            <Table.Head>
              <Table.Row>
                <Table.Title>Component</Table.Title>
                <Table.Title>Subpath</Table.Title>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Charts</Table.Cell>
                <Table.Cell>
                  <Code fz="caption">/charts</Code>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>DataGrid</Table.Cell>
                <Table.Cell>
                  <Code fz="caption">/datagrid</Code>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Table.ScrollContainer>
      ),
    },
  },

  ButtonClose: { base: <ButtonClose aria-label="Close" /> },
  ButtonGroup: {
    base: (
      <ButtonGroup>
        <Button variant="light">Day</Button>
        <Button variant="light">Week</Button>
        <Button variant="light">Month</Button>
      </ButtonGroup>
    ),
  },
  UnstyledButton: { base: <UnstyledButton>Bare button</UnstyledButton> },
  Burger: { base: <Burger opened={false} openLabel="Open menu" closeLabel="Close menu" /> },
  Indicator: {
    base: (
      <Indicator label="3" size="sm">
        <Avatar>NB</Avatar>
      </Indicator>
    ),
  },
  Tag: { base: <Tag>design-system</Tag> },
  Banderole: { base: <Banderole w={320}>Nebula is in pre-release.</Banderole> },
  Paper: {
    base: (
      <Paper withBorder p="md" w={240}>
        <Text fz="body3">A plain surface.</Text>
      </Paper>
    ),
  },
  GlassSurface: {
    base: (
      <GlassSurface p="md" r="md" w={240}>
        <Text fz="body3">Glass over the page background.</Text>
      </GlassSurface>
    ),
    groups: [
      {
        title: "level",
        items: (["band", "control", "subtle", "default", "strong"] as const).map((level) => ({
          label: level,
          node: (
            <GlassSurface level={level} p="sm" r="md" w={120}>
              <Text fz="caption">{level}</Text>
            </GlassSurface>
          ),
        })),
      },
    ],
  },
  GradientText: { base: <GradientText fz="h3">Zero forks.</GradientText> },
  Blockquote: { base: <Blockquote w={360}>The contract lives in the tokens.</Blockquote> },
  List: {
    base: (
      <List>
        <List.Item>Web and React Native</List.Item>
        <List.Item>One contract per component</List.Item>
      </List>
    ),
  },
  Mark: {
    base: (
      <Text>
        The theme reaches <Mark>the whole visual surface</Mark>.
      </Text>
    ),
  },
  Group: {
    base: (
      <Group gap="sm">
        <Badge>One</Badge>
        <Badge>Two</Badge>
        <Badge>Three</Badge>
      </Group>
    ),
  },
  SimpleGrid: {
    base: (
      <SimpleGrid cols={3} gap="sm" w={320}>
        <Skeleton h={40} />
        <Skeleton h={40} />
        <Skeleton h={40} />
      </SimpleGrid>
    ),
  },
  AspectRatio: {
    base: (
      <AspectRatio ratio={16 / 9} w={240}>
        <Skeleton h="100%" />
      </AspectRatio>
    ),
  },
  Textarea: { base: <Textarea w={280} label="Notes" placeholder="What changed?" /> },
  PasswordInput: { base: <PasswordInput w={280} label="Password" /> },
  NumberInput: { base: <NumberInput w={200} label="Seats" defaultValue={3} /> },
  SearchInput: { base: <SearchInput w={280} placeholder="Search components" /> },
  PinInput: { base: <PinInput length={4} /> },
  Rating: { base: <Rating defaultValue={3} /> },
  Slider: { base: <Slider w={280} defaultValue={40} /> },
  FieldError: { base: <FieldError>That address is taken</FieldError> },
  CodeHighlight: {
    base: <CodeHighlight code={`pnpm add @stellaria/nebula-web`} lang="bash" w={360} r="lg" />,
  },

  Select: {
    base: (
      <Select
        w={280}
        label="Theme"
        placeholder="Pick one"
        data={[
          { value: "dark", label: "Dark" },
          { value: "light", label: "Light" },
          { value: "system", label: "System" },
        ]}
      />
    ),
  },
  NativeSelect: {
    base: (
      <NativeSelect
        w={240}
        label="Density"
        data={[
          { value: "compact", label: "Compact" },
          { value: "normal", label: "Normal" },
        ]}
      />
    ),
  },
  MultiSelect: {
    base: (
      <MultiSelect
        w={300}
        label="Subpaths"
        data={[
          { value: "charts", label: "/charts" },
          { value: "datagrid", label: "/datagrid" },
          { value: "editor", label: "/editor" },
        ]}
      />
    ),
  },
  TagsInput: { base: <TagsInput w={300} label="Tags" defaultValue={["web", "native"]} /> },
  JsonInput: {
    base: <JsonInput w={320} label="Theme JSON" defaultValue={`{ "scheme": "dark" }`} />,
  },
  FileInput: { base: <FileInput w={280} label="Attachment" placeholder="Pick a file" /> },
  Fieldset: {
    base: (
      <Fieldset legend="Billing" w={320}>
        <TextInput label="Company" placeholder="Stellaria" />
      </Fieldset>
    ),
  },
  FormField: {
    base: (
      <FormField label="Email" description="We only use it for the receipt." w={300}>
        <TextInput placeholder="you@example.com" />
      </FormField>
    ),
  },
  TimeInput: { base: <TimeInput w={200} label="Starts at" /> },
  DatePicker: { base: <DatePicker w={260} label="Due date" /> },

  Accordion: {
    base: (
      <Accordion
        w={360}
        data={[
          { value: "what", label: "What is Nebula", content: "A universal UI library." },
          { value: "how", label: "How it themes", content: "One object, seven axes." },
        ]}
      />
    ),
  },
  Tabs: {
    base: (
      <Tabs
        w={360}
        data={[
          {
            value: "preview",
            label: "Preview",
            content: <Text fz="body3">The rendered component.</Text>,
          },
          {
            value: "code",
            label: "Code",
            content: <Text fz="body3">The snippet that made it.</Text>,
          },
        ]}
      />
    ),
  },
  Timeline: {
    base: (
      <Timeline
        w={320}
        items={[
          { title: "Contract closed", description: "docs/02 fixes the theme contract." },
          { title: "Web catalogue complete", description: "158 components." },
        ]}
      />
    ),
  },
  Breadcrumbs: {
    base: (
      <Breadcrumbs
        items={[
          { key: "guides", label: "Guides", href: "/guides/getting-started" },
          { key: "components", label: "Components", href: "/guides/components" },
          { key: "button", label: "Button" },
        ]}
      />
    ),
  },
  Stepper: {
    base: (
      <Stepper
        w={420}
        active={1}
        steps={[{ label: "Account" }, { label: "Billing" }, { label: "Done" }]}
      />
    ),
  },
  Pagination: { base: <Pagination total={8} /> },
  NavLink: { base: <NavLink label="Components" w={240} /> },

  Stat: { base: <Stat label="Web components" value="158" description="in v1" /> },
  Feature: {
    base: (
      <Feature
        w={320}
        icon={STAR}
        title="Accessibility is a gate"
        description="Every story runs axe on every commit."
      />
    ),
  },
  EmptyState: {
    base: (
      <EmptyState
        w={360}
        icon={STAR}
        title="Nothing here yet"
        description="This section lands with web v1."
      />
    ),
  },
  ColorSwatch: { base: <ColorSwatch color="primary.500" /> },
  Spoiler: {
    base: (
      <Spoiler w={320} maxHeight={40} showLabel="Show more" hideLabel="Show less">
        <Text fz="body3">
          The contract lives in the tokens package and each platform implements only the visual
          layer, which is what lets two products share one catalogue.
        </Text>
      </Spoiler>
    ),
  },
  Highlight: {
    base: <Highlight highlight="one contract">Two platforms, one contract, zero forks.</Highlight>,
  },
  CurrencyDisplay: { base: <CurrencyDisplay amount={1299.5} currency="EUR" /> },
  StatusBadge: {
    base: <StatusBadge status="paid" map={{ paid: { label: "Paid", color: "success" } }} />,
  },
  QuickAction: { base: <QuickAction label="Reconcile" icon={STAR} /> },
  ButtonCopy: { base: <ButtonCopy value="pnpm add @stellaria/nebula-web" /> },

  Container: {
    base: (
      <Container w={360} bdw={1} bds="solid" bdc="border.subtle" r="md" p="md">
        <Text fz="body3">Bounded and centred.</Text>
      </Container>
    ),
  },
  Center: {
    base: (
      <Center w={240} h={80} bdw={1} bds="solid" bdc="border.subtle" r="md">
        <Text fz="body3">Centred</Text>
      </Center>
    ),
  },
  Flex: {
    base: (
      <Flex gap="sm">
        <Skeleton w={60} h={32} />
        <Skeleton w={60} h={32} />
        <Skeleton w={60} h={32} />
      </Flex>
    ),
  },
  Space: {
    base: (
      <Box display="flex" direction="column" w={200}>
        <Skeleton h={16} />
        <Space h="lg" />
        <Skeleton h={16} />
      </Box>
    ),
  },
  GradientBorder: {
    base: (
      <GradientBorder r="lg" p="md" w={240}>
        <Text fz="body3">A border painted by the theme.</Text>
      </GradientBorder>
    ),
  },
  NProgress: { base: <NProgress value={40} w={320} /> },

  Anchor: { base: <Anchor href="#preview">A link</Anchor> },
  Code: { base: <Code>pnpm add @stellaria/nebula-web</Code> },
  Kbd: { base: <Kbd>⌘ K</Kbd> },
  Title: { base: <Title order={3}>The quick brown fox</Title> },
  Text: { base: <Text>The quick brown fox jumps over the lazy dog.</Text> },
  Divider: { base: <Divider w={240} /> },
  Skeleton: { base: <Skeleton w={240} h={16} /> },
};

export function FindPreview(name: string): Preview | undefined {
  return PREVIEWS[name];
}
