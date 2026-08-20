"use client";

import {
  Accordion,
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Reveal,
  StatusBadge,
  Switch,
  Text,
} from "@stellaria/nebula-web";
import type { ReactElement } from "react";

const FAQ = [
  {
    value: "themes",
    label: "How does theming work?",
    content:
      "One NebulaTheme object retunes colour, type, geometry, density, motion and glass across the whole catalogue.",
  },
  {
    value: "platforms",
    label: "Does it run on React Native?",
    content: "The contract lives in the tokens; each platform implements only the visual layer.",
  },
  {
    value: "budget",
    label: "How big is it?",
    content:
      "size-limit measures every entry point in brotli kB and fails the build when it drifts.",
  },
];

const MEMBERS = [
  { who: "Ana Ruiz", role: "Admin", state: "matched" },
  { who: "Beto Lima", role: "Editor", state: "matched" },
  { who: "Cruz Vega", role: "Viewer", state: "review" },
] as const;

export function Settings(): ReactElement {
  return (
    <Box display="flex" direction="column" gap="md">
      <Box
        display="grid"
        gap="md"
        gridTemplateColumns={{ base: "1fr", laptop: "minmax(0, 2fr) minmax(0, 3fr)" }}
      >
        <Card withBorder r="md" p="md" reveal={{ index: 0 }}>
          <Box display="flex" direction="column" gap="md">
            <Box display="flex" align="center" gap="sm">
              <Avatar name="Ana Ruiz" size="lg" variant="light" color="primary" />
              <Box display="flex" direction="column">
                <Text fz="body2" fw="semibold">
                  Ana Ruiz
                </Text>
                <Text fz="caption" c="text.muted">
                  ana.ruiz@stellaria.dev
                </Text>
              </Box>
            </Box>
            <Divider />
            <Box display="flex" direction="column" gap="sm">
              {[
                "Email notifications",
                "SMS notifications",
                "Push notifications",
                "In-app notifications",
              ].map((label, index) => (
                <Reveal key={label} index={index}>
                  <Switch key={label} defaultChecked={index < 2} label={label} />
                </Reveal>
              ))}
            </Box>
            <Divider />
            <Alert variant="light" color="warning" title="Danger zone">
              Deleting a workspace removes every mapping in it.
            </Alert>
            <Button size="sm" variant="outline" color="error">
              Delete workspace
            </Button>
          </Box>
        </Card>

        <Card withBorder r="md" p="md" reveal={{ index: 1 }}>
          <Box display="flex" direction="column" gap="md">
            <Text fz="body2" fw="semibold">
              Frequently asked
            </Text>
            <Accordion data={FAQ} defaultValue="themes" />
            <Divider />
            <Text fz="body2" fw="semibold">
              Members
            </Text>
            {MEMBERS.map((row, index) => (
              <Box
                key={row.who}
                display="flex"
                align="center"
                justify="space-between"
                gap="sm"
                reveal={{ index: index + 1 }}
              >
                <Box display="flex" align="center" gap="sm">
                  <Avatar name={row.who} size="sm" variant="light" />
                  <Box display="flex" direction="column">
                    <Text fz="body3" fw="medium">
                      {row.who}
                    </Text>
                    <Text fz="caption" c="text.muted">
                      {row.role}
                    </Text>
                  </Box>
                </Box>
                <StatusBadge status={row.state} size="sm" />
              </Box>
            ))}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
