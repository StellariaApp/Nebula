import { describe, expect, it } from "vitest";

import {
  EmptyRange,
  FormatDate,
  FormatDateTime,
  FormatMonth,
  FormatTime,
  FormatYear,
  IsEmptyRange,
  ParseDate,
  ParseDateTime,
  ParseMonth,
  ParseTime,
  ParseYear,
  TodayDate,
} from "../date.js";

describe("puente ISO ↔ DateValue", () => {
  it("hace round-trip de fecha, hora y fecha-hora", () => {
    expect(FormatDate(ParseDate("2026-07-29"))).toBe("2026-07-29");
    expect(FormatTime(ParseTime("14:30"))).toBe("14:30");
    expect(FormatTime(ParseTime("14:30:45"), true)).toBe("14:30:45");
    expect(FormatDateTime(ParseDateTime("2026-07-29T14:30"))).toBe("2026-07-29T14:30");
    expect(FormatMonth(ParseMonth("2026-07"))).toBe("2026-07");
    expect(FormatYear(ParseYear("2026"))).toBe("2026");
  });

  it("devuelve null ante entrada malformada en vez de lanzar", () => {
    const dirty = ["29/07/2026", "2026-7-9", "", "   ", "not-a-date", "2026-13-45"];
    for (const value of dirty) {
      expect(ParseDate(value)).toBeNull();
    }
    expect(ParseTime("25:99")).toBeNull();
    expect(ParseDateTime("2026-07-29")).toBeNull();
    expect(ParseMonth("2026")).toBeNull();
    expect(ParseYear("26")).toBeNull();
  });

  it("trata null y undefined como vacío en ambos sentidos", () => {
    expect(ParseDate(null)).toBeNull();
    expect(ParseDate(undefined)).toBeNull();
    expect(FormatDate(null)).toBe("");
    expect(FormatDate(undefined)).toBe("");
    expect(FormatTime(null)).toBe("");
    expect(FormatYear(Number.NaN)).toBe("");
  });

  it("no desplaza el día por zona horaria", () => {
    const parsed = ParseDate("2026-01-01");
    expect(parsed?.day).toBe(1);
    expect(parsed?.month).toBe(1);
    expect(parsed?.year).toBe(2026);
  });

  it("rellena a la izquierda los años y meses de un dígito", () => {
    expect(FormatDate(ParseDate("0999-01-02"))).toBe("0999-01-02");
    expect(FormatYear(5)).toBe("0005");
  });

  it("expone el día de hoy como CalendarDate local", () => {
    const now = TodayDate();
    expect(FormatDate(now)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("reconoce el rango vacío", () => {
    expect(IsEmptyRange(EmptyRange())).toBe(true);
    expect(IsEmptyRange({ start: "2026-07-01", end: "2026-07-31" })).toBe(false);
    expect(IsEmptyRange(null)).toBe(true);
  });
});
