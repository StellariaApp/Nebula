"use client";

import { useRef, type ReactElement, type RefObject } from "react";

import { useListBox, useOption } from "react-aria";
import type { ListState, Node } from "react-stately";

import { cx } from "../utils/style-props.js";

import * as styles from "./option-list.css.js";
import type { RenderOption, SelectOption } from "./options.js";

const CHECK = (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

interface RowProps {
  node: Node<SelectOption>;
  state: ListState<SelectOption>;
  renderOption: RenderOption | undefined;
  withCheck: boolean;
}

function OptionRow(props: RowProps): ReactElement {
  const { node, state, renderOption, withCheck } = props;
  const ref = useRef<HTMLLIElement>(null);
  const data = node.value;

  const { optionProps, labelProps, descriptionProps, isSelected, isFocused, isDisabled } = useOption(
    { key: node.key },
    state,
    ref,
  );

  const custom =
    renderOption === undefined || data === null
      ? undefined
      : renderOption(data, { isSelected, isFocused, isDisabled });

  return (
    <li
      {...optionProps}
      ref={ref}
      className={styles.option}
      data-focused={isFocused ? "true" : undefined}
      data-selected={isSelected ? "true" : undefined}
      data-disabled={isDisabled ? "true" : undefined}
    >
      {custom === undefined ? (
        <>
          {data?.icon === undefined || data.icon === null ? null : (
            <span className={styles.icon} aria-hidden="true">
              {data.icon}
            </span>
          )}
          <span className={styles.labels}>
            <span {...labelProps}>{node.rendered}</span>
            {data?.description === undefined || data.description === null ? null : (
              <span {...descriptionProps} className={styles.description}>
                {data.description}
              </span>
            )}
          </span>
          {withCheck && isSelected ? (
            <span className={styles.check} aria-hidden="true">
              {CHECK}
            </span>
          ) : null}
        </>
      ) : (
        custom
      )}
    </li>
  );
}

export interface OptionListProps {
  state: ListState<SelectOption>;
  listBoxRef: RefObject<HTMLUListElement | null>;
  listBoxProps: Record<string, unknown>;
  renderOption?: RenderOption | undefined;
  withCheck?: boolean | undefined;
  emptyLabel?: string | undefined;
  className?: string | undefined;
}

export function OptionList(props: OptionListProps): ReactElement {
  const {
    state,
    listBoxRef,
    listBoxProps: outer,
    renderOption,
    withCheck = true,
    emptyLabel = "Sin resultados",
    className,
  } = props;

  const { listBoxProps } = useListBox(outer, state, listBoxRef);
  const nodes = [...state.collection];

  return (
    <>
      <ul {...listBoxProps} ref={listBoxRef} className={cx(styles.listbox, className)}>
        {nodes.map((node) => (
          <OptionRow
            key={node.key}
            node={node}
            state={state}
            renderOption={renderOption}
            withCheck={withCheck}
          />
        ))}
      </ul>
      {nodes.length === 0 ? <div className={styles.empty}>{emptyLabel}</div> : null}
    </>
  );
}

OptionList.displayName = "OptionList";
