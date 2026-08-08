import { Children, isValidElement, type ReactNode } from "react";

export function ContainsPart(children: ReactNode, part: unknown): boolean {
  let found = false;
  Children.forEach(children, (child) => {
    if (found || !isValidElement(child)) return;
    if (child.type === part) {
      found = true;
      return;
    }
    const { children: nested } = child.props as { children?: ReactNode };
    if (nested !== undefined && ContainsPart(nested, part)) found = true;
  });
  return found;
}
