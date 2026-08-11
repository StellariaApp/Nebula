"use client";

import { useMemo, type ReactElement } from "react";

import { usePermissionResolver } from "@stellaria/nebula-hooks";

import { ApplyPermissions } from "../../utils/permission.js";
import { Segment } from "../Segment/index.js";

import type { TabsProps } from "./Tabs.types.js";

export function Tabs(props: TabsProps): ReactElement {
  const {
    data,
    value,
    defaultValue,
    onChange,
    size = "md",
    variant,
    color = "primary",
    disabled = false,
    fullWidth = false,
    swipeable = true,
    draggable = true,
    fill = false,
    auto = false,
    autoWidth = false,
    loop = false,
    className,
    "aria-label": aria_label,
    ...style_rest
  } = props;

  const resolve = usePermissionResolver();
  const tabs = useMemo(() => ApplyPermissions(data, resolve), [data, resolve]);

  return (
    <Segment
      {...style_rest}
      size={size}
      {...(variant === undefined ? {} : { variant })}
      color={color}
      disabled={disabled}
      fullWidth={fullWidth}
      draggable={draggable}
      defaultValue={defaultValue ?? tabs[0]?.value ?? ""}
      {...(value === undefined ? {} : { value })}
      {...(onChange === undefined ? {} : { onChange })}
      {...(className === undefined ? {} : { className })}
    >
      <Segment.Control
        data={tabs.map((tab) => ({
          value: tab.value,
          label: tab.label,
          disabled: tab.disabled,
        }))}
        {...(aria_label === undefined ? {} : { "aria-label": aria_label })}
      />
      <Segment.Content
        swipeable={swipeable}
        fill={fill}
        auto={auto}
        autoWidth={autoWidth}
        loop={loop}
      >
        {tabs.map((tab) => (
          <Segment.Content.Item key={tab.value} value={tab.value}>
            {tab.content}
          </Segment.Content.Item>
        ))}
      </Segment.Content>
    </Segment>
  );
}

Tabs.displayName = "Tabs";
