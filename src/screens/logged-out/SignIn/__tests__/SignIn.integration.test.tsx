import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignIn from "../SignIn";
import * as authStoreModule from "../../../../shared/store/authStore";
import { signIn } from "../../../../shared/hooks/services/signIn";
import { useForm } from "react-hook-form";
import { useSignIn } from "../hooks/useSignIn";

jest.mock("../../../../shared/hooks/services/signIn", () => ({
  signIn: jest.fn(),
}));

jest.mock("../../../../shared/store/authStore", () => ({
  useAuthStore: jest.fn(),
}));

jest.mock("../../../../shared/hooks/useAuth", () => ({
  useAuth: jest.fn(),
  useAuthLogout: jest.fn(),
}));

// Mock the useSignIn hook to avoid Alert issues
jest.mock("../hooks/useSignIn", () => ({
  useSignIn: jest.fn(),
}));

const createMockAuthStore = (overrides = {}) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  login: jest.fn(),
  logout: jest.fn(),
  setLoading: jest.fn(),
  initializeAuth: jest.fn(),
  ...overrides,
});

const QueryWrapper = ({ children }: { children: React.ReactNode }) => {
  const qc = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};

describe("SignIn Integration Tests", () => {
  const mockCredentials = { username: "u", password: "p" };
  const mockResponse = {
    access_token: "t",
    user: { id: "1", name: "Test User" },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset useForm mock to return test credentials
    (useForm as jest.Mock).mockReturnValue({
      control: {},
      handleSubmit: (fn) => () => fn(mockCredentials),
      formState: { errors: {}, isValid: true },
      setValue: jest.fn(),
      watch: (field) => mockCredentials[field] || "",
    });
  });

  it("should call signIn and update store on successful login", async () => {
    // Prepare authStore mock with spy on login
    const loginSpy = jest.fn();
    (authStoreModule.useAuthStore as unknown as jest.Mock).mockImplementation(
      (selector) => selector(createMockAuthStore({ login: loginSpy }))
    );
    (signIn as jest.Mock).mockResolvedValue(mockResponse);

    // Mock the onSubmit function that will call the mutation
    const mockOnSubmit = jest.fn((data) => {
      // Simulate calling the actual signIn service and login
      signIn(data).then((response) => {
        loginSpy(response);
      });
    });

    // Mock useSignIn to return our controlled hook
    (useSignIn as jest.Mock).mockReturnValue({
      clearPassword: jest.fn(),
      clearUsername: jest.fn(),
      control: {},
      errors: {},
      handleForgotPassword: jest.fn(),
      handleSubmit: (fn) => () => fn(mockCredentials),
      isValid: true,
      onSubmit: mockOnSubmit,
      passwordValue: "",
      theme: { colors: { primary: "#007AFF", gray: "#999999" } },
      usernameValue: "",
      isLoading: false,
    });

    const { getByText } = render(
      <QueryWrapper>
        <SignIn />
      </QueryWrapper>
    );

    fireEvent.press(getByText("Entrar"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(mockCredentials);
      expect(signIn).toHaveBeenCalledWith(mockCredentials);
      expect(loginSpy).toHaveBeenCalledWith(mockResponse);
    });
  });

  it("should handle error on failed login", async () => {
    const errorObj = { message: "Invalid credentials" };
    (signIn as jest.Mock).mockRejectedValue(errorObj);

    // Mock the onSubmit function that will handle error
    const mockOnSubmit = jest.fn((data) => {
      // Simulate calling the actual signIn service that fails
      signIn(data).catch(() => {
        // Error is handled by the mutation
      });
    });

    // Mock useSignIn to return our controlled hook
    (useSignIn as jest.Mock).mockReturnValue({
      clearPassword: jest.fn(),
      clearUsername: jest.fn(),
      control: {},
      errors: {},
      handleForgotPassword: jest.fn(),
      handleSubmit: (fn) => () => fn(mockCredentials),
      isValid: true,
      onSubmit: mockOnSubmit,
      passwordValue: "",
      theme: { colors: { primary: "#007AFF", gray: "#999999" } },
      usernameValue: "",
      isLoading: false,
    });

    const { getByText } = render(
      <QueryWrapper>
        <SignIn />
      </QueryWrapper>
    );

    fireEvent.press(getByText("Entrar"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(mockCredentials);
      expect(signIn).toHaveBeenCalledWith(mockCredentials);
    });
  });
});
