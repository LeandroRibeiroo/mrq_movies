import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { FAVORITES_QUERY_KEYS } from "../../Details/hooks/utils/queryKeys";
import { ApiError } from "@/src/shared/interfaces/api-error";
import { FavoritesListResponse } from "../../Details/hooks/interfaces/favorites-list-response";
import { getFavoritesList } from "./services/getFavoritesList";

export const useFavoritesList = (): UseQueryResult<
  FavoritesListResponse,
  ApiError
> => {
  return useQuery({
    queryKey: [FAVORITES_QUERY_KEYS.LIST],
    queryFn: getFavoritesList,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
