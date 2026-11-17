import { describe, expect, it } from "vite-plus/test";

import { SCREEN_MESSAGE, screenLintOverride } from "./screen-lint-override.ts";

const { files, rules } = screenLintOverride;

describe("screenLintOverride", () => {
  it("targets the screens of every app: routes and features", () => {
    expect(files).toEqual(["apps/*/src/routes/**/*.tsx", "apps/*/src/features/**/*.tsx"]);
  });

  it.each(["react/forbid-component-props", "react/forbid-dom-props"] as const)(
    "forbids className and style with %s",
    (rule) => {
      expect(rules[rule]).toEqual([
        "error",
        {
          forbid: [
            { message: SCREEN_MESSAGE, propName: "className" },
            { message: SCREEN_MESSAGE, propName: "style" },
          ],
        },
      ]);
    },
  );

  it("forbids layout and text elements", () => {
    const [severity, { forbid }] = rules["react/forbid-elements"];

    expect(severity).toBe("error");
    expect(forbid).toContainEqual({ element: "div", message: SCREEN_MESSAGE });
  });

  it("points every violation to a component", () => {
    expect(SCREEN_MESSAGE).toMatch(/components\/ui/);
  });
});
