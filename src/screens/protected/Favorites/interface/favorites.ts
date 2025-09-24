import { Movie } from "../Home/interface/movies";

export interface AddFavoriteDto {
  movieId: number;
}

export interface FavoriteResponse {
  id: string;
  userId: string;
  movieId: number;
  createdAt: string;
  movieData: Movie;
}

export interface FavoritesListResponse {
  favorites: FavoriteResponse[];
}

export interface CheckFavoriteResponse {
  isFavorite: boolean;
}
