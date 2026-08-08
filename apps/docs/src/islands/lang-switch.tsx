"use client";

import { useRouter } from "next/navigation";

import { Button } from "@stellaria/nebula-web";

import { LANG_COOKIE, LANGS, type Lang } from "../lib/i18n";

export function LangSwitch({ lang, label }: { lang: Lang; label: string }) {
  const router = useRouter();
  const target = LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length] ?? lang;

  return (
    <Button
      size="sm"
      variant="ghost"
      aria-label={label}
      onPress={() => {
        document.cookie = `${LANG_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`;
        router.refresh();
      }}
    >
      {target.toUpperCase()}
    </Button>
  );
}
