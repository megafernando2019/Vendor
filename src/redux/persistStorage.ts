import type { Storage } from "redux-persist";

function createNoopStorage(): Storage {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
}

function createBrowserStorage(): Storage {
  return {
    getItem(key) {
      return Promise.resolve(window.localStorage.getItem(key));
    },
    setItem(key, value) {
      window.localStorage.setItem(key, value);
      return Promise.resolve(value);
    },
    removeItem(key) {
      window.localStorage.removeItem(key);
      return Promise.resolve();
    },
  };
}

const persistStorage: Storage =
  typeof window === "undefined" ? createNoopStorage() : createBrowserStorage();

export default persistStorage;
