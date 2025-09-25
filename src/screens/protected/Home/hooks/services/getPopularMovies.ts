import { MoviesResponse } from "@/src/shared/interfaces/movie";
import { apiClient } from "@/src/shared/services/api";

const getPopularMovies = async (page: number = 1): Promise<MoviesResponse> => {
  const response = await apiClient.get<MoviesResponse>(
    `/api/movies/popular?page=${page}`
  );

  return response.data;
};

export { getPopularMovies };
