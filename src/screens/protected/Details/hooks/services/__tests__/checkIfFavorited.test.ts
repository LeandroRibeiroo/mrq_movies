import MockAdapter from "axios-mock-adapter";
import { apiClient } from "../../../../../../shared/services/api";
import { checkIfFavorited } from "../checkIfFavorited";
import { CheckFavoriteResponse } from "../../interfaces/check-favorite-response";

jest.mock("../../../../../../shared/services/storage", () => ({
  tokenStorage: {
    getToken: jest.fn(),
    removeToken: jest.fn(),
  },
}));

describe("checkIfFavorited Service", () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(apiClient);
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockAxios.restore();
  });

  describe("Successful Responses", () => {
    it("should return true when movie is favorited", async () => {
      const movieId = 123;
      const expectedResponse: CheckFavoriteResponse = { isFavorite: true };

      mockAxios
        .onGet(`/api/movies/favorites/check/${movieId}`)
        .reply(200, expectedResponse);

      const result = await checkIfFavorited(movieId);

      expect(result).toEqual(expectedResponse);
      expect(result.isFavorite).toBe(true);
    });

    it("should return false when movie is not favorited", async () => {
      const movieId = 456;
      const expectedResponse: CheckFavoriteResponse = { isFavorite: false };

      mockAxios
        .onGet(`/api/movies/favorites/check/${movieId}`)
        .reply(200, expectedResponse);

      const result = await checkIfFavorited(movieId);

      expect(result).toEqual(expectedResponse);
      expect(result.isFavorite).toBe(false);
    });

    it("should handle different movie IDs correctly", async () => {
      const movieIds = [1, 999, 12345];
      const responses = [
        { isFavorite: true },
        { isFavorite: false },
        { isFavorite: true },
      ];

      // Setup multiple endpoints
      movieIds.forEach((id, index) => {
        mockAxios
          .onGet(`/api/movies/favorites/check/${id}`)
          .reply(200, responses[index]);
      });

      // Test each movie ID
      for (let i = 0; i < movieIds.length; i++) {
        const result = await checkIfFavorited(movieIds[i]);
        expect(result).toEqual(responses[i]);
      }
    });
  });

  describe("Error Handling", () => {
    it("should throw error when movie is not found (404)", async () => {
      const movieId = 999;
      mockAxios.onGet(`/api/movies/favorites/check/${movieId}`).reply(404, {
        message: "Movie not found",
        error: "NOT_FOUND",
      });

      await expect(checkIfFavorited(movieId)).rejects.toMatchObject({
        message: "Movie not found",
        statusCode: 404,
        error: "NOT_FOUND",
      });
    });

    it("should throw error when unauthorized (401)", async () => {
      const movieId = 123;
      mockAxios.onGet(`/api/movies/favorites/check/${movieId}`).reply(401, {
        message: "Unauthorized",
        error: "UNAUTHORIZED",
      });

      await expect(checkIfFavorited(movieId)).rejects.toMatchObject({
        message: "Unauthorized",
        statusCode: 401,
        error: "UNAUTHORIZED",
      });
    });

    it("should throw error on server error (500)", async () => {
      const movieId = 123;
      mockAxios.onGet(`/api/movies/favorites/check/${movieId}`).reply(500, {
        message: "Internal server error",
      });

      await expect(checkIfFavorited(movieId)).rejects.toMatchObject({
        message: "Internal server error",
        statusCode: 500,
      });
    });

    it("should throw error on network failure", async () => {
      const movieId = 123;
      mockAxios.onGet(`/api/movies/favorites/check/${movieId}`).networkError();

      await expect(checkIfFavorited(movieId)).rejects.toMatchObject({
        message: "An unexpected error occurred.",
        statusCode: 0,
      });
    });
  });

  describe("Request Validation", () => {
    it("should call correct API endpoint with movie ID", async () => {
      const movieId = 789;
      mockAxios
        .onGet(`/api/movies/favorites/check/${movieId}`)
        .reply(200, { isFavorite: false });

      await checkIfFavorited(movieId);

      expect(mockAxios.history.get).toHaveLength(1);
      expect(mockAxios.history.get[0].url).toBe(
        `/api/movies/favorites/check/${movieId}`
      );
    });

    it("should handle zero as valid movie ID", async () => {
      const movieId = 0;
      mockAxios
        .onGet(`/api/movies/favorites/check/${movieId}`)
        .reply(200, { isFavorite: true });

      const result = await checkIfFavorited(movieId);

      expect(result.isFavorite).toBe(true);
      expect(mockAxios.history.get[0].url).toBe(
        "/api/movies/favorites/check/0"
      );
    });

    it("should handle negative movie ID", async () => {
      const movieId = -1;
      mockAxios.onGet(`/api/movies/favorites/check/${movieId}`).reply(400, {
        message: "Invalid movie ID",
        error: "VALIDATION_ERROR",
      });

      await expect(checkIfFavorited(movieId)).rejects.toMatchObject({
        message: "Invalid movie ID",
        statusCode: 400,
      });
    });
  });
});
