export type FieldStatus = "idle" | "validating" | "valid" | "invalid";

export interface NebulaField<T> {
  value: T;
  setValue: (value: T) => void;
  status: FieldStatus;
  error?: string | undefined;
  touched: boolean;
}
