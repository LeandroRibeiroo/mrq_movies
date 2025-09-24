module.exports = {
  preset: "react-native",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["**/__tests__/**/*.(ts|tsx|js)", "**/*.(test|spec).(ts|tsx|js)"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|expo|@expo|react-native-unistyles|@expo/vector-icons|expo-image|expo-router|expo-font|react-native-config|expo-modules-core|react-native-mmkv|react-native-nitro-modules|expo-asset|expo-constants)/)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(png|jpg|jpeg|gif|svg|ttf|woff|woff2|eot)$":
      "<rootDir>/__mocks__/fileMock.js",
    "react-native-config": "<rootDir>/__mocks__/react-native-config.js",
    "react-native-mmkv": "<rootDir>/__mocks__/react-native-mmkv.js",
    "react-native-nitro-modules":
      "<rootDir>/__mocks__/react-native-nitro-modules.js",
    "expo-modules-core": "<rootDir>/__mocks__/expo-modules-core.js",
    "react-native-unistyles": "<rootDir>/__mocks__/react-native-unistyles.js",
    "expo-constants": "<rootDir>/__mocks__/expo-constants.js",
  },
};
