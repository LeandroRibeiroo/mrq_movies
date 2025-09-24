import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Animated,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ErrorComponent from "../../../components/ErrorComponent";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { useDetails } from "./hooks/useDetails";

export default function MovieDetailsScreen() {
  const { handleError } = useErrorHandler();

  const {
    HEADER_MAX_HEIGHT,
    handleContentSizeChange,
    handleGoBack,
    handleScrollViewLayout,
    headerBackgroundOpacity,
    headerHeight,
    imageOpacity,
    imageScale,
    isFavorite,
    movie,
    scrollY,
    styles,
    titleOpacity,
    toggleFavorite,
    error,
    toggleLoading,
  } = useDetails();

  useEffect(() => {
    if (error) {
      handleError(error);
    }
  }, [error, handleError]);

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: "#16171B" }}>
        <StatusBar barStyle="light-content" backgroundColor="#16171B" />
        <ErrorComponent
          title="Erro ao carregar filme"
          message="Não foi possível carregar os detalhes do filme. Verifique sua conexão e tente novamente."
          onRetry={() => {
            // The query will automatically refetch
          }}
        />
      </View>
    );
  }

  return (
    <View testID="details-container" style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Animated.View
        testID="details-header"
        style={[styles.header, { height: headerHeight }]}
      >
        <Animated.View
          style={[
            styles.headerBackground,
            { opacity: headerBackgroundOpacity },
          ]}
        />
        <Animated.Image
          testID="details-backdrop"
          source={{ uri: movie.backdropUrl }}
          style={[
            styles.headerImage,
            {
              opacity: imageOpacity,
              transform: [{ scale: imageScale }],
            },
          ]}
          resizeMode="cover"
        />

        <View testID="details-header-controls" style={styles.headerControls}>
          <TouchableOpacity
            testID="details-back-button"
            style={styles.headerButton}
            onPress={handleGoBack}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Animated.Text
            testID="details-header-title"
            style={[styles.headerTitle, { opacity: titleOpacity }]}
          >
            {movie.title}
          </Animated.Text>

          <TouchableOpacity
            testID="details-favorite-button"
            style={styles.headerButton}
            onPress={toggleFavorite}
            disabled={toggleLoading}
          >
            {toggleLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons
                testID={
                  isFavorite ? "details-heart-filled" : "details-heart-outline"
                }
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "#EC8B00" : "#FFFFFF"}
              />
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        testID="details-scroll-view"
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleScrollViewLayout}
      >
        {/* Spacer for header */}
        <View style={{ height: HEADER_MAX_HEIGHT - 50 }} />

        <View testID="details-movie-card" style={styles.movieCard}>
          <View testID="details-movie-header" style={styles.movieHeader}>
            <View style={styles.movieBasicInfo}>
              <Text testID="details-movie-title" style={styles.movieTitle}>
                {movie.title}
              </Text>
              <Text
                testID="details-movie-subtitle"
                style={styles.movieSubtitle}
              >
                {movie.originalTitle}
              </Text>
            </View>
          </View>

          <View testID="details-synopsis-section" style={styles.section}>
            <Text style={styles.sectionTitle}>SINOPSE</Text>
            <Text testID="details-synopsis-text" style={styles.synopsis}>
              {movie.synopsis}
            </Text>
          </View>

          <View testID="details-grid" style={styles.detailsGrid}>
            <View testID="details-genre-item" style={styles.detailItem}>
              <View style={styles.detailHeader}>
                <Ionicons name="film-outline" size={20} color="#EC8B00" />
                <Text testID="details-genre-label" style={styles.detailLabel}>
                  GÊNERO
                </Text>
              </View>
              <Text testID="details-genre-text" style={styles.detailText}>
                {movie.genre}
              </Text>
            </View>

            <View testID="details-director-item" style={styles.detailItem}>
              <View style={styles.detailHeader}>
                <Ionicons name="person-outline" size={20} color="#EC8B00" />
                <Text
                  testID="details-director-label"
                  style={styles.detailLabel}
                >
                  DIRETOR
                </Text>
              </View>
              <Text testID="details-director-text" style={styles.detailText}>
                {movie.director}
              </Text>
            </View>

            <View testID="details-cast-item" style={styles.detailItem}>
              <View style={styles.detailHeader}>
                <Ionicons name="people-outline" size={20} color="#EC8B00" />
                <Text testID="details-cast-label" style={styles.detailLabel}>
                  ELENCO
                </Text>
              </View>
              <Text testID="details-cast-text" style={styles.detailText}>
                {movie.cast}
              </Text>
            </View>

            <View testID="details-rating-item" style={styles.detailItem}>
              <View style={styles.detailHeader}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="#EC8B00"
                />
                <Text testID="details-rating-label" style={styles.detailLabel}>
                  CLASSIFICAÇÃO
                </Text>
              </View>
              <Text testID="details-rating-text" style={styles.detailText}>
                12 anos
              </Text>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
