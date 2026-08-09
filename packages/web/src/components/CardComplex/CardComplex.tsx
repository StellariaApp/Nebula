"use client";

import { useMemo, type ReactElement } from "react";

import { usePermissionResolver } from "@stellaria/nebula-hooks";

import { ApplyPermissions } from "../../utils/permission.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ActionIcon } from "../ActionIcon/ActionIcon.js";
import { Avatar } from "../Avatar/Avatar.js";
import { Badge } from "../Badge/Badge.js";
import {
  Card,
  CardBadges,
  CardImage,
  CardMeta as CardMetaSlot,
  CardActions,
} from "../Card/Card.js";
import { Box } from "../Box/Box.js";
import { DateDisplay } from "../DateDisplay/DateDisplay.js";
import { Text } from "../Text/Text.js";
import { Skeleton } from "../Skeleton/Skeleton.js";

import * as styles from "./CardComplex.css.js";
import type {
  CardAction,
  CardActionSlot,
  CardBadge,
  CardComplexProps,
} from "./CardComplex.types.js";
import type { BoxSlotProps } from "../Box/Box.types.js";

function BadgeRow(props: {
  items: readonly CardBadge[];
  grow: boolean;
  wrap: boolean;
}): ReactElement {
  return (
    <div
      className={styles.badge_row}
      data-grow={props.grow ? "true" : undefined}
      data-wrap={props.wrap ? "true" : undefined}
    >
      {props.items.map((badge) => (
        <Badge
          key={badge.key}
          size="sm"
          {...(badge.color === undefined ? {} : { color: badge.color })}
          {...(badge.variant === undefined ? {} : { variant: badge.variant })}
        >
          {badge.label}
        </Badge>
      ))}
    </div>
  );
}

function ActionRow(props: {
  items: readonly CardAction[];
  className?: string | undefined;
  slotProps?: BoxSlotProps | undefined;
}): ReactElement {
  const { className, slotProps } = props;
  return (
    <Box {...slotProps} className={cx(className ?? styles.slot_row, slotProps?.className)}>
      {props.items.map((action) => (
        <ActionIcon
          key={action.key}
          size="sm"
          variant="ghost"
          aria-label={action.label}
          {...(action.color === undefined ? {} : { color: action.color })}
          {...(action.disabled === undefined ? {} : { disabled: action.disabled })}
          {...(action.onPress === undefined ? {} : { onPress: action.onPress })}
        >
          {action.icon}
        </ActionIcon>
      ))}
    </Box>
  );
}

