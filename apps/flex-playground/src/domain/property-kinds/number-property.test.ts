import { describe, expect, it } from "vite-plus/test";

import { numberProperty } from "./number-property";

describe("numberProperty", () => {
  const property = numberProperty({
    initial: 1,
    max: 99,
    min: 0,
    step: 0.1,
  });

  it("gives its initial value when none is given", () => {
    expect(property.parse(undefined)).toBe(1);
  });

  it("keeps its description", () => {
    expect(property).toMatchObject({
      initial: 1,
      kind: "number",
      range: {
        max: 99,
        min: 0,
        step: 0.1,
      },
    });
  });

  it.each([0, 0.3, 1.1, 99])("accepts %d", (value) => {
    expect(property.safeParse(value).success).toBe(true);
  });

  it.each([-0.1, 99.1, 0.15])("rejects %d", (value) => {
    expect(property.safeParse(value).success).toBe(false);
  });
});
