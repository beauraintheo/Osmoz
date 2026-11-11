export const PAGE_MESSAGES = {
  api: {
    addedProps: (app: string): string => `Props added by ${app}`,
    none: (app: string, component: string): string =>
      `${app} adds no prop: every prop comes from the Osmoz ${component}.`,
    title: "API",
  },
  edgeCases: {
    title: "Edge cases",
  },
  examples: {
    title: "Examples",
  },
  intro: {
    contract: "Its behavior, keyboard and accessibility:",
    look: (app: string, component: string): string => `${app}'s look for the Osmoz ${component}.`,
    uiPage: (component: string): string => `Osmoz/${component}`,
  },
  tokens: {
    intro: "Each token is read in the theme picked in the toolbar.",
    title: "Tokens",
  },
};
