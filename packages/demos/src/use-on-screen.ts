"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Tells whether the node is in the viewport, so a demo can stop its timers while nobody is looking.
 * Without an `IntersectionObserver` it reports visible: the demo keeps working, it just stops saving.
 */
export function useOnScreen(): [RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, set_visible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (node === null || typeof IntersectionObserver === "undefined") {
      set_visible(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      set_visible(entries.some((entry) => entry.isIntersecting));
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return [ref, visible];
}
