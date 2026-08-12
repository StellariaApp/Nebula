import { Badge, Box, Card, Code, CodeHighlight, Table, Text, Title } from "@stellaria/nebula-web";
import type { ReactElement, ReactNode } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { FindApi, type ApiProp } from "../lib/api";
import { type CatalogEntry } from "../lib/catalog";
import { ReadDoc } from "../lib/content";
import { Dict, type Dictionary } from "../lib/dictionary";
import { CurrentLang } from "../lib/lang";
import { FindPreview } from "../previews";
import { ComponentSlug } from "../lib/catalog";
import { FindSurface } from "../surfaces";
import { MDX_COMPONENTS } from "./mdx";
import { PageHeader } from "./page-header";

const ROOT_SUBPATH = "@stellaria/nebula-web";

const SECTION = "components";

function Anchored({
  id,
  title,
  count,
  children,
}: {
  id: string;
  title: string;
  count?: number | undefined;
  children: ReactNode;
}): ReactElement {
  return (
    <Box component="section" id={id} aria-labelledby={`${id}-title`} mt="xxl">
      <Box display="flex" align="center" gap="sm" mb="sm">
        <Title id={`${id}-title`} order={2} fz="h5" c="text.primary">
          {title}
        </Title>
        {count === undefined ? null : (
          <Badge variant="light" size="sm">
            {count}
          </Badge>
        )}
      </Box>
      {children}
    </Box>
  );
}

/** El escenario de la muestra: superficie propia para que el componente no flote sobre la página. */
function Stage({ children }: { children: ReactNode }): ReactElement {
  return (
    <Card withBorder r="lg" padding="lg">
      <Box display="flex" gap="lg" wrap="wrap" align="flex-end">
        {children}
      </Box>
    </Card>
  );
}

