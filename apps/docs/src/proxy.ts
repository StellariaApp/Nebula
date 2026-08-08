import { NextResponse, type NextRequest } from "next/server";

import { IsLang, NegotiateLang } from "./lib/i18n";

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (IsLang(first)) return NextResponse.next();

  const lang = NegotiateLang(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}
