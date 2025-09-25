import apiClient from "@/src/shared/services/api";

const removeFromFavorites = async (movieId: number): Promise<void> => {
  await apiClient.delete(`/api/movies/favorites/${movieId}`);
};

export { removeFromFavorites };
