import { describe, expect, it } from "vite-plus/test";

import { headScriptsPlugin } from "./head-scripts-plugin.ts";

const injectedTags = (scripts: readonly string[]): unknown => {
  const { transformIndexHtml } = headScriptsPlugin(scripts);

  return typeof transformIndexHtml === "function"
    ? Reflect.apply(transformIndexHtml, {}, [])
    : null;
};

describe("headScriptsPlugin", () => {
  it("injects each script inline at the end of the head, in order", () => {
    expect(injectedTags(["first()", "second()"])).toEqual([
      { tag: "script", children: "first()", injectTo: "head" },
      { tag: "script", children: "second()", injectTo: "head" },
    ]);
  });

  it("injects nothing without scripts", () => {
    expect(injectedTags([])).toEqual([]);
  });
});
