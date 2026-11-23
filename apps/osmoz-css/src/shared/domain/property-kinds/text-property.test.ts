import { describe, expect, it } from "vite-plus/test";

import { textProperty } from "./text-property";

describe("textProperty", () => {
  const property = textProperty({ initial: "", maxCharacters: 3 });

  it("gives its initial value when none is given", () => {
    expect(property.parse(undefined)).toBe("");
  });

  it("keeps its description", () => {
    expect(property).toMatchObject({
      initial: "",
      kind: "text",
      maxCharacters: 3,
    });
  });

  it.each(["", "abc"])("accepts %j", (value) => {
    expect(property.safeParse(value).success).toBe(true);
  });

  it("rejects a text longer than its limit", () => {
    expect(property.safeParse("abcd").success).toBe(false);
  });
});
