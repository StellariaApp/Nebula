import type { PaginationItem } from "./Pagination.types.js";

function Range(start: number, end: number): number[] {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
}

export function PaginationRange(
  total: number,
  page: number,
  siblings: number,
  boundaries: number,
): PaginationItem[] {
  if (total <= 0) return [];

  const slots = siblings * 2 + boundaries * 2 + 3;
  if (slots >= total) return Range(1, total);

  const left = Math.max(page - siblings, boundaries + 2);
  const right = Math.min(page + siblings, total - boundaries - 1);

  const shows_left_dots = left > boundaries + 2;
  const shows_right_dots = right < total - boundaries - 1;

  if (!shows_left_dots && shows_right_dots) {
    return [
      ...Range(1, boundaries + siblings * 2 + 2),
      "dots-end",
      ...Range(total - boundaries + 1, total),
    ];
  }

  if (shows_left_dots && !shows_right_dots) {
    return [
      ...Range(1, boundaries),
      "dots-start",
      ...Range(total - (boundaries + siblings * 2 + 1), total),
    ];
  }

  return [
    ...Range(1, boundaries),
    "dots-start",
    ...Range(left, right),
    "dots-end",
    ...Range(total - boundaries + 1, total),
  ];
}
