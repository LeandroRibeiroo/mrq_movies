import apiClient from "../../../../services/api";
import { MoviesResponse } from "../interface/movies";

export const moviesService = {
  getPopularMovies: async (page: number = 1): Promise<MoviesResponse> => {
    const response = await apiClient.get<MoviesResponse>(
      `/api/movies/popular?page=${page}`
    );
    return response.data;
  },
};

export default moviesService;
