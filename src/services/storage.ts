import { MMKV } from "react-native-mmkv";

export const storage = new MMKV({
  id: "brq-movies-storage",
  encryptionKey: "brq-movies-encryption-key",
});

const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  USER_DATA: "user_data",
} as const;

export const tokenStorage = {
  getToken: (): string | null => {
    return storage.getString(STORAGE_KEYS.ACCESS_TOKEN) ?? null;
  },

  setToken: (token: string): void => {
    storage.set(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  removeToken: (): void => {
    storage.delete(STORAGE_KEYS.ACCESS_TOKEN);
  },

  hasToken: (): boolean => {
    return storage.contains(STORAGE_KEYS.ACCESS_TOKEN);
  },
};

export const userStorage = {
  getUser: () => {
    const userData = storage.getString(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  setUser: (user: any): void => {
    storage.set(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  },

  removeUser: (): void => {
    storage.delete(STORAGE_KEYS.USER_DATA);
  },
};

export const clearStorage = (): void => {
  storage.clearAll();
};
