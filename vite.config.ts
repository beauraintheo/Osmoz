import { existsSync } from "node:fs";
import { join } from "node:path";

import { defineConfig } from "vite-plus";

import { APPS_DIR, listApps } from "./packages/scripts/src/list-apps.ts";

const APP_THEME_FILE = "src/theme/theme.css";

const appClassSorting = listApps(APPS_DIR)
  .filter((app) => existsSync(join(APPS_DIR, app, APP_THEME_FILE)))
  .map((app) => ({
    files: [`apps/${app}/**`],
    options: {
      sortTailwindcss: {
        functions: ["cn"],
        stylesheet: `./apps/${app}/${APP_THEME_FILE}`,
      },
    },
  }));

const ignorePatterns = [
  "**/node_modules/**",
  "**/dist/**",
  "**/coverage/**",
  "storybook-static/**",
  "**/*.gen.ts",
  "**/CHANGELOG.md",
  "**/.claude/settings.local.json",
  ".claude/skills/**",
  ".claude/agents/**",
  ".impeccable/**",
];

const SORT_OPTIONS = { partitionByNewLine: true, type: "alphabetical" } as const;

export default defineConfig({
  fmt: {
    ignorePatterns,
    overrides: appClassSorting,
    printWidth: 100,
    semi: true,
    singleQuote: false,
    sortImports: {
      groups: [
        "builtin",
        "external",
        "internal",
        ["parent", "sibling", "index"],
        "style",
        "unknown",
      ],
      internalPattern: ["@/"],
      newlinesBetween: true,
    },
    sortPackageJson: true,
    sortTailwindcss: {
      functions: ["cn"],
    },
  },
  lint: {
    categories: {
      correctness: "error",
    },
    env: {
      builtin: true,
    },
    ignorePatterns,
    jsPlugins: ["@stylistic/eslint-plugin", "eslint-plugin-perfectionist"],
    options: {
      typeAware: true,
      typeCheck: false,
    },
    overrides: [
      {
        files: [
          "*.config.ts",
          "*.config.js",
          "*.config.mjs",
          "*.cjs",
          "**/*.stories.tsx",
          ".storybook/*.ts",
          ".storybook/*.tsx",
        ],
        rules: {
          "import/no-default-export": "off",
        },
      },
      {
        files: ["**/index.ts", "**/index.tsx", "**/index.js", "**/index.mts"],
        rules: {
          "import/no-named-export": "error",
        },
      },
    ],
    plugins: ["typescript", "unicorn", "oxc", "import", "promise", "react"],
    rules: {
      "typescript/consistent-type-assertions": ["error", { assertionStyle: "never" }],
      "typescript/consistent-type-imports": "error",
      "typescript/explicit-function-return-type": "error",
      "typescript/no-explicit-any": "error",
      "typescript/no-floating-promises": "error",
      "typescript/no-non-null-assertion": "error",
      "typescript/prefer-nullish-coalescing": "error",
      "typescript/switch-exhaustiveness-check": "error",

      "import/no-cycle": "error",
      "import/no-default-export": "error",
      "oxc/no-barrel-file": ["error", { threshold: 0 }],

      "func-style": ["error", "expression"],
      "no-param-reassign": ["error", { props: true }],
      "no-var": "error",
      "prefer-const": "error",
      "unicorn/no-array-for-each": "error",

      "react/jsx-no-literals": [
        "error",
        {
          ignoreProps: true,
          noStrings: true,
          restrictedAttributes: [
            "aria-label",
            "aria-description",
            "alt",
            "title",
            "placeholder",
            "label",
          ],
        },
      ],

      "no-console": ["error", { allow: ["warn", "error"] }],
      "unicorn/filename-case": ["error", { case: "kebabCase" }],

      "@stylistic/object-curly-newline": [
        "error",
        {
          ObjectExpression: {
            consistent: true,
            minProperties: 3,
            multiline: true,
          },
          ObjectPattern: { consistent: true, multiline: true },
        },
      ],

      "perfectionist/sort-enums": ["error", SORT_OPTIONS],
      "perfectionist/sort-interfaces": ["error", SORT_OPTIONS],
      "perfectionist/sort-jsx-props": ["error", SORT_OPTIONS],
      "perfectionist/sort-object-types": ["error", SORT_OPTIONS],
      "perfectionist/sort-objects": ["error", SORT_OPTIONS],
    },
  },
  staged: {
    "*.{js,ts,jsx,tsx,json,jsonc,css,md}": "vp check --fix",
  },
});
