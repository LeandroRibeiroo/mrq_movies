import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, useWindowDimensions } from "react-native";
import { useCheckFavorite } from "./useCheckFavorite";
import { useToggleFavorite } from "./useToggleFavorite";
import { useMovieDetails } from "./useMovieDetails";
import { Genre, MovieDetails } from "./interfaces/movie-details";
import { MovieView } from "./interfaces/movie-view";
import { styles as detailsStyles } from "../styles";

const TMDB = {
  img: (size: "w500" | "w1280", path?: string | null) =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : undefined,
};

const useMovieParams = () => {
  const { movieId } = useLocalSearchParams<{ movieId?: string | string[] }>();
  const movieIdString = Array.isArray(movieId) ? movieId[0] : movieId;
  const parsed = movieIdString ? Number.parseInt(movieIdString, 10) : NaN;
  const isValid = Number.isFinite(parsed) && parsed > 0;
  return { movieId: isValid ? parsed : undefined, isValid };
};

const useMovieViewModel = (details: MovieDetails): MovieView | undefined => {
  return useMemo(() => {
    if (!details) return undefined;

    return {
      id: details.id,
      title: details.title ?? "N/A",
      originalTitle: details.original_title ?? "N/A",
      poster: TMDB.img("w500", details.poster_path),
      backdropUrl: TMDB.img("w1280", details.backdrop_path),
      synopsis: details.overview ?? "N/A",
      year: details.release_date
        ? new Date(details.release_date).getFullYear().toString()
        : "N/A",
      duration: details.runtime ? `${details.runtime} min` : "N/A",
      genre: Array.isArray(details.genres)
        ? details.genres.map((g: Genre) => g.name).join(", ")
        : "N/A",
      director: "N/A",
      cast: "N/A",
      rating:
        typeof details.vote_average === "number"
          ? details.vote_average.toFixed(1)
          : "N/A",
    };
  }, [details]);
};

const useHeaderAnimations = (
  scrollY: Animated.Value,
  maxHeight: number,
  minHeight: number,
  contentHeight: number,
  scrollViewHeight: number
) => {
  const dist = maxHeight - minHeight;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, dist],
    outputRange: [maxHeight, minHeight],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, dist / 4, dist * 0.7, dist],
    outputRange: [1, 0.8, 0.3, 0],
    extrapolate: "clamp",
  });

  const imageScale = scrollY.interpolate({
    inputRange: [0, dist * 0.5, dist],
    outputRange: [1, 1.1, 1.3],
    extrapolate: "clamp",
  });

  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, dist * 0.3, dist],
    outputRange: [0, 0.3, 1],
    extrapolate: "clamp",
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [
      dist * 0.3,
      dist * 0.6,
      dist,
      Math.max(dist, contentHeight - scrollViewHeight),
    ],
    outputRange: [0, 0.7, 1, 1],
    extrapolate: "clamp",
  });

  return {
    headerHeight,
    imageOpacity,
    imageScale,
    headerBackgroundOpacity,
    titleOpacity,
  };
};

function useFavorite(movieId?: number) {
  const enabled = typeof movieId === "number";
  const { data: favoriteStatus, isLoading: favoriteLoading } = useCheckFavorite(
    movieId!,
    enabled
  );
  const {
    toggleFavorite: mutateToggle,
    isLoading: toggleLoading,
    error: lastActionError,
  } = useToggleFavorite();

  const isFavorite = !!favoriteStatus?.isFavorite;

  const toggle = useCallback(() => {
    if (!enabled || toggleLoading) return;
    try {
      mutateToggle(movieId!, isFavorite);
    } catch {
      // Erro exposto via lastActionError
    }
  }, [enabled, toggleLoading, mutateToggle, movieId, isFavorite]);

  return {
    isFavorite,
    favoriteLoading,
    toggleLoading,
    toggle,
    lastActionError,
  };
}

export const useDetails = () => {
  const { width, height } = useWindowDimensions();

  const HEADER_MIN_HEIGHT = 100;
  const HEADER_MAX_HEIGHT = Math.max(HEADER_MIN_HEIGHT + 1, height * 0.6);

  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  const { movieId, isValid } = useMovieParams();

  const {
    data: movieDetails,
    isLoading: movieLoading,
    error: movieError,
  } = useMovieDetails(movieId!, isValid);

  const movie = movieDetails ? useMovieViewModel(movieDetails) : undefined;

  const {
    isFavorite,
    favoriteLoading,
    toggleLoading,
    toggle,
    lastActionError,
  } = useFavorite(movieId);

  const onContentSizeChange = useCallback(
    (_w: number, h: number) => setContentHeight(h),
    []
  );

  const styles = detailsStyles(width);

  const onScrollViewLayout = useCallback((e: LayoutChangeEvent) => {
    setScrollViewHeight(e.nativeEvent.layout.height);
  }, []);
  const goBack = useCallback(() => router.back(), [router]);

  const anim = useHeaderAnimations(
    scrollY,
    HEADER_MAX_HEIGHT,
    HEADER_MIN_HEIGHT,
    contentHeight,
    scrollViewHeight
  );

  return {
    HEADER_MAX_HEIGHT,
    HEADER_MIN_HEIGHT,
    styles,
    height,
    movie,
    isValidId: isValid,
    isLoading: movieLoading || favoriteLoading,
    error: movieError,
    lastActionError,
    isFavorite,
    toggleFavorite: toggle,
    toggleLoading,
    scrollY,
    ...anim,
    onContentSizeChange,
    onScrollViewLayout,
    goBack,
  };
};
