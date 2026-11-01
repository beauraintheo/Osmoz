export type Click = Pick<MouseEvent, "altKey" | "button" | "ctrlKey" | "metaKey" | "shiftKey">;

export const docsPath = (id: string): string => `?path=/docs/${id}--docs`;

export const componentName = (title: string): string => title.slice(title.lastIndexOf("/") + 1);

export const isPlainClick = ({ altKey, button, ctrlKey, metaKey, shiftKey }: Click): boolean =>
  button === 0 && !altKey && !ctrlKey && !metaKey && !shiftKey;
