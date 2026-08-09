import { Badge, Box, Table, Text, Title } from "@stellaria/nebula-web";

import { ByFamily, CATALOG } from "../../../../lib/catalog";
import { Dict } from "../../../../lib/dictionary";
import { AsLang } from "../../../../lib/i18n";
import { PageHeader } from "../../../../ui/page-header";

export default async function Components({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = AsLang(raw);
  const dict = await Dict(lang, "chrome");
  const families = ByFamily();

  return (
    <Box display="flex" direction="column">
      <PageHeader
        title={dict["nav.components"]}
        description={dict["catalog.lede"]}
        aside={
          <Badge variant="light" size="lg">
            {CATALOG.count} {dict["catalog.count"]}
          </Badge>
        }
      />

      <Box display="flex" direction="column" gap="xl">
        {families.map(({ family, components }) => (
          <Box key={family} component="section" display="flex" direction="column" gap="sm">
            <Box display="flex" align="baseline" gap="sm">
              <Title order={2} fz="h4" c="text.primary">
                {family}
              </Title>
              <Text fz="caption" c="text.muted">
                {components.length}
              </Text>
            </Box>
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
          </Box>
        ))}
      </Box>
    </Box>
  );
}
