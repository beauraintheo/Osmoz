import type { HtmlTagDescriptor, Plugin } from "vite-plus";

export const headScriptsPlugin = (scripts: readonly string[]): Plugin => ({
  name: "osmoz:head-scripts",
  transformIndexHtml: (): HtmlTagDescriptor[] =>
    scripts.map((children) => ({ tag: "script", children, injectTo: "head" })),
});
