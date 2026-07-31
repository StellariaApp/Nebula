const NEEDS_QUOTES = /["\n\r]/;
const FORMULA = /^[=+\-@\t\r]/;

/**
 * Neutraliza la inyección de fórmulas: una celda que empieza por `=`, `+`, `-` o `@` la ejecuta Excel
 * al abrir el fichero. Se antepone un apóstrofo, que es la convención de la hoja de cálculo para
 * «esto es texto».
 */
function Escape(value: string, delimiter: string): string {
  const safe = FORMULA.test(value) ? `'${value}` : value;
  const quoted = safe.replace(/"/g, '""');
  return NEEDS_QUOTES.test(safe) || safe.includes(delimiter) ? `"${quoted}"` : quoted;
}

export function ToCsv(
  headers: readonly string[],
  rows: readonly (readonly string[])[],
  delimiter = ",",
): string {
  const lines = [headers, ...rows].map((row) =>
    row.map((cell) => Escape(cell, delimiter)).join(delimiter),
  );
  return lines.join("\r\n");
}

export function DownloadCsv(csv: string, filename: string): void {
  if (typeof document === "undefined") return;
  const BOM = "﻿";
  const blob = new Blob([`${BOM}${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
