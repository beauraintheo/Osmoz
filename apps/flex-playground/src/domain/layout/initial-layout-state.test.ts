import { describe, expect, it } from "vite-plus/test";

import { createItem, INITIAL_LAYOUT_STATE } from "./initial-layout-state";
import { layoutStateSchema } from "./layout-state";

describe("createItem", () => {
  it("gives an item with the id at its defaults", () => {
    expect(createItem(7)).toMatchObject({
      content: "",
      "flex-shrink": 1,
      id: 7,
    });
  });
});

describe("INITIAL_LAYOUT_STATE", () => {
  it("starts with 3 items and the next id after them", () => {
    expect(INITIAL_LAYOUT_STATE.items.map(({ id }) => id)).toEqual([1, 2, 3]);
    expect(INITIAL_LAYOUT_STATE.nextId).toBe(4);
  });

  it("starts with a 600 × 300 px container at its defaults", () => {
    expect(INITIAL_LAYOUT_STATE.container).toMatchObject({
      display: "flex",
      size: {
        height: 300,
        width: 600,
      },
    });
  });

  it("is accepted by the schema", () => {
    expect(layoutStateSchema.parse(INITIAL_LAYOUT_STATE)).toEqual(INITIAL_LAYOUT_STATE);
  });
});
