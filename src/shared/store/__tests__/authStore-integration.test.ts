// src/shared/store/__tests__/authStore-integration.test.ts
import { renderHook, act } from "@testing-library/react-native";
import { useAuthStore } from "../authStore";
import { clearStorage } from "../../services/storage";

// Mock the storage module
jest.mock("../../services/storage", () => ({
  clearStorage: jest.fn(),
  tokenStorage: {
    setToken: jest.fn(),
    getToken: jest.fn(),
  },
  userStorage: {
    setUser: jest.fn(),
    getUser: jest.fn(),
  },
}));

describe("AuthStore Integration Tests", () => {
  const mockAuthResponse = {
    access_token: "integration-token",
    user: {
      id: "999",
      name: "Integration User",
      email: "integration@test.com",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks(); // This clears all mock call counts

    // Reset store state using logout
    act(() => {
      const store = useAuthStore;
      store.getState().logout();
      store.setState({ isLoading: true });
    });

    // Clear mock calls after the beforeEach reset
    jest.clearAllMocks();
  });

  describe("Complete Authentication Flow", () => {
    it("should handle multiple login/logout cycles", () => {
      const { result } = renderHook(() => useAuthStore());

      // First login
      act(() => {
        result.current.login(mockAuthResponse);
      });
      expect(result.current.isAuthenticated).toBe(true);

      // Track clearStorage calls from this point
      const initialCallCount = (clearStorage as jest.Mock).mock.calls.length;

      // First logout
      act(() => {
        result.current.logout();
      });
      expect(result.current.isAuthenticated).toBe(false);

      // Check that clearStorage was called exactly once more than before
      expect(clearStorage).toHaveBeenCalledTimes(initialCallCount + 1);

      // Second login
      const secondAuthResponse = {
        access_token: "second-token",
        user: { id: "888", name: "Second User", email: "second@test.com" },
      };

      act(() => {
        result.current.login(secondAuthResponse);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(secondAuthResponse.user);
      expect(result.current.token).toBe(secondAuthResponse.access_token);

      // Track calls before second logout
      const beforeSecondLogoutCount = (clearStorage as jest.Mock).mock.calls
        .length;

      // Second logout
      act(() => {
        result.current.logout();
      });
      expect(result.current.isAuthenticated).toBe(false);

      // Check that clearStorage was called one more time
      expect(clearStorage).toHaveBeenCalledTimes(beforeSecondLogoutCount + 1);
    });
  });
});
