/** El eje que comparten la barra y el grid del carril (ADR-126): si cambia uno, cambia el otro. */
export const SHELL_WIDTH = 1440;

export const NAV_HEIGHT = 64;

/** Alto de la banda de pestañas, el segundo peldaño bajo la barra. */
export const BAND_HEIGHT = 56;

/**
 * Lo que el cromado fijo tapa por arriba. El shell arranca debajo de la barra —en y=0— para que el
 * contenido pase por detrás del cristal al scrollear, así que cada scroller reserva este hueco.
 */
export const CHROME_HEIGHT = NAV_HEIGHT + BAND_HEIGHT;
