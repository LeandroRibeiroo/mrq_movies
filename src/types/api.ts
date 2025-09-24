export interface SignInDto {
  username: string;
  password: string;
}

export interface AuthResponseDto {
  access_token: string;
  user: {
    id: string;
    username: string;
    name: string;
  };
}

export interface AddFavoriteDto {
  movieId: number;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  budget: number;
  revenue: number;
  homepage: string;
  imdb_id: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
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

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
