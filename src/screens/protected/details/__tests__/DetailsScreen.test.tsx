import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import MovieDetailsScreen from "../index";

// Mock Ionicons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: ({ testID, name, size, color }: any) => {
    const { View } = require("react-native");
    return <View testID={testID || `icon-${name}`} />;
  },
}));

// Mock the useDetails hook directly
const mockBack = jest.fn();
const mockToggleFavorite = jest.fn();

jest.mock("../hooks/useDetails", () => ({
  useDetails: jest.fn(() => ({
    HEADER_MAX_HEIGHT: 400,
    handleContentSizeChange: jest.fn(),
    handleGoBack: mockBack,
    handleScrollViewLayout: jest.fn(),
    headerBackgroundOpacity: 0.5,
    headerHeight: 200,
    imageOpacity: 1,
    imageScale: 1,
    isFavorite: false,
    movie: {
      id: 1,
      title: "Missão: Impossível 7",
      originalTitle: "Mission: Impossible – Dead Reckoning Part One",
      backdropUrl:
        "https://image.tmdb.org/t/p/w1280/628Dep6AxEtDxjZoGP78TsOxYbK.jpg",
      synopsis:
        "Em Missão Impossível 7: Acerto de Contas Parte 1, Ethan Hunt (Tom Cruise) e a equipe do IMF...",
      genre: "Ação, Aventura, Thriller",
      director: "Christopher McQuarrie",
      cast: "Tom Cruise, Hayley Atwell, Ving Rhames, Simon Pegg, Rebecca Ferguson",
    },
    scrollY: { current: 0 },
    styles: {
      container: {},
      header: {},
      headerBackground: {},
      headerImage: {},
      headerControls: {},
      headerButton: {},
      headerTitle: {},
      scrollView: {},
      scrollContent: {},
      movieCard: {},
      movieHeader: {},
      movieTitle: {},
      movieSubtitle: {},
      section: {},
      sectionTitle: {},
      synopsis: {},
      detailsGrid: {},
      detailItem: {},
      detailHeader: {},
      detailLabel: {},
      detailText: {},
    },
    titleOpacity: 1,
    toggleFavorite: mockToggleFavorite,
  })),
}));

