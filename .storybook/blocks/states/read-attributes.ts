export interface Attribute {
  name: string;
  value: string;
}

const HIDDEN = new Set(["class", "style"]);

export const readAttributes = (element: Element): Attribute[] =>
  Array.from(element.attributes, ({ name, value }) => ({ name, value }))
    .filter(({ name }) => !HIDDEN.has(name))
    .toSorted((first, second) => first.name.localeCompare(second.name));

export const formatAttribute = ({ name, value }: Attribute): string =>
  value === "" ? name : `${name}="${value}"`;
