import { APP_ACTIONS, appCommands } from "./app-commands.ts";
import type { AppAction, Command } from "./app-commands.ts";

export interface RunAppDeps {
  apps: readonly string[];
  exec: (command: Command) => number;
}

const isAppAction = (value: string | undefined): value is AppAction =>
  APP_ACTIONS.some((action) => action === value);

export const runApp = (argv: readonly string[], { apps, exec }: RunAppDeps): number => {
  const [action, app] = argv;

  if (!isAppAction(action)) {
    console.error(`Unknown action "${action ?? ""}". Use one of: ${APP_ACTIONS.join(", ")}.`);
    return 1;
  }

  if (app !== undefined && !apps.includes(app)) {
    console.error(`Unknown app "${app}". Apps: ${apps.length > 0 ? apps.join(", ") : "none"}.`);
    return 1;
  }

  return appCommands(action, app).reduce(
    (status, command) => (status === 0 ? exec(command) : status),
    0,
  );
};
