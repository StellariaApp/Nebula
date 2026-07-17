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
      "spike/**"
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    // JS y configs TS (vite/vitest.config.ts) fuera del type-checked project:
    // no viven en ningún tsconfig `include` (rootDir: "src") y no se buildean.
    files: ["**/*.{js,mjs,cjs}", "**/*.config.ts"],
    ...tseslint.configs.disableTypeChecked
  }
);
