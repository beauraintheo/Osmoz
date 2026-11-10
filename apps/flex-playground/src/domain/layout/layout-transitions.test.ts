import { describe, expect, it } from "vite-plus/test";

import { createItem, INITIAL_LAYOUT_STATE } from "./initial-layout-state";
import { layoutStateSchema, type LayoutState } from "./layout-state";
import {
  addItem,
  duplicateItem,
  removeItem,
  resetContainerProperty,
  resetItemProperty,
  resetLayout,
  resizeContainer,
  restoreLayout,
  setContainerProperty,
  setItemProperty,
} from "./layout-transitions";

const STATE = INITIAL_LAYOUT_STATE;

const ids = (state: LayoutState): number[] => state.items.map(({ id }) => id);

const fullState = (): LayoutState =>
  Array.from({ length: 9 }).reduce<LayoutState>((state) => addItem(state), STATE);

describe("setContainerProperty", () => {
  it("changes the property", () => {
    expect(setContainerProperty(STATE, "flex-direction", "column").container).toMatchObject({
      "flex-direction": "column",
    });
  });

  it.each([
    [60, 48],
    [-4, 0],
    [12.4, 12],
  ])("fits a gap of %d to %d", (value, expected) => {
    expect(setContainerProperty(STATE, "row-gap", value).container["row-gap"]).toBe(expected);
  });

  it("leaves the given state as it was", () => {
    setContainerProperty(STATE, "display", "inline-flex");

    expect(STATE.container.display).toBe("flex");
  });

  it("keeps the last valid value when the new one is not a number", () => {
    expect(setContainerProperty(STATE, "row-gap", Number.NaN)).toBe(STATE);
  });

  it("does nothing for the value already set", () => {
    expect(setContainerProperty(STATE, "row-gap", 0)).toBe(STATE);
  });

  it("does nothing for a value that fits to the one already set", () => {
    expect(setContainerProperty(STATE, "row-gap", -4)).toBe(STATE);
  });
});

describe("resetContainerProperty", () => {
  it("brings the property back to its default", () => {
    const changed = setContainerProperty(STATE, "flex-wrap", "wrap");

    expect(resetContainerProperty(changed, "flex-wrap").container["flex-wrap"]).toBe("nowrap");
  });

  it("does nothing for a property already at its default", () => {
    expect(resetContainerProperty(STATE, "flex-wrap")).toBe(STATE);
  });
});

describe("setItemProperty", () => {
  it("changes only the given item", () => {
    const next = setItemProperty(STATE, 2, "order", 5);

    expect(next.items.map(({ order }) => order)).toEqual([0, 5, 0]);
  });

  it.each([
    ["flex-grow", 1.15, 1.2],
    ["order", -0.4, 0],
    ["flex-grow", 1.25, 1.3],
    ["flex-grow", 120, 99],
    ["order", -150, -99],
    ["font-size", 4, 8],
  ] as const)("fits %s set to %d to %d", (name, value, expected) => {
    expect(setItemProperty(STATE, 1, name, value).items[0]?.[name]).toBe(expected);
  });

  it("keeps the last valid value when the new one is invalid", () => {
    expect(setItemProperty(STATE, 1, "width", "10")).toBe(STATE);
  });

  it("does nothing for an unknown id", () => {
    expect(setItemProperty(STATE, 99, "order", 5)).toBe(STATE);
  });

  it("does nothing for the value already set", () => {
    expect(setItemProperty(STATE, 1, "order", 0)).toBe(STATE);
  });

  it("keeps a keyword of a number or keyword property", () => {
    const changed = setItemProperty(STATE, 1, "font-size", 16);

    expect(setItemProperty(changed, 1, "font-size", "inherit").items[0]?.["font-size"]).toBe(
      "inherit",
    );
  });
});

