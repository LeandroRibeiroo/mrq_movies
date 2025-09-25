import React from "react";
import { renderHook, waitFor, act } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAddToFavorites } from "../useAddToFavorites";
import { addToFavorites } from "../services/addToFavorite";
import { AddFavorite } from "../interfaces/add-to-favorite";

// Mock the service
jest.mock("../services/addToFavorite");
const mockAddToFavorites = addToFavorites as jest.MockedFunction<
  typeof addToFavorites
>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useAddToFavorites Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Successful Mutations", () => {
    it("should successfully add movie to favorites", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      mockAddToFavorites.mockResolvedValue();

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      // Initial state
      expect(result.current.isIdle).toBe(true);
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);

      // Trigger mutation
      act(() => {
        result.current.mutate(movieData);
      });

      // Wait for success
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(mockAddToFavorites).toHaveBeenCalledWith(
        movieData,
        expect.any(Object)
      );
      expect(mockAddToFavorites).toHaveBeenCalledTimes(1);
    });

    it("should handle different movie IDs correctly", async () => {
      const testCases = [{ movieId: 1 }, { movieId: 999 }, { movieId: 12345 }];

      mockAddToFavorites.mockResolvedValue();

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      // Test each movie ID
      for (const movieData of testCases) {
        act(() => {
          result.current.mutate(movieData);
        });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(mockAddToFavorites).toHaveBeenCalledWith(
          movieData,
          expect.any(Object)
        );

        // Reset for next test
        act(() => {
          result.current.reset();
        });
        mockAddToFavorites.mockClear();
      }
    });

    it("should handle zero as valid movie ID", async () => {
      const movieData: AddFavorite = { movieId: 0 };
      mockAddToFavorites.mockResolvedValue();

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate(movieData);
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockAddToFavorites).toHaveBeenCalledWith(
        movieData,
        expect.any(Object)
      );
    });

    it("should handle large movie IDs", async () => {
      const movieData: AddFavorite = { movieId: 999999999 };
      mockAddToFavorites.mockResolvedValue();

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate(movieData);
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockAddToFavorites).toHaveBeenCalledWith(
        movieData,
        expect.any(Object)
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle API errors gracefully", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      const mockError = {
        message: "Movie already in favorites",
        statusCode: 409,
        error: "CONFLICT",
      };
      mockAddToFavorites.mockRejectedValue(mockError);

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(mockError);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isPending).toBe(false);
    });

    it("should handle unauthorized errors (401)", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      const unauthorizedError = {
        message: "Unauthorized",
        statusCode: 401,
        error: "UNAUTHORIZED",
      };
      mockAddToFavorites.mockRejectedValue(unauthorizedError);

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(unauthorizedError);
    });

    it("should handle not found errors (404)", async () => {
      const movieData: AddFavorite = { movieId: 999 };
      const notFoundError = {
        message: "Movie not found",
        statusCode: 404,
        error: "NOT_FOUND",
      };
      mockAddToFavorites.mockRejectedValue(notFoundError);

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(notFoundError);
    });

    it("should handle server errors (500)", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      const serverError = {
        message: "Internal server error",
        statusCode: 500,
      };
      mockAddToFavorites.mockRejectedValue(serverError);

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(serverError);
    });

    it("should handle network errors", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      const networkError = {
        message: "Network error. Please check your connection.",
        statusCode: 0,
      };
      mockAddToFavorites.mockRejectedValue(networkError);

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(networkError);
    });

    it("should handle validation errors (400)", async () => {
      const movieData: AddFavorite = { movieId: -1 };
      const validationError = {
        message: "Invalid movie ID",
        statusCode: 400,
        error: "VALIDATION_ERROR",
      };
      mockAddToFavorites.mockRejectedValue(validationError);

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(validationError);
    });
  });

  describe("Mutation State Management", () => {
    it("should show correct loading states during mutation", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      // Use a promise that never resolves to test loading state
      mockAddToFavorites.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      // Initial state
      expect(result.current.isIdle).toBe(true);
      expect(result.current.isPending).toBe(false);

      // Trigger mutation
      act(() => {
        result.current.mutate(movieData);
      });

      // Should be pending (wait for it)
      await waitFor(() => expect(result.current.isPending).toBe(true));
      expect(result.current.isIdle).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it("should reset mutation state correctly", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      mockAddToFavorites.mockResolvedValue();

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      // Perform mutation
      act(() => {
        result.current.mutate(movieData);
      });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Verify success state
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isPending).toBe(false);

      // Reset
      act(() => {
        result.current.reset();
      });

      // After reset, the mutation should return to idle state
      await waitFor(() => expect(result.current.isIdle).toBe(true));
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("should handle multiple consecutive mutations", async () => {
      const movieData1: AddFavorite = { movieId: 123 };
      const movieData2: AddFavorite = { movieId: 456 };
      mockAddToFavorites.mockResolvedValue();

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      // First mutation
      act(() => {
        result.current.mutate(movieData1);
      });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockAddToFavorites).toHaveBeenCalledWith(
        movieData1,
        expect.any(Object)
      );

      // Reset and second mutation
      act(() => {
        result.current.reset();
      });
      act(() => {
        result.current.mutate(movieData2);
      });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockAddToFavorites).toHaveBeenCalledWith(
        movieData2,
        expect.any(Object)
      );
      expect(mockAddToFavorites).toHaveBeenCalledTimes(2);
    });
  });

  describe("Query Cache Integration", () => {
    it("should call mutation function with correct parameters", async () => {
      const movieData: AddFavorite = { movieId: 789 };
      mockAddToFavorites.mockResolvedValue();

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.mutate(movieData);
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockAddToFavorites).toHaveBeenCalledWith(
        movieData,
        expect.any(Object)
      );
      expect(mockAddToFavorites).toHaveBeenCalledTimes(1);
    });

    it("should handle mutateAsync correctly", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      mockAddToFavorites.mockResolvedValue();

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      let mutationPromise: Promise<void>;
      act(() => {
        mutationPromise = result.current.mutateAsync(movieData);
      });

      await expect(mutationPromise!).resolves.toBeUndefined();

      // Wait for the success state to be updated
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockAddToFavorites).toHaveBeenCalledWith(
        movieData,
        expect.any(Object)
      );
    });

    it("should handle mutateAsync with errors", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      const mockError = {
        message: "Movie already in favorites",
        statusCode: 409,
        error: "CONFLICT",
      };
      mockAddToFavorites.mockRejectedValue(mockError);

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      await expect(
        act(async () => {
          await result.current.mutateAsync(movieData);
        })
      ).rejects.toEqual(mockError);

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toEqual(mockError);
    });
  });

  describe("onSuccess and onError Callbacks", () => {
    it("should trigger console.error on mutation error", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      const mockError = {
        message: "Movie already in favorites",
        statusCode: 409,
        error: "CONFLICT",
      };
      mockAddToFavorites.mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error adding to favorites",
        mockError
      );

      consoleSpy.mockRestore();
    });
  });
});
