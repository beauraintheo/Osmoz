import type { TestUserConfig } from "vite-plus";

export const testConfig: TestUserConfig = {
  coverage: {
    exclude: ["src/**/*.test.ts", "src/**/*.d.ts", "src/**/*.gen.ts"],
    include: ["src/**/*.ts"],
    provider: "v8",
    thresholds: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  include: ["src/**/*.test.ts"],
  passWithNoTests: true,
};
