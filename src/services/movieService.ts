import {
  AddFavoriteDto,
  AuthResponseDto,
  CheckFavoriteResponse,
  FavoritesListResponse,
  MovieDetails,
  MoviesResponse,
  SignInDto,
} from "../types/api";
import apiClient from "./api";

export const authService = {
  signIn: async (credentials: SignInDto): Promise<AuthResponseDto> => {
    const response = await apiClient.post<AuthResponseDto>(
      "/api/auth/signin",
      credentials
    );
    return response.data;
  },
};

export const moviesService = {
  getPopularMovies: async (page: number = 1): Promise<MoviesResponse> => {
    const response = await apiClient.get<MoviesResponse>(
      `/api/movies/popular?page=${page}`
    );
    return response.data;
  },

  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await apiClient.get<MovieDetails>(
      `/api/movies/${movieId}`
    );
    return response.data;
  },
};

export const favoritesService = {
  getFavoritesList: async (): Promise<FavoritesListResponse> => {
    const response = await apiClient.get<any>("/api/movies/favorites/list");

    return {
      favorites: response.data,
    };
  },

  addToFavorites: async (movieData: AddFavoriteDto): Promise<void> => {
    await apiClient.post("/api/movies/favorites", movieData);
  },

  removeFromFavorites: async (movieId: number): Promise<void> => {
    await apiClient.delete(`/api/movies/favorites/${movieId}`);
  },

  checkIfFavorited: async (movieId: number): Promise<CheckFavoriteResponse> => {
    const response = await apiClient.get<CheckFavoriteResponse>(
      `/api/movies/favorites/check/${movieId}`
    );

    return response.data;
  },
};

export const apiService = {
  auth: authService,
  movies: moviesService,
  favorites: favoritesService,
};

export default apiService;
