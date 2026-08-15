/** El eje que comparten la barra y el grid del carril (ADR-126): si cambia uno, cambia el otro. */
export const SHELL_WIDTH = 1180;

/**
 * El alto natural de la barra con `size="md"` (`size.control.lg`). La landing no lo fija y se queda
 * en ese peldaño; guides lo fija porque la banda cuelga de él, así que tiene que valer lo mismo o
 * las dos barras del sitio no miden igual.
 */
export const NAV_HEIGHT = 64;

/** Alto de la banda de pestañas, el segundo peldaño bajo la barra. */
export const BAND_HEIGHT = 48;

/**
 * Lo que el cromado fijo tapa por arriba. El shell arranca debajo de la barra —en y=0— para que el
 * contenido pase por detrás del cristal al scrollear, así que cada scroller reserva este hueco.
 */
export const CHROME_HEIGHT = NAV_HEIGHT + BAND_HEIGHT;
