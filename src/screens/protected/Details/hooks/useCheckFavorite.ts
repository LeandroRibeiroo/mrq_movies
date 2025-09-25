import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiError } from "@/src/shared/interfaces/api-error";
import { FAVORITES_QUERY_KEYS } from "./utils/queryKeys";
import { CheckFavoriteResponse } from "./interfaces/check-favorite-response";
import { checkIfFavorited } from "./services/checkIfFavorited";

export const useCheckFavorite = (
  movieId: number,
  enabled: boolean
): UseQueryResult<CheckFavoriteResponse, ApiError> => {
  return useQuery({
    queryKey: [FAVORITES_QUERY_KEYS.CHECK, movieId],
    queryFn: () => checkIfFavorited(movieId),
    enabled,
    staleTime: 1 * 60 * 1000,
  });
};
