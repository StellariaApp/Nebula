"use client";

import { usePathname, useRouter } from "next/navigation";

import { Button } from "@stellaria/nebula-web";

import { OtherLang, type Lang } from "../lib/i18n";

export function LangSwitch({ lang, label }: { lang: Lang; label: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const target = OtherLang(lang);

  return (
    <Button
      size="sm"
      variant="ghost"
      aria-label={label}
      onPress={() => {
        router.push(pathname.replace(`/${lang}`, `/${target}`));
      }}
    >
      {target.toUpperCase()}
    </Button>
  );
}
