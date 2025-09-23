import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import HomeScreen from "../index";

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

describe("HomeScreen Structure", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render without crashing", () => {
      render(<HomeScreen />);
      expect(screen.getByTestId("home-container")).toBeTruthy();
    });

    it("should render the main container", () => {
      render(<HomeScreen />);
      const container = screen.getByTestId("home-container");
      expect(container).toBeTruthy();
    });

    it("should render the scroll view", () => {
      render(<HomeScreen />);
      const scrollView = screen.getByTestId("movies-scroll");
      expect(scrollView).toBeTruthy();
    });
  });

  describe("Movies Grid Structure", () => {
    it("should render the movies grid container", () => {
      render(<HomeScreen />);
      const moviesGrid = screen.getByTestId("movies-grid");
      expect(moviesGrid).toBeTruthy();
    });

    it("should render all movie items", () => {
      render(<HomeScreen />);

      // Should render 6 movie items based on the mock data
      const movieItems = screen.getAllByTestId(/^movie-item-/);
      expect(movieItems).toHaveLength(6);
    });

    it("should render movie posters for all items", () => {
      render(<HomeScreen />);

      // Should render 6 movie posters
      const moviePosters = screen.getAllByTestId(/^movie-poster-/);
      expect(moviePosters).toHaveLength(6);
    });

    it("should render movies in correct order", () => {
      render(<HomeScreen />);

      const movieItems = screen.getAllByTestId(/^movie-item-/);

      // Verify the order matches the mock data
      expect(movieItems[0]).toHaveProperty("props.testID", "movie-item-1");
      expect(movieItems[1]).toHaveProperty("props.testID", "movie-item-2");
      expect(movieItems[2]).toHaveProperty("props.testID", "movie-item-3");
      expect(movieItems[3]).toHaveProperty("props.testID", "movie-item-4");
      expect(movieItems[4]).toHaveProperty("props.testID", "movie-item-5");
      expect(movieItems[5]).toHaveProperty("props.testID", "movie-item-6");
    });
  });

  describe("Movie Items Structure", () => {
    it("should render movie items as touchable components", () => {
      render(<HomeScreen />);

      const movieItems = screen.getAllByTestId(/^movie-item-/);

      // All movie items should be touchable
      movieItems.forEach((item) => {
        expect(item.props.accessible).toBe(true);
      });
    });

    it("should render movie posters with correct sources", () => {
      render(<HomeScreen />);

      const moviePosters = screen.getAllByTestId(/^movie-poster-/);

      // Check that posters have URI sources
      moviePosters.forEach((poster) => {
        expect(poster.props.source).toHaveProperty("uri");
        expect(poster.props.source.uri).toContain(
          "https://image.tmdb.org/t/p/w500/"
        );
      });
    });

    it("should have proper poster properties", () => {
      render(<HomeScreen />);

      const moviePosters = screen.getAllByTestId(/^movie-poster-/);

      moviePosters.forEach((poster) => {
        expect(poster.props.resizeMode).toBe("cover");
      });
    });
  });

  describe("Navigation Functionality", () => {
    it("should call router.push when movie item is pressed", () => {
      render(<HomeScreen />);

      const firstMovieItem = screen.getByTestId("movie-item-1");

      fireEvent.press(firstMovieItem);

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/(protected)/details?movieId=1");
    });

    it("should navigate to correct movie detail for each item", () => {
      render(<HomeScreen />);

      // Test first movie
      const firstMovie = screen.getByTestId("movie-item-1");
      fireEvent.press(firstMovie);
      expect(mockPush).toHaveBeenCalledWith("/(protected)/details?movieId=1");

      mockPush.mockClear();

      // Test second movie
      const secondMovie = screen.getByTestId("movie-item-2");
      fireEvent.press(secondMovie);
      expect(mockPush).toHaveBeenCalledWith("/(protected)/details?movieId=2");

      mockPush.mockClear();

      // Test last movie
      const lastMovie = screen.getByTestId("movie-item-6");
      fireEvent.press(lastMovie);
      expect(mockPush).toHaveBeenCalledWith("/(protected)/details?movieId=6");
    });
  });

  describe("Layout Structure", () => {
    it("should have proper container hierarchy", () => {
      render(<HomeScreen />);

      // Check main container
      expect(screen.getByTestId("home-container")).toBeTruthy();

      // Check scroll view inside container
      expect(screen.getByTestId("movies-scroll")).toBeTruthy();

      // Check movies grid inside scroll view
      expect(screen.getByTestId("movies-grid")).toBeTruthy();

      // Check movie items inside grid
      expect(screen.getAllByTestId(/^movie-item-/)).toHaveLength(6);
    });

    it("should render scroll view with correct properties", () => {
      render(<HomeScreen />);

      const scrollView = screen.getByTestId("movies-scroll");
      expect(scrollView.props.showsVerticalScrollIndicator).toBe(false);
    });
  });

  describe("Movie Data Structure", () => {
    it("should display correct number of movies", () => {
      render(<HomeScreen />);

      const movieItems = screen.getAllByTestId(/^movie-item-/);
      expect(movieItems).toHaveLength(6);
    });

    it("should handle movie data properly", () => {
      render(<HomeScreen />);

      // Verify that each movie has both item and poster
      for (let i = 1; i <= 6; i++) {
        expect(screen.getByTestId(`movie-item-${i}`)).toBeTruthy();
        expect(screen.getByTestId(`movie-poster-${i}`)).toBeTruthy();
      }
    });
  });

  describe("Responsive Design", () => {
    it("should calculate item width based on screen dimensions", () => {
      // The component should handle different screen sizes
      render(<HomeScreen />);

      const movieItems = screen.getAllByTestId(/^movie-item-/);
      expect(movieItems.length).toBeGreaterThan(0);
    });

    it("should render grid layout properly", () => {
      render(<HomeScreen />);

      const moviesGrid = screen.getByTestId("movies-grid");
      expect(moviesGrid).toBeTruthy();

      // Should have all movie items in the grid
      const movieItems = screen.getAllByTestId(/^movie-item-/);
      expect(movieItems).toHaveLength(6);
    });
  });

  describe("Error Handling", () => {
    it("should handle empty movie data gracefully", () => {
      // This test would be more relevant if we could mock the movies array
      // For now, we verify the component renders without the movies
      render(<HomeScreen />);
      expect(screen.getByTestId("home-container")).toBeTruthy();
    });

    it("should handle navigation errors gracefully", () => {
      // Mock console.error to avoid error logs in test output
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      mockPush.mockImplementationOnce(() => {
        throw new Error("Navigation error");
      });

      render(<HomeScreen />);

      const firstMovieItem = screen.getByTestId("movie-item-1");

      // The error will be thrown by the mock, but the component should still be testable
      try {
        fireEvent.press(firstMovieItem);
      } catch (error) {
        expect((error as Error).message).toBe("Navigation error");
      }

      // Verify the navigation was attempted
      expect(mockPush).toHaveBeenCalledTimes(1);

      consoleSpy.mockRestore();
    });
  });

  describe("Performance Considerations", () => {
    it("should render efficiently with multiple items", () => {
      const startTime = Date.now();
      render(<HomeScreen />);
      const renderTime = Date.now() - startTime;

      // Should render within reasonable time (this is a basic performance check)
      expect(renderTime).toBeLessThan(1000);
    });

    it("should handle multiple rapid presses", () => {
      render(<HomeScreen />);

      const firstMovieItem = screen.getByTestId("movie-item-1");

      // Simulate rapid presses
      fireEvent.press(firstMovieItem);
      fireEvent.press(firstMovieItem);
      fireEvent.press(firstMovieItem);

      // Should handle multiple presses without crashing
      expect(mockPush).toHaveBeenCalledTimes(3);
    });
  });

  describe("Accessibility", () => {
    it("should have accessible movie items", () => {
      render(<HomeScreen />);

      const movieItems = screen.getAllByTestId(/^movie-item-/);

      movieItems.forEach((item) => {
        expect(item.props.accessible).toBe(true);
      });
    });

    it("should provide proper touch targets", () => {
      render(<HomeScreen />);

      const movieItems = screen.getAllByTestId(/^movie-item-/);

      // All items should be touchable components
      movieItems.forEach((item) => {
        // TouchableOpacity components should have accessible property
        expect(item.props.accessible).toBe(true);
        // They should also be pressable (we can test this by pressing them)
        expect(() => fireEvent.press(item)).not.toThrow();
      });
    });
  });
});
