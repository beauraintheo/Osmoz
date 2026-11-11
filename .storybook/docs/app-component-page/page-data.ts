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

const optionsSchema = z.object({ options: z.array(z.string()) });

const tokensSchema = z.object({ tokens: z.record(z.string(), z.string()) });

export interface PageToken {
  name: string;
  role: string;
}

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

export const argOptions = (argType: unknown): string[] => {
  const result = optionsSchema.safeParse(argType);

  return result.success ? result.data.options : [];
};

export const pageTokens = (parameters: unknown): PageToken[] => {
  const result = tokensSchema.safeParse(parameters);

  return result.success
    ? Object.entries(result.data.tokens).map(([name, role]) => ({ name, role }))
    : [];
};
