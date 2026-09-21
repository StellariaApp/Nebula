"use client";

import { useEffect, useState, type ElementType, type ReactElement } from "react";

import { useMediaQuery } from "@stellaria/nebula-hooks";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Avatar } from "../Avatar/Avatar.js";
import { Badge } from "../Badge/Badge.js";
import { Box } from "../Box/Box.js";
import { Card } from "../Card/Card.js";
import { GlassSurface } from "../GlassSurface/GlassSurface.js";
import { GradientBackground } from "../GradientBackground/GradientBackground.js";
import { Text } from "../Text/Text.js";
import { Title } from "../Title/Title.js";
import { VideoPlayer } from "../VideoPlayer/VideoPlayer.js";

import * as styles from "./MediaCard.css.js";
import type { MediaCardCorner, MediaCardProps } from "./MediaCard.types.js";

const FIRST_MS = 300;
const FRAME_MS = 900;
const REDUCED = "(prefers-reduced-motion: reduce)";

function Corner(props: {
  corner: MediaCardCorner;
  className: string | undefined;
  hidden: boolean;
}): ReactElement {
  const { corner, className, hidden } = props;
  return (
    <div className={className} data-hidden={hidden}>
      <Badge
        color="primary"
        ff="mono"
        size="sm"
        variant={corner.tone === "accent" ? "filled" : "light"}
      >
        {corner.text}
      </Badge>
    </div>
  );
}

