import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Animated, Dimensions } from "react-native";
import {
  useCheckFavorite,
  useToggleFavorite,
} from "../../../../hooks/useFavorites";
import { useMovieDetails } from "../../../../hooks/useMovies";
import { styles as stylesFn } from "../styles";

const useDetails = () => {
  const { width, height } = Dimensions.get("window");
  const HEADER_MAX_HEIGHT = height * 0.6;
  const HEADER_MIN_HEIGHT = 100;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const router = useRouter();
  const { movieId } = useLocalSearchParams();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  const movieIdString = Array.isArray(movieId) ? movieId[0] : movieId;
  const movieIdNumber = movieIdString ? parseInt(movieIdString) : 1;

  const {
    data: movieDetails,
    isLoading: movieLoading,
    error: movieError,
  } = useMovieDetails(movieIdNumber);

  const { data: favoriteStatus, isLoading: favoriteLoading } =
    useCheckFavorite(movieIdNumber);

  const {
    toggleFavorite: apiToggleFavorite,
    isLoading: toggleLoading,
    error: toggleError,
  } = useToggleFavorite();

  const movie = {
    id: movieDetails?.id,
    title: movieDetails?.title,
    originalTitle: movieDetails?.original_title,
    poster: `https://image.tmdb.org/t/p/w500${movieDetails?.poster_path}`,
    backdropUrl: `https://image.tmdb.org/t/p/w1280${movieDetails?.backdrop_path}`,
    synopsis: movieDetails?.overview,
    year: movieDetails?.release_date
      ? new Date(movieDetails?.release_date).getFullYear().toString()
      : "N/A",
    duration: movieDetails?.runtime ? `${movieDetails.runtime} min` : "N/A",
    genre: movieDetails?.genres?.map((g) => g.name).join(", ") || "N/A",
    director: "N/A",
    cast: "N/A",
    rating: movieDetails?.vote_average?.toFixed(1) || "N/A",
    isFavorite: favoriteStatus?.isFavorite || false,
  };

  const isFavorite = favoriteStatus?.isFavorite || false;

  const styles = stylesFn(width);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [
      0,
      HEADER_SCROLL_DISTANCE / 4,
      HEADER_SCROLL_DISTANCE * 0.7,
      HEADER_SCROLL_DISTANCE,
    ],
    outputRange: [1, 0.8, 0.3, 0],
    extrapolate: "clamp",
  });

  const imageScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.5, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1.1, 1.3],
    extrapolate: "clamp",
  });

  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.3, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0.3, 1],
    extrapolate: "clamp",
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [
      HEADER_SCROLL_DISTANCE * 0.3,
      HEADER_SCROLL_DISTANCE * 0.6,
      HEADER_SCROLL_DISTANCE,
      Math.max(HEADER_SCROLL_DISTANCE, contentHeight - scrollViewHeight),
    ],
    outputRange: [0, 0.7, 1, 1],
    extrapolate: "clamp",
  });

  const handleGoBack = () => {
    router.back();
  };

  const toggleFavorite = () => {
    if (toggleLoading) return;

    apiToggleFavorite(movieIdNumber, isFavorite || false);

    if (toggleError) {
      Alert.alert(
        "Erro",
        "Não foi possível atualizar os favoritos. Tente novamente.",
        [{ text: "OK" }]
      );
    }
  };

  const handleContentSizeChange = (
    contentWidth: number,
    contentHeight: number
  ) => {
    setContentHeight(contentHeight);
  };

  const handleScrollViewLayout = (event: any) => {
    setScrollViewHeight(event.nativeEvent.layout.height);
  };

  return {
    HEADER_MAX_HEIGHT,
    contentHeight,
    handleContentSizeChange,
    handleGoBack,
    handleScrollViewLayout,
    headerBackgroundOpacity,
    headerHeight,
    imageOpacity,
    imageScale,
    isFavorite,
    movie,
    scrollViewHeight,
    scrollY,
    styles,
    titleOpacity,
    toggleFavorite,
    isLoading: movieLoading || favoriteLoading,
    error: movieError,
    toggleLoading,
  };
};

export { useDetails };
