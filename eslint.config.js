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
        {
          selector: "function",
          format: ["PascalCase"],
          filter: { regex: "^[A-Z].{3,}$", match: true },
        },
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
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}", "**/*.config.ts"],
    ...tseslint.configs.disableTypeChecked,
  },
);
