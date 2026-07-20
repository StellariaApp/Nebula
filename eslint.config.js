import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/.turbo/**",
      "**/storybook-static/**",
      "**/.expo/**",
      "**/.next/**",
      "spike/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
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
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "function",
          filter: { regex: "^use[A-Z]", match: true },
          format: ["camelCase"],
        },
        { selector: "function", format: ["PascalCase"] },
        {
          selector: "variable",
          modifiers: ["const", "global"],
          format: ["UPPER_CASE", "PascalCase", "camelCase"],
        },
        {
          selector: "variable",
          modifiers: ["destructured"],
          format: null,
        },
        { selector: "variable", format: ["snake_case", "PascalCase", "UPPER_CASE"] },
        { selector: "parameter", format: null },
        { selector: "typeLike", format: ["PascalCase"] },
        { selector: ["objectLiteralProperty", "typeProperty"], format: null },
        { selector: "import", format: null },
      ],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}", "**/*.config.ts"],
    ...tseslint.configs.disableTypeChecked,
  },
);
