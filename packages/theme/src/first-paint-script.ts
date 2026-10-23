import { themeStorageKey } from "./theme-options.ts";
import type { ThemeOptions } from "./theme-options.ts";

const toScriptLiteral = (value: string): string => JSON.stringify(value).replaceAll("<", "\\u003c");

export const firstPaintScript = ({
  app,
  system,
}: Pick<ThemeOptions<string>, "app" | "system">): string => {
  const key = toScriptLiteral(themeStorageKey(app));
  const light = toScriptLiteral(system.light);
  const dark = toScriptLiteral(system.dark);

  return `(()=>{let t=null;try{t=localStorage.getItem(${key})}catch{}document.documentElement.dataset.theme=t&&t!=="system"?t:matchMedia("(prefers-color-scheme: dark)").matches?${dark}:${light}})()`;
};
