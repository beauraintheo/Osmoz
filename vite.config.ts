import { defineConfig } from "vite-plus";

import { APPS_DIR, listApps } from "./packages/scripts/src/list-apps.ts";

const APP_THEME_FILE = "src/theme/theme.css";

const appClassSorting = listApps(APPS_DIR).map((app) => ({
  files: [`apps/${app}/**`],
  options: {
    sortTailwindcss: {
      stylesheet: `./apps/${app}/${APP_THEME_FILE}`,
      functions: ["cn"],
    },
  },
}));

const ignorePatterns = [
  "**/node_modules/**",
  "**/dist/**",
  "**/coverage/**",
  "**/*.gen.ts",
  "**/CHANGELOG.md",
  "**/.claude/settings.local.json",
  ".claude/skills/**",
  ".claude/agents/**",
  ".impeccable/**",
];

export default defineConfig({
  lint: {
    plugins: ["typescript", "unicorn", "oxc", "import", "promise"],
    categories: {
      correctness: "error",
    },
    env: {
      builtin: true,
    },
    ignorePatterns,
    options: {
      typeAware: true,
      typeCheck: false,
    },
    rules: {
      "typescript/no-explicit-any": "error",
      "typescript/no-non-null-assertion": "error",
      "typescript/consistent-type-assertions": ["error", { assertionStyle: "never" }],
      "typescript/explicit-function-return-type": "error",
      "typescript/consistent-type-imports": "error",
      "typescript/no-floating-promises": "error",
      "typescript/switch-exhaustiveness-check": "error",
      "typescript/prefer-nullish-coalescing": "error",
      "import/no-default-export": "error",
      "import/no-cycle": "error",
      "oxc/no-barrel-file": ["error", { threshold: 0 }],
      "unicorn/filename-case": ["error", { case: "kebabCase" }],
      "unicorn/no-array-for-each": "error",
      "func-style": ["error", "expression"],
      "prefer-const": "error",
      "no-var": "error",
      "no-param-reassign": ["error", { props: true }],
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
    overrides: [
      {
        files: ["*.config.ts", "*.config.js", "*.config.mjs", "*.cjs"],
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
  },
  fmt: {
    ignorePatterns,
    singleQuote: false,
    semi: true,
    sortPackageJson: true,
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
    sortTailwindcss: {
      functions: ["cn"],
    },
    overrides: appClassSorting,
  },
  staged: {
    "*.{js,ts,jsx,tsx,json,jsonc,css,md}": "vp check --fix",
  },
});
