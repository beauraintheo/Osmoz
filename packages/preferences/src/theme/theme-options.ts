export interface ThemeOptions<Theme extends string> {
  app: string;
  system: { dark: Theme; light: Theme };
  themes: readonly Theme[];
}

export const defineThemeOptions = <const Theme extends string>(
  options: ThemeOptions<Theme>,
): ThemeOptions<Theme> => options;

export const themeStorageKey = (app: string): string => `${app}:theme`;
