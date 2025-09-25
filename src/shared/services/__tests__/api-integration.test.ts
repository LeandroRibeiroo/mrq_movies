// src/shared/services/__tests__/api-integration.test.ts

import MockAdapter from "axios-mock-adapter";
import { apiClient } from "../api";
import { tokenStorage } from "../storage";
import { ApiError } from "../../interfaces/api-error";

jest.mock("../storage", () => ({
  tokenStorage: {
    getToken: jest.fn(),
    removeToken: jest.fn(),
  },
}));

jest.mock("react-native-config", () => ({
  API_BASE_URL: "https://api.test.com",
}));

describe("API Client - Integration Tests (Accurate Errors)", () => {
  let mockAxios: MockAdapter;
  const mockToken = "integration-test-token";
  const genericError = {
    message: "An unexpected error occurred.",
    statusCode: 0,
  };

  beforeEach(() => {
    mockAxios = new MockAdapter(apiClient);
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockAxios.restore();
  });

  describe("Authentication Flow", () => {
    it("handles complete authenticated request flow", async () => {
      (tokenStorage.getToken as jest.Mock).mockReturnValue(mockToken);

      const mockUserData = { id: 1, name: "John Doe" };
      mockAxios.onGet("/users/profile").reply((config) => {
        expect(config.headers?.Authorization).toBe(`Bearer ${mockToken}`);
        return [200, mockUserData];
      });

      const response = await apiClient.get("/users/profile");
      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockUserData);
    });

    it("handles authentication failure with real error and token removal", async () => {
      (tokenStorage.getToken as jest.Mock).mockReturnValue(mockToken);
      const err = {
        message: "Refresh token expired",
        error: "REFRESH_TOKEN_EXPIRED",
      };
      mockAxios.onPost("/auth/refresh").reply(401, err);

      await expect(apiClient.post("/auth/refresh")).rejects.toMatchObject({
        message: err.message,
        statusCode: 401,
        error: err.error,
      });
      expect(tokenStorage.removeToken).toHaveBeenCalled();
    });

    it("handles public request without token", async () => {
      (tokenStorage.getToken as jest.Mock).mockReturnValue(null);
      const mockData = { message: "Public data" };
      mockAxios.onGet("/public/data").reply((config) => {
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, mockData];
      });

      const response = await apiClient.get("/public/data");
      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockData);
    });
  });

  describe("CRUD Operations Flow", () => {
    beforeEach(() =>
      (tokenStorage.getToken as jest.Mock).mockReturnValue(mockToken)
    );

    it("handles validation errors with real error", async () => {
      const invalidUser = { name: "", email: "invalid" };
      const err = { message: "Validation failed", error: "VALIDATION_ERROR" };
      mockAxios.onPost("/users").reply(400, err);

      await expect(apiClient.post("/users", invalidUser)).rejects.toMatchObject(
        {
          message: err.message,
          statusCode: 400,
          error: err.error,
        }
      );
      expect(tokenStorage.removeToken).not.toHaveBeenCalled();
    });
  });

  describe("Multiple Request Scenarios", () => {
    beforeEach(() =>
      (tokenStorage.getToken as jest.Mock).mockReturnValue(mockToken)
    );

    it("handles mixed success and HTTP errors accurately", async () => {
      mockAxios.onGet("/users").reply(200, [{ id: 1 }]);
      const postErr = { message: "Posts not found", error: "NOT_FOUND" };
      mockAxios.onGet("/posts").reply(404, postErr);
      mockAxios.onGet("/comments").networkError();

      const usersRes = await apiClient.get("/users");
      expect(Array.isArray(usersRes.data)).toBe(true);

      await expect(apiClient.get("/posts")).rejects.toMatchObject({
        message: postErr.message,
        statusCode: 404,
        error: postErr.error,
      });
      await expect(apiClient.get("/comments")).rejects.toMatchObject(
        genericError
      );
    });

    it("handles rate limiting with real error", async () => {
      const err = {
        message: "Too many requests",
        error: "RATE_LIMIT_EXCEEDED",
      };
      mockAxios.onGet("/api/data").reply(429, err);

      await expect(apiClient.get("/api/data")).rejects.toMatchObject({
        message: err.message,
        statusCode: 429,
        error: err.error,
      });
    });
  });

  describe("Error Recovery Scenarios", () => {
    it("handles storage errors as generic error", async () => {
      (tokenStorage.getToken as jest.Mock).mockImplementation(() => {
        throw new Error("Storage unavailable");
      });
      mockAxios.onGet("/test").reply(200, {});

      await expect(apiClient.get("/test")).rejects.toMatchObject(genericError);
    });

    it("handles maintenance mode with real error", async () => {
      (tokenStorage.getToken as jest.Mock).mockReturnValue(mockToken);
      const err = {
        message: "Service temporarily unavailable",
        error: "MAINTENANCE_MODE",
      };
      mockAxios.onAny().reply(503, err);

      await expect(apiClient.get("/users")).rejects.toMatchObject({
        message: err.message,
        statusCode: 503,
        error: err.error,
      });
      await expect(apiClient.post("/posts", {})).rejects.toMatchObject({
        message: err.message,
        statusCode: 503,
        error: err.error,
      });
    });
  });

  describe("Performance and Reliability", () => {
    beforeEach(() =>
      (tokenStorage.getToken as jest.Mock).mockReturnValue(mockToken)
    );

    it("handles timeout as generic error", async () => {
      mockAxios.onGet("/slow-endpoint").timeout();

      await expect(apiClient.get("/slow-endpoint")).rejects.toMatchObject(
        genericError
      );
    });

    it("handles concurrent requests", async () => {
      mockAxios.onGet("/a").reply(200, []);
      mockAxios.onGet("/b").reply(200, []);
      mockAxios.onGet("/c").reply(200, []);

      const responses = await Promise.all([
        apiClient.get("/a"),
        apiClient.get("/b"),
        apiClient.get("/c"),
      ]);
      expect(responses.every((r) => r.status === 200)).toBe(true);
      expect(tokenStorage.getToken).toHaveBeenCalledTimes(3);
    });
  });
});
