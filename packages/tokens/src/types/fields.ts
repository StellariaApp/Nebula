/**
 * Contrato duck-typed de forms (ADR-005): lo que Nebula necesita leer/escribir
 * de un campo. `@stellaria/nebula-hooks/useFieldProps` lo conecta con form-atoms
 * v3 cuando está instalado (peer opcional) — el core nunca importa form-atoms.
 */

export type FieldStatus = "idle" | "validating" | "valid" | "invalid";

export interface NebulaField<T> {
  value: T;
  setValue: (value: T) => void;
  status: FieldStatus;
  error?: string | undefined;
  touched: boolean;
}
