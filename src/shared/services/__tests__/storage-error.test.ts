import { userStorage } from "../storage";
import { MMKV } from "react-native-mmkv";

describe("Storage Error Handling", () => {
  let mockMMKV: jest.Mocked<MMKV>;

  beforeEach(() => {
    jest.clearAllMocks();
    const { storage } = require("../storage");
    mockMMKV = storage as jest.Mocked<MMKV>;
  });

  describe("userStorage error scenarios", () => {
    it("should handle JSON parse errors gracefully", () => {
      mockMMKV.getString.mockReturnValue("{ invalid json }");

      expect(() => userStorage.getUser()).toThrow();
    });

    it("should handle empty string as user data", () => {
      mockMMKV.getString.mockReturnValue("");

      const result = userStorage.getUser();
      expect(result).toBeNull();
    });

    it("should handle null user object when setting", () => {
      userStorage.setUser(null);

      expect(mockMMKV.set).toHaveBeenCalledWith("user_data", "null");
    });

    it("should handle undefined user object when setting", () => {
      userStorage.setUser(undefined);

      expect(mockMMKV.set).toHaveBeenCalledWith("user_data", undefined);
    });
  });
});
