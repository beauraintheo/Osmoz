const OSMOZ_TOOL = /^osmoz\//;

export const hiddenTools = (ids: readonly string[]): Record<string, { hidden: true }> =>
  Object.fromEntries(
    ids.filter((id) => !OSMOZ_TOOL.test(id)).map((id) => [id, { hidden: true } as const]),
  );
