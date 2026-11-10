import { describe, expect, it } from "vite-plus/test";

import { numberOrKeywordProperty } from "./number-or-keyword-property";

describe("numberOrKeywordProperty", () => {
  const property = numberOrKeywordProperty({
    initial: "inherit",
    keywords: ["inherit"],
    max: 48,
    min: 8,
    step: 1,
  });

  it("gives its initial value when none is given", () => {
    expect(property.parse(undefined)).toBe("inherit");
  });

  it("keeps its description", () => {
    expect(property).toMatchObject({
      initial: "inherit",
      keywords: ["inherit"],
      kind: "number-or-keyword",
      range: {
        max: 48,
        min: 8,
        step: 1,
      },
    });
  });

  it.each(["inherit", 8, 16, 48])("accepts %j", (value) => {
    expect(property.safeParse(value).success).toBe(true);
  });

  it.each(["auto", 7, 49, 12.5])("rejects %j", (value) => {
    expect(property.safeParse(value).success).toBe(false);
  });
});
