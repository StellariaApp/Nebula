"use client";

import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  GradientText,
  NebulaProvider,
  Paper,
  Segment,
  SimpleGrid,
  Stat,
  Text,
  TextInput,
  Title,
} from "@stellaria/nebula-web";
import { useState, type ReactElement } from "react";

import { ThemeScheme, SEED_NAMES, type SeedName } from "../themes/products";

const SCHEMES = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
];

function Surface(): ReactElement {
  return (
    <Box display="flex" direction="column" gap="lg" p="lg">
      <Box display="flex" direction="column" gap="xs" align="flex-start">
        <Badge variant="light">Reconciliation</Badge>
        <Title order={3} fz="h4">
          <GradientText>Every movement, matched</GradientText>
        </Title>
        <Text fz="body3" c="text.secondary" maw="46ch">
          The same components, the same props. Only the theme changed.
        </Text>
      </Box>

      <SimpleGrid cols={{ base: 1, tablet: 3 }} gap="sm">
        <Card>
          <Stat label="Matched" value="1,248" diff="+12%" trend="up" diffLabel="increase" />
        </Card>
        <Card>
          <Stat label="Pending" value="36" diff="-4%" trend="down" diffLabel="decrease" />
        </Card>
        <Card>
          <Stat label="Accounts" value="9" />
        </Card>
      </SimpleGrid>

      <Paper p="md">
        <Box display="flex" direction="column" gap="md">
          <TextInput label="Account" placeholder="MXN · 0012 3456" />
          <Box display="flex" gap="sm" wrap="wrap">
            <Button>Reconcile</Button>
            <Button variant="outline">Export</Button>
            <Button variant="ghost">Cancel</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default function ProductSwitch(): ReactElement {
  const [product, set_product] = useState<SeedName>("rosette");
  const [scheme, set_scheme] = useState<"dark" | "light">("dark");
  const theme = ThemeScheme(product, scheme);

  return (
    <Flex direction="column" gap="md">
      <Flex maw="100%" gap="sm" wrap="wrap" align="center">
        <Segment
          overflowMode="wrap"
          value={product}
          onChange={(value) => {
            set_product(value as SeedName);
          }}
        >
          <Segment.Control aria-label="Product theme" data={[...SEED_NAMES]} />
        </Segment>
        <Segment
          value={scheme}
          onChange={(value) => {
            set_scheme(value === "light" ? "light" : "dark");
          }}
        >
          <Segment.Control aria-label="Colour scheme" data={SCHEMES} />
        </Segment>
      </Flex>

      <Box bdw={1} bds="solid" bdc="border.subtle" r="lg" overflow="hidden">
        <NebulaProvider key={theme.meta.name} defaultTheme={theme} storage={null}>
          <Box bg="surface.base" c="text.primary">
            <Surface />
          </Box>
        </NebulaProvider>
      </Box>
    </Flex>
  );
}
