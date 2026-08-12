import type { ReactNode } from "react";

import type { SelectOption } from "../../collections/options.js";

import type { ComboboxProps } from "./Combobox.types.js";

export type AutocompleteProps = Omit<ComboboxProps, "allowsCustomValue" | "menuTrigger"> & {
  menuTrigger?: ComboboxProps["menuTrigger"] | undefined;
};

export type SearchableSelectProps = Omit<ComboboxProps, "allowsCustomValue">;

export interface CreatableSelectProps extends Omit<ComboboxProps, "allowsCustomValue" | "data"> {
  /**
   * The options. Narrower than the base contract on purpose: creating an option means building one,
   * so the shape has to be known rather than free-form.
   */
  data: readonly SelectOption[];
  /**
   * Runs when the create entry is picked, and decides what the new option is. Returning `null`
   * refuses the creation — the place to reject a name the server has already taken.
   */
  onCreate?: ((label: string) => SelectOption | string | null) | undefined;
  /** @default (label) => `Crear «${label}»` */
  createLabel?: ((label: string) => ReactNode) | undefined;
  /**
   * Decides whether the create entry is offered for what has been typed. The default hides it for
   * blank input and for a label that already exists, compared case-insensitively — replace it when
   * duplicates are legitimate, or when the match has to be made server-side.
   * @default hidden when the input is blank or already matches an option, case-insensitively
   */
  shouldCreate?: ((label: string, data: readonly SelectOption[]) => boolean) | undefined;
}

export interface AsyncSelectProps extends Omit<
  ComboboxProps,
  "data" | "inputValue" | "onInputChange"
> {
  /**
   * Fetches the options for what has been typed. It replaces `data`, which is why that prop is gone
   * from this contract: the list is the result of this call and nothing else.
   */
  load: (query: string) => Promise<readonly SelectOption[]>;
  /**
   * How long the typing has to settle before `load` runs, in milliseconds. It is the only thing
   * between a keystroke and a request, so it is the dial to turn when the endpoint is rate-limited.
   */
  debounce?: number | undefined;
  /**
   * How many characters have to be typed before `load` runs at all. It exists for endpoints where a
   * one-letter query would match most of the table.
   */
  minQueryLength?: number | undefined;
  /** What is announced while a fetch is in flight. English by default (ADR-120). */
  loadingLabel?: string | undefined;
  /** What is announced when the fetch rejects. English by default (ADR-120). */
  errorLabel?: string | undefined;
  /**
   * What the list holds before the first fetch — recents, favourites. Without it the menu opens
   * empty until something is typed.
   * @default []
   */
  initialData?: readonly SelectOption[] | undefined;
}

export type VirtualizedSelectProps = Omit<ComboboxProps, "allowsCustomValue">;
