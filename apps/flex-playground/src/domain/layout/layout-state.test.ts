import { describe, expect, it } from "vite-plus/test";

import { containerSchema, itemSchema, layoutStateSchema } from "./layout-state";

const STATE = {
  container: { size: {} },
  items: [{ id: 1 }, { id: 2 }],
  nextId: 3,
  version: 1,
};

describe("containerSchema", () => {
  it("fills a missing property with its default", () => {
    expect(containerSchema.parse({ size: {} })).toMatchObject({
      display: "flex",
      size: {
        height: 300,
        width: 600,
      },
    });
  });

  it.each([
    ["display", "grid"],
    ["row-gap", 49],
  ])("rejects %s set to %j", (name, value) => {
    expect(containerSchema.safeParse({ [name]: value, size: {} }).success).toBe(false);
  });

  it.each([[{ height: 79 }], [{ width: 1201 }]])("rejects a size of %j", (size) => {
    expect(containerSchema.safeParse({ size }).success).toBe(false);
  });
});

describe("itemSchema", () => {
  it("fills every property but the id with its default", () => {
    expect(itemSchema.parse({ id: 1 })).toMatchObject({
      "flex-shrink": 1,
      id: 1,
      order: 0,
    });
  });

  it.each([
    ["order", 1.5],
    ["flex-grow", -1],
    ["flex-basis", "10"],
    ["content", "x".repeat(41)],
  ])("rejects %s set to %j", (name, value) => {
    expect(itemSchema.safeParse({ id: 1, [name]: value }).success).toBe(false);
  });

  it("rejects an item without an id", () => {
    expect(itemSchema.safeParse({}).success).toBe(false);
  });
});

describe("layoutStateSchema", () => {
  it("accepts a valid state", () => {
    expect(layoutStateSchema.safeParse(STATE).success).toBe(true);
  });

  it("accepts a state without items", () => {
    expect(layoutStateSchema.safeParse({ ...STATE, items: [] }).success).toBe(true);
  });

  it("rejects an id that nextId could give again", () => {
    expect(layoutStateSchema.safeParse({ ...STATE, nextId: 2 }).success).toBe(false);
  });

  it("rejects two items with the same id", () => {
    expect(layoutStateSchema.safeParse({ ...STATE, items: [{ id: 1 }, { id: 1 }] }).success).toBe(
      false,
    );
  });

  it("rejects more than 12 items", () => {
    const items = Array.from({ length: 13 }, (_, index) => ({ id: index + 1 }));

    expect(
      layoutStateSchema.safeParse({
        ...STATE,
        items,
        nextId: 14,
      }).success,
    ).toBe(false);
  });

  it("rejects another version", () => {
    expect(layoutStateSchema.safeParse({ ...STATE, version: 2 }).success).toBe(false);
  });
});
