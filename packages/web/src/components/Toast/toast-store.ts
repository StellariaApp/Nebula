"use client";

import { atom, getDefaultStore, useAtomValue } from "jotai";

import type { ToastApi, ToastOptions, ToastRecord } from "./Toast.types.js";

const QUEUE = atom<readonly ToastRecord[]>([]);
const STORE = getDefaultStore();

const DEFAULT_DURATION = 4500;

let counter = 0;

function NextId(): string {
  counter += 1;
  return `nebula-toast-${String(counter)}`;
}

function Push(options: ToastOptions): string {
  const id = options.id ?? NextId();
  const record: ToastRecord = {
    ...options,
    id,
    color: options.color ?? "info",
    duration: options.duration ?? DEFAULT_DURATION,
    dismissible: options.dismissible ?? true,
  };
  const current = STORE.get(QUEUE);
  const without = current.filter((entry) => entry.id !== id);
  STORE.set(QUEUE, [...without, record]);
  return id;
}

function Dismiss(id: string): void {
  const current = STORE.get(QUEUE);
  if (!current.some((entry) => entry.id === id)) return;
  STORE.set(
    QUEUE,
    current.filter((entry) => entry.id !== id),
  );
}

export const nebulaToast: ToastApi = {
  show: Push,
  success: (message, options) => Push({ ...options, message, color: "success" }),
  error: (message, options) => Push({ ...options, message, color: "error" }),
  warning: (message, options) => Push({ ...options, message, color: "warning" }),
  info: (message, options) => Push({ ...options, message, color: "info" }),
  dismiss: Dismiss,
  clear: () => {
    if (STORE.get(QUEUE).length > 0) STORE.set(QUEUE, []);
  },
};

export function useToastQueue(): readonly ToastRecord[] {
  return useAtomValue(QUEUE);
}
