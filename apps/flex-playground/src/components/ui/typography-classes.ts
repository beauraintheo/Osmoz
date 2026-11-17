export const TYPOGRAPHY_CLASSES = {
  body: "font-sans text-body",
  canvas: "font-sans text-canvas",
  code: "font-mono text-code",
  control: "font-sans text-control",
  label: "font-mono text-label",
  overline: "font-sans text-overline uppercase",
  tile: "font-sans text-tile",
  title: "font-mono text-title",
} as const;

export type TypographyRole = keyof typeof TYPOGRAPHY_CLASSES;
