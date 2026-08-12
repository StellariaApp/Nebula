import { Code, Table } from "@stellaria/nebula-web";
import { States } from "./kit";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Table w={420}>
      <Table.Head>
        <Table.Row>
          <Table.Title>Component</Table.Title>
          <Table.Title numeric>Budget</Table.Title>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Button</Table.Cell>
          <Table.Cell numeric>42.25 kB</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Badge</Table.Cell>
          <Table.Cell numeric>25.5 kB</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
  groups: [
    States(
      {
        label: "striped",
        node: (
          <Table striped w={280}>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Button</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Badge</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Card</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        ),
      },
      {
        label: "withBorder",
        node: (
          <Table withBorder w={280}>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Button</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Badge</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        ),
      },
      {
        label: "density",
        node: (
          <Table density="compact" w={280}>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Button</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Badge</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        ),
      },
    ),
  ],
  usage: {
    code: `<Table.ScrollContainer minWidth={560}>
<Table highlightOnHover stickyHeader>
  <Table.Head>…</Table.Head>
  <Table.Body>…</Table.Body>
</Table>
</Table.ScrollContainer>`,
    node: (
      <Table.ScrollContainer minWidth={320}>
        <Table highlightOnHover w={420}>
          <Table.Head>
            <Table.Row>
              <Table.Title>Component</Table.Title>
              <Table.Title>Subpath</Table.Title>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Charts</Table.Cell>
              <Table.Cell>
                <Code fz="caption">/charts</Code>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>DataGrid</Table.Cell>
              <Table.Cell>
                <Code fz="caption">/datagrid</Code>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Table.ScrollContainer>
    ),
  },
};

export default preview;
