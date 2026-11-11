import { z } from "zod/mini";

import { componentName } from "../docs-link";

const storyIndexSchema = z.object({
  entries: z.record(
    z.string(),
    z.object({
      id: z.string(),
      title: z.string(),
      type: z.string(),
    }),
  ),
});

const descriptionSchema = z.object({
  docs: z.object({ description: z.object({ story: z.string() }) }),
});

const tokensSchema = z.object({ tokens: z.record(z.string(), z.string()) });

export interface PageToken {
  name: string;
  role: string;
}

interface TaggedStory {
  tags: string[];
}

export interface PageStories<T extends TaggedStory> {
  default: T | undefined;
  edgeCases: T[];
  examples: T[];
}

export const EDGE_CASE_TAG = "edge-case";

export const pageStories = <T extends TaggedStory>(stories: readonly T[]): PageStories<T> => {
  const [first, ...rest] = stories;

  return {
    default: first,
    edgeCases: rest.filter((story) => story.tags.includes(EDGE_CASE_TAG)),
    examples: rest.filter((story) => !story.tags.includes(EDGE_CASE_TAG)),
  };
};

export const uiStoryId = (index: unknown, component: string): string | undefined => {
  const result = storyIndexSchema.safeParse(index);

  if (!result.success) {
    return undefined;
  }

  return Object.values(result.data.entries).find(
    (entry) =>
      entry.type === "story" &&
      entry.title.startsWith("Osmoz/") &&
      componentName(entry.title) === component,
  )?.id;
};

export const addedProps = (
  app: Readonly<Record<string, unknown>>,
  ui: Readonly<Record<string, unknown>>,
): string[] => Object.keys(app).filter((name) => !(name in ui));

export const pageTokens = (parameters: unknown): PageToken[] => {
  const result = tokensSchema.safeParse(parameters);

  return result.success
    ? Object.entries(result.data.tokens).map(([name, role]) => ({ name, role }))
    : [];
};

export const importSnippet = (component: string): string => {
  const file = component.replaceAll(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

  return `import { ${component} } from "@/components/ui/${file}";`;
};

export const storyDescription = (parameters: unknown): string | undefined => {
  const result = descriptionSchema.safeParse(parameters);

  return result.success ? result.data.docs.description.story : undefined;
};
