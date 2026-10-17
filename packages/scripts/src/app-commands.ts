export const APP_ACTIONS = ["dev", "build", "validate"] as const;

export type AppAction = (typeof APP_ACTIONS)[number];

export interface Command {
  command: string;
  args: readonly string[];
}

const WORKSPACES = "!osmoz";

const vpRun = (filter: string, script: string): Command => ({
  command: "vp",
  args: ["run", "-F", filter, script],
});

const validateCommands = (app: string | undefined): Command[] =>
  app === undefined
    ? [
        { command: "vp", args: ["check"] },
        { command: "tsc", args: ["--noEmit"] },
        vpRun(WORKSPACES, "validate"),
      ]
    : [{ command: "vp", args: ["check"] }, vpRun(`@osmoz/${app}...`, "validate")];

export const appCommands = (action: AppAction, app?: string): Command[] => {
  const target = app === undefined ? WORKSPACES : `@osmoz/${app}`;

  switch (action) {
    case "dev":
      return [vpRun(target, "dev")];
    case "validate":
      return validateCommands(app);
    case "build":
      return [...validateCommands(app), vpRun(target, "build")];
  }
};
