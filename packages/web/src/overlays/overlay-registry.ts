"use client";

import { useCallback } from "react";

import { atom, getDefaultStore, useAtomValue } from "jotai";

export type OverlayId = string;

const OPEN_IDS = atom<ReadonlySet<OverlayId>>(new Set<OverlayId>());

const STORE = getDefaultStore();

function Mutate(id: OverlayId, next_open: boolean): void {
  const current = STORE.get(OPEN_IDS);
  if (current.has(id) === next_open) return;
  const next = new Set(current);
  if (next_open) next.add(id);
  else next.delete(id);
  STORE.set(OPEN_IDS, next);
}

export interface OverlayRegistry {
  open: (id: OverlayId) => void;
  close: (id: OverlayId) => void;
  toggle: (id: OverlayId) => void;
  isOpen: (id: OverlayId) => boolean;
  closeAll: () => void;
}

export const nebulaOverlays: OverlayRegistry = {
  open: (id) => {
    Mutate(id, true);
  },
  close: (id) => {
    Mutate(id, false);
  },
  toggle: (id) => {
    Mutate(id, !STORE.get(OPEN_IDS).has(id));
  },
  isOpen: (id) => STORE.get(OPEN_IDS).has(id),
  closeAll: () => {
    if (STORE.get(OPEN_IDS).size > 0) STORE.set(OPEN_IDS, new Set<OverlayId>());
  },
};

export interface OverlayHandle {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function useOverlayState(id: OverlayId): OverlayHandle {
  const open_ids = useAtomValue(OPEN_IDS);

  const Open = useCallback(() => {
    Mutate(id, true);
  }, [id]);
  const Close = useCallback(() => {
    Mutate(id, false);
  }, [id]);
  const Toggle = useCallback(() => {
    Mutate(id, !STORE.get(OPEN_IDS).has(id));
  }, [id]);

  return { isOpen: open_ids.has(id), open: Open, close: Close, toggle: Toggle };
}
