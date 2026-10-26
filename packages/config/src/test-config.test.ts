import { describe, expect, it } from "vite-plus/test";

import { testConfig } from "./test-config.ts";

describe("testConfig", () => {
  it("runs only .ts test files", () => {
    expect(testConfig.include).toEqual(["src/**/*.test.ts"]);
  });

  it("measures coverage on .ts sources, without tests, declarations or generated code", () => {
    expect(testConfig.coverage).toMatchObject({
      exclude: ["src/**/*.test.ts", "src/**/*.d.ts", "src/**/*.gen.ts"],
      include: ["src/**/*.ts"],
    });
  });

  it("requires 100% coverage", () => {
    expect(testConfig.coverage).toMatchObject({
      thresholds: { branches: 100, functions: 100, lines: 100, statements: 100 },
    });
  });
});
