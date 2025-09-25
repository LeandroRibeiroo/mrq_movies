import { apiClient } from "../../../../../shared/services/api";
import { AddFavorite } from "../interfaces/add-to-favorite";

const addToFavorites = async (movieData: AddFavorite): Promise<void> => {
  await apiClient.post("/api/movies/favorites", movieData);
};

export { addToFavorites };
