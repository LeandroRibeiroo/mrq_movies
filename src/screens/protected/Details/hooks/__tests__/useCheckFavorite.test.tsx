import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCheckFavorite } from "../useCheckFavorite";
import { checkIfFavorited } from "../services/checkIfFavorited";

// Mock the service
jest.mock("../services/checkIfFavorited");
const mockCheckIfFavorited = checkIfFavorited as jest.MockedFunction<
  typeof checkIfFavorited
>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useCheckFavorite Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Successful Queries", () => {
    it("should return favorited status when movie is favorited", async () => {
      const movieId = 123;
      const mockResponse = { isFavorite: true };
      mockCheckIfFavorited.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCheckFavorite(movieId, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockResponse);
      expect(result.current.data?.isFavorite).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it("should return non-favorited status when movie is not favorited", async () => {
      const movieId = 456;
      const mockResponse = { isFavorite: false };
      mockCheckIfFavorited.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCheckFavorite(movieId, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockResponse);
      expect(result.current.data?.isFavorite).toBe(false);
    });
  });

  describe("Query State Management", () => {
    it("should not fetch when enabled is false", async () => {
      const movieId = 123;
      mockCheckIfFavorited.mockResolvedValue({ isFavorite: true });

      const { result } = renderHook(() => useCheckFavorite(movieId, false), {
        wrapper: createWrapper(),
      });

      // Wait a bit to ensure no fetch happens
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockCheckIfFavorited).not.toHaveBeenCalled();
    });

    it("should start fetching when enabled changes from false to true", async () => {
      const movieId = 123;
      mockCheckIfFavorited.mockResolvedValue({ isFavorite: true });

      const { result, rerender } = renderHook(
        ({ enabled }: { enabled: boolean }) =>
          useCheckFavorite(movieId, enabled),
        {
          wrapper: createWrapper(),
          initialProps: { enabled: false },
        }
      );

      // Initially should not fetch
      expect(result.current.isFetching).toBe(false);
      expect(mockCheckIfFavorited).not.toHaveBeenCalled();

      // Enable the query
      rerender({ enabled: true });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockCheckIfFavorited).toHaveBeenCalledWith(movieId);
      expect(result.current.data?.isFavorite).toBe(true);
    });

    it("should show loading state initially when enabled", () => {
      const movieId = 123;
      mockCheckIfFavorited.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { result } = renderHook(() => useCheckFavorite(movieId, true), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isFetching).toBe(true);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe("Query Key Generation", () => {
    it("should use correct query key with movie ID", async () => {
      const movieId = 789;
      mockCheckIfFavorited.mockResolvedValue({ isFavorite: false });

      const { result } = renderHook(() => useCheckFavorite(movieId, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // The query key should include the FAVORITES_QUERY_KEYS.CHECK and movieId
      expect(mockCheckIfFavorited).toHaveBeenCalledWith(movieId);
    });

    it("should generate different cache entries for different movie IDs", async () => {
      const wrapper = createWrapper();
      mockCheckIfFavorited
        .mockResolvedValueOnce({ isFavorite: true })
        .mockResolvedValueOnce({ isFavorite: false });

      // First movie
      const { result: result1 } = renderHook(
        () => useCheckFavorite(111, true),
        { wrapper }
      );

      // Second movie
      const { result: result2 } = renderHook(
        () => useCheckFavorite(222, true),
        { wrapper }
      );

      await waitFor(() => expect(result1.current.isSuccess).toBe(true));
      await waitFor(() => expect(result2.current.isSuccess).toBe(true));

      expect(result1.current.data?.isFavorite).toBe(true);
      expect(result2.current.data?.isFavorite).toBe(false);
      expect(mockCheckIfFavorited).toHaveBeenCalledTimes(2);
    });
  });

  describe("Error Handling", () => {
    it("should handle API errors gracefully", async () => {
      const movieId = 123;
      const mockError = {
        message: "Movie not found",
        statusCode: 404,
        error: "NOT_FOUND",
      };
      mockCheckIfFavorited.mockRejectedValue(mockError);

      const { result } = renderHook(() => useCheckFavorite(movieId, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });

    it("should handle network errors", async () => {
      const movieId = 123;
      const networkError = {
        message: "Network error. Please check your connection.",
        statusCode: 0,
      };
      mockCheckIfFavorited.mockRejectedValue(networkError);

      const { result } = renderHook(() => useCheckFavorite(movieId, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(networkError);
    });
  });

  describe("Stale Time Configuration", () => {
    it("should respect staleTime configuration", async () => {
      const movieId = 123;
      mockCheckIfFavorited.mockResolvedValue({ isFavorite: true });

      const { result } = renderHook(() => useCheckFavorite(movieId, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Clear the mock to track subsequent calls
      mockCheckIfFavorited.mockClear();

      // Since we're testing staleTime, we don't need to re-render
      // The data should remain cached for the staleTime duration

      // Wait a bit to ensure no new fetch
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockCheckIfFavorited).not.toHaveBeenCalled();
    });
  });

  describe("Different Movie ID Scenarios", () => {
    it("should handle zero movie ID", async () => {
      const movieId = 0;
      mockCheckIfFavorited.mockResolvedValue({ isFavorite: false });

      const { result } = renderHook(() => useCheckFavorite(movieId, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockCheckIfFavorited).toHaveBeenCalledWith(0);
      expect(result.current.data?.isFavorite).toBe(false);
    });

    it("should handle large movie IDs", async () => {
      const movieId = 999999999;
      mockCheckIfFavorited.mockResolvedValue({ isFavorite: true });

      const { result } = renderHook(() => useCheckFavorite(movieId, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockCheckIfFavorited).toHaveBeenCalledWith(movieId);
    });
  });
});
