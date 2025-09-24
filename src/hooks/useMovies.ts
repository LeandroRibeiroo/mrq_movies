import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { moviesService } from "../services/movieService";
import { ApiError, MovieDetails, MoviesResponse } from "../types/api";

export const MOVIE_QUERY_KEYS = {
  POPULAR: "popular-movies",
  DETAILS: "movie-details",
} as const;

export const usePopularMovies = (
  page: number = 1
): UseQueryResult<MoviesResponse, ApiError> => {
  return useQuery({
    queryKey: [MOVIE_QUERY_KEYS.POPULAR, page],
    queryFn: () => moviesService.getPopularMovies(page),
    staleTime: 5 * 60 * 1000,
  });
};

export const useInfinitePopularMovies = (): UseInfiniteQueryResult<
  MoviesResponse,
  ApiError
> => {
  return useInfiniteQuery({
    queryKey: [MOVIE_QUERY_KEYS.POPULAR, "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      moviesService.getPopularMovies(pageParam as number),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMovieDetails = (
  movieId: number
): UseQueryResult<MovieDetails, ApiError> => {
  return useQuery({
    queryKey: [MOVIE_QUERY_KEYS.DETAILS, movieId],
    queryFn: () => moviesService.getMovieDetails(movieId),
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000,
  });
};
