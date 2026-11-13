export const THEME_EVENT_KEY = "osmoz-storybook:manager-theme";

export const PREVIEW_BACKGROUND = "--osmoz-preview-background";

export const PREVIEW_PAINT_STYLE = `html, .sb-preparing-story, .sb-preparing-docs { background-color: var(${PREVIEW_BACKGROUND}, Canvas); }`;

interface PreviewPaint {
  background: string;
  colorScheme: "light" | "dark";
}

export const paintPreview = (
  root: HTMLElement,
  { background, colorScheme }: PreviewPaint,
): void => {
  root.style.setProperty(PREVIEW_BACKGROUND, background);
  root.style.setProperty("color-scheme", colorScheme);
};

export const previewPaintScript = (): string =>
  `(()=>{try{const t=JSON.parse(localStorage.getItem(${JSON.stringify(THEME_EVENT_KEY)})).tokens,s=document.documentElement.style;if(typeof t.background==="string")s.setProperty(${JSON.stringify(PREVIEW_BACKGROUND)},t.background);if(t.colorScheme==="light"||t.colorScheme==="dark")s.setProperty("color-scheme",t.colorScheme)}catch{}})()`;

export const previewHead = (head = ""): string =>
  `${head}<style>${PREVIEW_PAINT_STYLE}</style><script>${previewPaintScript()}</script>`;
