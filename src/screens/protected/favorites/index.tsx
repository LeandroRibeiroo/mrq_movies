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

// Mock favorite movies data - in a real app this would come from state/storage
const favoriteMovies = [
  {
    id: 1,
    title: "Mission: Impossible",
    poster: "https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
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
];

export default function FavoritesScreen() {
  const router = useRouter();

  const renderMovieItem = (
    movie: (typeof favoriteMovies)[0],
    index: number
  ) => (
    <TouchableOpacity
      key={movie.id}
      testID={`favorite-item-${movie.id}`}
      style={[styles.movieItem, { marginRight: index % 2 === 0 ? 20 : 0 }]}
      onPress={() => {
        router.push(`/(protected)/details?movieId=${movie.id}` as any);
      }}
    >
      <Image
        testID={`favorite-poster-${movie.id}`}
        source={{ uri: movie.poster }}
        style={styles.moviePoster}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <View testID="favorites-container" style={styles.container}>
      <ScrollView
        testID="favorites-scroll"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View testID="favorites-grid" style={styles.moviesGrid}>
          {favoriteMovies.map((movie, index) => renderMovieItem(movie, index))}
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
