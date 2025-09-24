import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { MovieDetails } from "../screens/protected/Details/interface/movieDetails";
import { moviesService as detailsMoviesService } from "../screens/protected/Details/services/moviesService";
import { MoviesResponse } from "../screens/protected/Home/interface/movies";
import { moviesService as homeMoviesService } from "../screens/protected/Home/services/moviesService";
import { ApiError } from "../shared/interfaces/api";

export const MOVIE_QUERY_KEYS = {
  POPULAR: "popular-movies",
  DETAILS: "movie-details",
} as const;

export const usePopularMovies = (
  page: number = 1
): UseQueryResult<MoviesResponse, ApiError> => {
  return useQuery({
    queryKey: [MOVIE_QUERY_KEYS.POPULAR, page],
    queryFn: () => homeMoviesService.getPopularMovies(page),
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
      homeMoviesService.getPopularMovies(pageParam as number),
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
    queryFn: () => detailsMoviesService.getMovieDetails(movieId),
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000,
  });
};
