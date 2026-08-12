"use client";

import { Skeleton } from "@stellaria/nebula-web";
import { lazy, Suspense, useEffect, useState, type ComponentType, type ReactElement } from "react";

/**
 * Loads a component after hydration and never on the server, so its chunk leaves the initial bundle.
 * `next/dynamic` does the same with `ssr: false`, but this package is also consumed by the Vite
 * playground and must not import from a framework. The placeholder takes the height the component
 * declares, so deferring it costs no layout shift.
 */
interface Sized {
  height?: number | undefined;
}

const FALLBACK_HEIGHT = 160;

export function Deferred<P extends Sized>(Load: () => Promise<ComponentType<P>>): ComponentType<P> {
  const Lazy = lazy(async () => ({ default: await Load() }));

  function Late(props: P): ReactElement {
    const [ready, set_ready] = useState(false);

    useEffect(() => {
      set_ready(true);
    }, []);

    const hold = <Skeleton w="100%" h={props.height ?? FALLBACK_HEIGHT} r="md" />;
    if (!ready) return hold;

    return (
      <Suspense fallback={hold}>
        <Lazy {...props} />
      </Suspense>
    );
  }

  Late.displayName = "Deferred";
  return Late;
}
