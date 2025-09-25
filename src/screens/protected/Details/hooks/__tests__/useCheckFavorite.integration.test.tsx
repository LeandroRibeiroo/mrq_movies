import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MockAdapter from "axios-mock-adapter";
import { apiClient } from "../../../../../shared/services/api";
import { useCheckFavorite } from "../useCheckFavorite";
import { CheckFavoriteResponse } from "../interfaces/check-favorite-response";

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
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Check Favorite - Integration Test", () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(apiClient);
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockAxios.restore();
  });

  describe("Successful API Integration", () => {
    it("should successfully check favorite status through service to hook", async () => {
      const movieId = 123;
      const apiResponse: CheckFavoriteResponse = { isFavorite: true };

      mockAxios
        .onGet(`/api/movies/favorites/check/${movieId}`)
        .reply(200, apiResponse);

      const { result } = renderHook(() => useCheckFavorite(movieId, true), {
        wrapper: createWrapper(),
      });

      // Initially loading
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isFetching).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();

      // Wait for successful response
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Verify final state
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toEqual(apiResponse);
      expect(result.current.data?.isFavorite).toBe(true);
      expect(result.current.error).toBeNull();

      // Verify API was called correctly
      expect(mockAxios.history.get).toHaveLength(1);
      expect(mockAxios.history.get[0].url).toBe(
        `/api/movies/favorites/check/${movieId}`
      );
      expect(mockAxios.history.get[0].headers?.Authorization).toBe(
        "Bearer mock-token"
      );
    });

    it("should handle non-favorited movie through full integration", async () => {
      const movieId = 456;
      const apiResponse: CheckFavoriteResponse = { isFavorite: false };

      mockAxios
        .onGet(`/api/movies/favorites/check/${movieId}`)
        .reply(200, apiResponse);

      const { result } = renderHook(() => useCheckFavorite(movieId, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(apiResponse);
      expect(result.current.data?.isFavorite).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it("should handle multiple movie IDs with different responses", async () => {
      const testCases = [
        { movieId: 111, response: { isFavorite: true } },
        { movieId: 222, response: { isFavorite: false } },
        { movieId: 333, response: { isFavorite: true } },
      ];

      // Setup mock responses
      testCases.forEach(({ movieId, response }) => {
        mockAxios
          .onGet(`/api/movies/favorites/check/${movieId}`)
          .reply(200, response);
      });

      const wrapper = createWrapper();

      // Test each movie ID
      for (const { movieId, response } of testCases) {
        const { result } = renderHook(() => useCheckFavorite(movieId, true), {
          wrapper,
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(response);
        expect(result.current.data?.isFavorite).toBe(response.isFavorite);
      }

      // Verify all API calls were made
      expect(mockAxios.history.get).toHaveLength(testCases.length);
    });
  });

  describe("Error Handling Integration", () => {
    it("should handle 404 errors through full stack", async () => {
      const movieId = 999;
      const errorResponse = {
        message: "Movie not found",
        error: "NOT_FOUND",
      };

      mockAxios
        .onGet(`/api/movies/favorites/check/${movieId}`)
        .reply(404, errorResponse);

      const { result } = renderHook(() => useCheckFavorite(movieId, true), {
        wrapper: createWrapper(),
      });

      // Initially loading
      expect(result.current.isLoading).toBe(true);

      // Wait for error state
      await waitFor(() => expect(result.current.isError).toBe(true));

      // Verify error state
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toMatchObject({
        message: errorResponse.message,
        statusCode: 404,
        error: errorResponse.error,
      });
    });

    it("should handle 401 unauthorized errors", async () => {
      const movieId = 123;
      const errorResponse = {
        message: "Unauthorized",
        error: "UNAUTHORIZED",
      };

      mockAxios
        .onGet(`/api/movies/favorites/check/${movieId}`)
        .reply(401, errorResponse);

      const { result } = renderHook(() => useCheckFavorite(movieId, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toMatchObject({
        message: errorResponse.message,
        statusCode: 401,
        error: errorResponse.error,
      });
    });

    it("should handle 500 server errors", async () => {
      const movieId = 123;
      const errorResponse = {
        message: "Internal server error",
      };

      mockAxios
        .onGet(`/api/movies/favorites/check/${movieId}`)
        .reply(500, errorResponse);

      const { result } = renderHook(() => useCheckFavorite(movieId, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toMatchObject({
        message: errorResponse.message,
        statusCode: 500,
      });
    });

    it("should handle network errors through full integration", async () => {
      const movieId = 123;

      mockAxios.onGet(`/api/movies/favorites/check/${movieId}`).networkError();

      const { result } = renderHook(() => useCheckFavorite(movieId, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toMatchObject({
        message: "An unexpected error occurred.",
        statusCode: 0,
      });
    });

    it("should handle timeout errors", async () => {
      const movieId = 123;

      mockAxios.onGet(`/api/movies/favorites/check/${movieId}`).timeout();

      const { result } = renderHook(() => useCheckFavorite(movieId, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toMatchObject({
        message: "An unexpected error occurred.",
        statusCode: 0,
      });
    });
  });

  describe("Query State Management Integration", () => {
    it("should respect enabled parameter and not make API calls when disabled", async () => {
      const movieId = 123;

      mockAxios
        .onGet(`/api/movies/favorites/check/${movieId}`)
        .reply(200, { isFavorite: true });

      const { result } = renderHook(() => useCheckFavorite(movieId, false), {
        wrapper: createWrapper(),
      });

      // Wait to ensure no API call is made
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockAxios.history.get).toHaveLength(0);
    });

    it("should start fetching when enabled changes from false to true", async () => {
      const movieId = 123;
      const apiResponse = { isFavorite: true };

      mockAxios
        .onGet(`/api/movies/favorites/check/${movieId}`)
        .reply(200, apiResponse);

      const { result, rerender } = renderHook(
        ({ enabled }: { enabled: boolean }) =>
          useCheckFavorite(movieId, enabled),
        {
          wrapper: createWrapper(),
          initialProps: { enabled: false },
        }
      );

      // Initially disabled - no API call
      expect(result.current.isFetching).toBe(false);
      expect(mockAxios.history.get).toHaveLength(0);

      // Enable the query
      rerender({ enabled: true });

      // Should start fetching
      expect(result.current.isFetching).toBe(true);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(apiResponse);
      expect(mockAxios.history.get).toHaveLength(1);
    });

    it("should show proper loading states during API call", async () => {
      const movieId = 123;
      let resolvePromise: (value: any) => void;
      const delayedPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockAxios
        .onGet(`/api/movies/favorites/check/${movieId}`)
        .reply(() => delayedPromise.then(() => [200, { isFavorite: true }]));

      const { result } = renderHook(() => useCheckFavorite(movieId, true), {
        wrapper: createWrapper(),
      });

      // Should be loading initially
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isFetching).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeUndefined();

      // Resolve the promise
      resolvePromise!({ isFavorite: true });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
      expect(result.current.data?.isFavorite).toBe(true);
    });
  });

  describe("Caching and Stale Time Integration", () => {
    it("should cache responses and respect staleTime", async () => {
      const movieId = 123;
      const apiResponse = { isFavorite: true };

      mockAxios
        .onGet(`/api/movies/favorites/check/${movieId}`)
        .reply(200, apiResponse);

      const wrapper = createWrapper({
        queries: { staleTime: 5 * 60 * 1000 }, // 5 minutes
      });

      // First render
      const { result: result1 } = renderHook(
        () => useCheckFavorite(movieId, true),
        { wrapper }
      );

      await waitFor(() => expect(result1.current.isSuccess).toBe(true));

      expect(result1.current.data).toEqual(apiResponse);
      expect(mockAxios.history.get).toHaveLength(1);

      // Second render with same movieId should use cache
      const { result: result2 } = renderHook(
        () => useCheckFavorite(movieId, true),
        { wrapper }
      );

      // Should immediately have data from cache
      expect(result2.current.data).toEqual(apiResponse);
      expect(result2.current.isSuccess).toBe(true);

      // Should not make additional API call
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(mockAxios.history.get).toHaveLength(1);
    });

    it("should create separate cache entries for different movie IDs", async () => {
      const testData = [
        { movieId: 111, response: { isFavorite: true } },
        { movieId: 222, response: { isFavorite: false } },
      ];

      testData.forEach(({ movieId, response }) => {
        mockAxios
          .onGet(`/api/movies/favorites/check/${movieId}`)
          .reply(200, response);
      });

      const wrapper = createWrapper();

      // Render both hooks
      const { result: result1 } = renderHook(
        () => useCheckFavorite(testData[0].movieId, true),
        { wrapper }
      );

      const { result: result2 } = renderHook(
        () => useCheckFavorite(testData[1].movieId, true),
        { wrapper }
      );

      // Wait for both to complete
      await waitFor(() => expect(result1.current.isSuccess).toBe(true));
      await waitFor(() => expect(result2.current.isSuccess).toBe(true));

      // Should have different data
      expect(result1.current.data).toEqual(testData[0].response);
      expect(result2.current.data).toEqual(testData[1].response);

      // Should have made separate API calls
      expect(mockAxios.history.get).toHaveLength(2);
    });
  });

  describe("Edge Cases Integration", () => {
    it("should handle zero as valid movie ID", async () => {
      const movieId = 0;
      const apiResponse = { isFavorite: false };

      mockAxios
        .onGet(`/api/movies/favorites/check/${movieId}`)
        .reply(200, apiResponse);

      const { result } = renderHook(() => useCheckFavorite(movieId, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(apiResponse);
      expect(mockAxios.history.get[0].url).toBe(
        "/api/movies/favorites/check/0"
      );
    });

    it("should handle large movie IDs", async () => {
      const movieId = 999999999;
      const apiResponse = { isFavorite: true };

      mockAxios
        .onGet(`/api/movies/favorites/check/${movieId}`)
        .reply(200, apiResponse);

      const { result } = renderHook(() => useCheckFavorite(movieId, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(apiResponse);
      expect(mockAxios.history.get[0].url).toBe(
        `/api/movies/favorites/check/${movieId}`
      );
    });

    it("should handle malformed API responses gracefully", async () => {
      const movieId = 123;
      const malformedResponse = { someOtherField: "value" }; // Missing isFavorite

      mockAxios
        .onGet(`/api/movies/favorites/check/${movieId}`)
        .reply(200, malformedResponse);

      const { result } = renderHook(() => useCheckFavorite(movieId, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Should still succeed but with malformed data
      expect(result.current.data).toEqual(malformedResponse);
      expect(result.current.isError).toBe(false);
    });
  });

  describe("Authentication Integration", () => {
    it("should include authorization header in requests", async () => {
      const movieId = 123;
      const apiResponse = { isFavorite: true };

      mockAxios
        .onGet(`/api/movies/favorites/check/${movieId}`)
        .reply((config) => {
          // Verify auth header is present
          expect(config.headers?.Authorization).toBe("Bearer mock-token");
          return [200, apiResponse];
        });

      const { result } = renderHook(() => useCheckFavorite(movieId, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(apiResponse);
    });
  });
});
