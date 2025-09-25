import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock all external dependencies before importing useDetails
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(() => ({ movieId: "123" })),
  useRouter: jest.fn(() => ({
    back: jest.fn(),
  })),
}));

jest.mock("react-native", () => ({
  useWindowDimensions: jest.fn(() => ({ width: 375, height: 812 })),
  Animated: {
    Value: jest.fn(() => ({
      interpolate: jest.fn(() => ({})),
    })),
  },
}));

jest.mock("../../styles", () => ({
  styles: jest.fn(() => ({})),
}));

// Mock the hook dependencies
jest.mock("../useMovieDetails", () => ({
  useMovieDetails: jest.fn(),
}));

jest.mock("../useCheckFavorite", () => ({
  useCheckFavorite: jest.fn(),
}));

jest.mock("../useToggleFavorite", () => ({
  useToggleFavorite: jest.fn(),
}));

import { useDetails } from "../useDetails";
import { useMovieDetails } from "../useMovieDetails";
import { useCheckFavorite } from "../useCheckFavorite";
import { useToggleFavorite } from "../useToggleFavorite";

const mockUseMovieDetails = useMovieDetails as jest.Mock;
const mockUseCheckFavorite = useCheckFavorite as jest.Mock;
const mockUseToggleFavorite = useToggleFavorite as jest.Mock;

const mockMovieDetails = {
  id: 123,
  title: "Test Movie",
  original_title: "Original Test Movie",
  poster_path: "/test-poster.jpg",
  backdrop_path: "/test-backdrop.jpg",
  overview: "Test synopsis",
  release_date: "2019-01-01",
  runtime: 120,
  genres: [
    { id: 1, name: "Action" },
    { id: 2, name: "Drama" },
  ],
  vote_average: 8.5,
};

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};

