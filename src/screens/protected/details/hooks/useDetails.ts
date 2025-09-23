import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Animated, Dimensions } from "react-native";
import { movieData } from "../mocks";
import { styles as stylesFn } from "../styles";

const useDetails = () => {
  const { width, height } = Dimensions.get("window");
  const HEADER_MAX_HEIGHT = height * 0.6;
  const HEADER_MIN_HEIGHT = 100;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const router = useRouter();
  const { movieId } = useLocalSearchParams();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isFavorite, setIsFavorite] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  const movieIdString = Array.isArray(movieId) ? movieId[0] : movieId;
  const movieIdNumber = movieIdString ? parseInt(movieIdString) : 1;
  const movie =
    movieData[movieIdNumber as keyof typeof movieData] || movieData[1];

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
    setIsFavorite(!isFavorite);
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
  };
};

export { useDetails };
