export interface Attribute {
  name: string;
  value: string;
}

const HIDDEN = new Set(["class", "data-testid", "style"]);

const isWrapper = (element: Element): boolean =>
  element instanceof HTMLElement &&
  (element.dataset.appTheme !== undefined || element.dataset.storyLayout !== undefined);

export const storyRoot = (container: Element): Element | null => {
  const root = Array.from(container.children).find((child) => child.tagName !== "STYLE") ?? null;

  return root !== null && isWrapper(root) ? storyRoot(root) : root;
};

export const readAttributes = (element: Element): Attribute[] =>
  Array.from(element.attributes, ({ name, value }) => ({ name, value }))
    .filter(({ name }) => !HIDDEN.has(name))
    .toSorted((first, second) => first.name.localeCompare(second.name));

export const sameAttributes = (first: Attribute[], second: Attribute[]): boolean =>
  JSON.stringify(first) === JSON.stringify(second);
