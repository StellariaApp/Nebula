"use client";

import { useEffect, useId, useMemo, useState, type KeyboardEvent, type ReactElement } from "react";

import { useDebounce } from "@stellaria/nebula-hooks";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Loader } from "../Loader/Loader.js";
import { Modal } from "../Modal/Modal.js";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden.js";

import * as styles from "./GlobalSearch.css.js";
import { GLOBAL_SEARCH_LABELS } from "./labels.js";
import type { GlobalSearchProps, GlobalSearchResult } from "./GlobalSearch.types.js";

const DEFAULT_DEBOUNCE = 250;

const MAGNIFIER = (
  <svg
    viewBox="0 0 24 24"
    width="1.1em"
    height="1.1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

interface Group {
  name: string | undefined;
  items: GlobalSearchResult[];
}

function GroupBy(results: readonly GlobalSearchResult[]): Group[] {
  const groups: Group[] = [];
  for (const result of results) {
    const existing = groups.find((group) => group.name === result.group);
    if (existing === undefined) groups.push({ name: result.group, items: [result] });
    else existing.items.push(result);
  }
  return groups;
}

export function GlobalSearch(props: GlobalSearchProps): ReactElement {
  const {
    results,
    onQueryChange,
    onSelect,
    opened,
    onOpenChange,
    query,
    loading = false,
    debounce = DEFAULT_DEBOUNCE,
    recent,
    withTrigger = true,
    withShortcut = true,
    empty,
    labels,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const text = useMemo(
    () => (labels === undefined ? GLOBAL_SEARCH_LABELS : { ...GLOBAL_SEARCH_LABELS, ...labels }),
    [labels],
  );

  const auto_id = useId();
  const [uncontrolled_open, set_uncontrolled_open] = useState(false);
  const is_open = opened ?? uncontrolled_open;

  const [draft, set_draft] = useState(query ?? "");
  const debounced = useDebounce(draft, debounce);
  const [active, set_active] = useState(0);

  const SetOpen = (next: boolean): void => {
    if (opened === undefined) set_uncontrolled_open(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    onQueryChange(debounced);
  }, [debounced, onQueryChange]);

  useEffect(() => {
    set_active(0);
  }, [results]);

  useEffect(() => {
    if (!withShortcut || typeof window === "undefined") return;
    const OnKey = (event: globalThis.KeyboardEvent): void => {
      if (event.key !== "k" || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      SetOpen(true);
    };
    window.addEventListener("keydown", OnKey);
    return () => {
      window.removeEventListener("keydown", OnKey);
    };
  }, [withShortcut, opened]);

  const showing = draft.trim() === "" && recent !== undefined ? recent : results;
  const groups = useMemo(() => GroupBy(showing), [showing]);
  const flat = groups.flatMap((group) => group.items);

  const Choose = (result: GlobalSearchResult): void => {
    result.onSelect?.();
    onSelect?.(result);
    SetOpen(false);
    set_draft("");
  };

  const OnKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (flat.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      set_active((current) => (current + 1) % flat.length);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      set_active((current) => (current - 1 + flat.length) % flat.length);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      set_active(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      set_active(flat.length - 1);
      return;
    }
    if (event.key === "Enter") {
      const chosen = flat[active];
      if (chosen === undefined) return;
      event.preventDefault();
      Choose(chosen);
    }
  };

  const active_id = flat[active] === undefined ? undefined : `${auto_id}-${String(active)}`;
  let cursor = -1;

  return (
    <>
      {withTrigger ? (
        <button
          type="button"
          className={cx(styles.trigger, sprinkle_class, className)}
          style={sprinkle_style}
          onClick={() => {
            SetOpen(true);
          }}
          {...rest}
        >
          {MAGNIFIER}
          {text.trigger}
          {withShortcut ? <kbd className={styles.shortcut}>{text.shortcut}</kbd> : null}
        </button>
      ) : null}

      <Modal
        opened={is_open}
        onClose={() => {
          SetOpen(false);
        }}
        size="lg"
        padding="none"
        withCloseButton={false}
        aria-label={text.input}
      >
        <div className={styles.search_row}>
          <span className={styles.option_icon}>{MAGNIFIER}</span>
          <input
            className={styles.input}
            type="search"
            role="combobox"
            autoComplete="off"
            aria-expanded="true"
            aria-controls={`${auto_id}-list`}
            aria-label={text.input}
            placeholder={text.placeholder}
            value={draft}
            onChange={(event) => {
              set_draft(event.currentTarget.value);
            }}
            onKeyDown={OnKeyDown}
            {...(active_id === undefined ? {} : { "aria-activedescendant": active_id })}
          />
          {loading ? <Loader size="sm" aria-label={text.loading} /> : null}
        </div>

        <div className={styles.list} id={`${auto_id}-list`} role="listbox" aria-label={text.input}>
          {groups.map((group) => (
            <div
              key={group.name ?? "__root"}
              role="group"
              {...(group.name === undefined ? {} : { "aria-label": group.name })}
            >
              {group.name === undefined ? null : (
                <p className={styles.group_label} aria-hidden="true">
                  {group.name}
                </p>
              )}
              {group.items.map((result) => {
                cursor += 1;
                const index = cursor;
                return (
                  <div
                    key={result.id}
                    id={`${auto_id}-${String(index)}`}
                    className={styles.option}
                    role="option"
                    aria-selected={index === active}
                    data-active={index === active ? "true" : "false"}
                    onPointerMove={() => {
                      set_active(index);
                    }}
                    onClick={() => {
                      Choose(result);
                    }}
                  >
                    {result.icon === undefined ? null : (
                      <span className={styles.option_icon}>{result.icon}</span>
                    )}
                    <span className={styles.option_body}>
                      <span className={styles.option_title}>{result.title}</span>
                      {result.description === undefined ? null : (
                        <span className={styles.option_description}>{result.description}</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {flat.length === 0 && !loading ? (
          <p className={styles.status} role="status">
            {empty ?? text.empty}
          </p>
        ) : (
          <VisuallyHidden aria-live="polite">
            {loading ? text.loading : text.results(flat.length)}
          </VisuallyHidden>
        )}
      </Modal>
    </>
  );
}

GlobalSearch.displayName = "GlobalSearch";
