import { describe, expect, it } from "vite-plus/test";

import { ITEM_PROPERTIES } from "./item-properties";

describe("ITEM_PROPERTIES", () => {
  it("starts every property at its browser default", () => {
    expect(
      Object.fromEntries(
        Object.entries(ITEM_PROPERTIES).map(([name, { initial }]) => [name, initial]),
      ),
    ).toEqual({
      "align-self": "auto",
      content: "",
      "flex-basis": "auto",
      "flex-grow": 0,
      "flex-shrink": 1,
      "font-size": "inherit",
      height: "auto",
      order: 0,
      width: "auto",
    });
  });

  it("bounds order to whole numbers from -99 to 99", () => {
    expect(ITEM_PROPERTIES.order.range).toEqual({
      max: 99,
      min: -99,
      step: 1,
    });
  });

  it.each(["flex-grow", "flex-shrink"] as const)(
    "bounds %s from 0 to 99, to one decimal",
    (name) => {
      expect(ITEM_PROPERTIES[name].range).toEqual({
        max: 99,
        min: 0,
        step: 0.1,
      });
    },
  );

  it("limits the content to 40 characters", () => {
    expect(ITEM_PROPERTIES.content.maxCharacters).toBe(40);
  });

  it("bounds the font size from 8 to 48 px", () => {
    expect(ITEM_PROPERTIES["font-size"].range).toEqual({
      max: 48,
      min: 8,
      step: 1,
    });
  });

  it("accepts content as a flex-basis keyword, not as a width", () => {
    expect([
      ITEM_PROPERTIES["flex-basis"].safeParse("content").success,
      ITEM_PROPERTIES.width.safeParse("content").success,
    ]).toEqual([true, false]);
  });
});