export function MediaCard(props: MediaCardProps): ReactElement {
  const {
    index = 0,
    href,
    component,
    onOpen,
    openLabel,
    frames,
    clip = null,
    poster,
    playable = false,
    seconds = null,
    clock = null,
    stamp = null,
    sheet = false,
    cornerStart = null,
    cornerEnd = null,
    action,
    actionStart,
    avatar,
    title,
    subtitle,
    count = null,
    ceiling = null,
    ceilingLabel,
    fallback,
    className,
    frameProps,
    footProps,
    imageProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const reduced = useMediaQuery(REDUCED);
  const [active, set_active] = useState(false);
  const [frame, set_frame] = useState(0);
  const [rolling, set_rolling] = useState(false);

  const stills = [...new Set(frames.filter((source) => source !== ""))];
  const player_src = playable && clip !== null ? clip : null;
  const player = player_src !== null;
  const cycling = active && !reduced && !player;
  const still = poster ?? stills[0] ?? null;

  useEffect(() => {
    if (!cycling || clip !== null || stills.length < 2 || sheet) return;
    let timer: ReturnType<typeof setTimeout>;
    const Advance = (): void => {
      set_frame((current) => (current + 1) % stills.length);
      timer = setTimeout(Advance, FRAME_MS);
    };
    timer = setTimeout(Advance, FIRST_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [clip, cycling, sheet, stills.length]);

  useEffect(() => {
    if (!cycling) set_frame(0);
  }, [cycling]);

  const has_top =
    cornerStart !== null || cornerEnd !== null || action !== undefined || actionStart !== undefined;
  const stamps =
    clock !== null || stamp !== null || (cornerStart !== null && actionStart !== undefined);
  const stats = stamps || count !== null || ceiling !== null;

  const body = (
    <Card
      cursor={href !== undefined || onOpen !== undefined ? "pointer" : undefined}
      gap="none"
      h="100%"
      onBlur={() => {
        set_active(false);
      }}
      onFocus={() => {
        set_active(true);
      }}
      onMouseEnter={() => {
        set_active(true);
      }}
      onMouseLeave={() => {
        set_active(false);
      }}
      p="none"
      r="xl"
      reveal={{ index }}
      variant="glass"
    >
      <Box {...frameProps} className={cx(styles.frame, frameProps?.className)}>
        <GradientBackground
          gradient="surface"
          h="100%"
          left={0}
          position="absolute"
          top={0}
          w="100%"
        />

        {stills.length === 0 && !player ? (
          <Box align="center" display="flex" h="100%" justify="center" w="100%">
            {fallback}
          </Box>
        ) : null}

        {player_src !== null ? (
          <div className={styles.stage} data-playing={rolling}>
            <VideoPlayer
              defer
              duration={seconds}
              fill
              label={title}
              maxHeight="100%"
              onPlaying={set_rolling}
              poster={still}
              src={player_src}
            />
          </div>
        ) : (
          stills.map((source, position) => (
            <div className={styles.layer} data-active={position === frame} key={source}>
              <img
                alt={position === 0 ? title : ""}
                src={source}
                {...imageProps}
                className={cx(sheet ? styles.cell : styles.image, imageProps?.className)}
              />
            </div>
          ))
        )}

        {clip !== null && cycling ? (
          <video
            autoPlay
            className={styles.clip}
            loop
            muted
            playsInline
            poster={still ?? undefined}
            src={clip}
          />
        ) : null}

        {player ? null : <div className={styles.scrim} />}

        {href !== undefined || onOpen === undefined || player ? null : (
          <button aria-label={openLabel} className={styles.hit} onClick={onOpen} type="button" />
        )}

        {has_top ? (
          <div className={cx(styles.top_scrim, styles.fading)} data-hidden={rolling} />
        ) : null}

        {actionStart === undefined ? null : (
          <div
            className={cx(styles.action_start, styles.fading, styles.fading_top)}
            data-hidden={rolling}
          >
            {actionStart}
          </div>
        )}
        {action === undefined ? null : (
          <div
            className={cx(styles.action, styles.fading, styles.fading_top)}
            data-hidden={rolling}
          >
            {action}
          </div>
        )}

        {cornerStart !== null && actionStart === undefined ? (
          <Corner
            className={cx(styles.corner_start, styles.fading, styles.fading_top)}
            corner={cornerStart}
            hidden={rolling}
          />
        ) : null}
        {cornerEnd === null ? null : (
          <Corner
            className={cx(styles.corner_end, styles.fading, styles.fading_top)}
            corner={cornerEnd}
            hidden={rolling}
          />
        )}

        <GlassSurface
          bdtw={1}
          bdw={0}
          data-hidden={rolling}
          direction="column"
          display="flex"
          gap="xs"
          p="sm"
          rtl={0}
          rtr={0}
          {...footProps}
          className={cx(styles.meta, styles.fading, styles.fading_foot, footProps?.className)}
        >
          {/* Stamps and figures share one row, so the four of them sit on the same centre line. */}
          {stats ? (
            <div className={styles.stats}>
              {stamps ? (
                <div className={styles.stamps}>
                  {cornerStart !== null && actionStart !== undefined ? (
                    <Badge
                      color="primary"
                      ff="mono"
                      size="sm"
                      variant={cornerStart.tone === "accent" ? "filled" : "light"}
                    >
                      {cornerStart.text}
                    </Badge>
                  ) : null}
                  {stamp === null ? null : (
                    <Badge
                      color="primary"
                      ff="mono"
                      size="sm"
                      variant={stamp.tone === "accent" ? "filled" : "light"}
                    >
                      {stamp.text}
                    </Badge>
                  )}
                  {clock === null ? null : (
                    <Badge color="gray" ff="mono" size="sm" variant="filled">
                      {clock}
                    </Badge>
                  )}
                </div>
              ) : null}
              {count === null && ceiling === null ? null : (
                <div className={styles.figures}>
                  {count === null ? null : (
                    <Box
                      align="center"
                      aria-label={count.label}
                      c="text.secondary"
                      display="flex"
                      gap="xs"
                    >
                      {count.icon}
                      <Text c="inherit" ff="mono" fw="bold" fz="caption" lh="tight">
                        {count.value}
                      </Text>
                    </Box>
                  )}
                  {ceiling === null ? null : (
                    <Badge
                      aria-label={ceilingLabel}
                      color="gray"
                      ff="mono"
                      size="sm"
                      variant="outline"
                    >
                      {ceiling}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          ) : null}
          <Box align="center" display="flex" gap="sm">
            {avatar === undefined ? null : (
              <Avatar
                alt={avatar.name}
                name={avatar.name}
                size={30}
                src={avatar.src ?? undefined}
              />
            )}
            <Box direction="column" display="flex" gap={0} miw={0}>
              <Title c="text.primary" fw="bold" fz="body2" lh={1} order={3}>
                {title}
              </Title>
              {subtitle === undefined ? null : (
                <Text c="text.secondary" fz="caption" truncate>
                  {subtitle}
                </Text>
              )}
            </Box>
          </Box>
        </GlassSurface>
      </Box>
    </Card>
  );

  if (href === undefined) {
    return (
      <div className={cx(styles.link, sprinkle_class, className)} style={sprinkle_style}>
        {body}
      </div>
    );
  }

  const Root: ElementType = component ?? "a";
  return (
    <Root className={cx(styles.link, sprinkle_class, className)} href={href} style={sprinkle_style}>
      {body}
    </Root>
  );
}

MediaCard.displayName = "MediaCard";
