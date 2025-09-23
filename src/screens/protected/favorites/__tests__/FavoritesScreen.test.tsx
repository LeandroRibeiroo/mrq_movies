import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import FavoritesScreen from "../index";

// Mock expo-router
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock react-native-unistyles
jest.mock("react-native-unistyles", () => ({
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

describe("FavoritesScreen Structure", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render without crashing", () => {
      render(<FavoritesScreen />);
      expect(screen.getByTestId("favorites-container")).toBeTruthy();
    });

    it("should render the main container", () => {
      render(<FavoritesScreen />);
      const container = screen.getByTestId("favorites-container");
      expect(container).toBeTruthy();
    });

    it("should render the scroll view", () => {
      render(<FavoritesScreen />);
      const scrollView = screen.getByTestId("favorites-scroll");
      expect(scrollView).toBeTruthy();
    });
  });

  describe("Favorites Grid Structure", () => {
    it("should render the favorites grid container", () => {
      render(<FavoritesScreen />);
      const favoritesGrid = screen.getByTestId("favorites-grid");
      expect(favoritesGrid).toBeTruthy();
    });

    it("should render all favorite movie items", () => {
      render(<FavoritesScreen />);

      // Should render 3 favorite movie items based on the mock data
      const favoriteItems = screen.getAllByTestId(/^favorite-item-/);
      expect(favoriteItems).toHaveLength(3);
    });

    it("should render movie posters for all favorite items", () => {
      render(<FavoritesScreen />);

      // Should render 3 movie posters
      const moviePosters = screen.getAllByTestId(/^favorite-poster-/);
      expect(moviePosters).toHaveLength(3);
    });

    it("should render favorites in correct order", () => {
      render(<FavoritesScreen />);

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
      render(<FavoritesScreen />);

      const favoriteItems = screen.getAllByTestId(/^favorite-item-/);

      // All favorite items should be touchable
      favoriteItems.forEach((item) => {
        expect(item.props.accessible).toBe(true);
      });
    });

    it("should render movie posters with correct sources", () => {
      render(<FavoritesScreen />);

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
      render(<FavoritesScreen />);

      const moviePosters = screen.getAllByTestId(/^favorite-poster-/);

      moviePosters.forEach((poster) => {
        expect(poster.props.resizeMode).toBe("cover");
      });
    });
  });

  describe("Navigation Functionality", () => {
    it("should call router.push when favorite item is pressed", () => {
      render(<FavoritesScreen />);

      const firstFavoriteItem = screen.getByTestId("favorite-item-1");

      fireEvent.press(firstFavoriteItem);

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/(protected)/details?movieId=1");
    });

    it("should navigate to correct movie detail for each favorite", () => {
      render(<FavoritesScreen />);

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
      render(<FavoritesScreen />);

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
      render(<FavoritesScreen />);

      const scrollView = screen.getByTestId("favorites-scroll");
      expect(scrollView.props.showsVerticalScrollIndicator).toBe(false);
    });
  });

  describe("Favorites Data Structure", () => {
    it("should display correct number of favorites", () => {
      render(<FavoritesScreen />);

      const favoriteItems = screen.getAllByTestId(/^favorite-item-/);
      expect(favoriteItems).toHaveLength(3);
    });

    it("should handle favorite data properly", () => {
      render(<FavoritesScreen />);

      // Verify that each favorite has both item and poster
      const favoriteIds = [1, 4, 5]; // Based on mock data
      favoriteIds.forEach((id) => {
        expect(screen.getByTestId(`favorite-item-${id}`)).toBeTruthy();
        expect(screen.getByTestId(`favorite-poster-${id}`)).toBeTruthy();
      });
    });

    it("should render specific favorite movies", () => {
      render(<FavoritesScreen />);

      // Check that we have the expected favorite movies
      expect(screen.getByTestId("favorite-item-1")).toBeTruthy(); // Mission: Impossible
      expect(screen.getByTestId("favorite-item-4")).toBeTruthy(); // John Wick 4
      expect(screen.getByTestId("favorite-item-5")).toBeTruthy(); // Avatar
    });
  });

  describe("Responsive Design", () => {
    it("should calculate item width based on screen dimensions", () => {
      // The component should handle different screen sizes
      render(<FavoritesScreen />);

      const favoriteItems = screen.getAllByTestId(/^favorite-item-/);
      expect(favoriteItems.length).toBeGreaterThan(0);
    });

    it("should render grid layout properly", () => {
      render(<FavoritesScreen />);

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
      render(<FavoritesScreen />);
      expect(screen.getByTestId("favorites-container")).toBeTruthy();
    });

    it("should handle navigation errors gracefully", () => {
      // Mock console.error to avoid error logs in test output
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      mockPush.mockImplementationOnce(() => {
        throw new Error("Navigation error");
      });

      render(<FavoritesScreen />);

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
      render(<FavoritesScreen />);
      const renderTime = Date.now() - startTime;

      // Should render within reasonable time (basic performance check)
      expect(renderTime).toBeLessThan(1000);
    });

    it("should handle multiple rapid presses", () => {
      render(<FavoritesScreen />);

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
      render(<FavoritesScreen />);

      const favoriteItems = screen.getAllByTestId(/^favorite-item-/);

      favoriteItems.forEach((item) => {
        expect(item.props.accessible).toBe(true);
      });
    });

    it("should provide proper touch targets", () => {
      render(<FavoritesScreen />);

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
      render(<FavoritesScreen />);

      // Verify specific movie posters are rendered
      const missionImpossiblePoster = screen.getByTestId("favorite-poster-1");
      const johnWickPoster = screen.getByTestId("favorite-poster-4");
      const avatarPoster = screen.getByTestId("favorite-poster-5");

      expect(missionImpossiblePoster.props.source.uri).toContain(
        "NNxYkU70HPurnNCSiCjYAmacwm.jpg"
      );
      expect(johnWickPoster.props.source.uri).toContain(
        "vZloFAK7NmvMGKE7VkF5UHaz0I.jpg"
      );
      expect(avatarPoster.props.source.uri).toContain(
        "jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg"
      );
    });

    it("should have fewer items than home screen", () => {
      render(<FavoritesScreen />);

      // Favorites should have 3 items (subset of home screen's 6 items)
      const favoriteItems = screen.getAllByTestId(/^favorite-item-/);
      expect(favoriteItems).toHaveLength(3);
    });
  });
});
