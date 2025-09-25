import { useInfiniteQuery } from "@tanstack/react-query";
import { getPopularMovies } from "./services/getPopularMovies";
import { MOVIE_QUERY_KEYS } from "./utils/movieQueryKeys";

export const useInfinitePopularMovies = () => {
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
