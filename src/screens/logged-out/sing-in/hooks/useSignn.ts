import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
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
    Alert.alert("Sucesso", "Login realizado com sucesso!");
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
    usernameValue,
  };
};

export { useSignIn };
