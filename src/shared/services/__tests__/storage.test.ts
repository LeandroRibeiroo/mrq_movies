import { storage, tokenStorage, userStorage, clearStorage } from "../storage";
import { MMKV } from "react-native-mmkv";

describe("Storage Utility", () => {
  let mockMMKV: jest.Mocked<MMKV>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockMMKV = storage as jest.Mocked<MMKV>;
  });

  describe("tokenStorage", () => {
    describe("getToken", () => {
      it("should return token when it exists", () => {
        const mockToken = "mock-jwt-token";
        mockMMKV.getString.mockReturnValue(mockToken);

        const result = tokenStorage.getToken();

        expect(mockMMKV.getString).toHaveBeenCalledWith("access_token");
        expect(result).toBe(mockToken);
      });

      it("should return null when token does not exist", () => {
        mockMMKV.getString.mockReturnValue(undefined);

        const result = tokenStorage.getToken();

        expect(mockMMKV.getString).toHaveBeenCalledWith("access_token");
        expect(result).toBeNull();
      });
    });

    describe("setToken", () => {
      it("should store token in MMKV", () => {
        const mockToken = "new-jwt-token";

        tokenStorage.setToken(mockToken);

        expect(mockMMKV.set).toHaveBeenCalledWith("access_token", mockToken);
      });
    });

    describe("removeToken", () => {
      it("should delete token from MMKV", () => {
        tokenStorage.removeToken();

        expect(mockMMKV.delete).toHaveBeenCalledWith("access_token");
      });
    });

    describe("hasToken", () => {
      it("should return true when token exists", () => {
        mockMMKV.contains.mockReturnValue(true);

        const result = tokenStorage.hasToken();

        expect(mockMMKV.contains).toHaveBeenCalledWith("access_token");
        expect(result).toBe(true);
      });

      it("should return false when token does not exist", () => {
        mockMMKV.contains.mockReturnValue(false);

        const result = tokenStorage.hasToken();

        expect(mockMMKV.contains).toHaveBeenCalledWith("access_token");
        expect(result).toBe(false);
      });
    });
  });

  describe("userStorage", () => {
    const mockUser = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
    };

    describe("getUser", () => {
      it("should return parsed user data when it exists", () => {
        const userDataString = JSON.stringify(mockUser);
        mockMMKV.getString.mockReturnValue(userDataString);

        const result = userStorage.getUser();

        expect(mockMMKV.getString).toHaveBeenCalledWith("user_data");
        expect(result).toEqual(mockUser);
      });

      it("should return null when user data does not exist", () => {
        mockMMKV.getString.mockReturnValue(undefined);

        const result = userStorage.getUser();

        expect(mockMMKV.getString).toHaveBeenCalledWith("user_data");
        expect(result).toBeNull();
      });

      it("should handle invalid JSON gracefully", () => {
        mockMMKV.getString.mockReturnValue("invalid-json");

        expect(() => userStorage.getUser()).toThrow();
      });
    });

    describe("setUser", () => {
      it("should store stringified user data in MMKV", () => {
        userStorage.setUser(mockUser);

        expect(mockMMKV.set).toHaveBeenCalledWith(
          "user_data",
          JSON.stringify(mockUser)
        );
      });

      it("should handle different user data types", () => {
        const complexUser = {
          id: "456",
          profile: {
            preferences: ["action", "comedy"],
            settings: { theme: "dark" },
          },
        };

        userStorage.setUser(complexUser);

        expect(mockMMKV.set).toHaveBeenCalledWith(
          "user_data",
          JSON.stringify(complexUser)
        );
      });
    });

    describe("removeUser", () => {
      it("should delete user data from MMKV", () => {
        userStorage.removeUser();

        expect(mockMMKV.delete).toHaveBeenCalledWith("user_data");
      });
    });
  });

  describe("clearStorage", () => {
    it("should clear all data from MMKV", () => {
      clearStorage();

      expect(mockMMKV.clearAll).toHaveBeenCalled();
    });
  });
});
