import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ErrorComponent from "../../../components/ErrorComponent";
import { usePopularMovies } from "../../../hooks/useMovies";
import { styles as stylesFn } from "./styles";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 60) / 2;

export default function HomeScreen() {
  const router = useRouter();
  const { data: moviesData, isLoading, error } = usePopularMovies(1);

  const movies = moviesData?.results || [];

  const styles = stylesFn(ITEM_WIDTH);

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
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        style={styles.moviePoster}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#EC8B00" />
        <Text style={styles.loadingText}>Carregando filmes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <ErrorComponent
        title="Erro ao carregar filmes"
        message="Não foi possível carregar a lista de filmes. Verifique sua conexão e tente novamente."
        onRetry={() => {
          // The query will automatically refetch
        }}
      />
    );
  }

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
