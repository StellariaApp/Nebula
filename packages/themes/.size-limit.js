/**
 * Presupuestos de `@stellaria/nebula-themes` (ADR-168).
 *
 * Los que NO llevan `/web` son datos puros y es lo unico que `packages/native` importa: si alguno
 * empieza a crecer de golpe, lo mas probable es que Vanilla Extract se haya colado donde no debe.
 *
 * `/all/web` compila los 10 temas al importarse. Pesa mas que uno solo pero mucho menos que diez:
 * comparten los 627 nombres de propiedad y se deduplican entre si.
 */
export default [
  {
    name: "datos: el par por defecto y el registro (lo unico que ve native)",
    path: "dist/index.js",
    import: "{ Dark, Light, Themes }",
    limit: "42 kB",
  },
  {
    name: "datos: un solo tema (subpath /<tema>)",
    path: "dist/themes/aurora/index.js",
    import: "{ aurora }",
    limit: "30 kB",
  },
  {
    name: "web: el contrato y su runtime (subpath /web)",
    path: "dist/web/index.js",
    import: "{ vars, CompileTheme, ResolveVariant }",
    limit: "22 kB",
  },
  {
    name: "web: un tema materializado (subpath /<tema>/web)",
    path: "dist/themes/aurora/web.js",
    import: "{ CLASSES, CSS }",
    limit: "40 kB",
  },
  {
    name: "web: los diez materializados (subpath /all/web)",
    path: "dist/themes/all-web.js",
    import: "{ CLASSES, CSS }",
    limit: "120 kB",
  },
];
