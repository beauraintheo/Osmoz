import { describe, expect, it } from "vite-plus/test";

import { sentenceCase } from "./sentence-case";

describe("sentenceCase", () => {
  it("keeps the first word and lowers the others", () => {
    expect(sentenceCase("Focusable When Disabled")).toBe("Focusable when disabled");
  });

  it("keeps an acronym", () => {
    expect(sentenceCase("With SVG props")).toBe("With SVG props");
  });

  it("lowers a one-letter word", () => {
    expect(sentenceCase("With A Label")).toBe("With a label");
  });
});
