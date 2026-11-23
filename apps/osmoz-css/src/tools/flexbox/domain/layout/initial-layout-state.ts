import { containerSchema, itemSchema, type Item, type LayoutState } from "./layout-state";

export const createItem = (id: number): Item => itemSchema.parse({ id });

const INITIAL_ITEMS = [1, 2, 3].map(createItem);

export const INITIAL_LAYOUT_STATE: LayoutState = {
  container: containerSchema.parse({ size: {} }),
  items: INITIAL_ITEMS,
  nextId: INITIAL_ITEMS.length + 1,
  version: 1,
};