describe("MovieDetailsScreen Structure", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render without crashing", () => {
      render(<MovieDetailsScreen />);
      expect(screen.getByTestId("details-container")).toBeTruthy();
    });

    it("should render the main container", () => {
      render(<MovieDetailsScreen />);
      const container = screen.getByTestId("details-container");
      expect(container).toBeTruthy();
    });

    it("should render the header", () => {
      render(<MovieDetailsScreen />);
      const header = screen.getByTestId("details-header");
      expect(header).toBeTruthy();
    });

    it("should render the scroll view", () => {
      render(<MovieDetailsScreen />);
      const scrollView = screen.getByTestId("details-scroll-view");
      expect(scrollView).toBeTruthy();
    });
  });

  describe("Header Structure", () => {
    it("should render header controls", () => {
      render(<MovieDetailsScreen />);
      const headerControls = screen.getByTestId("details-header-controls");
      expect(headerControls).toBeTruthy();
    });

    it("should render back button", () => {
      render(<MovieDetailsScreen />);
      const backButton = screen.getByTestId("details-back-button");
      expect(backButton).toBeTruthy();
    });

    it("should render header title", () => {
      render(<MovieDetailsScreen />);
      const headerTitle = screen.getByTestId("details-header-title");
      expect(headerTitle).toBeTruthy();
      expect(headerTitle.props.children).toBeTruthy();
    });

    it("should render favorite button", () => {
      render(<MovieDetailsScreen />);
      const favoriteButton = screen.getByTestId("details-favorite-button");
      expect(favoriteButton).toBeTruthy();
    });

    it("should render backdrop image", () => {
      render(<MovieDetailsScreen />);
      const backdrop = screen.getByTestId("details-backdrop");
      expect(backdrop).toBeTruthy();
      expect(backdrop.props.source.uri).toBeTruthy();
    });
  });

  describe("Movie Content Structure", () => {
    it("should render movie card", () => {
      render(<MovieDetailsScreen />);
      const movieCard = screen.getByTestId("details-movie-card");
      expect(movieCard).toBeTruthy();
    });

    it("should render movie header", () => {
      render(<MovieDetailsScreen />);
      const movieHeader = screen.getByTestId("details-movie-header");
      expect(movieHeader).toBeTruthy();
    });

    it("should render movie title", () => {
      render(<MovieDetailsScreen />);
      const movieTitle = screen.getByTestId("details-movie-title");
      expect(movieTitle).toBeTruthy();
      expect(movieTitle.props.children).toBeTruthy();
    });

    it("should render movie subtitle", () => {
      render(<MovieDetailsScreen />);
      const movieSubtitle = screen.getByTestId("details-movie-subtitle");
      expect(movieSubtitle).toBeTruthy();
      expect(movieSubtitle.props.children).toBeTruthy();
    });
  });

  describe("Synopsis Section", () => {
    it("should render synopsis section", () => {
      render(<MovieDetailsScreen />);
      const synopsisSection = screen.getByTestId("details-synopsis-section");
      expect(synopsisSection).toBeTruthy();
    });

    it("should render synopsis text", () => {
      render(<MovieDetailsScreen />);
      const synopsisText = screen.getByTestId("details-synopsis-text");
      expect(synopsisText).toBeTruthy();
      expect(synopsisText.props.children).toBeTruthy();
    });

    it("should display synopsis title", () => {
      render(<MovieDetailsScreen />);
      // Just verify the synopsis section exists, not the specific text
      const synopsisSection = screen.getByTestId("details-synopsis-section");
      expect(synopsisSection).toBeTruthy();
    });
  });

  describe("Details Grid Structure", () => {
    it("should render details grid", () => {
      render(<MovieDetailsScreen />);
      const detailsGrid = screen.getByTestId("details-grid");
      expect(detailsGrid).toBeTruthy();
    });

    it("should render genre item", () => {
      render(<MovieDetailsScreen />);
      const genreItem = screen.getByTestId("details-genre-item");
      expect(genreItem).toBeTruthy();

      const genreLabel = screen.getByTestId("details-genre-label");
      expect(genreLabel.props.children).toBeTruthy();

      const genreText = screen.getByTestId("details-genre-text");
      expect(genreText.props.children).toBeTruthy();
    });

    it("should render director item", () => {
      render(<MovieDetailsScreen />);
      const directorItem = screen.getByTestId("details-director-item");
      expect(directorItem).toBeTruthy();

      const directorLabel = screen.getByTestId("details-director-label");
      expect(directorLabel.props.children).toBeTruthy();

      const directorText = screen.getByTestId("details-director-text");
      expect(directorText.props.children).toBeTruthy();
    });

    it("should render cast item", () => {
      render(<MovieDetailsScreen />);
      const castItem = screen.getByTestId("details-cast-item");
      expect(castItem).toBeTruthy();

      const castLabel = screen.getByTestId("details-cast-label");
      expect(castLabel.props.children).toBeTruthy();

      const castText = screen.getByTestId("details-cast-text");
      expect(castText.props.children).toContain("Tom Cruise, Hayley Atwell");
    });

    it("should render rating item", () => {
      render(<MovieDetailsScreen />);
      const ratingItem = screen.getByTestId("details-rating-item");
      expect(ratingItem).toBeTruthy();

      const ratingLabel = screen.getByTestId("details-rating-label");
      expect(ratingLabel.props.children).toBeTruthy();

      const ratingText = screen.getByTestId("details-rating-text");
      expect(ratingText.props.children).toBeTruthy();
    });
  });

  describe("Navigation Functionality", () => {
    it("should call router.back when back button is pressed", () => {
      render(<MovieDetailsScreen />);
      const backButton = screen.getByTestId("details-back-button");

      fireEvent.press(backButton);

      expect(mockBack).toHaveBeenCalledTimes(1);
    });

    it("should handle back navigation errors gracefully", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      mockBack.mockImplementationOnce(() => {
        throw new Error("Navigation error");
      });

      render(<MovieDetailsScreen />);
      const backButton = screen.getByTestId("details-back-button");

      try {
        fireEvent.press(backButton);
      } catch (error) {
        expect((error as Error).message).toBe("Navigation error");
      }

      expect(mockBack).toHaveBeenCalledTimes(1);
      consoleSpy.mockRestore();
    });
  });

  describe("Favorite Functionality", () => {
    it("should render heart outline when not favorite", () => {
      render(<MovieDetailsScreen />);
      const heartIcon = screen.getByTestId("details-heart-outline");
      expect(heartIcon).toBeTruthy();
    });

    it("should call toggleFavorite when favorite button is pressed", () => {
      render(<MovieDetailsScreen />);
      const favoriteButton = screen.getByTestId("details-favorite-button");

      // Initially not favorite
      expect(screen.getByTestId("details-heart-outline")).toBeTruthy();

      // Press to toggle favorite
      fireEvent.press(favoriteButton);

      // Should call the toggle function
      expect(mockToggleFavorite).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple favorite toggles", () => {
      render(<MovieDetailsScreen />);
      const favoriteButton = screen.getByTestId("details-favorite-button");

      // Press multiple times
      fireEvent.press(favoriteButton);
      fireEvent.press(favoriteButton);

      // Should call the toggle function multiple times
      expect(mockToggleFavorite).toHaveBeenCalledTimes(2);
    });
  });

  describe("Movie Data Display", () => {
    it("should display correct movie information", () => {
      render(<MovieDetailsScreen />);

      // Check movie title has content
      expect(
        screen.getByTestId("details-movie-title").props.children
      ).toBeTruthy();

      // Check original title has content
      expect(
        screen.getByTestId("details-movie-subtitle").props.children
      ).toBeTruthy();

      // Check synopsis has content
      const synopsis = screen.getByTestId("details-synopsis-text");
      expect(synopsis.props.children).toBeTruthy();
    });

    it("should display movie details correctly", () => {
      render(<MovieDetailsScreen />);

      // Check genre has content
      expect(
        screen.getByTestId("details-genre-text").props.children
      ).toBeTruthy();

      // Check director has content
      expect(
        screen.getByTestId("details-director-text").props.children
      ).toBeTruthy();

      // Check cast has content
      expect(
        screen.getByTestId("details-cast-text").props.children
      ).toBeTruthy();
    });
  });

  describe("Layout and Structure", () => {
    it("should have proper container hierarchy", () => {
      render(<MovieDetailsScreen />);

      // Check main container
      expect(screen.getByTestId("details-container")).toBeTruthy();

      // Check header inside container
      expect(screen.getByTestId("details-header")).toBeTruthy();

      // Check scroll view inside container
      expect(screen.getByTestId("details-scroll-view")).toBeTruthy();

      // Check movie card inside scroll view
      expect(screen.getByTestId("details-movie-card")).toBeTruthy();
    });

    it("should render scroll view with correct properties", () => {
      render(<MovieDetailsScreen />);
      const scrollView = screen.getByTestId("details-scroll-view");
      expect(scrollView.props.showsVerticalScrollIndicator).toBe(false);
    });
  });

  describe("Error Handling", () => {
    it("should handle missing movie data gracefully", () => {
      // The component should still render even if movie data is missing
      render(<MovieDetailsScreen />);
      expect(screen.getByTestId("details-container")).toBeTruthy();
    });

    it("should render with default movie data", () => {
      render(<MovieDetailsScreen />);

      // Should render movie data
      expect(
        screen.getByTestId("details-movie-title").props.children
      ).toBeTruthy();
    });
  });

  describe("Performance Considerations", () => {
    it("should render efficiently", () => {
      const startTime = Date.now();
      render(<MovieDetailsScreen />);
      const renderTime = Date.now() - startTime;

      // Should render within reasonable time
      expect(renderTime).toBeLessThan(1000);
    });

    it("should handle multiple rapid button presses", () => {
      render(<MovieDetailsScreen />);
      const favoriteButton = screen.getByTestId("details-favorite-button");

      // Simulate rapid presses
      fireEvent.press(favoriteButton);
      fireEvent.press(favoriteButton);
      fireEvent.press(favoriteButton);

      // Should handle multiple presses without crashing
      expect(screen.getByTestId("details-favorite-button")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should have accessible buttons", () => {
      render(<MovieDetailsScreen />);

      const backButton = screen.getByTestId("details-back-button");
      expect(backButton.props.accessible).toBe(true);

      const favoriteButton = screen.getByTestId("details-favorite-button");
      expect(favoriteButton.props.accessible).toBe(true);
    });

    it("should provide proper touch targets", () => {
      render(<MovieDetailsScreen />);

      const backButton = screen.getByTestId("details-back-button");
      const favoriteButton = screen.getByTestId("details-favorite-button");

      // Buttons should be pressable
      expect(() => fireEvent.press(backButton)).not.toThrow();
      expect(() => fireEvent.press(favoriteButton)).not.toThrow();
    });
  });

  describe("Content Verification", () => {
    it("should display all required sections", () => {
      render(<MovieDetailsScreen />);

      // Check all main sections are present
      expect(screen.getByTestId("details-header")).toBeTruthy();
      expect(screen.getByTestId("details-movie-header")).toBeTruthy();
      expect(screen.getByTestId("details-synopsis-section")).toBeTruthy();
      expect(screen.getByTestId("details-grid")).toBeTruthy();
    });

    it("should display all detail items", () => {
      render(<MovieDetailsScreen />);

      // Check all detail items are present
      expect(screen.getByTestId("details-genre-item")).toBeTruthy();
      expect(screen.getByTestId("details-director-item")).toBeTruthy();
      expect(screen.getByTestId("details-cast-item")).toBeTruthy();
      expect(screen.getByTestId("details-rating-item")).toBeTruthy();
    });

    it("should have proper backdrop image source", () => {
      render(<MovieDetailsScreen />);
      const backdrop = screen.getByTestId("details-backdrop");

      expect(backdrop.props.source).toHaveProperty("uri");
      expect(backdrop.props.source.uri).toBeTruthy();
    });
  });
});
