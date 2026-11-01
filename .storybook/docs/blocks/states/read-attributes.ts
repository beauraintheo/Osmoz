export interface Attribute {
  name: string;
  value: string;
}

const HIDDEN = new Set(["class", "style"]);

const isWrapper = (element: Element): boolean =>
  element.hasAttribute("data-app-theme") || element.hasAttribute("data-story-layout");

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

export const formatAttribute = ({ name, value }: Attribute): string =>
  value === "" ? name : `${name}="${value}"`;
