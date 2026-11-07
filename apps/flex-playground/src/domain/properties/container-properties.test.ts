import { describe, expect, it } from "vite-plus/test";

import { CONTAINER_PROPERTIES } from "./container-properties";

describe("CONTAINER_PROPERTIES", () => {
  it("starts every property at its browser default", () => {
    expect(
      Object.fromEntries(
        Object.entries(CONTAINER_PROPERTIES).map(([name, { initial }]) => [name, initial]),
      ),
    ).toEqual({
      "align-content": "normal",
      "align-items": "normal",
      "column-gap": 0,
      display: "flex",
      "flex-direction": "row",
      "flex-wrap": "nowrap",
      "justify-content": "normal",
      "row-gap": 0,
    });
  });

  it.each(["row-gap", "column-gap"] as const)("bounds %s from 0 to 48 px", (name) => {
    expect(CONTAINER_PROPERTIES[name].range).toEqual({
      max: 48,
      min: 0,
      step: 1,
    });
  });
});
