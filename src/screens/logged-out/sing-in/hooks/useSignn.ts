import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { SignInFormData, signInSchema } from "../schemas/authSchema";

const useSignIn = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { theme } = useUnistyles();
  const router = useRouter();

  const usernameValue = watch("username");
  const passwordValue = watch("password");

  const clearUsername = () => {
    setValue("username", "");
  };

  const clearPassword = () => {
    setValue("password", "");
  };

  const onSubmit = (data: SignInFormData) => {
    console.log("Form data:", data);
    router.replace("/(protected)");
  };

  const handleForgotPassword = () => {
    Alert.alert("Esqueci a Senha", "Funcionalidade em desenvolvimento");
  };
  return {
    clearPassword,
    clearUsername,
    control,
    errors,
    handleForgotPassword,
    handleSubmit,
    isValid,
    onSubmit,
    passwordValue,
    theme,
    usernameValue,
  };
};

export { useSignIn };
