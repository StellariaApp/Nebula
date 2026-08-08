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
import { Search } from "../../glyphs/index.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

const DEFAULT_DEBOUNCE = 250;

const MAGNIFIER = <Search />;

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
    triggerProps,
    shortcutProps,
    searchRowProps,
    iconProps,
    inputProps,
    listProps,
    groupLabelProps,
    optionProps,
    optionBodyProps,
    optionTitleProps,
    optionDescriptionProps,
    statusProps,
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
          {...triggerProps}
          className={cx(styles.trigger, sprinkle_class, className, triggerProps?.className)}
          style={{ ...sprinkle_style, ...triggerProps?.style }}
          onClick={() => {
            SetOpen(true);
          }}
          {...rest}
        >
          {MAGNIFIER}
          {text.trigger}
          {withShortcut ? (
            <Box
              component="kbd"
              {...shortcutProps}
              className={cx(styles.shortcut, shortcutProps?.className)}
            >
              {text.shortcut}
            </Box>
          ) : null}
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
        <Box {...searchRowProps} className={cx(styles.search_row, searchRowProps?.className)}>
          <Box
            component="span"
            {...iconProps}
            className={cx(styles.option_icon, iconProps?.className)}
          >
            {MAGNIFIER}
          </Box>
          <input
            {...inputProps}
            className={cx(styles.input, inputProps?.className)}
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
        </Box>

        <Box
          aria-label={text.input}
          {...listProps}
          id={`${auto_id}-list`}
          role="listbox"
          className={cx(styles.list, listProps?.className)}
        >
          {groups.map((group) => (
            <div
              key={group.name ?? "__root"}
              role="group"
              {...(group.name === undefined ? {} : { "aria-label": group.name })}
            >
              {group.name === undefined ? null : (
                <Text
                  aria-hidden="true"
                  {...groupLabelProps}
                  className={cx(styles.group_label, groupLabelProps?.className)}
                >
                  {group.name}
                </Text>
              )}
              {group.items.map((result) => {
                cursor += 1;
                const index = cursor;
                return (
                  <Box
                    key={result.id}
                    data-active={index === active ? "true" : "false"}
                    {...optionProps}
                    id={`${auto_id}-${String(index)}`}
                    role="option"
                    aria-selected={index === active}
                    className={cx(styles.option, optionProps?.className)}
                    onPointerMove={() => {
                      set_active(index);
                    }}
                    onClick={() => {
                      Choose(result);
                    }}
                  >
                    {result.icon === undefined ? null : (
                      <Box
                        component="span"
                        {...iconProps}
                        className={cx(styles.option_icon, iconProps?.className)}
                      >
                        {result.icon}
                      </Box>
                    )}
                    <Box
                      component="span"
                      {...optionBodyProps}
                      className={cx(styles.option_body, optionBodyProps?.className)}
                    >
                      <Text
                        inherit
                        component="span"
                        {...optionTitleProps}
                        className={cx(styles.option_title, optionTitleProps?.className)}
                      >
                        {result.title}
                      </Text>
                      {result.description === undefined ? null : (
                        <Text
                          component="span"
                          {...optionDescriptionProps}
                          className={cx(
                            styles.option_description,
                            optionDescriptionProps?.className,
                          )}
                        >
                          {result.description}
                        </Text>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </div>
          ))}
        </Box>

        {flat.length === 0 && !loading ? (
          <Text
            {...statusProps}
            role="status"
            className={cx(styles.status, statusProps?.className)}
          >
            {empty ?? text.empty}
          </Text>
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
