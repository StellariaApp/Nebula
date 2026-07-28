"use client";

import type { ReactElement } from "react";

import { Segment } from "../Segment/index.js";

import type { TabsProps } from "./Tabs.types.js";

export function Tabs(props: TabsProps): ReactElement {
  const {
    data,
    value,
    defaultValue,
    onChange,
    size = "md",
    color = "primary",
    disabled = false,
    fullWidth = false,
    swipeable = true,
    draggable = true,
    fill = false,
    className,
    "aria-label": aria_label,
    ...style_rest
  } = props;

  return (
    <Segment
      {...style_rest}
      size={size}
      color={color}
      disabled={disabled}
      fullWidth={fullWidth}
      draggable={draggable}
      defaultValue={defaultValue ?? data[0]?.value ?? ""}
      {...(value === undefined ? {} : { value })}
      {...(onChange === undefined ? {} : { onChange })}
      {...(className === undefined ? {} : { className })}
    >
      <Segment.Control
        data={data.map((tab) => ({
          value: tab.value,
          label: tab.label,
          disabled: tab.disabled,
        }))}
        {...(aria_label === undefined ? {} : { "aria-label": aria_label })}
      />
      <Segment.Content swipeable={swipeable} fill={fill}>
        {data.map((tab) => (
          <Segment.Content.Item key={tab.value} value={tab.value}>
            {tab.content}
          </Segment.Content.Item>
        ))}
      </Segment.Content>
    </Segment>
  );
}

Tabs.displayName = "Tabs";
