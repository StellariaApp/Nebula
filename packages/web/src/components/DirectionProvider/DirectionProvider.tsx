"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";

import { I18nProvider } from "react-aria";

import type {
  Direction,
  DirectionContextValue,
  DirectionProviderProps,
} from "./DirectionProvider.types.js";

const RTL_LOCALE = "ar-AE";
const LTR_LOCALE = "es-ES";

const DirectionContext = createContext<DirectionContextValue | null>(null);

export function useDirection(): DirectionContextValue {
  const value = useContext(DirectionContext);
  if (value !== null) return value;
  return { direction: "ltr", setDirection: () => undefined, toggleDirection: () => undefined };
}

export function DirectionProvider(props: DirectionProviderProps): ReactElement {
  const {
    children,
    direction,
    defaultDirection = "ltr",
    onDirectionChange,
    detectFromDocument = false,
  } = props;

  const [local, set_local] = useState<Direction>(direction ?? defaultDirection);
  const resolved = direction ?? local;

  const SetDirection = useCallback(
    (next: Direction): void => {
      if (direction === undefined) set_local(next);
      onDirectionChange?.(next);
    },
    [direction, onDirectionChange],
  );

  useEffect(() => {
    if (!detectFromDocument || typeof document === "undefined") return;
    const found = document.documentElement.getAttribute("dir");
    if (found === "rtl" || found === "ltr") set_local(found);
  }, [detectFromDocument]);

  const value = useMemo<DirectionContextValue>(
    () => ({
      direction: resolved,
      setDirection: SetDirection,
      toggleDirection: () => {
        SetDirection(resolved === "ltr" ? "rtl" : "ltr");
      },
    }),
    [resolved, SetDirection],
  );

  return (
    <DirectionContext.Provider value={value}>
      <I18nProvider locale={resolved === "rtl" ? RTL_LOCALE : LTR_LOCALE}>
        <div dir={resolved} data-direction={resolved}>
          {children}
        </div>
      </I18nProvider>
    </DirectionContext.Provider>
  );
}

DirectionProvider.displayName = "DirectionProvider";