export function CardComplex(props: CardComplexProps): ReactElement {
  const {
    title,
    description,
    media,
    badges,
    actions,
    meta,
    href,
    onPress,
    selected = false,
    disabled = false,
    loading = false,
    variant,
    color,
    lines,
    footer,
    children,
    className,
    mediaProps,
    mediaActionsProps,
    bodyProps,
    headerProps,
    headingProps,
    titleProps,
    descriptionProps,
    metaProps,
    personProps,
    footProps,
    "aria-label": aria_label,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const resolve = usePermissionResolver();
  const allowed = useMemo(() => ApplyPermissions(actions ?? [], resolve), [actions, resolve]);

  const BySlot = (slot: CardActionSlot): CardAction[] =>
    allowed.filter((action) => (action.slot ?? "header") === slot);

  const header_actions = BySlot("header");
  const media_actions = BySlot("media");
  const footer_actions = BySlot("footer");

  const show_media = media !== undefined && media.hidden !== true;
  const grow = badges?.grow === true;
  const wrap = badges?.wrap !== false;

  if (loading) {
    return (
      <Card
        {...(variant === undefined ? {} : { variant })}
        {...(color === undefined ? {} : { color })}
        className={cx(sprinkle_class, className)}
        {...(sprinkle_style === undefined ? {} : { style: sprinkle_style })}
      >
        <Skeleton height={140} radius="sm" />
        <Skeleton height={20} width="60%" mt="sm" />
        <Skeleton height={14} lines={2} mt="xs" />
      </Card>
    );
  }

  return (
    <Card
      {...(variant === undefined ? {} : { variant })}
      {...(color === undefined ? {} : { color })}
      {...(href === undefined || disabled ? {} : { href })}
      {...(onPress === undefined || disabled ? {} : { onPress })}
      {...(aria_label === undefined ? {} : { "aria-label": aria_label })}
      className={cx(sprinkle_class, className)}
      {...(sprinkle_style === undefined ? {} : { style: sprinkle_style })}
    >
      {show_media ? (
        <Box
          data-selected={selected ? "true" : undefined}
          {...mediaProps}
          className={cx(styles.media_wrap, mediaProps?.className)}
        >
          {media.component ?? (
            <CardImage
              {...(media.image === undefined ? {} : { src: media.image })}
              alt={media.alt ?? ""}
              {...(media.height === undefined ? {} : { height: media.height })}
            />
          )}
          {media_actions.length === 0 ? null : (
            <ActionRow
              items={media_actions}
              className={styles.media_actions}
              slotProps={mediaActionsProps}
            />
          )}
        </Box>
      ) : null}

      <Box {...bodyProps} className={cx(styles.body, bodyProps?.className)}>
        {title === undefined && header_actions.length === 0 ? null : (
          <Box {...headerProps} className={cx(styles.header, headerProps?.className)}>
            <Box {...headingProps} className={cx(styles.heading, headingProps?.className)}>
              {badges?.title === undefined ? null : (
                <BadgeRow items={badges.title} grow={grow} wrap={wrap} />
              )}
              {title === undefined ? null : (
                <Text {...titleProps} className={cx(styles.title, titleProps?.className)}>
                  {title}
                </Text>
              )}
            </Box>
            {header_actions.length === 0 ? null : <ActionRow items={header_actions} />}
          </Box>
        )}

        {description === undefined ? null : (
          <Text
            {...descriptionProps}
            className={cx(styles.description, descriptionProps?.className)}
            {...(lines === undefined ? {} : { lines })}
          >
            {description}
          </Text>
        )}

        {badges?.main === undefined ? null : (
          <CardBadges>
            <BadgeRow items={badges.main} grow={grow} wrap={wrap} />
          </CardBadges>
        )}

        {children}

        {meta === undefined ? null : (
          <CardMetaSlot>
            <Box {...metaProps} className={cx(styles.meta_row, metaProps?.className)}>
              {meta.createdAt === undefined ? null : (
                <span>
                  {meta.createdAtLabel ?? "Created"}{" "}
                  <DateDisplay
                    value={meta.createdAt}
                    mode="auto"
                    {...(meta.locale === undefined ? {} : { locale: meta.locale })}
                  />
                </span>
              )}
              {meta.updatedAt === undefined ? null : (
                <span>
                  {meta.updatedAtLabel ?? "Updated"}{" "}
                  <DateDisplay
                    value={meta.updatedAt}
                    mode="auto"
                    {...(meta.locale === undefined ? {} : { locale: meta.locale })}
                  />
                </span>
              )}
              {meta.responsible === undefined ? null : (
                <Box
                  component="span"
                  {...personProps}
                  className={cx(styles.person, personProps?.className)}
                >
                  <Avatar
                    size="xs"
                    name={meta.responsible.name}
                    {...(meta.responsible.avatar === undefined
                      ? {}
                      : { src: meta.responsible.avatar })}
                  />
                  {meta.responsibleLabel === undefined ? null : `${meta.responsibleLabel} `}
                  {meta.responsible.name}
                </Box>
              )}
            </Box>
          </CardMetaSlot>
        )}

        {footer === undefined &&
        footer_actions.length === 0 &&
        badges?.footer === undefined ? null : (
          <Box {...footProps} className={cx(styles.foot, footProps?.className)}>
            {badges?.footer === undefined ? (
              <span />
            ) : (
              <BadgeRow items={badges.footer} grow={grow} wrap={wrap} />
            )}
            {footer}
            {footer_actions.length === 0 ? null : (
              <CardActions>
                <ActionRow items={footer_actions} />
              </CardActions>
            )}
          </Box>
        )}
      </Box>
    </Card>
  );
}

CardComplex.displayName = "CardComplex";
