import apiClient from "../../../../services/api";
import { MovieDetails } from "../interface/movieDetails";

export const moviesService = {
  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await apiClient.get<MovieDetails>(
      `/api/movies/${movieId}`
    );
    return response.data;
  },
};

export default moviesService;
