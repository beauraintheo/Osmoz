import { themeStorageKey } from "./theme-options.ts";
import type { ThemeOptions } from "./theme-options.ts";

const toScriptLiteral = (value: string | readonly string[]): string =>
  JSON.stringify(value).replaceAll("<", "\\u003c");

export const firstPaintScript = ({
  app,
  system,
  themes,
}: Pick<ThemeOptions<string>, "app" | "system" | "themes">): string => {
  const key = toScriptLiteral(themeStorageKey(app));
  const known = toScriptLiteral(themes);
  const light = toScriptLiteral(system.light);
  const dark = toScriptLiteral(system.dark);

  return `(()=>{let t=null;try{t=JSON.parse(localStorage.getItem(${key})).state.preference}catch{}document.documentElement.dataset.theme=${known}.includes(t)?t:matchMedia("(prefers-color-scheme: dark)").matches?${dark}:${light}})()`;
};
