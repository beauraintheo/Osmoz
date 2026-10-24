export interface ThemeOptions<Theme extends string> {
  app: string;
  themes: readonly Theme[];
  system: { light: Theme; dark: Theme };
}

export const defineThemeOptions = <const Theme extends string>(
  options: ThemeOptions<Theme>,
): ThemeOptions<Theme> => options;

export const themeStorageKey = (app: string): string => `${app}:theme`;
