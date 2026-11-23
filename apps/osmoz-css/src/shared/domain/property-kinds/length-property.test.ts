import { describe, expect, it } from "vite-plus/test";

import { lengthProperty } from "./length-property";

describe("lengthProperty", () => {
  const property = lengthProperty({ initial: "auto", keywords: ["auto", "content"] });

  it("gives its initial value when none is given", () => {
    expect(property.parse(undefined)).toBe("auto");
  });

  it("keeps its description", () => {
    expect(property).toMatchObject({
      initial: "auto",
      keywords: ["auto", "content"],
      kind: "length",
    });
  });

  it.each(["auto", "content", "10px", "1.5rem", "0"])("accepts %j", (value) => {
    expect(property.safeParse(value).success).toBe(true);
  });

  it.each(["", "AUTO", "grid", "10", "10pt", " 10px ", "007px"])("rejects %j", (value) => {
    expect(property.safeParse(value).success).toBe(false);
  });
});
