import { StyleSheet } from "react-native-unistyles";

const defaultTheme = {
  colors: {
    primary: "#EC8B00",
    secondary: "#FFFFFF",
    tertiary: "#2E2F33",
    quaternary: "#4B5563",
    neutral: "#16171B",
    gray: "#A9A9A9",
  },
};

const otherTheme = {
  colors: {
    primary: "#EC8B00",
    secondary: "#FFFFFF",
    tertiary: "#49454F",
    quaternary: "#4B5563",
    neutral: "#16171B",
    gray: "#A9A9A9",
  },
};

const appThemes = {
  default: defaultTheme,
  other: otherTheme,
};

type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  settings: {
    initialTheme: "default",
  },
  themes: appThemes,
});
