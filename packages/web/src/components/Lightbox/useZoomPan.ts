import { useCallback, useMemo, useRef, useState } from "react";

export interface ZoomPanState {
  scale: number;
  x: number;
  y: number;
}

export interface ZoomPan {
  state: ZoomPanState;
  zoomed: boolean;
  panning: boolean;
  ZoomBy: (delta: number) => void;
  ZoomTo: (scale: number) => void;
  Reset: () => void;
  Toggle: () => void;
  PanBy: (dx: number, dy: number) => void;
  StartPan: (x: number, y: number) => void;
  MovePan: (x: number, y: number) => void;
  EndPan: () => void;
}

const MIN_SCALE = 1;
const ZOOM_STEP = 0.5;
const PAN_STEP = 40;
const TOGGLE_SCALE = 2;
const REST: ZoomPanState = { scale: MIN_SCALE, x: 0, y: 0 };

function Clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** El desplazamiento útil crece con el zoom: a escala 1 no hay nada que arrastrar. */
function ClampOffset(value: number, scale: number): number {
  const reach = (scale - MIN_SCALE) * 400;
  return Clamp(value, -reach, reach);
}

export function useZoomPan(maxScale: number): ZoomPan {
  const [state, set_state] = useState<ZoomPanState>(REST);
  const [panning, set_panning] = useState(false);
  const origin = useRef<{ x: number; y: number } | null>(null);

  const ZoomTo = useCallback(
    (scale: number): void => {
      set_state((current) => {
        const next = Clamp(scale, MIN_SCALE, maxScale);
        if (next === MIN_SCALE) return REST;
        return { scale: next, x: ClampOffset(current.x, next), y: ClampOffset(current.y, next) };
      });
    },
    [maxScale],
  );

  const ZoomBy = useCallback(
    (delta: number): void => {
      set_state((current) => {
        const next = Clamp(current.scale + delta, MIN_SCALE, maxScale);
        if (next === MIN_SCALE) return REST;
        return { scale: next, x: ClampOffset(current.x, next), y: ClampOffset(current.y, next) };
      });
    },
    [maxScale],
  );

  const Reset = useCallback((): void => {
    set_state(REST);
    set_panning(false);
    origin.current = null;
  }, []);

  const Toggle = useCallback((): void => {
    set_state((current) =>
      current.scale > MIN_SCALE
        ? REST
        : { scale: Clamp(TOGGLE_SCALE, MIN_SCALE, maxScale), x: 0, y: 0 },
    );
  }, [maxScale]);

  const PanBy = useCallback((dx: number, dy: number): void => {
    set_state((current) => {
      if (current.scale === MIN_SCALE) return current;
      return {
        scale: current.scale,
        x: ClampOffset(current.x + dx, current.scale),
        y: ClampOffset(current.y + dy, current.scale),
      };
    });
  }, []);

  const StartPan = useCallback((x: number, y: number): void => {
    origin.current = { x, y };
    set_panning(true);
  }, []);

  const MovePan = useCallback(
    (x: number, y: number): void => {
      const from = origin.current;
      if (from === null) return;
      origin.current = { x, y };
      PanBy(x - from.x, y - from.y);
    },
    [PanBy],
  );

  const EndPan = useCallback((): void => {
    origin.current = null;
    set_panning(false);
  }, []);

  return useMemo(
    () => ({
      state,
      zoomed: state.scale > MIN_SCALE,
      panning,
      ZoomBy,
      ZoomTo,
      Reset,
      Toggle,
      PanBy,
      StartPan,
      MovePan,
      EndPan,
    }),
    [state, panning, ZoomBy, ZoomTo, Reset, Toggle, PanBy, StartPan, MovePan, EndPan],
  );
}

export const ZOOM_CONSTANTS = { MIN_SCALE, ZOOM_STEP, PAN_STEP, TOGGLE_SCALE };