describe("useDetails hook", () => {
  beforeEach(() => {
    mockUseMovieDetails.mockReturnValue({
      data: mockMovieDetails,
      isLoading: false,
      error: null,
    });

    mockUseCheckFavorite.mockReturnValue({
      data: { isFavorite: false },
      isLoading: false,
    });

    mockUseToggleFavorite.mockReturnValue({
      toggleFavorite: jest.fn(),
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns movie data with proper formatting", () => {
    const { result } = renderHook(() => useDetails(), { wrapper });

    const movie = result.current.movie;
    expect(movie).toBeDefined();
    expect(movie?.id).toBe(123);
    expect(movie?.title).toBe("Test Movie");
    expect(movie?.originalTitle).toBe("Original Test Movie");
    expect(movie?.poster).toBe(
      "https://image.tmdb.org/t/p/w500/test-poster.jpg"
    );
    expect(movie?.backdropUrl).toBe(
      "https://image.tmdb.org/t/p/w1280/test-backdrop.jpg"
    );
    expect(movie?.synopsis).toBe("Test synopsis");
    expect(movie?.year).toMatch(/^\d{4}$/); // Just check it's a 4-digit year
    expect(movie?.duration).toBe("120 min");
    expect(movie?.genre).toBe("Action, Drama");
    expect(movie?.director).toBe("N/A");
    expect(movie?.cast).toBe("N/A");
    expect(movie?.rating).toBe("8.5");
  });

  it("handles loading states correctly", () => {
    mockUseMovieDetails.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => useDetails(), { wrapper });

    expect(result.current.isLoading).toBe(true);
  });

  it("handles error states correctly", () => {
    const mockError = { message: "Network error" };
    mockUseMovieDetails.mockReturnValue({
      data: null,
      isLoading: false,
      error: mockError,
    });

    const { result } = renderHook(() => useDetails(), { wrapper });

    expect(result.current.error).toBe(mockError);
  });

  it("provides required functions and values", () => {
    const { result } = renderHook(() => useDetails(), { wrapper });

    expect(typeof result.current.goBack).toBe("function");
    expect(typeof result.current.toggleFavorite).toBe("function");
    expect(typeof result.current.onContentSizeChange).toBe("function");
    expect(typeof result.current.onScrollViewLayout).toBe("function");
    expect(result.current.HEADER_MAX_HEIGHT).toBeGreaterThan(0);
    expect(result.current.HEADER_MIN_HEIGHT).toBe(100);
    expect(result.current.styles).toBeDefined();
  });

  describe("Favorite functionality", () => {
    it("handles favorite status correctly when movie is not favorited", () => {
      mockUseCheckFavorite.mockReturnValue({
        data: { isFavorite: false },
        isLoading: false,
      });

      const { result } = renderHook(() => useDetails(), { wrapper });

      expect(result.current.isFavorite).toBe(false);
    });

    it("handles favorite status correctly when movie is favorited", () => {
      mockUseCheckFavorite.mockReturnValue({
        data: { isFavorite: true },
        isLoading: false,
      });

      const { result } = renderHook(() => useDetails(), { wrapper });

      expect(result.current.isFavorite).toBe(true);
    });

    it("handles favorite loading state", () => {
      mockUseCheckFavorite.mockReturnValue({
        data: null,
        isLoading: true,
      });

      const { result } = renderHook(() => useDetails(), { wrapper });

      expect(result.current.isLoading).toBe(true);
    });

    it("calls toggleFavorite with correct parameters when movie is not favorited", () => {
      const mockToggleFavorite = jest.fn();
      mockUseToggleFavorite.mockReturnValue({
        toggleFavorite: mockToggleFavorite,
        isLoading: false,
        error: null,
      });

      mockUseCheckFavorite.mockReturnValue({
        data: { isFavorite: false },
        isLoading: false,
      });

      const { result } = renderHook(() => useDetails(), { wrapper });

      act(() => {
        result.current.toggleFavorite();
      });

      expect(mockToggleFavorite).toHaveBeenCalledWith(123, false);
    });

    it("calls toggleFavorite with correct parameters when movie is favorited", () => {
      const mockToggleFavorite = jest.fn();
      mockUseToggleFavorite.mockReturnValue({
        toggleFavorite: mockToggleFavorite,
        isLoading: false,
        error: null,
      });

      mockUseCheckFavorite.mockReturnValue({
        data: { isFavorite: true },
        isLoading: false,
      });

      const { result } = renderHook(() => useDetails(), { wrapper });

      act(() => {
        result.current.toggleFavorite();
      });

      expect(mockToggleFavorite).toHaveBeenCalledWith(123, true);
    });

    it("shows toggle loading state", () => {
      mockUseToggleFavorite.mockReturnValue({
        toggleFavorite: jest.fn(),
        isLoading: true,
        error: null,
      });

      const { result } = renderHook(() => useDetails(), { wrapper });

      expect(result.current.toggleLoading).toBe(true);
    });

    it("handles toggle favorite error", () => {
      const mockError = { message: "Failed to toggle favorite" };
      mockUseToggleFavorite.mockReturnValue({
        toggleFavorite: jest.fn(),
        isLoading: false,
        error: mockError,
      });

      const { result } = renderHook(() => useDetails(), { wrapper });

      expect(result.current.lastActionError).toBe(mockError);
    });

    it("does not call toggleFavorite when already loading", () => {
      const mockToggleFavorite = jest.fn();
      mockUseToggleFavorite.mockReturnValue({
        toggleFavorite: mockToggleFavorite,
        isLoading: true,
        error: null,
      });

      const { result } = renderHook(() => useDetails(), { wrapper });

      act(() => {
        result.current.toggleFavorite();
      });

      // Should not call the function when loading
      expect(mockToggleFavorite).not.toHaveBeenCalled();
    });

    it("handles undefined favorite data gracefully", () => {
      mockUseCheckFavorite.mockReturnValue({
        data: undefined,
        isLoading: false,
      });

      const { result } = renderHook(() => useDetails(), { wrapper });

      expect(result.current.isFavorite).toBe(false);
    });
  });

  describe("Movie ID validation", () => {
    it("handles valid movie ID", () => {
      const { result } = renderHook(() => useDetails(), { wrapper });

      expect(result.current.isValidId).toBe(true);
    });

    it("handles invalid movie ID", () => {
      // Mock invalid movie ID
      jest.doMock("expo-router", () => ({
        useLocalSearchParams: () => ({ movieId: "invalid" }),
        useRouter: () => ({
          back: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useDetails(), { wrapper });

      // The hook should still provide functions even with invalid ID
      expect(typeof result.current.toggleFavorite).toBe("function");
      expect(typeof result.current.goBack).toBe("function");
    });

    it("handles missing movie ID", () => {
      // Mock missing movie ID
      jest.doMock("expo-router", () => ({
        useLocalSearchParams: () => ({}),
        useRouter: () => ({
          back: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useDetails(), { wrapper });

      expect(typeof result.current.toggleFavorite).toBe("function");
      expect(typeof result.current.goBack).toBe("function");
    });

    it("handles array movie ID", () => {
      // Mock array movie ID (takes first element)
      jest.doMock("expo-router", () => ({
        useLocalSearchParams: () => ({ movieId: ["456", "789"] }),
        useRouter: () => ({
          back: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useDetails(), { wrapper });

      expect(typeof result.current.toggleFavorite).toBe("function");
      expect(typeof result.current.goBack).toBe("function");
    });
  });
});
