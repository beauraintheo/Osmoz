import type { fr } from "./fr";
import { useLocaleStore } from "./use-locale-store";

export const useMessages = (): typeof fr => useLocaleStore((state) => state.messages);
