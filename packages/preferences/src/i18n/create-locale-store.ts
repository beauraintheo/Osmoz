import { create } from "zustand";
import type { StoreApi, UseBoundStore } from "zustand";
import { persist } from "zustand/middleware";

import { followOtherTabs } from "../persist/follow-other-tabs.ts";
import { persistPreference } from "../persist/persist-preference.ts";

type Message = string | ((...args: never[]) => string) | Messages;

export interface Messages {
  readonly [key: string]: Message;
}

interface LocaleOptions<Locale extends string, Catalog extends Messages> {
  app: string;
  catalogs: Readonly<Record<Locale, Catalog>>;
  fallback: NoInfer<Locale>;
  locales: readonly NoInfer<Locale>[];
}

interface LocaleState<Locale extends string, Catalog extends Messages> {
  locale: Locale;
  locales: readonly Locale[];
  messages: Catalog;
  setLocale: (locale: Locale) => void;
}

export type LocaleStore<Locale extends string, Catalog extends Messages> = UseBoundStore<
  StoreApi<LocaleState<Locale, Catalog>>
>;

export const createLocaleStore = <Locale extends string, Catalog extends Messages>({
  app,
  catalogs,
  fallback,
  locales,
}: LocaleOptions<Locale, Catalog>): LocaleStore<Locale, Catalog> => {
  const key = `${app}:locale`;

  const isLocale = (value: string | null): value is Locale =>
    value !== null && Object.hasOwn(catalogs, value);

  const select = (locale: Locale): Pick<LocaleState<Locale, Catalog>, "locale" | "messages"> => ({
    locale,
    messages: catalogs[locale],
  });

  const store = create<LocaleState<Locale, Catalog>>()(
    persist(
      (set, get) => ({
        ...select(fallback),
        locales,
        setLocale: (locale): void => {
          if (locale !== get().locale) {
            set(select(locale));
          }
        },
      }),
      persistPreference({
        field: "locale",
        name: key,
        restore: (stored) => select(isLocale(stored) ? stored : fallback),
      }),
    ),
  );

  const applyLang = ({ locale }: LocaleState<Locale, Catalog>): void => {
    document.documentElement.lang = locale;
  };

  applyLang(store.getState());
  store.subscribe(applyLang);

  followOtherTabs(store, key);

  return store;
};
