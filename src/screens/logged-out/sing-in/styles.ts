import { StyleSheet } from "react-native-unistyles";

const styles = StyleSheet.create(({ colors }) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.neutral,
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: "100%",
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 180,
    height: 180,
  },
  formContainer: {
    width: "100%",
    height: "60%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  form: {
    width: "100%",
    maxWidth: 400,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPasswordContainer: {
    alignItems: "center",
  },
  forgotPasswordText: {
    color: "#FFFFFF",
    fontSize: 14,
    textDecorationLine: "underline",
  },
}));

export default styles;
