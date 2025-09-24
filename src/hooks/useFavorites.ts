import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { favoritesService } from "../services/movieService";
import {
  AddFavoriteDto,
  ApiError,
  CheckFavoriteResponse,
  FavoritesListResponse,
} from "../types/api";

export const FAVORITES_QUERY_KEYS = {
  LIST: "favorites-list",
  CHECK: "check-favorite",
} as const;

export const useFavoritesList = (): UseQueryResult<
  FavoritesListResponse,
  ApiError
> => {
  return useQuery({
    queryKey: [FAVORITES_QUERY_KEYS.LIST],
    queryFn: favoritesService.getFavoritesList,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useCheckFavorite = (
  movieId: number
): UseQueryResult<CheckFavoriteResponse, ApiError> => {
  return useQuery({
    queryKey: [FAVORITES_QUERY_KEYS.CHECK, movieId],
    queryFn: () => favoritesService.checkIfFavorited(movieId),
    enabled: !!movieId,
    staleTime: 1 * 60 * 1000,
  });
};

export const useAddToFavorites = (): UseMutationResult<
  void,
  ApiError,
  AddFavoriteDto
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: favoritesService.addToFavorites,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [FAVORITES_QUERY_KEYS.LIST] });

      queryClient.setQueryData(
        [FAVORITES_QUERY_KEYS.CHECK, variables.movieId],
        { isFavorited: true }
      );
    },
    onError: (error) => {
      console.error("Error adding to favorites", error);
    },
  });
};

export const useRemoveFromFavorites = (): UseMutationResult<
  void,
  ApiError,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: favoritesService.removeFromFavorites,
    onSuccess: (_, movieId) => {
      queryClient.invalidateQueries({ queryKey: [FAVORITES_QUERY_KEYS.LIST] });

      queryClient.setQueryData([FAVORITES_QUERY_KEYS.CHECK, movieId], {
        isFavorited: false,
      });
    },
  });
};

export const useToggleFavorite = () => {
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  const toggleFavorite = (movieId: number, isFavorited: boolean) => {
    if (isFavorited) {
      removeFromFavorites.mutate(movieId);
    } else {
      addToFavorites.mutate({ movieId });
    }
  };

  return {
    toggleFavorite,
    isLoading: addToFavorites.isPending || removeFromFavorites.isPending,
    error: addToFavorites.error || removeFromFavorites.error,
  };
};
