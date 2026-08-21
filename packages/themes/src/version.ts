/**
 * La version que declara `meta.version` en todos los temas del paquete.
 *
 * Estaba escrita tres veces —las dos bases y `BuildProduct`— y se quedo en `0.1.0` cuando el paquete
 * salio a `1.0.0`, asi que los dieciseis temas mentian sobre su propia version. Vive aqui sola para
 * que subirla sea una linea, y `version.test.ts` falla si se separa de la del `package.json`.
 */
export const THEME_VERSION = "1.1.3";
