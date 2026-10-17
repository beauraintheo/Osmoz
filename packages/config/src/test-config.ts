import type { TestUserConfig } from "vite-plus";

export const testConfig: TestUserConfig = {
  include: ["src/**/*.test.ts"],
  passWithNoTests: true,
  coverage: {
    provider: "v8",
    include: ["src/**/*.ts"],
    exclude: ["src/**/*.test.ts", "src/**/*.d.ts", "src/**/*.gen.ts"],
    thresholds: {
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,
    },
  },
};
