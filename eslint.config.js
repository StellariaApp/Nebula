import js from "@eslint/js";
import tseslint from "typescript-eslint";

// ADR-019 §1: el formato de las constantes de módulo cambia según el archivo.
// `global` son las declaradas en el ámbito del módulo; `local`, las de dentro de
// una función. El resto de selectores es idéntico en todos los ámbitos.
const NamingConvention = (global, local, extra = []) => [
  "error",
  ...extra,
  {
    selector: "function",
    filter: { regex: "^use[A-Z]", match: true },
    format: ["camelCase"],
  },
  {
    selector: "function",
    format: ["PascalCase"],
    filter: { regex: "^[A-Z].{3,}$", match: true },
  },
  { selector: "variable", modifiers: ["const", "global"], format: global },
  { selector: "variable", modifiers: ["destructured"], format: null },
  { selector: "variable", format: local },
  { selector: "parameter", format: null },
  { selector: "typeLike", format: ["PascalCase"] },
  { selector: ["objectLiteralProperty", "typeProperty"], format: null },
  { selector: "import", format: null },
];

// ADR-119: los componentes cuyo `radius` es una lista corta deliberada sobre la
// raíz. Son once, no los cuatro que censó el ADR, y los siete que faltaban se
// escapaban por dos vías que su búsqueda no cubría: `Chip`, `ColorSwatch`,
// `ScrollProgress`, `Tag` y `ThemeIcon` aplican su lista con un mapa de
// `styleVariants` en vez de una variante de `recipe`; `Drawer` y `StatusBadge`
// la reenvían a `Modal` y a `Badge`.
//
// Los otros cinco que lo declaraban —EditorImage, Image, ImageGallery, Progress
// y Skeleton— ya no existen como caso: perdieron `radius` en la enmienda de
// ADR-119, y lo que llegaba a un elemento interior va ahora por su ranura.
const SHORT_LIST_RADIUS = [
  "Avatar",
  "Badge",
  "Chip",
  "ColorSwatch",
  "Drawer",
  "Modal",
  "Popover",
  "ScrollProgress",
  "StatusBadge",
  "Tag",
  "ThemeIcon",
];

const RestrictedRadius = `JSXOpeningElement[name.name=/^(${SHORT_LIST_RADIUS.join("|")})$/] > JSXAttribute[name.name="r"]`;

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/.turbo/**",
      "**/storybook-static/**",
      "**/.expo/**",
      "**/.next/**",
      "**/public/pagefind/**",
      "spike/**",
      "packages/web/styles.css.d.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    // Los guiones de `scripts/` y `tools/` corren en Node, no en el navegador: sin esto
    // `console`, `fetch` y `process` salen como `no-undef` y obligan a escribir un CLI mudo.
    files: ["scripts/**/*.{mjs,js,ts}", "tools/**/*.{mjs,js,ts}", "**/scripts/**/*.{mjs,js,ts}"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        fetch: "readonly",
        URL: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
      },
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // ADR-019: hooks camelCase · funciones PascalCase · constantes globales
      // UPPERCASE · constantes locales snake_case.
      "@typescript-eslint/naming-convention": NamingConvention(
        ["UPPER_CASE", "snake_case", "PascalCase", "camelCase"],
        ["snake_case", "PascalCase", "UPPER_CASE"],
      ),
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          // ADR-119: el radio lo manda la style prop `r`, salvo en estos once,
          // que restringen a propósito su lista de radios. Pero los once
          // extienden `StyleProps`, así que `r` se cuela y gana: la lista corta
          // no restringía nada. Esto la hace real sin capar `r` en los tipos,
          // que sería la excepción contraria a lo que ADR-119 decidió.
          selector: RestrictedRadius,
          message: `Usa \`radius\` en ${SHORT_LIST_RADIUS.join(", ")}: su lista de radios es corta a propósito (ADR-119). \`r\` la saltaría.`,
        },
      ],
    },
  },
  {
    // ADR-094 (N0): una hoja solo declara asas de clase, que son constantes
    // locales del módulo → snake_case. Las tablas de constantes siguen en
    // UPPER_CASE.
    //
    // El selector de tipo función admite las dos formas porque el tipo no las
    // separa: `recipe()` devuelve una función y es un asa (snake_case), y una
    // auxiliar como `Track(step)` es una función de verdad (PascalCase,
    // ADR-019 §1). Sin este selector, la auxiliar no tendría forma válida.
    files: ["**/*.css.ts"],
    rules: {
      "@typescript-eslint/naming-convention": NamingConvention(
        ["snake_case", "UPPER_CASE"],
        ["snake_case", "UPPER_CASE"],
        [
          {
            selector: "variable",
            modifiers: ["const", "global"],
            types: ["function"],
            format: ["snake_case", "PascalCase"],
          },
        ],
      ),
    },
  },
  {
    // ADR-094 (N0): una var nombra la propiedad CSS que gobierna, y esa se
    // escribe camelCase en CSS-in-JS. Este bloque va DESPUÉS del anterior
    // porque *.vars.css.ts también casa con **/*.css.ts.
    files: ["**/*.vars.css.ts"],
    rules: {
      "@typescript-eslint/naming-convention": NamingConvention(
        ["camelCase", "UPPER_CASE"],
        ["camelCase", "UPPER_CASE"],
      ),
    },
  },
  {
    // ADR-094 (N0): `themeClass` sale en el barrel de @stellaria/nebula-web.
    // Los símbolos exportados del paquete conservan su nombre — son contrato,
    // no asas de clase.
    files: ["packages/web/src/theme/themes.css.ts"],
    rules: {
      "@typescript-eslint/naming-convention": NamingConvention(
        ["camelCase", "snake_case", "UPPER_CASE"],
        ["snake_case", "UPPER_CASE"],
      ),
    },
  },
  {
    // ADR-056: `NebulaPermissions` es un punto de extensión por declaration
    // merging. Tiene que estar vacía — una propiedad propia chocaría con la que
    // declara la app al aumentar la interfaz.
    files: ["packages/tokens/src/types/permissions.ts"],
    rules: { "@typescript-eslint/no-empty-object-type": "off" },
  },
  {
    files: ["**/*.{js,mjs,cjs}", "**/*.config.ts"],
    ...tseslint.configs.disableTypeChecked,
  },
);
