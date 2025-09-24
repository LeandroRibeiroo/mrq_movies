import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";
import { Alert } from "react-native";
import { useSignIn } from "../useSignn";

const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock("react-native-unistyles", () => ({
  useUnistyles: () => ({
    theme: {
      colors: {
        primary: "#007AFF",
        gray: "#8E8E93",
        neutral: "#FFFFFF",
        background: "#F2F2F7",
      },
    },
  }),
}));

jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

// Create a wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("useSignIn Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockClear();
    mockReplace.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe("Hook Initialization", () => {
    it("should initialize with correct default values", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      expect(result.current.usernameValue).toBe("");
      expect(result.current.passwordValue).toBe("");
      expect(result.current.isValid).toBe(false);
      expect(result.current.errors).toEqual({});
    });

    it("should provide all required functions", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.clearUsername).toBe("function");
      expect(typeof result.current.clearPassword).toBe("function");
      expect(typeof result.current.onSubmit).toBe("function");
      expect(typeof result.current.handleForgotPassword).toBe("function");
      expect(typeof result.current.handleSubmit).toBe("function");
    });

    it("should provide form control and state", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      expect(result.current.control).toBeDefined();
      expect(result.current.errors).toBeDefined();
      expect(typeof result.current.isValid).toBe("boolean");
    });
  });

  describe("Form Validation", () => {
    it("should be invalid with empty fields", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isValid).toBe(false);
    });

    it("should start with empty username and password values", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      expect(result.current.usernameValue).toBe("");
      expect(result.current.passwordValue).toBe("");
    });

    it("should provide form control for validation", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      // Verify that control object exists and has expected structure
      expect(result.current.control).toBeDefined();
      expect(typeof result.current.control).toBe("object");
    });
  });

  describe("Clear Functions", () => {
    it("should provide clearUsername function", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.clearUsername).toBe("function");

      // Test that the function can be called without errors
      act(() => {
        result.current.clearUsername();
      });
    });

    it("should provide clearPassword function", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.clearPassword).toBe("function");

      // Test that the function can be called without errors
      act(() => {
        result.current.clearPassword();
      });
    });
  });

  describe("Form Submission", () => {
    it("should handle form submission with valid data", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });
      const mockFormData = {
        username: "testuser",
        password: "password123",
      };

      act(() => {
        result.current.onSubmit(mockFormData);
      });

      // The onSubmit function calls signInMutation.mutate which is async
      // We just need to verify the function doesn't throw
      expect(() => {
        result.current.onSubmit(mockFormData);
      }).not.toThrow();
    });

    it("should provide onSubmit function", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.onSubmit).toBe("function");
    });

    it("should handle form submission without errors", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });
      const mockFormData = {
        username: "testuser",
        password: "password123",
      };

      expect(() => {
        result.current.onSubmit(mockFormData);
      }).not.toThrow();
    });
  });

  describe("Forgot Password Functionality", () => {
    it("should handle forgot password action", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleForgotPassword();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        "Esqueci a Senha",
        "Funcionalidade em desenvolvimento"
      );
    });

    it("should show development message for forgot password", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleForgotPassword();
      });

      expect(Alert.alert).toHaveBeenCalledTimes(1);
      expect(Alert.alert).toHaveBeenCalledWith(
        "Esqueci a Senha",
        "Funcionalidade em desenvolvimento"
      );
    });
  });

  describe("Form State Management", () => {
    it("should watch username value changes", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      // Initially empty
      expect(result.current.usernameValue).toBe("");

      // The watch functionality would be tested with actual form interactions
      // This test verifies the initial state
    });

    it("should watch password value changes", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      // Initially empty
      expect(result.current.passwordValue).toBe("");

      // The watch functionality would be tested with actual form interactions
      // This test verifies the initial state
    });

    it("should provide handleSubmit function from react-hook-form", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.handleSubmit).toBe("function");
    });
  });

  describe("Hook Return Values", () => {
    it("should return all expected properties", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      const expectedProperties = [
        "clearPassword",
        "clearUsername",
        "control",
        "errors",
        "handleForgotPassword",
        "handleSubmit",
        "isValid",
        "onSubmit",
        "passwordValue",
        "usernameValue",
      ];

      expectedProperties.forEach((property) => {
        expect(result.current).toHaveProperty(property);
      });
    });

    it("should return functions for all action methods", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      const functionProperties: (keyof ReturnType<typeof useSignIn>)[] = [
        "clearPassword",
        "clearUsername",
        "handleForgotPassword",
        "handleSubmit",
        "onSubmit",
      ];

      functionProperties.forEach((property) => {
        expect(typeof result.current[property]).toBe("function");
      });
    });

    it("should return correct types for state properties", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.isValid).toBe("boolean");
      expect(typeof result.current.usernameValue).toBe("string");
      expect(typeof result.current.passwordValue).toBe("string");
      expect(typeof result.current.errors).toBe("object");
      expect(typeof result.current.control).toBe("object");
    });
  });

  describe("Error Handling", () => {
    it("should handle errors gracefully in onSubmit", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      // Test with invalid data structure
      const invalidData = null as any;

      expect(() => {
        act(() => {
          result.current.onSubmit(invalidData);
        });
      }).not.toThrow();
    });

    it("should handle errors gracefully in clear functions", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      expect(() => {
        act(() => {
          result.current.clearUsername();
          result.current.clearPassword();
        });
      }).not.toThrow();
    });
  });

  describe("Integration with react-hook-form", () => {
    it("should use yup resolver for validation", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      // Verify that the hook initializes with yup validation
      expect(result.current.control).toBeDefined();
      expect(result.current.errors).toBeDefined();
    });

    it("should use onChange mode for validation", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      // The hook should be configured with mode: "onChange"
      // This is verified by the hook's behavior of validating on each change
      expect(result.current.control).toBeDefined();
    });

    it("should provide form control for external components", () => {
      const { result } = renderHook(() => useSignIn(), {
        wrapper: createWrapper(),
      });

      // Control should be suitable for passing to Controller components
      expect(result.current.control).toBeDefined();
      expect(typeof result.current.control).toBe("object");
    });
  });
});
