"use client";

import { TextInput } from "@stellaria/nebula-web";

export function Search({ label, placeholder }: { label: string; placeholder: string }) {
  return <TextInput type="search" size="sm" w={200} aria-label={label} placeholder={placeholder} />;
}
