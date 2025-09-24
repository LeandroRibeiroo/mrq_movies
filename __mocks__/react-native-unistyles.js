export const StyleSheet = {
  create: jest.fn((fn) => fn({ colors: {} })),
  init: jest.fn(),
};

export const useUnistyles = jest.fn(() => ({
  theme: {
    colors: {
      primary: "#007AFF",
      gray: "#8E8E93",
      neutral: "#FFFFFF",
      background: "#F2F2F7",
    },
  },
}));

export default {
  StyleSheet,
  useUnistyles,
};
