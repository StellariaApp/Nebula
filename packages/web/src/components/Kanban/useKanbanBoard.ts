import { useEffect, useMemo, useRef, useState } from "react";

export type KanbanColumns = Record<string, string[]>;

export function GroupKeys(
  columnIds: readonly string[],
  entries: readonly { key: string; column: string }[],
): KanbanColumns {
  const groups: KanbanColumns = {};
  for (const id of columnIds) groups[id] = [];
  for (const entry of entries) {
    const bucket = groups[entry.column];
    if (bucket === undefined) continue;
    bucket.push(entry.key);
  }
  return groups;
}

export function ColumnOf(groups: KanbanColumns, key: string): string | null {
  for (const [id, keys] of Object.entries(groups)) {
    if (keys.includes(key)) return id;
  }
  return null;
}

export function MoveKey(
  groups: KanbanColumns,
  key: string,
  to: string,
  index: number,
): KanbanColumns {
  const next: KanbanColumns = {};
  for (const [id, keys] of Object.entries(groups)) {
    next[id] = keys.filter((candidate) => candidate !== key);
  }
  const target = next[to];
  if (target === undefined) return groups;
  const at = index < 0 || index > target.length ? target.length : index;
  target.splice(at, 0, key);
  return next;
}

export function useKanbanColumns(
  columnIds: readonly string[],
  entries: readonly { key: string; column: string }[],
): [KanbanColumns, (next: KanbanColumns) => void] {
  const derived = useMemo(() => GroupKeys(columnIds, entries), [columnIds, entries]);
  const [local, set_local] = useState<KanbanColumns | null>(null);
  const signature = useRef("");

  const next_signature = JSON.stringify(derived);
  useEffect(() => {
    if (signature.current === next_signature) return;
    signature.current = next_signature;
    set_local(null);
  }, [next_signature]);

  return [local ?? derived, set_local];
}
