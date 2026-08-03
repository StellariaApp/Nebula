import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { Button } from "../components/Button/Button.js";
import { Combobox } from "../components/Combobox/Combobox.js";
import { ContextMenu } from "../components/Menu/ContextMenu.js";
import { Menu } from "../components/Menu/Menu.js";
import { MultiSelect } from "../components/MultiSelect/MultiSelect.js";
import { Popover } from "../components/Popover/Popover.js";
import { Select } from "../components/Select/Select.js";
import { Tooltip } from "../components/Tooltip/Tooltip.js";
import { themeClass } from "../theme/themes.css.js";

import { cleanup, render, screen, waitFor } from "./render.js";

afterEach(cleanup);

const dark = themeClass["dark"];

const options = [
  { value: "mx", label: "México" },
  { value: "co", label: "Colombia" },
];

async function ExpectScoped(text: string): Promise<void> {
  await waitFor(() => {
    expect(screen.getAllByText(text).length).toBeGreaterThan(0);
  });
  const scoped = screen.getAllByText(text).some((node) => node.closest(`.${dark}`) !== null);
  expect(scoped).toBe(true);
}

describe("alcance del tema en contenido portalizado", () => {
  it("Popover", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<Button>abrir</Button>}>
        <span>contenido portalizado</span>
      </Popover>,
    );
    await user.click(screen.getByRole("button", { name: "abrir" }));
    await ExpectScoped("contenido portalizado");
  });

  it("Tooltip", async () => {
    const user = userEvent.setup();
    render(<Tooltip label="ayuda portalizada" trigger={<Button>señalar</Button>} delay={0} />);
    await user.hover(screen.getByRole("button", { name: "señalar" }));
    await ExpectScoped("ayuda portalizada");
  });

  it("Menu", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger={<Button>acciones</Button>}
        items={[{ key: "dup", label: "Duplicar" }]}
        aria-label="Acciones"
      />,
    );
    await user.click(screen.getByRole("button", { name: "acciones" }));
    await ExpectScoped("Duplicar");
  });

  it("ContextMenu", async () => {
    render(
      <ContextMenu items={[{ key: "dup", label: "Duplicar" }]} aria-label="Acciones">
        <div>zona</div>
      </ContextMenu>,
    );
    const zone = screen.getByText("zona");
    zone.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true }));
    await ExpectScoped("Duplicar");
  });

  it("Select", async () => {
    const user = userEvent.setup();
    render(<Select label="País" data={options} />);
    await user.click(screen.getByRole("button", { name: /País/ }));
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Colombia" })).toBeDefined();
    });
    expect(screen.getByRole("option", { name: "Colombia" }).closest(`.${dark}`)).not.toBeNull();
  });

  it("Combobox", async () => {
    const user = userEvent.setup();
    render(<Combobox label="País" data={options} />);
    await user.click(screen.getByRole("button"));
    await ExpectScoped("Colombia");
  });

  it("MultiSelect", async () => {
    const user = userEvent.setup();
    render(<MultiSelect label="Países" data={options} />);
    await user.click(screen.getByRole("button"));
    await ExpectScoped("Colombia");
  });
});
