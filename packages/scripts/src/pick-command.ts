import type { Command } from "./app-commands.ts";
import type { Ask, AskOption } from "./clack-ask.ts";
import { runApp } from "./run-app.ts";

const ALL_APPS = "*";

const ACTION_OPTIONS: readonly AskOption[] = [
  { value: "dev", label: "dev", hint: "start the dev server" },
  { value: "validate", label: "validate", hint: "lint, types and tests" },
  { value: "build", label: "build", hint: "validate, then build" },
];

export interface PickCommandDeps {
  apps: readonly string[];
  ask: Ask;
  exec: (command: Command) => number;
  onCancel: () => void;
}

const pickArgv = async (apps: readonly string[], ask: Ask): Promise<string[] | undefined> => {
  const app = await ask("Which app?", [
    { value: ALL_APPS, label: "all apps", hint: "the whole monorepo" },
    ...apps.map((name) => ({ value: name, label: name })),
  ]);

  if (app === undefined) {
    return undefined;
  }

  const action = await ask("Which command?", ACTION_OPTIONS);

  if (action === undefined) {
    return undefined;
  }

  return app === ALL_APPS ? [action] : [action, app];
};

export const pickCommand = async ({
  apps,
  ask,
  exec,
  onCancel,
}: PickCommandDeps): Promise<number> => {
  const argv = await pickArgv(apps, ask);

  if (argv === undefined) {
    onCancel();
    return 0;
  }

  return runApp(argv, { apps, exec });
};
