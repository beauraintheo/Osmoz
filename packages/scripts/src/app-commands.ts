export const APP_ACTIONS = ["dev", "build", "validate"] as const;

export type AppAction = (typeof APP_ACTIONS)[number];

export interface Command {
  args: readonly string[];
  command: string;
}

const ROOT = "osmoz";

const WORKSPACES = `!${ROOT}`;

const vpRun = (filter: string, script: string): Command => ({
  args: ["run", "-F", filter, script],
  command: "vp",
});

const STORIES: Command[] = [
  { args: ["--noEmit", "-p", ".storybook"], command: "tsc" },
  vpRun(ROOT, "test:stories"),
];

const validateCommands = (app: string | undefined): Command[] =>
  app === undefined
    ? [
        { args: ["check"], command: "vp" },
        { args: ["--noEmit"], command: "tsc" },
        vpRun(WORKSPACES, "validate"),
      ]
    : [{ args: ["check"], command: "vp" }, vpRun(`@osmoz/${app}...`, "validate")];

export const appCommands = (action: AppAction, app?: string): Command[] => {
  const target = app === undefined ? WORKSPACES : `@osmoz/${app}`;

  switch (action) {
    case "dev":
      return [vpRun(target, "dev")];
    case "validate":
      return [...validateCommands(app), ...STORIES];
    case "build":
      return [...validateCommands(app), vpRun(target, "build")];
  }
};
