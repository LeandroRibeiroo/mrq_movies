import { StyleSheet } from "react-native-unistyles";

export const styles = (width: number) =>
  StyleSheet.create(({ colors }) => ({
    container: {
      flex: 1,
      backgroundColor: colors.neutral,
    },
    centerContent: {
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      color: colors.secondary,
      fontSize: 16,
      marginTop: 10,
    },
    errorText: {
      color: "#FF6B6B",
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
    },
    errorMessage: {
      color: colors.secondary,
      fontSize: 14,
      textAlign: "center",
      paddingHorizontal: 20,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 100,
    },
    moviesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    movieItem: {
      width: width,
      marginBottom: 20,
      borderRadius: 12,
      overflow: "hidden",
    },
    moviePoster: {
      width: "100%",
      height: width * 1.5,
      borderRadius: 12,
    },
  }));
