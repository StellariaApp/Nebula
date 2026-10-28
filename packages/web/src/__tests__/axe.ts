import axe from "axe-core";
import { expect } from "vitest";

export async function ExpectNoViolations(container: Element = document.body): Promise<void> {
  const results = await axe.run(container, {
    rules: { "color-contrast": { enabled: false }, region: { enabled: false } },
  });
  const found = results.violations.map((violation) => ({
    id: violation.id,
    nodes: violation.nodes.map((node) => node.html),
  }));
  expect(found).toEqual([]);
}
