import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { useAuth } from "../../../../shared/hooks/useAuth";
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
  const signInMutation = useAuth();

  const usernameValue = watch("username");
  const passwordValue = watch("password");

  const clearUsername = () => {
    setValue("username", "");
  };

  const clearPassword = () => {
    setValue("password", "");
  };

  const onSubmit = (data: SignInFormData) => {
    signInMutation.mutate(data, {
      onSuccess: () => {
        router.replace("/(protected)");
      },
      onError: (error) => {
        Alert.alert(
          "Erro no Login",
          error.message || "Erro ao fazer login. Tente novamente."
        );
      },
    });
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
    isLoading: signInMutation.isPending,
  };
};

export { useSignIn };
