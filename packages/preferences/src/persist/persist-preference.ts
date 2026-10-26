import { createJSONStorage } from "zustand/middleware";
import type { PersistOptions } from "zustand/middleware";

import { safeStorage } from "./safe-storage.ts";

interface PreferenceOptions<State extends object, Field extends keyof State & string> {
  name: string;
  field: Field;
  restore: (stored: string | null) => NoInfer<Partial<State>>;
}

const ownValue = (source: unknown, key: string): unknown =>
  typeof source === "object" && source !== null
    ? Object.getOwnPropertyDescriptor(source, key)?.value
    : null;

const storedValue = (persisted: unknown, field: string): string | null => {
  const value = ownValue(persisted, field);

  return typeof value === "string" ? value : null;
};

const isUnchanged = (current: object, restored: object): boolean =>
  Object.keys(restored).every((key) => Object.is(ownValue(current, key), ownValue(restored, key)));

export const persistPreference = <State extends object, Field extends keyof State & string>({
  name,
  field,
  restore,
}: PreferenceOptions<State, Field>): PersistOptions<State, Record<string, State[Field]>> => ({
  name,
  storage: createJSONStorage(() => safeStorage),
  partialize: (state) => ({ [field]: state[field] }),
  merge: (persisted, current) => {
    const restored = restore(storedValue(persisted, field));

    return isUnchanged(current, restored) ? current : { ...current, ...restored };
  },
});
