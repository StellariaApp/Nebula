import type { ReactElement } from "react";

export const CALENDAR_ICON: ReactElement = (
  <svg
    viewBox="0 0 24 24"
    width="1.1em"
    height="1.1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

export const CLOCK_ICON: ReactElement = (
  <svg
    viewBox="0 0 24 24"
    width="1.1em"
    height="1.1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
