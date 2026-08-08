import { Box, Text, Title } from "@stellaria/nebula-web";

import { Dict } from "../lib/dictionary";
import type { Lang } from "../lib/i18n";

export async function Reserved({ lang, heading }: { lang: Lang; heading: string }) {
  const dict = await Dict(lang, "chrome");

  return (
    <Box display="flex" direction="column" gap="xs" maw={640}>
      <Title order={1} c="text.primary">
        {dict[heading]}
      </Title>
      <Text c="text.secondary">{dict["reserved.title"]}</Text>
      <Text c="text.muted" fz="body3">
        {dict["reserved.body"]}
      </Text>
    </Box>
  );
}
