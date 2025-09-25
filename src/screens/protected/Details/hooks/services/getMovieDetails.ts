import { apiClient } from "@/src/shared/services/api";
import { MovieDetails } from "../interfaces/movie-details";

const getMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  const response = await apiClient.get<MovieDetails>(`/api/movies/${movieId}`);
  return response.data;
};

export { getMovieDetails };
