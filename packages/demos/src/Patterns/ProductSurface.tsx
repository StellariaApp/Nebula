"use client";

import { Box, ColorSwatch, Divider, Flex, Segment, Text, useTheme } from "@stellaria/nebula-web";
import { useState, type ReactElement } from "react";

import {
  ChoiceFromTheme,
  ResolveChoice,
  THEMES,
  THEME_NAMES,
  type ThemeName,
} from "../themes/products";
import Scenarios, { SCENARIOS, type Scenario } from "./Scenarios";

function Brand(name: ThemeName, scheme: "dark" | "light"): string {
  const stops = THEMES[name][scheme].effects.gradients.brand.stops;
  const from = stops[0]?.color ?? "#000";
  const to = stops.at(-1)?.color ?? from;
  return `linear-gradient(120deg, ${from}, ${to})`;
}

function Switcher(): ReactElement {
  const { theme, setTheme } = useTheme();
  const choice = ChoiceFromTheme(theme);

  return (
    <Flex direction="column" gap="xs" align="flex-start">
      <Flex maw="100%" gap="sm" align="center" wrap="wrap">
        <Segment
          overflowMode="wrap"
          value={choice.name}
          size="sm"
          onChange={(value) => {
            setTheme(ResolveChoice({ ...choice, name: value as ThemeName }));
          }}
        >
          <Segment.Control
            aria-label="Product theme"
            data={THEME_NAMES.map((entry) => ({
              value: entry,
              label: (
                <Flex align="center" gap={5}>
                  <ColorSwatch color={Brand(entry, choice.scheme)} size={12} withShadow={false} />
                  <Text fz="body3" tt="capitalize">
                    {entry}
                  </Text>
                </Flex>
              ),
            }))}
          />
        </Segment>
        <Segment
          value={choice.scheme}
          size="sm"
          onChange={(value) => {
            setTheme(ResolveChoice({ ...choice, scheme: value === "light" ? "light" : "dark" }));
          }}
        >
          <Segment.Control
            aria-label="Colour scheme"
            data={[
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" },
            ]}
          />
        </Segment>
      </Flex>
    </Flex>
  );
}

export default function ProductSurface(): ReactElement {
  const [scenario, set_scenario] = useState<Scenario>("components");

  return (
    <Segment
      value={scenario}
      size="sm"
      onChange={(value) => {
        set_scenario(value as Scenario);
      }}
    >
      <Box display="flex" direction="column" gap="lg">
        <Switcher />
        <Divider />
        <Box display="flex" direction="column" gap="xs" align="flex-start">
          <Box display="flex" justify="space-between" align="center" gap="md" wrap="wrap" w="100%">
            <Segment.Control
              aria-label="Situation"
              data={SCENARIOS.map((entry) => ({
                value: entry,
                label: (
                  <Text fz="body3" tt="capitalize">
                    {entry}
                  </Text>
                ),
              }))}
            />
            <Text fz="caption" c="text.muted">
              Six surfaces, one catalogue, zero forks
            </Text>
          </Box>
        </Box>
        <Scenarios />
      </Box>
    </Segment>
  );
}
