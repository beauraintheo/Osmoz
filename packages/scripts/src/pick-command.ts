import type { Command } from "./app-commands.ts";
import type { Ask, AskOption } from "./clack-ask.ts";
import { runApp } from "./run-app.ts";

const ALL_APPS = "*";

const ACTION_OPTIONS: readonly AskOption[] = [
  {
    hint: "start the dev server",
    label: "dev",
    value: "dev",
  },
  {
    hint: "lint, types and tests",
    label: "validate",
    value: "validate",
  },
  {
    hint: "validate, then build",
    label: "build",
    value: "build",
  },
];

export interface PickCommandDeps {
  apps: readonly string[];
  ask: Ask;
  exec: (command: Command) => number;
  onCancel: () => void;
}

const pickArgv = async (apps: readonly string[], ask: Ask): Promise<string[] | undefined> => {
  const app = await ask("Which app?", [
    {
      hint: "the whole monorepo",
      label: "all apps",
      value: ALL_APPS,
    },
    ...apps.map((name) => ({ label: name, value: name })),
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
