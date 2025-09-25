import apiClient from "@/src/shared/services/api";
import { CheckFavoriteResponse } from "../interfaces/check-favorite-response";

const checkIfFavorited = async (
  movieId: number
): Promise<CheckFavoriteResponse> => {
  const response = await apiClient.get<CheckFavoriteResponse>(
    `/api/movies/favorites/check/${movieId}`
  );

  return response.data;
};

export { checkIfFavorited };
