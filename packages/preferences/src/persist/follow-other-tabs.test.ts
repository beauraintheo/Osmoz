import { describe, expect, it, vi } from "vite-plus/test";

import { followOtherTabs } from "./follow-other-tabs.ts";

interface Setup {
  name: string;
  rehydrate: () => void;
}

const setup = (): Setup => {
  const rehydrate = vi.fn();
  const name = `${crypto.randomUUID()}:locale`;
  followOtherTabs({ persist: { rehydrate } }, name);

  return { name, rehydrate };
};

const storageEvent = (key: string | null): void => {
  window.dispatchEvent(new StorageEvent("storage", { key }));
};

describe("followOtherTabs", () => {
  it("reloads the store when another tab changes its entry", () => {
    const { name, rehydrate } = setup();

    storageEvent(name);

    expect(rehydrate).toHaveBeenCalledOnce();
  });

  it("reloads the store when another tab clears the storage", () => {
    const { rehydrate } = setup();

    storageEvent(null);

    expect(rehydrate).toHaveBeenCalledOnce();
  });

  it("ignores the entries of other stores", () => {
    const { rehydrate } = setup();

    storageEvent("other:locale");

    expect(rehydrate).not.toHaveBeenCalled();
  });
});
