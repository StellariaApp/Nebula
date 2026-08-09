import { Badge, Box, Divider, Table, Text, Title } from "@stellaria/nebula-web";

import { ByFamily, CATALOG } from "../../../../lib/catalog";
import { Dict } from "../../../../lib/dictionary";
import { AsLang } from "../../../../lib/i18n";

export default async function Components({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = AsLang(raw);
  const dict = await Dict(lang, "chrome");

  return (
    <Box display="flex" direction="column" gap="lg">
      <Box>
        <Title order={1} c="text.primary">
          {dict["nav.components"]}
        </Title>
        <Text c="text.muted" fz="body3">
          {CATALOG.count} {dict["catalog.count"]}
        </Text>
      </Box>

      {ByFamily().map(({ family, components }) => (
        <Box key={family} display="flex" direction="column" gap="xs">
          <Title order={2} fz="h5" c="text.primary">
            {family}
          </Title>
          <Table>
            <thead>
              <tr>
                <th>{dict["nav.components"]}</th>
                <th>{dict["catalog.subpath"]}</th>
                <th>RSC</th>
                <th>{dict["catalog.budget"]}</th>
              </tr>
            </thead>
            <tbody>
              {components.map((entry) => (
                <tr key={entry.name}>
                  <td>
                    <Text fz="body3">{entry.name}</Text>
                    {entry.compound && (
                      <Badge variant="light" size="xs" ml="xs">
                        {dict["catalog.compound"]}
                      </Badge>
                    )}
                  </td>
                  <td>
                    <Text fz="caption" c="text.muted">
                      {entry.subpath === "." ? "@stellaria/nebula-web" : entry.subpath}
                    </Text>
                  </td>
                  <td>
                    <Text fz="caption" c="text.muted">
                      {dict[`catalog.boundary.${entry.boundary}`]}
                    </Text>
                  </td>
                  <td>
                    <Text fz="caption" c="text.muted">
                      {entry.budget ?? "—"}
                    </Text>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Divider />
        </Box>
      ))}
    </Box>
  );
}
