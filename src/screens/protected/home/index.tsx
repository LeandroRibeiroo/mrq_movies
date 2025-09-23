import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 60) / 2; // 60 = padding + gap

// Mock movie data - in a real app this would come from an API
const movies = [
  {
    id: 1,
    title: "Mission: Impossible",
    poster: "https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
  },
  {
    id: 2,
    title: "The Flash",
    poster: "https://image.tmdb.org/t/p/w500/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg",
  },
  {
    id: 3,
    title: "Super Mario Bros",
    poster: "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
  },
  {
    id: 4,
    title: "John Wick 4",
    poster: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
  },
  {
    id: 5,
    title: "Avatar",
    poster: "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
  },
  {
    id: 6,
    title: "Top Gun: Maverick",
    poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
  },
];

export default function HomeScreen() {
  const router = useRouter();

  const renderMovieItem = (movie: (typeof movies)[0], index: number) => (
    <TouchableOpacity
      key={movie.id}
      testID={`movie-item-${movie.id}`}
      style={[styles.movieItem, { marginRight: index % 2 === 0 ? 20 : 0 }]}
      onPress={() => {
        router.push(`/(protected)/details?movieId=${movie.id}` as any);
      }}
    >
      <Image
        testID={`movie-poster-${movie.id}`}
        source={{ uri: movie.poster }}
        style={styles.moviePoster}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <View testID="home-container" style={styles.container}>
      <ScrollView
        testID="movies-scroll"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View testID="movies-grid" style={styles.moviesGrid}>
          {movies.map((movie, index) => renderMovieItem(movie, index))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create(({ colors }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.neutral,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Extra padding for bottom
  },
  moviesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  movieItem: {
    width: ITEM_WIDTH,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  moviePoster: {
    width: "100%",
    height: ITEM_WIDTH * 1.5, // 3:2 aspect ratio for movie posters
    borderRadius: 12,
  },
}));
