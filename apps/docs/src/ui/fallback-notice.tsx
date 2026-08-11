import { Alert, Anchor } from "@stellaria/nebula-web";

import type { Dictionary } from "../lib/dictionary";
import type { Lang } from "../lib/i18n";

export function FallbackNotice({
  dict,
  from,
  section,
  slug,
}: {
  dict: Dictionary;
  from: Lang;
  section: string;
  slug: string[];
}) {
  return (
    <Alert variant="light" color="warning" title={dict["fallback.title"]} mb="lg">
      {dict["fallback.body"]}{" "}
      <Anchor
        href={`https://github.com/stellaria/nebula/new/main/apps/docs/content/${from}/${section}/${slug.join("/")}.mdx`}
      >
        {dict["fallback.contribute"]}
      </Anchor>
    </Alert>
  );
}
