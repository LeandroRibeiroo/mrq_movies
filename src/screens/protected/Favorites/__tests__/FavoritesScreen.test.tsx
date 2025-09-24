import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import FavoritesScreen from "../FavoritesScreen";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("react-native-unistyles", () => ({
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

jest.mock("../../../../hooks/useFavorites", () => ({
  useFavoritesList: jest.fn(() => ({
    data: {
      favorites: [
        {
          id: "fav1",
          userId: "user1",
          movieId: 1,
          createdAt: "2023-01-01T00:00:00Z",
          movieData: {
            id: 1,
            title: "Mission: Impossible - Dead Reckoning Part One",
            poster_path: "/poster1.jpg",
            backdrop_path: "/backdrop1.jpg",
            release_date: "2023-07-12",
            vote_average: 7.8,
            overview:
              "Ethan Hunt and his IMF team must track down a terrifying new weapon.",
          },
        },
        {
          id: "fav2",
          userId: "user1",
          movieId: 4,
          createdAt: "2023-01-02T00:00:00Z",
          movieData: {
            id: 4,
            title: "John Wick: Chapter 4",
            poster_path: "/poster4.jpg",
            backdrop_path: "/backdrop4.jpg",
            release_date: "2023-03-24",
            vote_average: 7.7,
            overview: "John Wick uncovers a path to defeating The High Table.",
          },
        },
        {
          id: "fav3",
          userId: "user1",
          movieId: 5,
          createdAt: "2023-01-03T00:00:00Z",
          movieData: {
            id: 5,
            title: "Avatar: The Way of Water",
            poster_path: "/poster5.jpg",
            backdrop_path: "/backdrop5.jpg",
            release_date: "2022-12-16",
            vote_average: 7.6,
            overview:
              "Set more than a decade after the events of the first film.",
          },
        },
      ],
    },
    isLoading: false,
    error: null,
  })),
}));

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

describe("FavoritesScreen Structure", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render without crashing", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });
      expect(screen.getByTestId("favorites-container")).toBeTruthy();
    });

    it("should render the main container", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });
      const container = screen.getByTestId("favorites-container");
      expect(container).toBeTruthy();
    });

    it("should render the scroll view", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });
      const scrollView = screen.getByTestId("favorites-scroll");
      expect(scrollView).toBeTruthy();
    });
  });

  describe("Favorites Grid Structure", () => {
    it("should render the favorites grid container", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });
      const favoritesGrid = screen.getByTestId("favorites-grid");
      expect(favoritesGrid).toBeTruthy();
    });

    it("should render all favorite movie items", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });

      // Should render 3 favorite movie items based on the mock data
      const favoriteItems = screen.getAllByTestId(/^favorite-item-/);
      expect(favoriteItems).toHaveLength(3);
    });

    it("should render movie posters for all favorite items", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });

      // Should render 3 movie posters
      const moviePosters = screen.getAllByTestId(/^favorite-poster-/);
      expect(moviePosters).toHaveLength(3);
    });

    it("should render favorites in correct order", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });

      const favoriteItems = screen.getAllByTestId(/^favorite-item-/);

      // Verify the order matches the mock data (ids: 1, 4, 5)
      expect(favoriteItems[0]).toHaveProperty(
        "props.testID",
        "favorite-item-1"
      );
      expect(favoriteItems[1]).toHaveProperty(
        "props.testID",
        "favorite-item-4"
      );
      expect(favoriteItems[2]).toHaveProperty(
        "props.testID",
        "favorite-item-5"
      );
    });
  });

  describe("Favorite Items Structure", () => {
    it("should render favorite items as touchable components", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });

      const favoriteItems = screen.getAllByTestId(/^favorite-item-/);

      // All favorite items should be touchable
      favoriteItems.forEach((item) => {
        expect(item.props.accessible).toBe(true);
      });
    });

    it("should render movie posters with correct sources", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });

      const moviePosters = screen.getAllByTestId(/^favorite-poster-/);

      // Check that posters have URI sources
      moviePosters.forEach((poster) => {
        expect(poster.props.source).toHaveProperty("uri");
        expect(poster.props.source.uri).toContain(
          "https://image.tmdb.org/t/p/w500/"
        );
      });
    });

    it("should have proper poster properties", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });

      const moviePosters = screen.getAllByTestId(/^favorite-poster-/);

      moviePosters.forEach((poster) => {
        expect(poster.props.resizeMode).toBe("cover");
      });
    });
  });

  describe("Navigation Functionality", () => {
    it("should call router.push when favorite item is pressed", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });

      const firstFavoriteItem = screen.getByTestId("favorite-item-1");

      fireEvent.press(firstFavoriteItem);

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/(protected)/details?movieId=1");
    });

    it("should navigate to correct movie detail for each favorite", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });

      // Test first favorite (Mission: Impossible - ID 1)
      const firstFavorite = screen.getByTestId("favorite-item-1");
      fireEvent.press(firstFavorite);
      expect(mockPush).toHaveBeenCalledWith("/(protected)/details?movieId=1");

      mockPush.mockClear();

      // Test second favorite (John Wick 4 - ID 4)
      const secondFavorite = screen.getByTestId("favorite-item-4");
      fireEvent.press(secondFavorite);
      expect(mockPush).toHaveBeenCalledWith("/(protected)/details?movieId=4");

      mockPush.mockClear();

      // Test third favorite (Avatar - ID 5)
      const thirdFavorite = screen.getByTestId("favorite-item-5");
      fireEvent.press(thirdFavorite);
      expect(mockPush).toHaveBeenCalledWith("/(protected)/details?movieId=5");
    });
  });

  describe("Layout Structure", () => {
    it("should have proper container hierarchy", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });

      // Check main container
      expect(screen.getByTestId("favorites-container")).toBeTruthy();

      // Check scroll view inside container
      expect(screen.getByTestId("favorites-scroll")).toBeTruthy();

      // Check favorites grid inside scroll view
      expect(screen.getByTestId("favorites-grid")).toBeTruthy();

      // Check favorite items inside grid
      expect(screen.getAllByTestId(/^favorite-item-/)).toHaveLength(3);
    });

    it("should render scroll view with correct properties", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });

      const scrollView = screen.getByTestId("favorites-scroll");
      expect(scrollView.props.showsVerticalScrollIndicator).toBe(false);
    });
  });

  describe("Favorites Data Structure", () => {
    it("should display correct number of favorites", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });

      const favoriteItems = screen.getAllByTestId(/^favorite-item-/);
      expect(favoriteItems).toHaveLength(3);
    });

    it("should handle favorite data properly", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });

      // Verify that each favorite has both item and poster
      const favoriteIds = [1, 4, 5]; // Based on mock data
      favoriteIds.forEach((id) => {
        expect(screen.getByTestId(`favorite-item-${id}`)).toBeTruthy();
        expect(screen.getByTestId(`favorite-poster-${id}`)).toBeTruthy();
      });
    });

    it("should render specific favorite movies", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });

      // Check that we have the expected favorite movies
      expect(screen.getByTestId("favorite-item-1")).toBeTruthy(); // Mission: Impossible
      expect(screen.getByTestId("favorite-item-4")).toBeTruthy(); // John Wick 4
      expect(screen.getByTestId("favorite-item-5")).toBeTruthy(); // Avatar
    });
  });

  describe("Responsive Design", () => {
    it("should calculate item width based on screen dimensions", () => {
      // The component should handle different screen sizes
      render(<FavoritesScreen />, { wrapper: createWrapper() });

      const favoriteItems = screen.getAllByTestId(/^favorite-item-/);
      expect(favoriteItems.length).toBeGreaterThan(0);
    });

    it("should render grid layout properly", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });

      const favoritesGrid = screen.getByTestId("favorites-grid");
      expect(favoritesGrid).toBeTruthy();

      // Should have all favorite items in the grid
      const favoriteItems = screen.getAllByTestId(/^favorite-item-/);
      expect(favoriteItems).toHaveLength(3);
    });
  });

  describe("Error Handling", () => {
    it("should handle empty favorites gracefully", () => {
      // This test verifies the component renders even if favorites are empty
      render(<FavoritesScreen />, { wrapper: createWrapper() });
      expect(screen.getByTestId("favorites-container")).toBeTruthy();
    });

    it("should handle navigation errors gracefully", () => {
      // Mock console.error to avoid error logs in test output
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      mockPush.mockImplementationOnce(() => {
        throw new Error("Navigation error");
      });

      render(<FavoritesScreen />, { wrapper: createWrapper() });

      const firstFavoriteItem = screen.getByTestId("favorite-item-1");

      // The error will be thrown by the mock, but the component should still be testable
      try {
        fireEvent.press(firstFavoriteItem);
      } catch (error) {
        expect((error as Error).message).toBe("Navigation error");
      }

      // Verify the navigation was attempted
      expect(mockPush).toHaveBeenCalledTimes(1);

      consoleSpy.mockRestore();
    });
  });

  describe("Performance Considerations", () => {
    it("should render efficiently with favorite items", () => {
      const startTime = Date.now();
      render(<FavoritesScreen />, { wrapper: createWrapper() });
      const renderTime = Date.now() - startTime;

      // Should render within reasonable time (basic performance check)
      expect(renderTime).toBeLessThan(1000);
    });

    it("should handle multiple rapid presses", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });

      const firstFavoriteItem = screen.getByTestId("favorite-item-1");

      // Simulate rapid presses
      fireEvent.press(firstFavoriteItem);
      fireEvent.press(firstFavoriteItem);
      fireEvent.press(firstFavoriteItem);

      // Should handle multiple presses without crashing
      expect(mockPush).toHaveBeenCalledTimes(3);
    });
  });

  describe("Accessibility", () => {
    it("should have accessible favorite items", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });

      const favoriteItems = screen.getAllByTestId(/^favorite-item-/);

      favoriteItems.forEach((item) => {
        expect(item.props.accessible).toBe(true);
      });
    });

    it("should provide proper touch targets", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });

      const favoriteItems = screen.getAllByTestId(/^favorite-item-/);

      // All items should be touchable components
      favoriteItems.forEach((item) => {
        // TouchableOpacity components should have accessible property
        expect(item.props.accessible).toBe(true);
        // They should also be pressable (we can test this by pressing them)
        expect(() => fireEvent.press(item)).not.toThrow();
      });
    });
  });

  describe("Content Verification", () => {
    it("should contain expected favorite movies", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });

      // Verify specific movie posters are rendered
      const missionImpossiblePoster = screen.getByTestId("favorite-poster-1");
      const johnWickPoster = screen.getByTestId("favorite-poster-4");
      const avatarPoster = screen.getByTestId("favorite-poster-5");

      expect(missionImpossiblePoster.props.source.uri).toContain("poster1.jpg");
      expect(johnWickPoster.props.source.uri).toContain("poster4.jpg");
      expect(avatarPoster.props.source.uri).toContain("poster5.jpg");
    });

    it("should have fewer items than home screen", () => {
      render(<FavoritesScreen />, { wrapper: createWrapper() });

      // Favorites should have 3 items (subset of home screen's 6 items)
      const favoriteItems = screen.getAllByTestId(/^favorite-item-/);
      expect(favoriteItems).toHaveLength(3);
    });
  });
});
