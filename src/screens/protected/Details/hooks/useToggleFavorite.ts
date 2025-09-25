import { useAddToFavorites } from "./useAddToFavorites";
import { useRemoveFromFavorites } from "./useRemoveFromFavorites";

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
