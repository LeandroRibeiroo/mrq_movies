import MockAdapter from "axios-mock-adapter";
import { apiClient } from "../../../../../../shared/services/api";
import { addToFavorites } from "../addToFavorite";
import { AddFavorite } from "../../interfaces/add-to-favorite";

jest.mock("../../../../../../shared/services/storage", () => ({
  tokenStorage: {
    getToken: jest.fn(),
    removeToken: jest.fn(),
  },
}));

describe("addToFavorites Service", () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(apiClient);
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockAxios.restore();
  });

  describe("Successful Responses", () => {
    it("should successfully add movie to favorites", async () => {
      const movieData: AddFavorite = { movieId: 123 };

      mockAxios.onPost("/api/movies/favorites", movieData).reply(201);

      await expect(addToFavorites(movieData)).resolves.toBeUndefined();
    });

    it("should handle different movie IDs correctly", async () => {
      const testCases = [{ movieId: 1 }, { movieId: 999 }, { movieId: 12345 }];

      // Setup multiple endpoints
      testCases.forEach((movieData) => {
        mockAxios.onPost("/api/movies/favorites", movieData).reply(201);
      });

      // Test each movie ID
      for (const movieData of testCases) {
        await expect(addToFavorites(movieData)).resolves.toBeUndefined();
      }
    });

    it("should handle 200 response as well as 201", async () => {
      const movieData: AddFavorite = { movieId: 456 };

      mockAxios.onPost("/api/movies/favorites", movieData).reply(200);

      await expect(addToFavorites(movieData)).resolves.toBeUndefined();
    });
  });

  describe("Error Handling", () => {
    it("should throw error when movie is already favorited (409)", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      mockAxios.onPost("/api/movies/favorites", movieData).reply(409, {
        message: "Movie already in favorites",
        error: "CONFLICT",
      });

      await expect(addToFavorites(movieData)).rejects.toMatchObject({
        message: "Movie already in favorites",
        statusCode: 409,
        error: "CONFLICT",
      });
    });

    it("should throw error when unauthorized (401)", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      mockAxios.onPost("/api/movies/favorites", movieData).reply(401, {
        message: "Unauthorized",
        error: "UNAUTHORIZED",
      });

      await expect(addToFavorites(movieData)).rejects.toMatchObject({
        message: "Unauthorized",
        statusCode: 401,
        error: "UNAUTHORIZED",
      });
    });

    it("should throw error when movie not found (404)", async () => {
      const movieData: AddFavorite = { movieId: 999 };
      mockAxios.onPost("/api/movies/favorites", movieData).reply(404, {
        message: "Movie not found",
        error: "NOT_FOUND",
      });

      await expect(addToFavorites(movieData)).rejects.toMatchObject({
        message: "Movie not found",
        statusCode: 404,
        error: "NOT_FOUND",
      });
    });

    it("should throw error on server error (500)", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      mockAxios.onPost("/api/movies/favorites", movieData).reply(500, {
        message: "Internal server error",
      });

      await expect(addToFavorites(movieData)).rejects.toMatchObject({
        message: "Internal server error",
        statusCode: 500,
      });
    });

    it("should throw error on network failure", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      mockAxios.onPost("/api/movies/favorites", movieData).networkError();

      await expect(addToFavorites(movieData)).rejects.toMatchObject({
        message: "An unexpected error occurred.",
        statusCode: 0,
      });
    });

    it("should throw error on validation error (400)", async () => {
      const movieData: AddFavorite = { movieId: -1 };
      mockAxios.onPost("/api/movies/favorites", movieData).reply(400, {
        message: "Invalid movie ID",
        error: "VALIDATION_ERROR",
      });

      await expect(addToFavorites(movieData)).rejects.toMatchObject({
        message: "Invalid movie ID",
        statusCode: 400,
        error: "VALIDATION_ERROR",
      });
    });
  });

  describe("Request Validation", () => {
    it("should call correct API endpoint with movie data", async () => {
      const movieData: AddFavorite = { movieId: 789 };
      mockAxios.onPost("/api/movies/favorites", movieData).reply(201);

      await addToFavorites(movieData);

      expect(mockAxios.history.post).toHaveLength(1);
      expect(mockAxios.history.post[0].url).toBe("/api/movies/favorites");
      expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(movieData);
    });

    it("should handle zero as valid movie ID", async () => {
      const movieData: AddFavorite = { movieId: 0 };
      mockAxios.onPost("/api/movies/favorites", movieData).reply(201);

      await addToFavorites(movieData);

      expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(movieData);
    });

    it("should send correct content-type header", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      mockAxios.onPost("/api/movies/favorites", movieData).reply(201);

      await addToFavorites(movieData);

      expect(mockAxios.history.post[0].headers?.["Content-Type"]).toContain(
        "application/json"
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle large movie IDs", async () => {
      const movieData: AddFavorite = { movieId: 999999999 };
      mockAxios.onPost("/api/movies/favorites", movieData).reply(201);

      await expect(addToFavorites(movieData)).resolves.toBeUndefined();
      expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(movieData);
    });

    it("should handle timeout errors", async () => {
      const movieData: AddFavorite = { movieId: 123 };
      mockAxios.onPost("/api/movies/favorites", movieData).timeout();

      await expect(addToFavorites(movieData)).rejects.toMatchObject({
        message: "An unexpected error occurred.",
        statusCode: 0,
      });
    });
  });
});
