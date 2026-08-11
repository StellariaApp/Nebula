import { Anchor, Badge, Box, Card, Code, Table, Text, Title } from "@stellaria/nebula-web";
import type { ReactElement } from "react";

import { ByFamily, CATALOG, ComponentSlug, FamilySlug } from "../lib/catalog";
import { Dict } from "../lib/dictionary";
import { CurrentLang } from "../lib/lang";
import { SectionHref } from "../lib/sections";
import { PageHeader } from "./page-header";

const ROOT_SUBPATH = "@stellaria/nebula-web";

const SECTION = "components";

export async function CatalogIndex(): Promise<ReactElement> {
  const dict = await Dict(await CurrentLang(), "chrome");
  const families = ByFamily();

  return (
    <Box display="flex" direction="column">
      <PageHeader
        title={dict["section.components"]}
        description={dict["catalog.lede"]}
        aside={
          <Badge variant="light" size="lg">
            {CATALOG.count} {dict["catalog.count"]}
          </Badge>
        }
      />

      <Box display="flex" direction="column" gap="lg">
        {families.map(({ family, components }) => {
          const slug = FamilySlug(family);
          return (
            <Box key={family} component="section" id={slug} aria-labelledby={`${slug}-title`}>
              <Card withBorder r="lg" padding="none">
                <Box
                  display="flex"
                  align="center"
                  justify="space-between"
                  gap="sm"
                  px="md"
                  py="sm"
                  bdbw={1}
                  bdbs="solid"
                  bdc="border.subtle"
                >
                  <Title id={`${slug}-title`} order={2} fz="h6" c="text.primary">
                    {family}
                  </Title>
                  <Badge variant="light" size="sm">
                    {components.length}
                  </Badge>
                </Box>

                <Table.ScrollContainer minWidth={560}>
                  <Table>
                    <Table.Head>
                      <Table.Row>
                        <Table.Title>{dict["section.components"]}</Table.Title>
                        <Table.Title>{dict["catalog.subpath"]}</Table.Title>
                        <Table.Title>RSC</Table.Title>
                        <Table.Title numeric>{dict["catalog.budget"]}</Table.Title>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {components.map((entry) => (
                        <Table.Row key={entry.name}>
                          <Table.Cell>
                            <Box display="flex" align="center" gap="xs" wrap="wrap">
                              <Anchor
                                href={SectionHref(SECTION, ComponentSlug(entry.name))}
                                fz="body3"
                                fw="medium"
                              >
                                {entry.name}
                              </Anchor>
                              {entry.compound && (
                                <Badge variant="light" size="xs">
                                  {dict["catalog.compound"]}
                                </Badge>
                              )}
                            </Box>
                          </Table.Cell>
                          <Table.Cell>
                            <Code fz="caption">
                              {entry.subpath === "." ? ROOT_SUBPATH : entry.subpath}
                            </Code>
                          </Table.Cell>
                          <Table.Cell>
                            <Badge
                              variant="light"
                              size="xs"
                              color={entry.boundary === "server" ? "success" : "info"}
                            >
                              {dict[`catalog.boundary.${entry.boundary}`]}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell numeric>
                            <Text
                              fz="caption"
                              c={entry.budget === null ? "text.muted" : "text.secondary"}
                            >
                              {entry.budget ?? "—"}
                            </Text>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </Table.ScrollContainer>
              </Card>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
