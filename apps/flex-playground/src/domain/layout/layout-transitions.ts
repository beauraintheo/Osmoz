import { CONTAINER_PROPERTIES } from "@/domain/properties/container-properties";
import { ITEM_PROPERTIES } from "@/domain/properties/item-properties";
import { fitNumber } from "@/domain/property-kinds/number-range";

import { createItem, INITIAL_LAYOUT_STATE } from "./initial-layout-state";
import {
  CONTAINER_SIZE,
  containerSchema,
  itemSchema,
  MAX_ITEMS,
  type Container,
  type Item,
  type LayoutState,
} from "./layout-state";

type ContainerName = keyof typeof CONTAINER_PROPERTIES;
type ItemName = keyof typeof ITEM_PROPERTIES;
type Property = (typeof CONTAINER_PROPERTIES)[ContainerName] | (typeof ITEM_PROPERTIES)[ItemName];

const fitValue = (property: Property, value: unknown): unknown =>
  (property.kind === "number" || property.kind === "number-or-keyword") && typeof value === "number"
    ? fitNumber(value, property.range)
    : value;

const withContainer = (state: LayoutState, candidate: unknown): LayoutState => {
  const result = containerSchema.safeParse(candidate);

  return result.success ? { ...state, container: result.data } : state;
};

const withContainerValue = (
  state: LayoutState,
  name: ContainerName,
  value: unknown,
): LayoutState => {
  const fitted = fitValue(CONTAINER_PROPERTIES[name], value);

  return fitted === state.container[name]
    ? state
    : withContainer(state, {
        ...state.container,
        [name]: fitted,
      });
};

const withItemValue = (
  state: LayoutState,
  id: number,
  name: ItemName,
  value: unknown,
): LayoutState => {
  const target = state.items.find((item) => item.id === id);

  if (target === undefined) return state;

  const fitted = fitValue(ITEM_PROPERTIES[name], value);

  if (fitted === target[name]) return state;

  const result = itemSchema.safeParse({
    ...target,
    [name]: fitted,
  });

  if (!result.success) return state;

  return {
    ...state,
    items: state.items.map((item) => (item.id === id ? result.data : item)),
  };
};

export const setContainerProperty = <Name extends ContainerName>(
  state: LayoutState,
  name: Name,
  value: Container[Name],
): LayoutState => withContainerValue(state, name, value);

export const resetContainerProperty = (state: LayoutState, name: ContainerName): LayoutState =>
  withContainerValue(state, name, CONTAINER_PROPERTIES[name].initial);

export const setItemProperty = <Name extends ItemName>(
  state: LayoutState,
  id: number,
  name: Name,
  value: Item[Name],
): LayoutState => withItemValue(state, id, name, value);

export const resetItemProperty = (state: LayoutState, id: number, name: ItemName): LayoutState =>
  withItemValue(state, id, name, ITEM_PROPERTIES[name].initial);

export const resizeContainer = (state: LayoutState, size: Container["size"]): LayoutState => {
  const height = fitNumber(size.height, CONTAINER_SIZE.height.range);
  const width = fitNumber(size.width, CONTAINER_SIZE.width.range);
  const current = state.container.size;

  return height === current.height && width === current.width
    ? state
    : withContainer(state, {
        ...state.container,
        size: { height, width },
      });
};

export const addItem = (state: LayoutState): LayoutState =>
  state.items.length >= MAX_ITEMS
    ? state
    : {
        ...state,
        items: [...state.items, createItem(state.nextId)],
        nextId: state.nextId + 1,
      };

export const duplicateItem = (state: LayoutState, id: number): LayoutState =>
  state.items.length >= MAX_ITEMS || !state.items.some((item) => item.id === id)
    ? state
    : {
        ...state,
        items: state.items.flatMap((item) =>
          item.id === id ? [item, { ...item, id: state.nextId }] : [item],
        ),
        nextId: state.nextId + 1,
      };

export const removeItem = (state: LayoutState, id: number): LayoutState =>
  state.items.some((item) => item.id === id)
    ? {
        ...state,
        items: state.items.filter((item) => item.id !== id),
      }
    : state;

export const restoreLayout = (
  state: LayoutState,
  { container, items }: Pick<LayoutState, "container" | "items">,
): LayoutState => ({
  ...state,
  container,
  items,
});

export const resetLayout = ({ nextId }: LayoutState): LayoutState => ({
  ...INITIAL_LAYOUT_STATE,
  items: INITIAL_LAYOUT_STATE.items.map((_, index) => createItem(nextId + index)),
  nextId: nextId + INITIAL_LAYOUT_STATE.items.length,
});
