import { createLocaleStore } from "@osmoz/preferences/i18n/create-locale-store";

import { en } from "./en";
import { fr } from "./fr";

export const useLocaleStore = createLocaleStore({
  app: "flux",
  catalogs: { fr, en },
  fallback: "fr",
});
