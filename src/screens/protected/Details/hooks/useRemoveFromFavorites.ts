import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { FAVORITES_QUERY_KEYS } from "./utils/queryKeys";
import { ApiError } from "@/src/shared/interfaces/api-error";
import { removeFromFavorites } from "./services/removeFromFavorites";

export const useRemoveFromFavorites = (): UseMutationResult<
  void,
  ApiError,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromFavorites,
    onSuccess: (_, movieId) => {
      queryClient.invalidateQueries({ queryKey: [FAVORITES_QUERY_KEYS.LIST] });

      queryClient.setQueryData([FAVORITES_QUERY_KEYS.CHECK, movieId], {
        isFavorite: false,
      });
    },
  });
};
