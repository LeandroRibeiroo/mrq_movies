import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useInfinitePopularMovies } from "./hooks/useInfinitePopularMovies";
import { styles as stylesFn } from "./styles";
import ErrorComponent from "@/src/shared/components/ErrorComponent/ErrorComponent";
import { Movie } from "@/src/shared/interfaces/movie";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 60) / 2;

export default function HomeScreen() {
  const router = useRouter();
  const {
    data: moviesData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfinitePopularMovies();

  const movies = moviesData?.results || [];

  const styles = stylesFn(ITEM_WIDTH);

  const renderMovieItem = (movie: Movie, index: number) => (
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
      <FlatList
        data={movies}
        renderItem={({ item }) => renderMovieItem(item, item.id)}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.moviesGrid}
        testID="movies-list"
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          hasNextPage ? (
            <ActivityIndicator size="large" color="#EC8B00" />
          ) : null
        }
      />
    </View>
  );
}
