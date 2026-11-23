import { describe, expect, it } from "vite-plus/test";

import { fitNumber, rangedNumber } from "./number-range";

const RANGE = {
  max: 99,
  min: -99,
  step: 0.1,
};

describe("rangedNumber", () => {
  it.each([-99, 0, 0.3, 1.1, 99])("accepts %d", (value) => {
    expect(rangedNumber(RANGE).safeParse(value).success).toBe(true);
  });

  it.each([-99.1, 99.1, 0.15])("rejects %d", (value) => {
    expect(rangedNumber(RANGE).safeParse(value).success).toBe(false);
  });
});

describe("fitNumber", () => {
  it.each([
    [120, 99],
    [-120, -99],
    [1.15, 1.2],
    [1.25, 1.3],
    [-0.04, 0],
  ])("fits %d to %d", (value, expected) => {
    expect(fitNumber(value, RANGE)).toBe(expected);
  });

  it("gives a value the schema of the same range accepts", () => {
    expect(rangedNumber(RANGE).safeParse(fitNumber(12.34, RANGE)).success).toBe(true);
  });

  it("gives a value the schema rejects when the input is not a number", () => {
    expect(rangedNumber(RANGE).safeParse(fitNumber(Number.NaN, RANGE)).success).toBe(false);
  });
});
