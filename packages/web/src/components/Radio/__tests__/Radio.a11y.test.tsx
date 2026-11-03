import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ExpectNoViolations } from "../../../__tests__/axe.js";
import { cleanup, render, screen } from "../../../__tests__/render.js";

import { RadioGroup } from "../Group.js";
import { Radio } from "../Radio.js";

afterEach(cleanup);

function Plans(props: { onChange?: (value: string) => void; error?: string }): React.ReactElement {
  return (
    <RadioGroup
      label="Plan"
      defaultValue="pro"
      {...(props.onChange === undefined ? {} : { onChange: props.onChange })}
      {...(props.error === undefined ? {} : { error: props.error })}
    >
      <Radio value="free" label="Gratis" />
      <Radio value="pro" label="Pro" />
      <Radio value="team" label="Equipo" disabled />
      <Radio value="biz" label="Empresa" />
    </RadioGroup>
  );
}

describe("Radio · accesibilidad", () => {
  it("grupo normal y con error: sin violaciones de axe", async () => {
    const { container } = render(
      <>
        <Plans />
        <Plans error="Elige un plan" />
      </>,
    );
    await ExpectNoViolations(container);
  });

  it("el grupo es un radiogroup con nombre y expone la selección", () => {
    render(<Plans />);
    expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeDefined();
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveProperty("checked", true);
  });

  it("solo la opción elegida está en el orden de Tab", async () => {
    const user = userEvent.setup();
    render(<Plans />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("radio", { name: "Pro" }));
  });

  it("las flechas mueven la selección y se saltan la opción deshabilitada", async () => {
    const user = userEvent.setup();
    const on_change = vi.fn();
    render(<Plans onChange={on_change} />);
    await user.tab();
    await user.keyboard("{ArrowDown}");
    expect(on_change).toHaveBeenLastCalledWith("biz");
    await user.keyboard("{ArrowUp}");
    expect(on_change).toHaveBeenLastCalledWith("pro");
  });
});
