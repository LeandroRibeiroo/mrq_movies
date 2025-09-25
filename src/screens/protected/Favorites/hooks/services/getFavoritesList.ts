import apiClient from "@/src/shared/services/api";
import { FavoritesListResponse } from "../../../Details/hooks/interfaces/favorites-list-response";

const getFavoritesList = async (): Promise<FavoritesListResponse> => {
  const response = await apiClient.get<any>("/api/movies/favorites/list");

  return {
    favorites: response.data,
  };
};

export { getFavoritesList };
