import MockAdapter from "axios-mock-adapter";
import { apiClient } from "../api";
import { tokenStorage } from "../storage";

jest.mock("../storage", () => ({
  tokenStorage: {
    getToken: jest.fn(),
    removeToken: jest.fn(),
  },
}));

jest.mock("react-native-config", () => ({
  API_BASE_URL: "https://api.test.com",
}));

describe("API Client - Unit Tests (Accurate Errors)", () => {
  let mockAxios: MockAdapter;
  const mockToken = "test-bearer-token";

  beforeEach(() => {
    mockAxios = new MockAdapter(apiClient);
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it("should return response for successful requests", async () => {
    const mockData = { id: 1, name: "Test" };
    mockAxios.onGet("/test").reply(200, mockData);

    const res = await apiClient.get("/test");
    expect(res.data).toEqual(mockData);
  });

  it("should handle 401 and remove token", async () => {
    (tokenStorage.getToken as jest.Mock).mockReturnValue(mockToken);
    const err = { message: "Unauthorized", error: "TOKEN_EXPIRED" };
    mockAxios.onGet("/auth").reply(401, err);

    await expect(apiClient.get("/auth")).rejects.toMatchObject({
      message: err.message,
      statusCode: 401,
      error: err.error,
    });
    expect(tokenStorage.removeToken).toHaveBeenCalled();
  });

  it("should handle 400 errors without removing token", async () => {
    const err = { message: "Bad Request", error: "VALIDATION_FAILED" };
    mockAxios.onPost("/users").reply(400, err);

    await expect(apiClient.post("/users", {})).rejects.toMatchObject({
      message: err.message,
      statusCode: 400,
      error: err.error,
    });
    expect(tokenStorage.removeToken).not.toHaveBeenCalled();
  });

  it("should handle 500 errors", async () => {
    const err = { message: "Server Error" };
    mockAxios.onGet("/error").reply(500, err);

    await expect(apiClient.get("/error")).rejects.toMatchObject({
      message: err.message,
      statusCode: 500,
    });
    expect(tokenStorage.removeToken).not.toHaveBeenCalled();
  });

  it("should handle network errors", async () => {
    mockAxios.onGet("/network").networkError();

    await expect(apiClient.get("/network")).rejects.toMatchObject({
      message: "An unexpected error occurred.",
      statusCode: 0,
    });
  });

  it("should handle timeout errors", async () => {
    mockAxios.onGet("/timeout").timeout();

    await expect(apiClient.get("/timeout")).rejects.toMatchObject({
      message: "An unexpected error occurred.",
      statusCode: 0,
    });
  });

  it("should handle storage errors as generic error", async () => {
    (tokenStorage.getToken as jest.Mock).mockImplementation(() => {
      throw new Error("Storage fail");
    });
    mockAxios.onGet("/test").reply(200, {});

    await expect(apiClient.get("/test")).rejects.toMatchObject({
      message: "An unexpected error occurred.",
      statusCode: 0,
    });
  });
});
