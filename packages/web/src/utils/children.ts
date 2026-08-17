import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

/**
 * Hands a compound part what only its root knows —an id, a heading level— without a context, so the
 * root can stay a server component (ADR-156). It walks nested children because a part is rarely a
 * direct child: `<Hero.Header><Hero.Title/></Hero.Header>` is the usual shape.
 *
 * What the consumer wrote WINS: only keys the part left `undefined` get filled in.
 */
export function InjectPart<P>(
  children: ReactNode,
  part: unknown,
  props: Partial<P>,
): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const own = child.props as P & { children?: ReactNode };

    if (child.type === part) {
      const fill: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(props)) {
        if ((own as Record<string, unknown>)[key] === undefined) fill[key] = value;
      }
      return cloneElement(child as ReactElement<Record<string, unknown>>, fill);
    }

    if (own.children === undefined) return child;
    return cloneElement(child as ReactElement<{ children?: ReactNode }>, {
      children: InjectPart<P>(own.children, part, props),
    });
  });
}

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
