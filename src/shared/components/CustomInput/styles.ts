import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(({ colors }) => ({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9CA3AF",
    paddingTop: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.tertiary,
    borderWidth: 1,
    borderColor: colors.tertiary,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 12,
    height: 58,
  },
  inputContainerFocused: {
    borderBottomColor: colors.primary,
  },
  inputContainerError: {
    borderBottomColor: "#EF4444",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  icon: {
    marginRight: 12,
  },
  input: {
    fontSize: 16,
    color: colors.secondary,
    paddingVertical: 0,
  },
  eyeIcon: {
    marginLeft: 8,
    padding: 4,
  },
  clearIcon: {
    marginLeft: 8,
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
}));
