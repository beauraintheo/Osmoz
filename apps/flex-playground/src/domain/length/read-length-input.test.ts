import { describe, expect, it } from "vite-plus/test";

import { readLengthInput } from "./read-length-input";

const KEYWORDS = ["auto", "content"];

describe("readLengthInput", () => {
  it.each([
    ["auto", "auto"],
    ["  AUTO ", "auto"],
    ["Content", "content"],
    ["10px", "10px"],
    [" 007px ", "7px"],
    ["1.50rem", "1.5rem"],
    ["0", "0"],
    [" 0 ", "0"],
    ["0px", "0px"],
  ])("reads %j as %j", (input, value) => {
    expect(readLengthInput(input, KEYWORDS)).toEqual({ ok: true, value });
  });

  it.each([
    ["", "empty"],
    ["   ", "empty"],
    ["-10px", "invalid-number"],
    ["10 px", "invalid-number"],
    [".5em", "invalid-number"],
    ["10", "missing-unit"],
    ["10pt", "unknown-unit"],
  ])("rejects %j with the error %s", (input, error) => {
    expect(readLengthInput(input, KEYWORDS)).toEqual({ error, ok: false });
  });

  it("rejects a keyword of another property", () => {
    expect(readLengthInput("content", ["auto"])).toEqual({ error: "invalid-number", ok: false });
  });
});
