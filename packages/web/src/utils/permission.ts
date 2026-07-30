import type { PermissionResolver } from "@stellaria/nebula-hooks";
import type { PermissionProps } from "@stellaria/nebula-tokens";

type Gateable = PermissionProps & { disabled?: boolean | undefined };

export function ApplyPermissions<T extends Gateable>(
  items: readonly T[],
  resolve: PermissionResolver,
): T[] {
  const allowed: T[] = [];

  for (const item of items) {
    if (item.permission === undefined || resolve(item.permission)) {
      allowed.push(item);
      continue;
    }
    if (item.permissionMode === "disable") allowed.push({ ...item, disabled: true });
  }

  return allowed;
}
