import { describe, expect, it } from "vite-plus/test";

import { keywordProperty } from "./keyword-property";

describe("keywordProperty", () => {
  const property = keywordProperty({ initial: "row", values: ["row", "column"] });

  it("gives its initial value when none is given", () => {
    expect(property.parse(undefined)).toBe("row");
  });

  it("keeps its description", () => {
    expect(property).toMatchObject({
      initial: "row",
      kind: "keyword",
      values: ["row", "column"],
    });
  });

  it("accepts each of its values", () => {
    expect(property.parse("column")).toBe("column");
  });

  it("rejects any other value", () => {
    expect(property.safeParse("grid").success).toBe(false);
  });
});
