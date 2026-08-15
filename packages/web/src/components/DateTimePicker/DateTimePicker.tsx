import type { ReactElement } from "react";

import { DatePicker } from "../DatePicker/DatePicker.js";
import type { DatePickerProps } from "../DatePicker/DatePicker.types.js";

export type DateTimePickerProps = DatePickerProps;

export function DateTimePicker(props: DateTimePickerProps): ReactElement {
  const { granularity = "minute", ...rest } = props;
  return <DatePicker {...rest} granularity={granularity === "day" ? "minute" : granularity} />;
}

DateTimePicker.displayName = "DateTimePicker";
