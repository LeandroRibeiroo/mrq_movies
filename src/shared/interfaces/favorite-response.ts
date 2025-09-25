import { Movie } from "@/src/shared/interfaces/movie";

export interface FavoriteResponse {
  id: string;
  userId: string;
  movieId: number;
  createdAt: string;
  movieData: Movie;
}
