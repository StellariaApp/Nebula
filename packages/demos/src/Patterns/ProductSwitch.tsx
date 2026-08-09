"use client";

import {
  Badge,
  Box,
  Button,
  Card,
  GradientText,
  NebulaProvider,
  Paper,
  SimpleGrid,
  Stat,
  Text,
  TextInput,
  Title,
} from "@stellaria/nebula-web";
import { useState, type ReactElement } from "react";

import { PRODUCTS, type ProductName } from "../themes/products";

const PRODUCT_NAMES: readonly ProductName[] = [
  "rosette",
  "stellaria",
  "polaris",
  "lagrange",
  "aurora",
  "nova",
];

function Surface(): ReactElement {
  return (
    <Box display="flex" direction="column" gap="lg" p="lg">
      <Box display="flex" direction="column" gap="xs">
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
          <Stat label="Matched" value="1,248" diff="+12%" trend="up" />
        </Card>
        <Card>
          <Stat label="Pending" value="36" diff="-4%" trend="down" />
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
  const [product, set_product] = useState<ProductName>("rosette");
  const [scheme, set_scheme] = useState<"dark" | "light">("dark");
  const theme = PRODUCTS[product][scheme];

  return (
    <Box display="flex" direction="column" gap="md">
      <Box display="flex" gap="xs" wrap="wrap" role="group" aria-label="Product theme">
        {PRODUCT_NAMES.map((name) => (
          <Button
            key={name}
            size="xs"
            variant={name === product ? "filled" : "outline"}
            aria-pressed={name === product}
            onPress={() => set_product(name)}
          >
            {name}
          </Button>
        ))}
        <Button
          size="xs"
          variant="ghost"
          onPress={() => set_scheme(scheme === "dark" ? "light" : "dark")}
        >
          {scheme === "dark" ? "Light" : "Dark"}
        </Button>
      </Box>

      <Box bdw={1} bds="solid" bdc="border.subtle" r="lg" overflow="hidden">
        <NebulaProvider key={theme.meta.name} defaultTheme={theme} storage={null}>
          <Box bg="surface.base" c="text.primary">
            <Surface />
          </Box>
        </NebulaProvider>
      </Box>
    </Box>
  );
}
