import { describe, expect, it } from "vite-plus/test";

import { formatLength } from "./format-length";

describe("formatLength", () => {
  it.each([
    [{ amount: 1.5, unit: "rem" }, "1.5rem"],
    [{ amount: 0, unit: null }, "0"],
  ] as const)("writes %j as %j", (length, expected) => {
    expect(formatLength(length)).toBe(expected);
  });
});
