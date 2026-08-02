"use client";

import { useId, useMemo, useState, type ReactElement } from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import type { SelectOption } from "../../collections/options.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { ActionIcon } from "../ActionIcon/ActionIcon.js";
import { SearchInput } from "../SearchInput/SearchInput.js";

import * as styles from "./TransferList.css.js";
import { TRANSFER_LIST_LABELS } from "./labels.js";
import type { TransferListPane, TransferListProps } from "./TransferList.types.js";

const DEFAULT_HEIGHT = 240;

const Chevron = (path: string): ReactElement => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={path} />
  </svg>
);

const TO_TARGET = Chevron("M9 6l6 6-6 6");
const TO_SOURCE = Chevron("M15 6l-6 6 6 6");
const ALL_TO_TARGET = Chevron("M6 6l6 6-6 6M13 6l6 6-6 6");
const ALL_TO_SOURCE = Chevron("M18 6l-6 6 6 6M11 6l-6 6 6 6");

interface PaneProps {
  id: string;
  options: readonly SelectOption[];
  marked: readonly string[];
  onToggle: (value: string) => void;
  pane: TransferListPane | undefined;
  searchable: boolean;
  searchLabel: string;
  emptyLabel: string;
  countLabel: string;
  disabled: boolean;
  query: string;
  onQuery: (value: string) => void;
}

function Pane(props: PaneProps): ReactElement {
  const {
    id,
    options,
    marked,
    onToggle,
    pane,
    searchable,
    searchLabel,
    emptyLabel,
    countLabel,
    disabled,
    query,
    onQuery,
  } = props;

  return (
    <div className={styles.pane}>
      {pane?.title === undefined ? null : (
        <div className={styles.paneHead}>
          <p className={styles.paneTitle} id={id}>
            {pane.title}
          </p>
          <span className={styles.paneCount}>{countLabel}</span>
        </div>
      )}
      {searchable ? (
        <div className={styles.search}>
          <SearchInput
            value={query}
            onChange={onQuery}
            aria-label={searchLabel}
            size="sm"
            disabled={disabled}
          />
        </div>
      ) : null}
      <div
        className={styles.list}
        role="listbox"
        aria-multiselectable="true"
        {...(pane?.title === undefined ? {} : { "aria-labelledby": id })}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={styles.item}
            role="option"
            aria-selected={marked.includes(option.value)}
            disabled={disabled || option.disabled === true}
            onClick={() => {
              onToggle(option.value);
            }}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
      {options.length === 0 ? <p className={styles.empty}>{pane?.empty ?? emptyLabel}</p> : null}
      {pane?.title === undefined ? <span className={styles.paneCount}>{countLabel}</span> : null}
    </div>
  );
}

export function TransferList(props: TransferListProps): ReactElement {
  const {
    data,
    value,
    defaultValue = [],
    onChange,
    source,
    target,
    searchable = false,
    height = DEFAULT_HEIGHT,
    disabled = false,
    labels,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const text = useMemo(
    () => (labels === undefined ? TRANSFER_LIST_LABELS : { ...TRANSFER_LIST_LABELS, ...labels }),
    [labels],
  );

  const auto_id = useId();
  const [selected, set_selected] = useUncontrolled<readonly string[]>(
    value,
    defaultValue,
    onChange === undefined
      ? undefined
      : (next) => {
          onChange([...next]);
        },
  );

  const [marked_source, set_marked_source] = useState<string[]>([]);
  const [marked_target, set_marked_target] = useState<string[]>([]);
  const [query_source, set_query_source] = useState("");
  const [query_target, set_query_target] = useState("");

  const in_target = useMemo(() => new Set(selected), [selected]);

  const Match = (option: SelectOption, query: string): boolean =>
    query === "" || option.label.toLowerCase().includes(query.toLowerCase());

  const source_options = data.filter((o) => !in_target.has(o.value) && Match(o, query_source));
  const target_options = data.filter((o) => in_target.has(o.value) && Match(o, query_target));

  const Toggle = (list: string[], set: (next: string[]) => void, key: string): void => {
    set(list.includes(key) ? list.filter((item) => item !== key) : [...list, key]);
  };

  const Move = (keys: readonly string[], to_target: boolean): void => {
    const next = to_target
      ? [...selected, ...keys.filter((key) => !in_target.has(key))]
      : selected.filter((key) => !keys.includes(key));
    set_selected(next);
    set_marked_source([]);
    set_marked_target([]);
  };

  const css_vars = assignInlineVars({ [styles.paneHeight]: LengthToCss(height) });
  const enabled = data.filter((option) => option.disabled !== true).map((option) => option.value);

  return (
    <div
      className={cx(styles.root, sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      {...rest}
    >
      <Pane
        id={`${auto_id}-source`}
        options={source_options}
        marked={marked_source}
        onToggle={(key) => {
          Toggle(marked_source, set_marked_source, key);
        }}
        pane={source}
        searchable={searchable}
        searchLabel={text.search}
        emptyLabel={text.empty}
        countLabel={text.count(marked_source.length, source_options.length)}
        disabled={disabled}
        query={query_source}
        onQuery={set_query_source}
      />

      <div className={styles.controls}>
        <ActionIcon
          variant="outline"
          size="sm"
          aria-label={text.add}
          disabled={disabled || marked_source.length === 0}
          onPress={() => {
            Move(marked_source, true);
          }}
        >
          {TO_TARGET}
        </ActionIcon>
        <ActionIcon
          variant="ghost"
          size="sm"
          aria-label={text.addAll}
          disabled={disabled || source_options.length === 0}
          onPress={() => {
            Move(
              source_options.filter((o) => o.disabled !== true).map((o) => o.value),
              true,
            );
          }}
        >
          {ALL_TO_TARGET}
        </ActionIcon>
        <ActionIcon
          variant="outline"
          size="sm"
          aria-label={text.remove}
          disabled={disabled || marked_target.length === 0}
          onPress={() => {
            Move(marked_target, false);
          }}
        >
          {TO_SOURCE}
        </ActionIcon>
        <ActionIcon
          variant="ghost"
          size="sm"
          aria-label={text.removeAll}
          disabled={disabled || target_options.length === 0}
          onPress={() => {
            Move(enabled, false);
          }}
        >
          {ALL_TO_SOURCE}
        </ActionIcon>
      </div>

      <Pane
        id={`${auto_id}-target`}
        options={target_options}
        marked={marked_target}
        onToggle={(key) => {
          Toggle(marked_target, set_marked_target, key);
        }}
        pane={target}
        searchable={searchable}
        searchLabel={text.search}
        emptyLabel={text.empty}
        countLabel={text.count(marked_target.length, target_options.length)}
        disabled={disabled}
        query={query_target}
        onQuery={set_query_target}
      />
    </div>
  );
}

TransferList.displayName = "TransferList";
