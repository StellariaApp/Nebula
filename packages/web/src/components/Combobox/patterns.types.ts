import type { ReactNode } from "react";

import type { SelectOption } from "../../collections/options.js";

import type { ComboboxProps } from "./Combobox.types.js";

export type AutocompleteProps = Omit<ComboboxProps, "allowsCustomValue" | "menuTrigger"> & {
  menuTrigger?: ComboboxProps["menuTrigger"] | undefined;
};

export type SearchableSelectProps = Omit<ComboboxProps, "allowsCustomValue">;

export interface CreatableSelectProps extends Omit<ComboboxProps, "allowsCustomValue" | "data"> {
  data: readonly SelectOption[];
  onCreate?: ((label: string) => SelectOption | string | null) | undefined;
  /** @default (label) => `Crear «${label}»` */
  createLabel?: ((label: string) => ReactNode) | undefined;
  shouldCreate?: ((label: string, data: readonly SelectOption[]) => boolean) | undefined;
}

export interface AsyncSelectProps extends Omit<
  ComboboxProps,
  "data" | "inputValue" | "onInputChange"
> {
  load: (query: string) => Promise<readonly SelectOption[]>;
  debounce?: number | undefined;
  minQueryLength?: number | undefined;
  loadingLabel?: string | undefined;
  errorLabel?: string | undefined;
  /** @default [] */
  initialData?: readonly SelectOption[] | undefined;
}

export type VirtualizedSelectProps = Omit<ComboboxProps, "allowsCustomValue">;
