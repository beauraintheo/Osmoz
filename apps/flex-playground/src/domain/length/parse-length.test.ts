import { describe, expect, it } from "vite-plus/test";

import { parseLength } from "./parse-length";

describe("parseLength", () => {
  it.each([
    ["10px", 10, "px"],
    ["50%", 50, "%"],
    ["1.5rem", 1.5, "rem"],
    ["2em", 2, "em"],
    ["20ch", 20, "ch"],
    ["10vw", 10, "vw"],
    ["10vh", 10, "vh"],
    ["0px", 0, "px"],
    ["007px", 7, "px"],
    ["  10px  ", 10, "px"],
    ["0", 0, null],
    [" 0 ", 0, null],
  ])("reads %j as %d %s", (input, amount, unit) => {
    expect(parseLength(input)).toEqual({ ok: true, value: { amount, unit } });
  });

  it.each([
    ["", "empty"],
    ["   ", "empty"],
    ["px", "invalid-number"],
    ["-4px", "invalid-number"],
    ["+4px", "invalid-number"],
    [".5em", "invalid-number"],
    ["1.px", "invalid-number"],
    ["10 px", "invalid-number"],
    ["1,5rem", "invalid-number"],
    [`1${"0".repeat(21)}px`, "invalid-number"],
    [`1${"0".repeat(309)}px`, "invalid-number"],
    ["0.0000001px", "invalid-number"],
    ["10", "missing-unit"],
    ["0.0", "missing-unit"],
    ["10pt", "unknown-unit"],
    ["10PX", "unknown-unit"],
  ])("rejects %j with %s", (input, error) => {
    expect(parseLength(input)).toEqual({ error, ok: false });
  });
});
