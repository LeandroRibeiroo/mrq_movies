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
import { useFavoritesList } from "../../../hooks/useFavorites";
import { styles as stylesFn } from "./styles";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 60) / 2;

export default function FavoritesScreen() {
  const router = useRouter();
  const { data: favoritesData, isLoading, error } = useFavoritesList();

  const favoriteMovies = favoritesData?.favorites || [];

  const styles = stylesFn(ITEM_WIDTH);

  const renderMovieItem = (
    favorite: (typeof favoriteMovies)[0],
    index: number
  ) => (
    <TouchableOpacity
      key={favorite.id}
      testID={`favorite-item-${favorite.movieId}`}
      style={[styles.movieItem, { marginRight: index % 2 === 0 ? 20 : 0 }]}
      onPress={() => {
        router.push(`/(protected)/details?movieId=${favorite.movieId}` as any);
      }}
    >
      <Image
        testID={`favorite-poster-${favorite.movieId}`}
        source={{
          uri: favorite.movieData?.poster_path
            ? `https://image.tmdb.org/t/p/w500${favorite.movieData.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image",
        }}
        style={styles.moviePoster}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#EC8B00" />
        <Text style={styles.loadingText}>Carregando favoritos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <ErrorComponent
        title="Erro ao carregar favoritos"
        message="Não foi possível carregar sua lista de favoritos. Verifique sua conexão e tente novamente."
        onRetry={() => {
          // The query will automatically refetch
        }}
      />
    );
  }

  if (favoriteMovies.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyText}>Nenhum filme favorito</Text>
        <Text style={styles.emptySubText}>
          Adicione filmes aos seus favoritos para vê-los aqui
        </Text>
      </View>
    );
  }

  return (
    <View testID="favorites-container" style={styles.container}>
      <ScrollView
        testID="favorites-scroll"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View testID="favorites-grid" style={styles.moviesGrid}>
          {favoriteMovies.map((favorite, index) =>
            renderMovieItem(favorite, index)
          )}
        </View>
      </ScrollView>
    </View>
  );
}
