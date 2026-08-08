import { AsLang } from "../../../lib/i18n";
import { Reserved } from "../../../ui/reserved";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = AsLang(raw);
  return <Reserved lang={lang} heading="nav.native" />;
}
