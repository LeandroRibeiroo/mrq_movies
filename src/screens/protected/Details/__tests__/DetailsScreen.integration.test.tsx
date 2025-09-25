import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock all dependencies that cause import issues
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

jest.mock("../styles", () => ({
  styles: jest.fn(() => ({})),
}));

jest.mock("../hooks/useMovieDetails", () => ({
  useMovieDetails: jest.fn(),
}));

jest.mock("../hooks/useCheckFavorite", () => ({
  useCheckFavorite: jest.fn(),
}));

jest.mock("../hooks/useToggleFavorite", () => ({
  useToggleFavorite: jest.fn(),
}));

jest.mock("../../../../shared/hooks/useErrorHandler", () => ({
  useErrorHandler: jest.fn(() => ({
    handleError: jest.fn(),
  })),
}));

import { useDetails } from "../hooks/useDetails";
import { useMovieDetails } from "../hooks/useMovieDetails";
import { useCheckFavorite } from "../hooks/useCheckFavorite";
import { useToggleFavorite } from "../hooks/useToggleFavorite";
import { useErrorHandler } from "../../../../shared/hooks/useErrorHandler";

const mockUseMovieDetails = useMovieDetails as jest.Mock;
const mockUseCheckFavorite = useCheckFavorite as jest.Mock;
const mockUseToggleFavorite = useToggleFavorite as jest.Mock;
const mockUseErrorHandler = useErrorHandler as jest.Mock;

const mockMovieDetails = {
  id: 123,
  title: "Test Movie",
  original_title: "Original Test Movie",
  poster_path: "/test-poster.jpg",
  backdrop_path: "/test-backdrop.jpg",
  overview: "Test synopsis",
  release_date: "2021-01-01",
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

describe("DetailsScreen Integration", () => {
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

    mockUseErrorHandler.mockReturnValue({
      handleError: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("integrates useDetails with error handling correctly", () => {
    const mockError = { message: "Network error" };
    mockUseMovieDetails.mockReturnValue({
      data: null,
      isLoading: false,
      error: mockError,
    });

    const { result } = renderHook(
      () => {
        const details = useDetails();
        const { handleError } = useErrorHandler();

        // Simulate the useEffect behavior from the component
        React.useEffect(() => {
          if (details.error) {
            handleError(details.error);
          }
        }, [details.error, handleError]);

        return { details, handleError };
      },
      { wrapper }
    );

    expect(result.current.details.error).toBe(mockError);
    expect(mockUseErrorHandler().handleError).toHaveBeenCalledWith(mockError);
  });

  it("handles favorite toggle interactions", () => {
    const mockToggleFavorite = jest.fn();
    mockUseToggleFavorite.mockReturnValue({
      toggleFavorite: mockToggleFavorite,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useDetails(), { wrapper });

    act(() => {
      result.current.toggleFavorite();
    });

    expect(mockToggleFavorite).toHaveBeenCalled();
  });

  it("handles navigation interactions", () => {
    const mockBack = jest.fn();
    jest.doMock("expo-router", () => ({
      useLocalSearchParams: jest.fn(() => ({ movieId: "123" })),
      useRouter: jest.fn(() => ({
        back: mockBack,
      })),
    }));

    const { result } = renderHook(() => useDetails(), { wrapper });

    act(() => {
      result.current.goBack();
    });

    // The goBack function should be available
    expect(typeof result.current.goBack).toBe("function");
  });

  it("provides all required data for screen rendering", () => {
    const { result } = renderHook(() => useDetails(), { wrapper });

    // Check that all required properties are available
    expect(result.current.movie).toBeDefined();
    expect(result.current.isFavorite).toBeDefined();
    expect(result.current.isLoading).toBeDefined();
    expect(result.current.error).toBeDefined();
    expect(result.current.toggleFavorite).toBeDefined();
    expect(result.current.goBack).toBeDefined();
    expect(result.current.styles).toBeDefined();

    // Check animation values
    expect(result.current.headerHeight).toBeDefined();
    expect(result.current.imageOpacity).toBeDefined();
    expect(result.current.titleOpacity).toBeDefined();
  });

  it("handles loading states for UI rendering", () => {
    mockUseMovieDetails.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    mockUseCheckFavorite.mockReturnValue({
      data: null,
      isLoading: true,
    });

    const { result } = renderHook(() => useDetails(), { wrapper });

    expect(result.current.isLoading).toBe(true);
  });
});
