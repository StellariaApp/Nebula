import { NextResponse, type NextRequest } from "next/server";

import { IsLang, LANG_COOKIE, ResolveLang } from "./lib/i18n";

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";

  if (IsLang(first)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(first.length + 1) || "/";
    const response = NextResponse.redirect(url);
    response.cookies.set(LANG_COOKIE, first, { path: "/", sameSite: "lax", maxAge: 31_536_000 });
    return response;
  }

  const lang = ResolveLang(
    request.cookies.get(LANG_COOKIE)?.value,
    request.headers.get("accept-language"),
  );

  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}
