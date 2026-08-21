"use client";

import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Kbd,
  NavLink,
  Reveal,
  SearchInput,
  Text,
  Textarea,
  ThemeIcon,
  Title,
} from "@stellaria/nebula-web";
import type { ReactElement } from "react";

const THREADS = [
  {
    who: "Carlos Iglesias",
    when: "10:21",
    subject: "Launch recap",
    unread: true,
    tag: "Work",
    tone: "info",
  },
  {
    who: "Stripe",
    when: "Yesterday",
    subject: "Invoice INV-0241 is due",
    unread: true,
    tag: "Billing",
    tone: "warning",
  },
  {
    who: "Maya Okafor",
    when: "Mon",
    subject: "Design review: v3",
    unread: false,
    tag: undefined,
    tone: undefined,
  },
  {
    who: "Parker Wren",
    when: "Fri",
    subject: "Q2 growth plan",
    unread: false,
    tag: undefined,
    tone: undefined,
  },
  {
    who: "Amelia Ruiz",
    when: "Apr 22",
    subject: "Weekly summary",
    unread: false,
    tag: "Travel",
    tone: "success",
  },
] as const;

const LABELS = [
  { label: "Work", color: "info.500" },
  { label: "Billing", color: "warning.500" },
  { label: "Travel", color: "success.500" },
  { label: "Urgent", color: "error.500" },
] as const;

const MAILBOXES = [
  { label: "Inbox", count: "4" },
  { label: "Starred", count: "2" },
  { label: "Sent", count: undefined },
  { label: "Archive", count: undefined },
];

const ARCHIVE = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M3 7h18v4H3zM5 11v9h14v-9M9 15h6" />
  </svg>
);

const TRASH = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14" />
  </svg>
);

const PAPER = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M14 3v5h5M6 3h9l5 5v13H6z" />
  </svg>
);

const DOWNLOAD = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" />
  </svg>
);

export function Mail(): ReactElement {
  return (
    <Box display="flex" direction="column" gap="md">
      <Box
        display="grid"
        gap="md"
        gridTemplateColumns={{
          base: "1fr",
          laptop: "minmax(0, 1fr) minmax(0, 2fr) minmax(0, 2fr)",
        }}
        reveal={{ index: 0 }}
      >
        <Card withBorder r="md" p="sm">
          <Box display="flex" direction="column" gap="xxs">
            <Button size="sm" variant="gradient" fullWidth>
              New email
            </Button>
            <Divider my="xs" />
            {MAILBOXES.map((box, index) => (
              <Reveal key={box.label} index={index + 1}>
                <NavLink
                  key={box.label}
                  label={box.label}
                  active={index === 0}
                  {...(box.count === undefined
                    ? {}
                    : {
                        rightSection: (
                          <Badge variant="light" size="xs">
                            {box.count}
                          </Badge>
                        ),
                      })}
                />
              </Reveal>
            ))}
            <Divider my="xs" />
            <Text fz="caption" c="text.muted" fw="semibold" tt="uppercase" ls="wide" px="xs">
              Labels
            </Text>
            {LABELS.map((tag, index) => (
              <Box
                key={tag.label}
                display="flex"
                align="center"
                gap="sm"
                px="xs"
                py="xxs"
                reveal={{ index: index + 1 }}
              >
                <Box w={8} h={8} r="full" bg={tag.color} />
                <Text fz="body3" c="text.secondary">
                  {tag.label}
                </Text>
              </Box>
            ))}
          </Box>
        </Card>

        <Card withBorder r="md" p="none" reveal={{ index: 1 }}>
          <Box display="flex" direction="column">
            <Box p="sm" bdbw={1} bdbs="solid" bdc="border.subtle">
              <SearchInput size="sm" placeholder="Search mail" aria-label="Search mail" />
            </Box>
            {THREADS.map((thread, index) => (
              <Box
                key={thread.subject}
                p="sm"
                bg={index === 0 ? "surface.hover" : undefined}
                bdbw={index === THREADS.length - 1 ? 0 : 1}
                bdbs="solid"
                bdc="border.subtle"
                display="flex"
                gap="sm"
                align="flex-start"
                reveal={{ index }}
              >
                <Avatar name={thread.who} size="sm" variant="light" color="accent" />
                <Box display="flex" direction="column" gap="xxs" style={{ minWidth: 0, flex: 1 }}>
                  <Box display="flex" justify="space-between" gap="sm" align="baseline">
                    <Text fz="body3" fw={thread.unread ? "semibold" : "regular"}>
                      {thread.who}
                    </Text>
                    <Text fz="caption" c="text.muted">
                      {thread.when}
                    </Text>
                  </Box>
                  <Text fz="caption" c="text.secondary">
                    {thread.subject}
                  </Text>
                  {thread.tag === undefined ? null : (
                    <Box display="flex">
                      <Badge variant="light" size="xs" color={thread.tone}>
                        {thread.tag}
                      </Badge>
                    </Box>
                  )}
                </Box>
                {thread.unread ? <Box w={8} h={8} r="full" bg="primary.500" /> : null}
              </Box>
            ))}
          </Box>
        </Card>

        <Card withBorder r="md" p="md" reveal={{ index: 2 }}>
          <Box display="flex" direction="column" gap="sm">
            <Box display="flex" justify="space-between" align="center" gap="sm">
              <Title order={4} fz="h6">
                Launch recap
              </Title>
              <Box display="flex" gap="xs">
                <ActionIcon size="sm" variant="ghost" aria-label="Archive">
                  {ARCHIVE}
                </ActionIcon>
                <ActionIcon size="sm" variant="ghost" aria-label="Delete">
                  {TRASH}
                </ActionIcon>
              </Box>
            </Box>
            <Box display="flex" align="center" gap="sm">
              <Avatar name="Carlos Iglesias" size="sm" variant="light" />
              <Box display="flex" direction="column">
                <Text fz="body3" fw="semibold">
                  Carlos Iglesias
                </Text>
                <Text fz="caption" c="text.muted">
                  to me · 10:21
                </Text>
              </Box>
            </Box>
            <Divider />
            <Text fz="body3" c="text.secondary" lh="relaxed">
              We agreed on the final launch date and the three must-ship items: onboarding tour,
              billing update flow, and the analytics dashboard.
            </Text>
            <Box display="flex" align="center" gap="sm" p="xs" r="sm" bg="surface.sunken">
              <ThemeIcon size="sm" variant="light" radius="sm">
                {PAPER}
              </ThemeIcon>
              <Box display="flex" direction="column" style={{ minWidth: 0, flex: 1 }}>
                <Text fz="body3" fw="medium">
                  go-no-go.pdf
                </Text>
                <Text fz="caption" c="text.muted">
                  248 kB
                </Text>
              </Box>
              <ActionIcon size="sm" variant="ghost" aria-label="Download attachment">
                {DOWNLOAD}
              </ActionIcon>
            </Box>
            <Textarea placeholder="Reply…" autosize rows={2} aria-label="Reply" />
            <Box display="flex" justify="space-between" align="center" gap="sm" wrap="wrap">
              <Box display="flex" gap="sm">
                <Button size="sm" variant="gradient">
                  Send
                </Button>
                <Button size="sm" variant="ghost">
                  Later
                </Button>
              </Box>
              <Box display="flex" gap="xs" align="center">
                <Kbd>⌘</Kbd>
                <Kbd>↵</Kbd>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
