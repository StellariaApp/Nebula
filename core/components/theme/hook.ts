"use client";

import { useAtom } from "jotai";
import { ThemeAtom } from "./atom";
import { useLayoutEffect } from "react";
import theme from ".";

const useTheme = () => {
  const [getter, setter] = useAtom(ThemeAtom);

  const listener = () => setter(theme.get());

  useLayoutEffect(() => {
    listener();
    window.addEventListener("storage", listener);
    return () => {
      window.removeEventListener("storage", listener);
    };
  }, []);

  return [getter, setter] as const;
};

export default useTheme;
