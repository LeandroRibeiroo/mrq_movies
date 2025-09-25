import { tokenStorage, userStorage, clearStorage } from "../storage";

describe("Storage Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearStorage(); // Clear storage before each test
  });

  it("should handle complete auth flow", () => {
    const mockToken = "test-jwt-token";
    const mockUser = { id: "123", name: "Test User" };

    // Initially no token or user
    expect(tokenStorage.hasToken()).toBe(false);
    expect(tokenStorage.getToken()).toBeNull();
    expect(userStorage.getUser()).toBeNull();

    // Set token and user
    tokenStorage.setToken(mockToken);
    userStorage.setUser(mockUser);

    // Verify they're stored
    expect(tokenStorage.hasToken()).toBe(true);
    expect(tokenStorage.getToken()).toBe(mockToken);
    expect(userStorage.getUser()).toEqual(mockUser);

    // Clear everything
    clearStorage();

    // Verify they're gone
    expect(tokenStorage.hasToken()).toBe(false);
    expect(tokenStorage.getToken()).toBeNull();
    expect(userStorage.getUser()).toBeNull();
  });

  it("should handle logout scenario", () => {
    const mockToken = "test-jwt-token";
    const mockUser = { id: "123", name: "Test User" };

    // Set initial state
    tokenStorage.setToken(mockToken);
    userStorage.setUser(mockUser);

    // Verify they're set
    expect(tokenStorage.hasToken()).toBe(true);
    expect(tokenStorage.getToken()).toBe(mockToken);
    expect(userStorage.getUser()).toEqual(mockUser);

    // Remove token and user separately (logout)
    tokenStorage.removeToken();
    userStorage.removeUser();

    // Verify they're removed
    expect(tokenStorage.hasToken()).toBe(false);
    expect(tokenStorage.getToken()).toBeNull();
    expect(userStorage.getUser()).toBeNull();
  });
});
