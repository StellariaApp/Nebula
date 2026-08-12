import { Badge, Box, Text, Title } from "@stellaria/nebula-web";
import type { ReactElement, ReactNode } from "react";

export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode | undefined;
  /** El rótulo pequeño sobre el título: la categoría, el estado, la cifra. */
  eyebrow?: ReactNode | undefined;
  /** Va a la derecha del título en pantallas anchas. */
  aside?: ReactNode | undefined;
}

export function PageHeader({ title, description, eyebrow, aside }: PageHeaderProps): ReactElement {
  return (
    <Box
      component="header"
      display="flex"
      direction="column"
      gap="sm"
      pb="lg"
      mb="lg"
      bdbw={1}
      bdbs="solid"
      bdc="border.subtle"
    >
      {eyebrow === undefined ? null : (
        <Box display="flex" data-pagefind-ignore="all">
          <Badge variant="light">{eyebrow}</Badge>
        </Box>
      )}
      <Box display="flex" align="baseline" justify="space-between" gap="md" wrap="wrap">
        <Title order={1} fz="h1" c="text.primary">
          {title}
        </Title>
        <Box display="flex" data-pagefind-ignore="all">
          {aside}
        </Box>
      </Box>
      {description === undefined ? null : (
        <Text fz="body1" c="text.secondary" maw="62ch" data-pagefind-meta="summary">
          {description}
        </Text>
      )}
    </Box>
  );
}
