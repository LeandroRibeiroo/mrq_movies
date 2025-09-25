const createMockMMKV = () => {
  const storage = new Map();

  return {
    getString: jest.fn((key) => storage.get(key) || undefined),
    set: jest.fn((key, value) => {
      storage.set(key, value);
    }),
    delete: jest.fn((key) => {
      storage.delete(key);
    }),
    contains: jest.fn((key) => storage.has(key)),
    clearAll: jest.fn(() => {
      storage.clear();
    }),
  };
};

jest.mock("expo/src/winter/ImportMetaRegistry", () => ({
  ImportMetaRegistry: {
    get url() {
      return null;
    },
  },
}));

global.console = {
  ...console,
  error: jest.fn(),
};

// Mock expo modules to prevent import scope errors
jest.mock("expo/src/winter/runtime.native", () => ({}));
jest.mock("expo/src/winter/installGlobal", () => ({}));

// Mock React Native Alert specifically
jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn(),
}));

// Also mock Alert directly
global.Alert = {
  alert: jest.fn(),
};

// Mock expo-image
jest.mock("expo-image", () => ({
  Image: "Image",
}));

// Mock react-native-config
jest.mock("react-native-config", () => ({
  API_BASE_URL: "https://api.test.com",
}));

// Mock react-native-unistyles
jest.mock("react-native-unistyles", () => ({
  useUnistyles: () => ({
    theme: {
      colors: {
        primary: "#007AFF",
        gray: "#999999",
      },
    },
  }),
  StyleSheet: {
    create: (fn) => fn({ colors: {} }),
  },
}));

// Mock the specific image asset
jest.mock("@/assets/images/BRQ_movies_logo.png", () => 123);

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock react-hook-form
jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useForm: jest.fn(() => ({
    control: {},
    handleSubmit: (fn) => fn,
    formState: { errors: {}, isValid: true },
    setValue: jest.fn(),
    watch: () => "",
  })),
  Controller: ({ render }) =>
    render({ field: { onChange: jest.fn(), onBlur: jest.fn(), value: "" } }),
}));

// Mock react-native-mmkv with a factory function
jest.mock("react-native-mmkv", () => ({
  MMKV: jest.fn().mockImplementation(() => createMockMMKV()),
}));

if (typeof global.structuredClone === "undefined") {
  global.structuredClone = (object) => JSON.parse(JSON.stringify(object));
}
