export type FieldStatus = "idle" | "validating" | "valid" | "invalid";

export interface DateRange {
  start: string;
  end: string;
}

export interface NebulaField<T> {
  value: T;
  setValue: (value: T) => void;
  status: FieldStatus;
  error?: string | undefined;
  touched: boolean;
}
