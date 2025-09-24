import { StyleSheet } from "react-native-unistyles";

export const styles = (width: number) =>
  StyleSheet.create(({ colors }) => ({
    container: {
      flex: 1,
      backgroundColor: colors.neutral,
    },
    header: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      overflow: "hidden",
    },
    headerBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.neutral,
    },
    headerImage: {
      width: "100%",
      height: "85%",
    },
    headerControls: {
      position: "absolute",
      height: 60,
      top: 50,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      color: colors.secondary,
      fontSize: 18,
      fontWeight: "bold",
      flex: 1,
      textAlign: "center",
      marginHorizontal: 20,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 50,
    },
    movieCard: {
      backgroundColor: colors.neutral,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      marginTop: -20,
    },
    movieHeader: {
      flexDirection: "row",
      marginBottom: 24,
    },
    moviePoster: {
      width: 120,
      height: 180,
      borderRadius: 12,
      marginRight: 16,
    },
    movieBasicInfo: {
      flex: 1,
      justifyContent: "flex-start",
    },
    movieTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.secondary,
      marginBottom: 4,
    },
    movieSubtitle: {
      fontSize: 16,
      color: colors.gray,
      marginBottom: 16,
    },
    movieMeta: {
      gap: 12,
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    metaText: {
      fontSize: 14,
      color: colors.secondary,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 12,
    },
    synopsis: {
      fontSize: 14,
      lineHeight: 22,
      color: colors.secondary,
    },
    detailsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
    },
    detailItem: {
      width: (width - 60) / 2,
      backgroundColor: colors.tertiary,
      padding: 16,
      borderRadius: 12,
    },
    detailHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },
    detailLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.primary,
    },
    detailText: {
      fontSize: 14,
      color: colors.secondary,
      lineHeight: 18,
    },
  }));
