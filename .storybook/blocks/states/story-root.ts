export const storyRoot = (container: Element): Element | null => {
  const root = container.firstElementChild;

  if (root === null || !root.hasAttribute("data-app-theme")) {
    return root;
  }

  return Array.from(root.children).find((child) => child.tagName !== "STYLE") ?? null;
};
