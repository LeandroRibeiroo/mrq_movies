// src/shared/store/__tests__/authStore.test.ts
import { renderHook, act } from "@testing-library/react-native";
import { useAuthStore } from "../authStore";

// Mock the storage module
jest.mock("../../services/storage");

describe("AuthStore", () => {
  const mockAuthResponse = {
    access_token: "test-access-token",
    user: {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset store state using getState and setState properly
    const store = useAuthStore;
    act(() => {
      store.getState().logout(); // Use logout to reset state
      store.setState({
        isLoading: true, // Set initial loading state
      });
    });
  });

  describe("Initial State", () => {
    it("should have correct initial state after reset", () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe("login", () => {
    it("should login user successfully", () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login(mockAuthResponse);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockAuthResponse.user);
      expect(result.current.token).toBe(mockAuthResponse.access_token);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("logout", () => {
    it("should logout user and clear storage", () => {
      const { result } = renderHook(() => useAuthStore());

      // First login
      act(() => {
        result.current.login(mockAuthResponse);
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("initializeAuth", () => {
    it("should initialize auth when token and user exist in storage", () => {
      const { result } = renderHook(() => useAuthStore());

      // Mock storage to return existing data
      const { tokenStorage, userStorage } = require("../../services/storage");
      tokenStorage.getToken.mockReturnValue(mockAuthResponse.access_token);
      userStorage.getUser.mockReturnValue(mockAuthResponse.user);

      act(() => {
        result.current.initializeAuth();
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockAuthResponse.user);
      expect(result.current.token).toBe(mockAuthResponse.access_token);
      expect(result.current.isLoading).toBe(false);
    });

    it("should not authenticate when no stored data exists", () => {
      const { result } = renderHook(() => useAuthStore());

      // Mock storage to return nothing
      const { tokenStorage, userStorage } = require("../../services/storage");
      tokenStorage.getToken.mockReturnValue(null);
      userStorage.getUser.mockReturnValue(null);

      act(() => {
        result.current.initializeAuth();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("setLoading", () => {
    it("should update loading state", () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);
    });
  });
});
