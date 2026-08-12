import { Alert, Anchor } from "@stellaria/nebula-web";

import type { Dictionary } from "../lib/dictionary";
import type { Lang } from "../lib/i18n";
import { CONTENT_PATH, REPO_URL } from "../lib/site";

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
        href={`${REPO_URL}/new/main/${CONTENT_PATH}/${from}/${section}/${slug.join("/")}.mdx`}
      >
        {dict["fallback.contribute"]}
      </Anchor>
    </Alert>
  );
}
