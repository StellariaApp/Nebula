import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "../../../__tests__/render.js";
import { Countdown } from "../Countdown.js";
import { COUNTDOWN_LABELS } from "../labels.js";
import { SplitRemaining } from "../useCountdown.js";

afterEach(cleanup);

const HOUR = 3600 * 1000;

describe("SplitRemaining", () => {
  it("descompone el tiempo restante", () => {
    const total = 25 * HOUR + 61 * 1000;
    expect(SplitRemaining(total)).toStrictEqual({
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
      total,
    });
  });

  it("no devuelve negativos", () => {
    expect(SplitRemaining(-5000)).toStrictEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      total: 0,
    });
  });
});

describe("Countdown", () => {
  it("se anuncia como temporizador", () => {
    render(<Countdown to={new Date(Date.now() + 2 * HOUR).toISOString()} />);
    expect(screen.getByRole("timer")).toBeDefined();
  });

  it("da el tiempo restante en texto para el lector de pantalla", () => {
    render(<Countdown to={new Date(Date.now() + 2 * HOUR).toISOString()} />);
    expect(screen.getByRole("timer").textContent).toMatch(/left/);
  });

  it("muestra el mensaje de fin cuando la fecha ya pasó", () => {
    render(<Countdown to={new Date(Date.now() - HOUR).toISOString()} />);
    const timer = screen.getByRole("timer");
    expect(timer.getAttribute("data-finished")).toBe("true");
    expect(timer.textContent).toContain(COUNTDOWN_LABELS.finished);
  });

  it("acepta un contenido propio de fin", () => {
    render(<Countdown to={new Date(Date.now() - HOUR).toISOString()} finished="Se acabó" />);
    expect(screen.getByText("Se acabó")).toBeDefined();
  });

  it("avisa una sola vez al completarse", () => {
    const on_complete = vi.fn();
    render(<Countdown to={new Date(Date.now() - 1).toISOString()} onComplete={on_complete} />);
    expect(on_complete).toHaveBeenCalledTimes(1);
  });

  it("puede prescindir de días y segundos", () => {
    render(
      <Countdown
        to={new Date(Date.now() + 2 * HOUR).toISOString()}
        withDays={false}
        withSeconds={false}
        data-testid="cd"
      />,
    );
    const units = screen.getByTestId("cd").querySelectorAll("[aria-hidden='true']");
    expect(units).toHaveLength(2);
  });

  it("aguanta una fecha inválida sin romper", () => {
    render(<Countdown to="no-es-una-fecha" />);
    expect(screen.getByRole("timer").getAttribute("data-finished")).toBe("true");
  });
});
