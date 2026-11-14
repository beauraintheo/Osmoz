import type { OxlintOverride } from "vite-plus/lint";

export const SCREEN_MESSAGE =
  "A screen assembles components: use a primitive of components/ui or a pattern of components/.";

const STYLE_PROPS = ["className", "style"].map((propName) => ({
  message: SCREEN_MESSAGE,
  propName,
}));

const LAYOUT_ELEMENTS = [
  "div",
  "span",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "main",
  "header",
  "footer",
  "nav",
  "aside",
  "section",
  "article",
  "ul",
  "ol",
  "li",
].map((element) => ({ element, message: SCREEN_MESSAGE }));

export const screenLintOverride = {
  files: ["apps/*/src/routes/**/*.tsx", "apps/*/src/features/**/*.tsx"],
  rules: {
    "react/forbid-component-props": ["error", { forbid: STYLE_PROPS }],
    "react/forbid-dom-props": ["error", { forbid: STYLE_PROPS }],
    "react/forbid-elements": ["error", { forbid: LAYOUT_ELEMENTS }],
  },
} satisfies OxlintOverride;
