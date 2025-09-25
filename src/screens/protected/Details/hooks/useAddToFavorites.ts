import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { FAVORITES_QUERY_KEYS } from "./utils/queryKeys";
import { ApiError } from "@/src/shared/interfaces/api-error";
import { AddFavorite } from "./interfaces/add-to-favorite";
import { addToFavorites } from "./services/addToFavorite";

export const useAddToFavorites = (): UseMutationResult<
  void,
  ApiError,
  AddFavorite
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToFavorites,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [FAVORITES_QUERY_KEYS.LIST] });

      queryClient.setQueryData(
        [FAVORITES_QUERY_KEYS.CHECK, variables.movieId],
        { isFavorite: true }
      );
    },
    onError: (error) => {
      console.error("Error adding to favorites", error);
    },
  });
};
