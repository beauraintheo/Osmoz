const isWrapper = (element: Element): boolean =>
  element.hasAttribute("data-app-theme") || element.hasAttribute("data-story-layout");

export const storyRoot = (container: Element): Element | null => {
  const root = Array.from(container.children).find((child) => child.tagName !== "STYLE") ?? null;

  return root !== null && isWrapper(root) ? storyRoot(root) : root;
};
