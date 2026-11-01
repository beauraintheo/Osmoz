export const PAGE_MESSAGES = {
  addedProps: {
    none: (app: string, component: string): string =>
      `${app} adds no prop: every prop comes from the Osmoz ${component}.`,
    title: (app: string): string => `Props added by ${app}`,
  },
  intro: {
    contract: "Its behavior, keyboard and accessibility:",
    look: (app: string, component: string): string => `${app}'s look for the Osmoz ${component}.`,
    uiPage: (component: string): string => `Osmoz/${component}`,
  },
  matrix: {
    rest: "Rest",
    title: "Variants and states",
    variant: "Variant",
  },
  sizes: {
    title: "Sizes",
  },
  tokens: {
    intro: "Each token is read in the theme picked in the toolbar.",
    title: "Tokens",
  },
  usage: {
    title: "Usage",
  },
};
