import { describe, expect, it } from "vite-plus/test";

import { hiddenTools } from "./hidden-tools";

describe("hiddenTools", () => {
  it("hides every tool of Storybook and its addons", () => {
    expect(hiddenTools(["zoom", "storybook/viewport/tool"])).toEqual({
      "storybook/viewport/tool": { hidden: true },
      zoom: { hidden: true },
    });
  });

  it("keeps the tools of Osmoz", () => {
    expect(hiddenTools(["osmoz/theme/tool", "zoom"])).toEqual({ zoom: { hidden: true } });
  });
});
