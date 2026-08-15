"use client";

import { Anchor, Box, Text } from "@stellaria/nebula-web";
import { useEffect, useState, type ReactElement } from "react";

import type { Heading } from "../lib/headings";

export interface TocProps {
  headings: readonly Heading[];
  title: string;
  edit: { href: string; label: string };
}

const PENCIL = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  </svg>
);

export function Toc({ headings, title, edit }: TocProps): ReactElement | null {
  const [active, set_active] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    const nodes = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((node): node is HTMLElement => node !== null);
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0] !== undefined) set_active(visible[0].target.id);
      },
      { rootMargin: `-${String(24)}px 0px -70% 0px`, threshold: 0 },
    );

    for (const node of nodes) observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <Box
      component="nav"
      aria-label={title}
      position="sticky"
      top={32}
      display={{ base: "none", laptop: "flex" }}
      direction="column"
      gap="sm"
      w={240}
      shrink={0}
      mah={`calc(100dvh - ${String(76)}px)`}
      overflowY="auto"
    >
      <Text fz="caption" fw="semibold" c="text.muted" tt="uppercase" ls="wide">
        {title}
      </Text>
      <Box display="flex" direction="column">
        {headings.map((heading) => (
          <Anchor
            key={heading.id}
            href={`#${heading.id}`}
            td="none"
            fz="body3"
            lh="snug"
            py="xs"
            ps={heading.level === 3 ? "md" : "sm"}
            bdlw={2}
            bdls="solid"
            r={0}
            bdlc={heading.id === active ? "primary.500" : "border.subtle"}
            c={heading.id === active ? "text.primary" : "text.secondary"}
            fw={heading.id === active ? "semibold" : "regular"}
          >
            {heading.text}
          </Anchor>
        ))}
      </Box>
      <Anchor
        href={edit.href}
        td="none"
        fz="caption"
        c="text.muted"
        mt="sm"
        display="flex"
        align="center"
        gap="xs"
      >
        {PENCIL}
        {edit.label}
      </Anchor>
    </Box>
  );
}
