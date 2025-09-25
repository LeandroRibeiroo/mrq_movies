import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { MOVIE_QUERY_KEYS } from "./utils/queryKeys";
import { ApiError } from "@/src/shared/interfaces/api-error";
import { getMovieDetails } from "./services/getMovieDetails";
import { MovieDetails } from "./interfaces/movie-details";

export const useMovieDetails = (
  movieId: number,
  enabled: boolean
): UseQueryResult<MovieDetails, ApiError> => {
  return useQuery({
    queryKey: [MOVIE_QUERY_KEYS.DETAILS, movieId],
    queryFn: () => getMovieDetails(movieId),
    enabled,
    staleTime: 10 * 60 * 1000,
  });
};
