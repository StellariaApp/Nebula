"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactElement } from "react";

import { Maximize, Minimize, Play } from "../../glyphs/index.js";
import { FILLED, track, track_over_media } from "../../styles/player-controls.css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { ActionIcon } from "../ActionIcon/ActionIcon.js";
import { PlayerVolume } from "../AudioPlayer/components/Volume.js";
import { PLAYER_CONTROLS_LABELS, Stamp } from "../AudioPlayer/labels.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

import * as styles from "./VideoPlayer.css.js";
import type { VideoPlayerProps } from "./VideoPlayer.types.js";

const PERCENT = 100;
const STEP = 0.05;
const LOOKAHEAD = "200px";

function Measure(node: HTMLVideoElement | null): number {
  if (node === null) return 0;
  const total = Number.isFinite(node.duration)
    ? node.duration
    : node.seekable.length > 0
      ? node.seekable.end(node.seekable.length - 1)
      : 0;
  return Number.isFinite(total) && total > 0 ? total : 0;
}

export function VideoPlayer(props: VideoPlayerProps): ReactElement {
  const {
    src,
    poster,
    label,
    maxHeight,
    fill = false,
    defer = false,
    duration = null,
    autoPlay = false,
    loop = false,
    onPlaying,
    labels,
    className,
    surfaceProps,
    barProps,
    trackProps,
    volumeProps,
    fullscreenProps,
    playProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);
  const text = { ...PLAYER_CONTROLS_LABELS, ...labels };

  const shell = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const asked = useRef(false);
  const [live, set_live] = useState(!defer);
  const [poster_failed, set_poster_failed] = useState(false);
  const [playing, set_playing] = useState(false);
  const [time, set_time] = useState(0);
  const [length, set_length] = useState(duration ?? 0);
  const [volume, set_volume] = useState(1);
  const [muted, set_muted] = useState(autoPlay);
  const [full, set_full] = useState(false);

  const Report = (next: boolean): void => {
    set_playing(next);
    onPlaying?.(next);
  };

  const Remeasure = (node: HTMLVideoElement | null): void => {
    const total = Measure(node);
    if (total > 0) set_length(total);
  };

  useEffect(() => {
    Remeasure(video.current);
  }, [src]);

  useEffect(() => {
    if (live || (poster !== null && poster !== undefined && !poster_failed)) return;
    const node = shell.current;
    if (node === null || typeof IntersectionObserver === "undefined") return;
    const watching = new IntersectionObserver(
      (entries) => {
        if (!entries.some((one) => one.isIntersecting)) return;
        set_live(true);
        watching.disconnect();
      },
      { rootMargin: LOOKAHEAD },
    );
    watching.observe(node);
    return () => {
      watching.disconnect();
    };
  }, [live, poster, poster_failed]);

  useEffect(() => {
    if (!live || !asked.current) return;
    asked.current = false;
    void video.current?.play();
  }, [live]);

  useEffect(() => {
    const Sync = (): void => {
      set_full(document.fullscreenElement === shell.current);
    };
    document.addEventListener("fullscreenchange", Sync);
    return () => {
      document.removeEventListener("fullscreenchange", Sync);
    };
  }, []);

  const Toggle = (): void => {
    if (!live) {
      asked.current = true;
      set_live(true);
      return;
    }
    const node = video.current;
    if (node === null) return;
    if (node.paused) void node.play();
    else node.pause();
  };

  const Full = (): void => {
    const node = shell.current;
    if (node === null) return;
    if (document.fullscreenElement === node) void document.exitFullscreen();
    else void node.requestFullscreen().catch(() => undefined);
  };

  const filled = length > 0 ? Math.min(PERCENT, (time / length) * PERCENT) : 0;
  const cap = maxHeight === undefined ? undefined : { maxHeight: LengthToCss(maxHeight) };
  const has_poster = poster !== null && poster !== undefined && !poster_failed;

  return (
    <div
      className={cx(styles.shell, fill && styles.shell_fill, sprinkle_class, className)}
      ref={shell}
      style={{ ...cap, ...sprinkle_style }}
    >
      {live ? (
        <video
          aria-label={label}
          autoPlay={autoPlay}
          loop={loop}
          muted={autoPlay}
          onCanPlay={(event) => {
            Remeasure(event.currentTarget);
          }}
          onClick={Toggle}
          onDurationChange={(event) => {
            Remeasure(event.currentTarget);
          }}
          onEnded={() => {
            Report(false);
            if (!loop) set_time(0);
          }}
          onLoadedMetadata={(event) => {
            Remeasure(event.currentTarget);
          }}
          onPause={() => {
            Report(false);
          }}
          onPlay={() => {
            Report(true);
          }}
          onTimeUpdate={(event) => {
            set_time(event.currentTarget.currentTime);
          }}
          playsInline
          preload="metadata"
          {...surfaceProps}
          className={cx(styles.video, surfaceProps?.className)}
          poster={has_poster ? poster : undefined}
          ref={video}
          src={src}
          style={{ ...cap, ...surfaceProps?.style }}
        />
      ) : has_poster ? (
        <img
          alt={label ?? ""}
          className={styles.video}
          onError={() => {
            set_poster_failed(true);
          }}
          src={poster}
          style={cap}
        />
      ) : (
        <div className={styles.video} style={cap} />
      )}

      {playing ? null : (
        <button
          aria-label={text.play}
          onClick={Toggle}
          type="button"
          {...playProps}
          className={cx(styles.big, playProps?.className)}
        >
          <span className={styles.big_dot}>
            <Play />
          </span>
        </button>
      )}

      <div className={styles.grow} data-show={!playing}>
        <ActionIcon
          aria-label={full ? text.exitFullscreen : text.fullscreen}
          glass="strong"
          onPress={Full}
          pressed={full}
          pressedVariant="light"
          size="sm"
          variant="glass"
          {...fullscreenProps}
        >
          {full ? <Minimize /> : <Maximize />}
        </ActionIcon>
      </div>

      <Box data-show={!playing} {...barProps} className={cx(styles.bar, barProps?.className)}>
        <input
          aria-label={text.seek}
          max={length > 0 ? length : 1}
          min={0}
          onChange={(event) => {
            const node = video.current;
            const wanted = Number(event.currentTarget.value);
            if (node !== null && Number.isFinite(wanted)) {
              node.currentTime = wanted;
              set_time(wanted);
            }
          }}
          step={STEP}
          type="range"
          value={Math.min(time, length > 0 ? length : 1)}
          {...trackProps}
          className={cx(track, track_over_media, trackProps?.className)}
          style={{ [FILLED]: `${String(filled)}%`, ...trackProps?.style } as CSSProperties}
        />

        <div className={styles.foot}>
          <Text c="text.muted" ff="mono" fz="body3" lh={1}>
            {`${Stamp(time)}/${Stamp(length)}`}
          </Text>
          <PlayerVolume
            labels={text}
            muted={muted}
            onMute={() => {
              const next = !muted;
              set_muted(next);
              if (video.current !== null) video.current.muted = next;
            }}
            onVolume={(wanted) => {
              set_volume(wanted);
              set_muted(false);
              const node = video.current;
              if (node !== null) {
                node.volume = wanted;
                node.muted = false;
              }
            }}
            size="xs"
            sliderProps={volumeProps}
            volume={volume}
          />
        </div>
      </Box>
    </div>
  );
}

VideoPlayer.displayName = "VideoPlayer";
