import { z } from "zod";

import { CONTAINER_PROPERTIES } from "@/domain/properties/container-properties";
import { ITEM_PROPERTIES } from "@/domain/properties/item-properties";
import { numberProperty } from "@/domain/property-kinds/number-property";

export const MAX_ITEMS = 12;

export const CONTAINER_SIZE = {
  height: numberProperty({
    initial: 300,
    max: 900,
    min: 80,
    step: 1,
  }),
  width: numberProperty({
    initial: 600,
    max: 1200,
    min: 120,
    step: 1,
  }),
};

export const containerSchema = z.object({
  ...CONTAINER_PROPERTIES,
  size: z.object(CONTAINER_SIZE),
});

const idSchema = z.int().positive();

export const itemSchema = z.object({
  ...ITEM_PROPERTIES,
  id: idSchema,
});

export type Container = z.infer<typeof containerSchema>;
export type Item = z.infer<typeof itemSchema>;

const hasUniqueIds = (items: readonly Item[]): boolean =>
  new Set(items.map(({ id }) => id)).size === items.length;

export const layoutStateSchema = z
  .object({
    container: containerSchema,
    items: z.array(itemSchema).max(MAX_ITEMS).refine(hasUniqueIds),
    nextId: idSchema,
    version: z.literal(1),
  })
  .refine(({ items, nextId }) => items.every(({ id }) => id < nextId));

export type LayoutState = z.infer<typeof layoutStateSchema>;
