# Integration Tests - BRQ Movies

This document provides a comprehensive overview of the integration testing strategy and implementation for the BRQ Movies React Native application.

## 📋 Table of Contents

- [Overview](#overview)
- [Testing Architecture](#testing-architecture)
- [Test Suites](#test-suites)
- [Running Tests](#running-tests)
- [Test Patterns](#test-patterns)
- [Coverage Areas](#coverage-areas)
- [Contributing](#contributing)

## 🎯 Overview

The integration tests in this project validate the complete data flow from UI components through business logic to data persistence. These tests ensure that all layers of the application work together correctly in realistic scenarios, covering both successful operations and error conditions.

### Key Integration Points Tested

- UI Components → Custom Hooks → Services → API → Storage
- React Query cache management and invalidation
- Authentication token lifecycle management
- Error propagation through all application layers
- State synchronization between components and stores

## 🏗️ Testing Architecture

### Technology Stack

- **Testing Framework:** Jest with React Native Testing Library
- **API Mocking:** Axios Mock Adapter for HTTP request simulation
- **State Management:** React Query with custom QueryClient configurations
- **Storage Mocking:** Jest mocks for MMKV storage operations
- **Component Testing:** React Native Testing Library for UI interactions

### Project Structure

```
src/
├── screens/
│   ├── logged-out/SignIn/__tests__/
│   │   └── SignIn.integration.test.tsx
│   └── protected/Details/hooks/__tests__/
│       ├── useAddToFavorites.integration.test.tsx
│       └── useCheckFavorite.integration.test.tsx
├── shared/
│   ├── services/__tests__/
│   │   ├── api-integration.test.ts
│   │   └── storage-integration.test.ts
│   └── store/__tests__/
│       └── authStore-integration.test.ts
```

## 🧪 Test Suites

### 1. **useAddToFavorites Integration Tests**

**File:** `src/screens/protected/Details/hooks/__tests__/useAddToFavorites.integration.test.tsx`

Tests the complete flow of adding movies to favorites from React hook through API service layer.

**Key Scenarios:**

- ✅ Successful API integration with proper authentication
- ❌ Error handling (409 Conflict, 401 Unauthorized, 404 Not Found, 400 Validation, 500 Server Error)
- 🔄 Mutation state management (`isIdle`, `isPending`, `isSuccess`, `isError`)
- 📦 Query cache integration and invalidation
- 🎯 Edge cases (zero movie ID, large IDs, empty responses)

**Example Test:**

```typescript
it("should successfully add movie to favorites through service to hook", async () => {
  const movieData: AddFavorite = { movieId: 123 };
  mockAxios.onPost("/api/movies/favorites", movieData).reply(201);

  const { result } = renderHook(() => useAddToFavorites(), {
    wrapper: createWrapper(),
  });

  act(() => {
    result.current.mutate(movieData);
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(mockAxios.history.post[0].headers?.Authorization).toBe(
    "Bearer mock-token"
  );
});
```

### 2. **useCheckFavorite Integration Tests**

**File:** `src/screens/protected/Details/hooks/__tests__/useCheckFavorite.integration.test.tsx`

Validates the complete flow for checking if a movie is favorited, testing React Query integration with the API.

**Key Scenarios:**

- ✅ Successful API integration for both favorited and non-favorited movies
- ❌ Error handling (404, 401, 500, network/timeout errors)
- 🔄 Query state management with conditional fetching (`enabled` parameter)
- 💾 Caching and performance optimization with `staleTime`
- 🎯 Edge cases (malformed responses, large movie IDs)

### 3. **API Client Integration Tests**

**File:** `src/shared/services/__tests__/api-integration.test.ts`

Tests the core API client functionality, focusing on authentication, error handling, and request/response processing.

**Key Scenarios:**

- 🔐 Authentication flow (token injection, automatic token removal on 401)
- 🌐 CRUD operations with proper error handling
- ⚡ Multiple request scenarios (concurrent requests, rate limiting)
- 🛠️ Error recovery (storage errors, maintenance mode)
- 📊 Performance and reliability (timeouts, network errors)

### 4. **SignIn Integration Tests**

**File:** `src/screens/logged-out/SignIn/__tests__/SignIn.integration.test.tsx`

Validates the complete sign-in flow from UI interaction through authentication service to state management.

**Key Scenarios:**

- ✅ Complete authentication flow (form submission → service call → store update)
- ❌ Error handling during authentication
- 📝 Form integration with React Hook Form
- 🔄 UI state management and loading states

### 5. **AuthStore Integration Tests**

**File:** `src/shared/store/__tests__/authStore-integration.test.ts`

Tests the Zustand-based authentication store's integration with the storage layer.

**Key Scenarios:**

- 🔄 Multiple login/logout cycles
- 💾 Storage integration with proper cleanup
- 📊 State persistence across authentication cycles
- 👤 User data management and validation

### 6. **Storage Integration Tests**

**File:** `src/shared/services/__tests__/storage-integration.test.ts`

Validates the MMKV-based storage system's integration for authentication data persistence.

**Key Scenarios:**

- 💾 Complete auth flow (storage → retrieval → cleanup)
- 🚪 Logout scenario with individual data removal
- 🔧 Storage operations (token and user data management)

## 🚀 Running Tests

### Run All Integration Tests

```bash
# Run all tests
npm test

# Run only integration tests
npm test -- --testNamePattern="Integration"

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run with verbose output
npm run test:verbose
```

### Run Specific Test Suites

```bash
# Run specific integration test file
npm test -- useAddToFavorites.integration.test.tsx

# Run all API-related integration tests
npm test -- api-integration.test.ts

# Run authentication-related tests
npm test -- --testPathPattern="auth"
```

## 🎨 Test Patterns

### 1. **Mock Setup Pattern**

```typescript
const createWrapper = (customOptions?: any) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0, cacheTime: 0 },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
```

### 2. **API Mocking Pattern**

```typescript
beforeEach(() => {
  mockAxios = new MockAdapter(apiClient);
  jest.clearAllMocks();
});

afterEach(() => {
  mockAxios.restore();
});
```

### 3. **Error Testing Pattern**

```typescript
it("should handle 409 conflict errors", async () => {
  const errorResponse = {
    message: "Movie already in favorites",
    error: "CONFLICT",
  };

  mockAxios.onPost("/api/movies/favorites").reply(409, errorResponse);

  await waitFor(() => expect(result.current.isError).toBe(true));

  expect(result.current.error).toMatchObject({
    message: errorResponse.message,
    statusCode: 409,
    error: errorResponse.error,
  });
});
```

### 4. **State Management Testing Pattern**

```typescript
// Initial state verification
expect(result.current.isIdle).toBe(true);
expect(result.current.isPending).toBe(false);

// Action trigger
act(() => {
  result.current.mutate(data);
});

// Final state verification
await waitFor(() => expect(result.current.isSuccess).toBe(true));
```

## 📊 Coverage Areas

### ✅ Covered Scenarios

- **Authentication Flow:** Login, logout, token management, session persistence
- **Favorites Management:** Add to favorites, check favorite status, cache invalidation
- **Error Handling:** HTTP errors (400, 401, 404, 409, 500), network errors, timeouts
- **State Management:** React Query states, Zustand store states, loading indicators
- **Storage Operations:** Token storage, user data persistence, cleanup operations
- **Edge Cases:** Invalid inputs, malformed responses, large values, zero values

### 🎯 Integration Points

- **UI → Hooks:** Component interactions with custom hooks
- **Hooks → Services:** Custom hooks calling business logic services
- **Services → API:** Service layer making HTTP requests
- **API → Storage:** Authentication token management and persistence
- **Cache Management:** React Query cache invalidation and updates

## 🤝 Contributing

### Adding New Integration Tests

1. **Follow the naming convention:** `*.integration.test.tsx` or `*.integration.test.ts`
2. **Use the established patterns:** Mock setup, wrapper creation, error handling
3. **Test the complete flow:** Don't just test individual functions, test the integration
4. **Cover error scenarios:** Always test both success and failure cases
5. **Validate state changes:** Ensure proper state transitions are tested

### Test Structure Guidelines

```typescript
describe("Feature Integration Tests", () => {
  // Setup and teardown
  beforeEach(() => {
    /* setup */
  });
  afterEach(() => {
    /* cleanup */
  });

  describe("Successful Scenarios", () => {
    it("should handle successful operation", async () => {
      // Arrange: Setup mocks and data
      // Act: Trigger the operation
      // Assert: Verify the results
    });
  });

  describe("Error Scenarios", () => {
    it("should handle specific error type", async () => {
      // Test error handling
    });
  });

  describe("Edge Cases", () => {
    it("should handle edge case", async () => {
      // Test boundary conditions
    });
  });
});
```

### Best Practices

- **Mock external dependencies** but test real integration between your modules
- **Use realistic data** that matches production scenarios
- **Test both happy and sad paths** for comprehensive coverage
- **Validate error objects** match expected structure and content
- **Clean up after tests** to prevent test interference
- **Use descriptive test names** that explain the scenario being tested

## 📈 Metrics and Monitoring

### Current Test Coverage

- **Integration Tests:** 6 comprehensive test suites
- **Total Test Cases:** 50+ integration scenarios
- **Error Scenarios:** 20+ different error conditions tested
- **Edge Cases:** 15+ boundary conditions covered

### Key Performance Indicators

- ✅ All critical user flows covered by integration tests
- ✅ Authentication and authorization flows fully tested
- ✅ API error handling comprehensively validated
- ✅ State management integration thoroughly tested
- ✅ Storage operations completely covered

---

## 📞 Support

For questions about the integration tests or to report issues:

1. **Check existing test patterns** in the codebase for examples
2. **Review this documentation** for established practices
3. **Run tests locally** to verify your changes don't break existing functionality
4. **Follow the contributing guidelines** when adding new tests

---

_This README is maintained alongside the integration test suite. Please update it when adding new test scenarios or changing testing patterns._
