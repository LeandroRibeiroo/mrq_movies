import apiClient from "../../../../services/api";
import {
  AddFavoriteDto,
  CheckFavoriteResponse,
  FavoritesListResponse,
} from "../interface/favorites";

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

export default favoritesService;
