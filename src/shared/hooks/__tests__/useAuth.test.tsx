import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth, useAuthLogout } from "../useAuth";
import { signIn } from "../services/signIn";
import { useAuthStore } from "../../store/authStore";

// Mock signIn
jest.mock("../services/signIn", () => ({ signIn: jest.fn() }));
// Mock useAuthStore selector
jest.mock("../../store/authStore", () => ({ useAuthStore: jest.fn() }));

// Spies for store actions
const mockLogin = jest.fn();
const mockSetLoading = jest.fn();
const mockLogout = jest.fn();

// Fake store object
const fakeAuthStore = {
  login: mockLogin,
  setLoading: mockSetLoading,
  logout: mockLogout,
};

// Ensure every selector returns correct function
(useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
  selector(fakeAuthStore)
);

// Query Client wrapper
const wrapper = ({ children }: { children: React.ReactNode }) => {
  const qc = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};

describe("useAuth hook", () => {
  const credentials = { username: "user", password: "pass" };
  const authResponse = {
    access_token: "token",
    user: { id: "1", name: "Test" },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls setLoading(true), login(data), then setLoading(false)", async () => {
    (signIn as jest.Mock).mockResolvedValue(authResponse);

    const { result, waitFor } = renderHook(() => useAuth(), { wrapper });

    act(() => result.current.mutate(credentials));

    // Wait for onMutate to call setLoading(true)
    await waitFor(() => expect(mockSetLoading).toHaveBeenCalledWith(true));

    // Wait for mutation success
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockLogin).toHaveBeenCalledWith(authResponse);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it("calls setLoading(false) on error", async () => {
    (signIn as jest.Mock).mockRejectedValue(new Error("fail"));

    const { result, waitFor } = renderHook(() => useAuth(), { wrapper });

    act(() => result.current.mutate(credentials));

    // Wait for mutation error
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });
});

describe("useAuthLogout hook", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns a function that calls logout()", () => {
    const { result } = renderHook(() => useAuthLogout(), { wrapper });

    act(() => result.current());

    expect(mockLogout).toHaveBeenCalled();
  });
});
