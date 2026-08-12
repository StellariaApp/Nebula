import type { ReactNode } from "react";

export interface PortalProps {
  /**
   * What renders at the other end of the portal. Nothing reaches the DOM on the first render: the
   * portal waits for the client mount effect, so the server output is empty and there is no
   * hydration mismatch. Anything that must be in the server HTML does not belong here.
   */
  children?: ReactNode | undefined;
  /**
   * Where to portal to, as an element or as a CSS selector resolved against the document on every
   * render. A selector that matches nothing is not an error: it falls back to the container of the
   * surrounding React Aria portal provider, and to `document.body` when there is none.
   */
  target?: Element | string | null | undefined;
  /**
   * Renders the children in place instead, which keeps them subject to the ancestors' `overflow`
   * and stacking context. It is also the only branch that renders on the server.
   * @default false
   */
  disabled?: boolean | undefined;
}