function Props({ rows, dict }: { rows: readonly ApiProp[]; dict: Dictionary }): ReactElement {
  return (
    <Card withBorder r="lg" padding="none">
      <Table.ScrollContainer minWidth={640}>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Title>{dict["api.prop"]}</Table.Title>
              <Table.Title>{dict["api.type"]}</Table.Title>
              <Table.Title>{dict["api.default"]}</Table.Title>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {rows.map((prop) => (
              <Table.Row key={prop.name}>
                <Table.Cell>
                  <Box display="flex" direction="column" gap="xxs">
                    <Box display="flex" align="center" gap="xs" wrap="wrap">
                      <Text fz="body3" fw="medium" c="text.primary">
                        {prop.name}
                      </Text>
                      {prop.required && (
                        <Badge variant="light" color="warning" size="xs">
                          {dict["api.required"]}
                        </Badge>
                      )}
                    </Box>
                    {prop.doc === null ? null : (
                      <Text fz="caption" c="text.secondary" maw="60ch">
                        {prop.doc}
                      </Text>
                    )}
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Code fz="caption">{prop.type}</Code>
                </Table.Cell>
                <Table.Cell>
                  {prop.default === null ? (
                    <Text fz="caption" c="text.muted">
                      —
                    </Text>
                  ) : (
                    <Code fz="caption">{prop.default}</Code>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Table.ScrollContainer>
    </Card>
  );
}

export async function ComponentPage({ entry }: { entry: CatalogEntry }): Promise<ReactElement> {
  const lang = await CurrentLang();
  const dict = await Dict(lang, "chrome");
  const api = FindApi(entry.name);
  const preview = FindPreview(entry.name);
  const surface = FindSurface(entry.name);
  const doc = await ReadDoc(lang, SECTION, [ComponentSlug(entry.name)]);

  const prose =
    doc === null
      ? null
      : (
          await compileMDX({
            source: doc.body,
            components: MDX_COMPONENTS,
            options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
          })
        ).content;

  return (
    <Box display="flex" direction="column" w="100%" maw={1180} mx="auto" data-pagefind-body>
      <PageHeader
        title={entry.name}
        eyebrow={entry.family}
        description={doc?.front.summary}
        aside={
          <Box display="flex" align="center" gap="xs" wrap="wrap">
            <Badge variant="light" color={entry.boundary === "server" ? "success" : "info"}>
              {dict[`catalog.boundary.${entry.boundary}`]}
            </Badge>
            {entry.budget === null ? null : (
              <Badge variant="light" size="sm">
                {entry.budget}
              </Badge>
            )}
          </Box>
        }
      />

      <Box display="flex" align="center" gap="sm" wrap="wrap">
        <Code fz="caption">{entry.subpath === "." ? ROOT_SUBPATH : entry.subpath}</Code>
        {api === undefined ? null : <Code fz="caption">{api.contract}</Code>}
      </Box>

      {surface === undefined ? null : (
        <Anchored id="preview" title={dict["api.preview"] ?? ""}>
          <Card withBorder r="lg" padding="none" overflow="hidden">
            <Box
              component="iframe"
              src={`/preview/${ComponentSlug(entry.name)}`}
              title={`${entry.name} preview`}
              w="100%"
              h={surface.height}
              display="block"
              bdw={0}
            />
          </Card>
        </Anchored>
      )}

      {preview === undefined ? null : (
        <>
          <Anchored id="preview" title={dict["api.preview"] ?? ""}>
            <Stage>{preview.base}</Stage>
          </Anchored>

          {preview.groups === undefined ? null : (
            <Anchored id="variants" title={dict["api.variants"] ?? ""}>
              <Box display="flex" direction="column" gap="md">
                {preview.groups.map((group) => (
                  <Box key={group.title} display="flex" direction="column" gap="xs">
                    <Text fz="caption" c="text.muted" tt="uppercase" ls="wide" fw="semibold">
                      {group.title}
                    </Text>
                    <Stage>
                      {group.items.map((item) => (
                        <Box
                          key={item.label}
                          display="flex"
                          direction="column"
                          gap="xs"
                          align="flex-start"
                        >
                          {item.node}
                          <Text fz="caption" c="text.muted">
                            {item.label}
                          </Text>
                        </Box>
                      ))}
                    </Stage>
                  </Box>
                ))}
              </Box>
            </Anchored>
          )}

          {preview.usage === undefined ? null : (
            <Anchored id="usage" title={dict["api.usage"] ?? ""}>
              <Box display="flex" direction="column" gap="md">
                <Stage>{preview.usage.node}</Stage>
                <CodeHighlight
                  code={preview.usage.code}
                  lang="tsx"
                  variant="glass"
                  withCopy
                  r="lg"
                />
              </Box>
            </Anchored>
          )}
        </>
      )}

      {prose === null ? null : (
        <Box display="flex" direction="column" gap="md" mt="lg">
          {prose}
        </Box>
      )}

      {api === undefined || api.own.length === 0 ? null : (
        <Anchored id="props" title={dict["api.props"] ?? ""} count={api.own.length}>
          <Props rows={api.own} dict={dict} />
        </Anchored>
      )}

      {api === undefined || api.slots.length === 0 ? null : (
        <Anchored id="slots" title={dict["api.slots"] ?? ""} count={api.slots.length}>
          <Box display="flex" direction="column" gap="sm">
            <Text fz="body3" c="text.secondary" maw="72ch">
              {dict["api.slots.lede"]}
            </Text>
            <Props rows={api.slots} dict={dict} />
          </Box>
        </Anchored>
      )}

      {entry.parts.length === 0 ? null : (
        <Anchored id="parts" title={dict["api.parts"] ?? ""} count={entry.parts.length}>
          <Box display="flex" gap="xs" wrap="wrap">
            {entry.parts.map((part) => (
              <Code key={part} fz="caption">
                {part}
              </Code>
            ))}
          </Box>
        </Anchored>
      )}

      {api === undefined || api.inherited.length === 0 ? null : (
        <Anchored id="inherited" title={dict["api.inherited"] ?? ""}>
          <Box display="flex" direction="column" gap="sm">
            <Text fz="body3" c="text.secondary" maw="72ch">
              {dict["api.inherited.lede"]}
            </Text>
            <Box display="flex" gap="xs" wrap="wrap">
              {api.inherited.map((group) => (
                <Badge key={group.group} variant="light" size="sm">
                  {dict[`api.group.${group.group}`] ?? group.group} · {group.count}
                </Badge>
              ))}
            </Box>
          </Box>
        </Anchored>
      )}
    </Box>
  );
}
