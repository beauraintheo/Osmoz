interface BreadcrumbParts {
  current: string;
  parents: string[];
}

export const breadcrumbParts = (title: string): BreadcrumbParts => {
  const parts = title.split("/").map((part) => part.trim());

  return { current: parts.slice(-1).join(""), parents: parts.slice(0, -1) };
};
