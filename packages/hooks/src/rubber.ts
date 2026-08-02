export const RUBBER_LIMIT = 0.3;

function Resist(distance: number, limit: number): number {
  if (limit <= 0) return 0;
  return (limit * distance) / (limit + distance);
}

export function Rubber(position: number, min: number, max: number, limit?: number): number {
  const span = Math.max(0, max - min);
  const cap = limit ?? span * RUBBER_LIMIT;
  if (position < min) return min - Resist(min - position, cap);
  if (position > max) return max + Resist(position - max, cap);
  return position;
}

export function RubberOffset(distance: number, limit: number): number {
  return Resist(Math.abs(distance), limit) * Math.sign(distance);
}
