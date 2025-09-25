import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSignIn } from "../hooks/useSignIn";
import { signIn } from "../../../../shared/hooks/services/signIn";

jest.mock("../../../../shared/hooks/services/signIn");

jest.mock("react-native-config", () => ({
  API_BASE_URL: "https://api.test.com",
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

jest.mock("react-native-unistyles", () => ({
  useUnistyles: () => ({
    theme: {},
  }),
}));

const mockSignIn = signIn as jest.Mock;

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const qc = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};

describe("useSign hook", () => {
  const creds = { username: "user", password: "12345678" };
  const response = { access_token: "token", user: { id: "1" } };

  it("mutates and handles success", async () => {
    mockSignIn.mockResolvedValue(response);
    const { result, waitFor } = renderHook(() => useSignIn(), { wrapper });

    act(() => {
      result.current.onSubmit(creds);
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it("handles error", async () => {
    mockSignIn.mockRejectedValue({ message: "err" });
    const { result, waitFor } = renderHook(() => useSignIn(), { wrapper });

    act(() => {
      result.current.onSubmit(creds);
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });
});
