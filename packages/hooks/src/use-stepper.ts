import { useCallback, useMemo, useState } from "react";

export interface UseStepperInput {
  count: number;
  initialStep?: number;
  loop?: boolean;
  onChange?: (step: number) => void;
}

export interface UseStepperReturn {
  step: number;
  count: number;
  isFirst: boolean;
  isLast: boolean;
  next: () => void;
  previous: () => void;
  goTo: (step: number) => void;
  reset: () => void;
}

export function useStepper(input: UseStepperInput): UseStepperReturn {
  const { count, initialStep = 0, loop = false, onChange } = input;

  const [step, set_step] = useState(initialStep);

  const Clamp = useCallback(
    (next: number): number => {
      if (count <= 0) return 0;
      if (!loop) return Math.min(Math.max(next, 0), count - 1);
      return ((next % count) + count) % count;
    },
    [count, loop],
  );

  const GoTo = useCallback(
    (target: number): void => {
      set_step((current) => {
        const clamped = Clamp(target);
        if (clamped !== current) onChange?.(clamped);
        return clamped;
      });
    },
    [Clamp, onChange],
  );

  const Next = useCallback((): void => {
    set_step((current) => {
      const target = Clamp(current + 1);
      if (target !== current) onChange?.(target);
      return target;
    });
  }, [Clamp, onChange]);

  const Previous = useCallback((): void => {
    set_step((current) => {
      const target = Clamp(current - 1);
      if (target !== current) onChange?.(target);
      return target;
    });
  }, [Clamp, onChange]);

  const Reset = useCallback((): void => {
    GoTo(initialStep);
  }, [GoTo, initialStep]);

  return useMemo(
    () => ({
      step,
      count,
      isFirst: step <= 0,
      isLast: step >= count - 1,
      next: Next,
      previous: Previous,
      goTo: GoTo,
      reset: Reset,
    }),
    [step, count, Next, Previous, GoTo, Reset],
  );
}
