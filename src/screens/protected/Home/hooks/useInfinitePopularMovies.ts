import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { MOVIE_QUERY_KEYS } from "../utils/movieQueryKeys";
import { ApiError } from "@/src/shared/interfaces/api-error";
import { MoviesResponse } from "@/src/shared/interfaces/movie";
import { getPopularMovies } from "./services/getPopularMovies";

export const useInfinitePopularMovies = (): UseInfiniteQueryResult<
  MoviesResponse,
  ApiError
> => {
  return useInfiniteQuery({
    queryKey: [MOVIE_QUERY_KEYS.POPULAR, "infinite"],
    queryFn: ({ pageParam = 1 }) => getPopularMovies(pageParam),
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
