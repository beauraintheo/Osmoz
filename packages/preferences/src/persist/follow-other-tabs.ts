interface Rehydratable {
  persist: { rehydrate: () => Promise<void> | void };
}

export const followOtherTabs = (store: Rehydratable, name: string): void => {
  window.addEventListener("storage", (event) => {
    if (event.key === name || event.key === null) {
      void store.persist.rehydrate();
    }
  });
};
