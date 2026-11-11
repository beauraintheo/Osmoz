import { sameAttributes } from "./read-attributes";
import type { Attribute } from "./read-attributes";

interface StoryRef {
  id: string;
  name: string;
}

export interface StoryReading {
  attributes: Attribute[];
  story: StoryRef;
}

export interface ExposedValue {
  stories: StoryRef[];
  value: string;
}

export interface ExposedAttribute {
  name: string;
  values: ExposedValue[];
}

const isExposed = (name: string): boolean =>
  name === "role" || name.startsWith("aria-") || name.startsWith("data-");

const unique = (items: string[]): string[] => [...new Set(items)];

export const exposedAttributes = (readings: readonly StoryReading[]): ExposedAttribute[] => {
  const pairs = readings.flatMap((reading) =>
    reading.attributes
      .filter(({ name }) => isExposed(name))
      .map(({ name, value }) => ({
        name,
        story: reading.story,
        value,
      })),
  );

  return unique(pairs.map(({ name }) => name))
    .toSorted((first, second) => first.localeCompare(second))
    .map((name) => {
      const named = pairs.filter((pair) => pair.name === name);

      return {
        name,
        values: unique(named.map(({ value }) => value)).map((value) => ({
          stories: named.filter((pair) => pair.value === value).map(({ story }) => story),
          value,
        })),
      };
    });
};

export const replaceReading = (
  readings: Readonly<Record<string, StoryReading>>,
  next: StoryReading,
): Readonly<Record<string, StoryReading>> => {
  const current = readings[next.story.id];

  if (current !== undefined && sameAttributes(current.attributes, next.attributes)) {
    return readings;
  }

  return { ...readings, [next.story.id]: next };
};