describe("resetItemProperty", () => {
  it("brings the property back to its default", () => {
    const changed = setItemProperty(STATE, 1, "flex-basis", "10px");

    expect(resetItemProperty(changed, 1, "flex-basis").items[0]?.["flex-basis"]).toBe("auto");
  });

  it("does nothing for an unknown id", () => {
    expect(resetItemProperty(STATE, 99, "flex-basis")).toBe(STATE);
  });

  it("does nothing for a property already at its default", () => {
    expect(resetItemProperty(STATE, 1, "flex-basis")).toBe(STATE);
  });
});

describe("resizeContainer", () => {
  it("sets the size within its bounds", () => {
    expect(resizeContainer(STATE, { height: 1000, width: 50 }).container.size).toEqual({
      height: 900,
      width: 120,
    });
  });

  it("keeps the last valid size when the new one is not a number", () => {
    expect(resizeContainer(STATE, { height: Number.NaN, width: 400 })).toBe(STATE);
  });

  it("changes the width alone", () => {
    expect(resizeContainer(STATE, { height: 300, width: 400 }).container.size).toEqual({
      height: 300,
      width: 400,
    });
  });

  it("does nothing for the size already set", () => {
    expect(resizeContainer(STATE, { height: 300, width: 600 })).toBe(STATE);
  });

  it("does nothing past a bound already reached", () => {
    const clamped = resizeContainer(STATE, { height: 1000, width: 2000 });

    expect(resizeContainer(clamped, { height: 1100, width: 3000 })).toBe(clamped);
  });
});

describe("addItem", () => {
  it("adds an item at its default with the next id", () => {
    const next = addItem(STATE);

    expect(next.items.at(-1)).toEqual(createItem(4));
    expect(next.nextId).toBe(5);
  });

  it("adds nothing past 12 items", () => {
    const full = fullState();

    expect(addItem(full)).toBe(full);
  });
});

describe("duplicateItem", () => {
  it("inserts a copy with a new id right after its source", () => {
    const changed = setItemProperty(STATE, 1, "order", 3);
    const next = duplicateItem(changed, 1);

    expect(ids(next)).toEqual([1, 4, 2, 3]);
    expect(next.items[1]?.order).toBe(3);
  });

  it("does nothing past 12 items", () => {
    const full = fullState();

    expect(duplicateItem(full, 1)).toBe(full);
  });

  it("does nothing for an unknown id", () => {
    expect(duplicateItem(STATE, 99)).toBe(STATE);
  });
});

describe("removeItem", () => {
  it("removes the item", () => {
    expect(ids(removeItem(STATE, 2))).toEqual([1, 3]);
  });

  it("does nothing for an unknown id", () => {
    expect(removeItem(STATE, 99)).toBe(STATE);
  });

  it("never gives a removed id again", () => {
    expect(ids(addItem(removeItem(STATE, 3)))).toEqual([1, 2, 4]);
  });

  it("can remove every item", () => {
    expect(removeItem(removeItem(removeItem(STATE, 1), 2), 3).items).toEqual([]);
  });
});

describe("restoreLayout", () => {
  it("brings an older state back without giving an id again", () => {
    const restored = restoreLayout(addItem(STATE), STATE);

    expect(ids(restored)).toEqual([1, 2, 3]);
    expect(ids(addItem(restored))).toEqual([1, 2, 3, 5]);
  });

  it("gives a valid state when an undone change comes back", () => {
    const added = addItem(STATE);
    const redone = restoreLayout(restoreLayout(added, STATE), added);

    expect(ids(redone)).toEqual([1, 2, 3, 4]);
    expect(layoutStateSchema.safeParse(redone).success).toBe(true);
  });
});

describe("resetLayout", () => {
  it("brings back 3 default items with new ids", () => {
    const changed = setContainerProperty(removeItem(STATE, 1), "display", "inline-flex");
    const next = resetLayout(changed);

    expect(next.container).toEqual(STATE.container);
    expect(ids(next)).toEqual([4, 5, 6]);
    expect(next.nextId).toBe(7);
  });

  it("gives a state the schema accepts", () => {
    expect(layoutStateSchema.safeParse(resetLayout(STATE)).success).toBe(true);
  });
});
