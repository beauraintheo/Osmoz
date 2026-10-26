import type { ComponentProps } from "react";

const EXTERNAL_HREF = /^(?:[a-z][a-z\d+.-]*:)?\/\//i;
const SAME_CONTEXT_TARGETS: ReadonlySet<string> = new Set(["_self", "_parent", "_top"]);

export interface LinkBehavior {
  rel: string | undefined;
  external: boolean;
  newTab: boolean;
}

export const resolveLinkBehavior = ({ href, target, rel }: ComponentProps<"a">): LinkBehavior => {
  const external = href !== undefined && EXTERNAL_HREF.test(href);
  const normalizedTarget = target?.toLowerCase();
  const newTab =
    normalizedTarget !== undefined &&
    normalizedTarget !== "" &&
    !SAME_CONTEXT_TARGETS.has(normalizedTarget);
  const tokens = [...(rel ?? "").split(/\s+/), newTab ? "noopener" : ""]
    .filter(Boolean)
    .filter(
      (token, index, all) =>
        all.findIndex((other) => other.toLowerCase() === token.toLowerCase()) === index,
    );

  return {
    rel: tokens.length > 0 ? tokens.join(" ") : undefined,
    external,
    newTab,
  };
};
