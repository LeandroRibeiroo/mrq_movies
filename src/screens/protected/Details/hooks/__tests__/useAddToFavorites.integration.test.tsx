import React from "react";
import { renderHook, waitFor, act } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MockAdapter from "axios-mock-adapter";
import { apiClient } from "../../../../../shared/services/api";
import { useAddToFavorites } from "../useAddToFavorites";
import { AddFavorite } from "../interfaces/add-to-favorite";

// Mock storage to avoid token-related side effects
jest.mock("../../../../../shared/services/storage", () => ({
  tokenStorage: {
    getToken: jest.fn().mockReturnValue("mock-token"),
    removeToken: jest.fn(),
  },
}));

const createWrapper = (customOptions?: any) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        cacheTime: 0,
        ...customOptions?.queries,
      },
      mutations: {
        retry: false,
        ...customOptions?.mutations,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Add to Favorites - Integration Test", () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(apiClient);
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockAxios.restore();
  });

  describe("Successful API Integration", () => {
    it("should successfully add movie to favorites through service to hook", async () => {
      const movieData: AddFavorite = { movieId: 123 };

      mockAxios.onPost("/api/movies/favorites", movieData).reply(201);

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      // Initial state
      expect(result.current.isIdle).toBe(true);
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();

      // Trigger mutation
      act(() => {
        result.current.mutate(movieData);
      });

      // Wait for successful response
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Verify final state
      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();

      // Verify API was called correctly
      expect(mockAxios.history.post).toHaveLength(1);
      expect(mockAxios.history.post[0].url).toBe("/api/movies/favorites");
      expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(movieData);
      expect(mockAxios.history.post[0].headers?.Authorization).toBe(
        "Bearer mock-token"
      );
      expect(mockAxios.history.post[0].headers?.["Content-Type"]).toContain(
        "application/json"
      );
    });

    it("should handle 200 response as success", async () => {
      const movieData: AddFavorite = { movieId: 456 };

      mockAxios.onPost("/api/movies/favorites", movieData).reply(200);

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isError).toBe(false);
      expect(mockAxios.history.post).toHaveLength(1);
    });

    it("should handle multiple movie additions with different IDs", async () => {
      const testCases = [{ movieId: 111 }, { movieId: 222 }, { movieId: 333 }];

      // Setup mock responses
      testCases.forEach((movieData) => {
        mockAxios.onPost("/api/movies/favorites", movieData).reply(201);
      });

      const wrapper = createWrapper();

      // Test each movie ID
      for (const movieData of testCases) {
        const { result } = renderHook(() => useAddToFavorites(), {
          wrapper,
        });

        result.current.mutate(movieData);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.isError).toBe(false);
      }

      // Verify all API calls were made
      expect(mockAxios.history.post).toHaveLength(testCases.length);
      testCases.forEach((movieData, index) => {
        expect(JSON.parse(mockAxios.history.post[index].data)).toEqual(
          movieData
        );
      });
    });

    it("should handle response with additional data", async () => {
      const movieData: AddFavorite = { movieId: 789 };
      const responseData = { success: true, message: "Added to favorites" };

      mockAxios
        .onPost("/api/movies/favorites", movieData)
        .reply(201, responseData);

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isError).toBe(false);
    });
  });

  describe("Error Handling Integration", () => {
    it("should handle conflict errors when movie already favorited (409)", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      const errorResponse = {
        message: "Movie already in favorites",
        error: "CONFLICT",
      };

      mockAxios
        .onPost("/api/movies/favorites", movieData)
        .reply(409, errorResponse);

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      // Initially idle
      expect(result.current.isIdle).toBe(true);

      act(() => {
        result.current.mutate(movieData);
      });

      // Wait for error state
      await waitFor(() => expect(result.current.isError).toBe(true));

      // Verify error state
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.error).toMatchObject({
        message: errorResponse.message,
        statusCode: 409,
        error: errorResponse.error,
      });
    });

    it("should handle 401 unauthorized errors", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      const errorResponse = {
        message: "Unauthorized",
        error: "UNAUTHORIZED",
      };

      mockAxios
        .onPost("/api/movies/favorites", movieData)
        .reply(401, errorResponse);

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toMatchObject({
        message: errorResponse.message,
        statusCode: 401,
        error: errorResponse.error,
      });
    });

    it("should handle 404 movie not found errors", async () => {
      const movieData: AddFavorite = { movieId: 999 };
      const errorResponse = {
        message: "Movie not found",
        error: "NOT_FOUND",
      };

      mockAxios
        .onPost("/api/movies/favorites", movieData)
        .reply(404, errorResponse);

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toMatchObject({
        message: errorResponse.message,
        statusCode: 404,
        error: errorResponse.error,
      });
    });

    it("should handle 400 validation errors", async () => {
      const movieData: AddFavorite = { movieId: -1 };
      const errorResponse = {
        message: "Invalid movie ID",
        error: "VALIDATION_ERROR",
      };

      mockAxios
        .onPost("/api/movies/favorites", movieData)
        .reply(400, errorResponse);

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toMatchObject({
        message: errorResponse.message,
        statusCode: 400,
        error: errorResponse.error,
      });
    });

    it("should handle 500 server errors", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      const errorResponse = {
        message: "Internal server error",
      };

      mockAxios
        .onPost("/api/movies/favorites", movieData)
        .reply(500, errorResponse);

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toMatchObject({
        message: errorResponse.message,
        statusCode: 500,
      });
    });

    it("should handle network errors through full integration", async () => {
      const movieData: AddFavorite = { movieId: 123 };

      mockAxios.onPost("/api/movies/favorites", movieData).networkError();

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toMatchObject({
        message: "An unexpected error occurred.",
        statusCode: 0,
      });
    });

    it("should handle timeout errors", async () => {
      const movieData: AddFavorite = { movieId: 123 };

      mockAxios.onPost("/api/movies/favorites", movieData).timeout();

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toMatchObject({
        message: "An unexpected error occurred.",
        statusCode: 0,
      });
    });
  });

  describe("Mutation State Management Integration", () => {
    it("should show proper loading states during API call", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      let resolvePromise!: (value: any) => void;
      const delayedPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockAxios
        .onPost("/api/movies/favorites", movieData)
        .reply(() => delayedPromise.then(() => [201]));

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      // Should be idle initially
      expect(result.current.isIdle).toBe(true);
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);

      // Trigger mutation
      act(() => {
        result.current.mutate(movieData);
      });

      // Resolve the promise
      act(() => {
        resolvePromise([201]);
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isPending).toBe(false);
      expect(result.current.isIdle).toBe(false);
    });

    it("should handle mutateAsync with successful response", async () => {
      const movieData: AddFavorite = { movieId: 456 };

      mockAxios.onPost("/api/movies/favorites", movieData).reply(201);

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      let mutationPromise: Promise<void>;
      act(() => {
        mutationPromise = result.current.mutateAsync(movieData);
      });

      await expect(mutationPromise!).resolves.toBeUndefined();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.isPending).toBe(false);
      expect(mockAxios.history.post).toHaveLength(1);
    });

    it("should handle mutateAsync with error response", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      const errorResponse = {
        message: "Movie already in favorites",
        error: "CONFLICT",
      };

      mockAxios
        .onPost("/api/movies/favorites", movieData)
        .reply(409, errorResponse);

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      await expect(
        act(async () => {
          await result.current.mutateAsync(movieData);
        })
      ).rejects.toMatchObject({
        message: errorResponse.message,
        statusCode: 409,
        error: errorResponse.error,
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.isPending).toBe(false);
    });
  });

  describe("Query Cache Integration", () => {
    it("should invalidate check favorites queries on successful addition", async () => {
      const movieData: AddFavorite = { movieId: 123 };

      mockAxios.onPost("/api/movies/favorites", movieData).reply(201);

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      // Set some initial data to verify invalidation
      queryClient.setQueryData(["check-favorite", 123], { isFavorite: false });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useAddToFavorites(), { wrapper });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Verify the query data was updated
      const updatedData = queryClient.getQueryData(["check-favorite", 123]);
      expect(updatedData).toEqual({ isFavorite: true });
    });

    it("should handle multiple mutations with cache updates", async () => {
      const testCases = [{ movieId: 111 }, { movieId: 222 }];

      testCases.forEach((movieData) => {
        mockAxios.onPost("/api/movies/favorites", movieData).reply(201);
      });

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      // Set initial data for both movies
      queryClient.setQueryData(["check-favorite", 111], { isFavorite: false });
      queryClient.setQueryData(["check-favorite", 222], { isFavorite: false });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      // Test each mutation
      for (const movieData of testCases) {
        const { result } = renderHook(() => useAddToFavorites(), { wrapper });

        result.current.mutate(movieData);
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        // Verify cache was updated for this specific movie
        const updatedData = queryClient.getQueryData([
          "check-favorite",
          movieData.movieId,
        ]);
        expect(updatedData).toEqual({ isFavorite: true });
      }
    });
  });

  describe("Edge Cases Integration", () => {
    it("should handle zero as valid movie ID", async () => {
      const movieData: AddFavorite = { movieId: 0 };

      mockAxios.onPost("/api/movies/favorites", movieData).reply(201);

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(movieData);
    });

    it("should handle large movie IDs", async () => {
      const movieData: AddFavorite = { movieId: 999999999 };

      mockAxios.onPost("/api/movies/favorites", movieData).reply(201);

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(movieData);
    });

    it("should handle empty response body", async () => {
      const movieData: AddFavorite = { movieId: 123 };

      mockAxios.onPost("/api/movies/favorites", movieData).reply(201, "");

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isError).toBe(false);
    });
  });

  describe("Authentication Integration", () => {
    it("should include authorization header in requests", async () => {
      const movieData: AddFavorite = { movieId: 123 };

      mockAxios.onPost("/api/movies/favorites", movieData).reply((config) => {
        // Verify auth header is present
        expect(config.headers?.Authorization).toBe("Bearer mock-token");
        return [201];
      });

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it("should include content-type header", async () => {
      const movieData: AddFavorite = { movieId: 123 };

      mockAxios.onPost("/api/movies/favorites", movieData).reply((config) => {
        expect(config.headers?.["Content-Type"]).toContain("application/json");
        return [201];
      });

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });
  });

  describe("Error Logging Integration", () => {
    it("should log errors to console on mutation failure", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      const errorResponse = {
        message: "Movie already in favorites",
        error: "CONFLICT",
      };

      mockAxios
        .onPost("/api/movies/favorites", movieData)
        .reply(409, errorResponse);

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { result } = renderHook(() => useAddToFavorites(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(movieData);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error adding to favorites",
        expect.objectContaining({
          message: errorResponse.message,
          statusCode: 409,
          error: errorResponse.error,
        })
      );

      consoleSpy.mockRestore();
    });
  });
});
