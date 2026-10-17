import { describe, expect, it, vi } from "vite-plus/test";
import type { Mock } from "vite-plus/test";

import type { Command } from "./app-commands.ts";
import type { Ask, AskOption } from "./clack-ask.ts";
import { pickCommand } from "./pick-command.ts";
import type { PickCommandDeps } from "./pick-command.ts";

const apps = ["flex", "tierlist"];

const line = ({ command, args }: Command): string => [command, ...args].join(" ");

interface Mocks {
  ask: Mock<Ask>;
  exec: Mock<PickCommandDeps["exec"]>;
  onCancel: Mock<() => void>;
}

const setup = (...answers: (string | undefined)[]): Mocks => {
  const ask = vi.fn<Ask>(
    async (_message: string, _options: readonly AskOption[]): Promise<string | undefined> =>
      answers[ask.mock.calls.length - 1],
  );
  const exec = vi.fn((_command: Command): number => 0);
  const onCancel = vi.fn((): void => undefined);
  return { ask, exec, onCancel };
};

describe("pickCommand", () => {
  it("offers every app, then every command", async () => {
    const deps = setup("flex", "dev");

    await pickCommand({ apps, ...deps });

    expect(
      deps.ask.mock.calls.map(([message, options]) => [message, options.map((o) => o.value)]),
    ).toEqual([
      ["Which app?", ["*", "flex", "tierlist"]],
      ["Which command?", ["dev", "validate", "build"]],
    ]);
  });

  it("runs the picked command on the picked app", async () => {
    const deps = setup("flex", "build");

    await expect(pickCommand({ apps, ...deps })).resolves.toBe(0);
    expect(deps.exec.mock.calls.map(([command]) => line(command))).toEqual([
      "vp check",
      "vp run -F @osmoz/flex... validate",
      "vp run -F @osmoz/flex build",
    ]);
  });

  it("runs the picked command on every workspace when all apps are picked", async () => {
    const deps = setup("*", "dev");

    await pickCommand({ apps, ...deps });

    expect(deps.exec.mock.calls.map(([command]) => line(command))).toEqual([
      "vp run -F !osmoz dev",
    ]);
  });

  it("returns the exit code of the failing command", async () => {
    const deps = { ...setup("flex", "validate"), exec: vi.fn((_command: Command): number => 2) };

    await expect(pickCommand({ apps, ...deps })).resolves.toBe(2);
  });

  it("runs nothing when the app question is cancelled", async () => {
    const deps = setup(undefined);

    await expect(pickCommand({ apps, ...deps })).resolves.toBe(0);
    expect(deps.ask).toHaveBeenCalledTimes(1);
    expect(deps.onCancel).toHaveBeenCalledOnce();
    expect(deps.exec).not.toHaveBeenCalled();
  });

  it("runs nothing when the command question is cancelled", async () => {
    const deps = setup("flex", undefined);

    await expect(pickCommand({ apps, ...deps })).resolves.toBe(0);
    expect(deps.onCancel).toHaveBeenCalledOnce();
    expect(deps.exec).not.toHaveBeenCalled();
  });
});
