import type { HtmlTagDescriptor, Plugin } from "vite-plus";

export const headScriptsPlugin = (scripts: readonly string[]): Plugin => ({
  name: "osmoz:head-scripts",
  transformIndexHtml: (): HtmlTagDescriptor[] =>
    scripts.map((children) => ({ children, injectTo: "head", tag: "script" })),
});
