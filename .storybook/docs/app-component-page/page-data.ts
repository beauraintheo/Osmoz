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

const fileNameSchema = z.object({ fileName: z.string() });

const tokensSchema = z.object({ tokens: z.record(z.string(), z.string()) });

const STORIES_FILE = /\/src\/(.+)\.stories\.tsx$/;

export interface PageToken {
  name: string;
  role: string;
}

interface TaggedStory {
  tags: string[];
}

interface PageStories<T extends TaggedStory> {
  default: T | undefined;
  edgeCases: T[];
  examples: T[];
}

const EDGE_CASE_TAG = "edge-case";

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

export const importSnippet = (component: string, parameters: unknown): string | undefined => {
  const result = fileNameSchema.safeParse(parameters);
  const path = result.success ? STORIES_FILE.exec(result.data.fileName)?.[1] : undefined;

  return path === undefined ? undefined : `import { ${component} } from "@/${path}";`;
};
