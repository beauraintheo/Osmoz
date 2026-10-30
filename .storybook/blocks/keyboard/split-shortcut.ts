export const splitShortcut = (shortcut: string): string[] => shortcut.match(/[^+]+|\+$/g) ?? [];
