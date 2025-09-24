import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import CustomInput from "../../../components/CustomInput/CustomInput";
import { useSignIn } from "./hooks/useSignn";
import styles from "./styles";

export default function SignIn() {
  const {
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
    isLoading,
  } = useSignIn();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/images/BRQ_movies_logo.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.formContainer}>
        <View style={styles.form}>
          <CustomInput
            control={control}
            name="username"
            label="Usuário"
            placeholder="Digite seu usuário"
            icon="person-outline"
            error={errors.username}
            onClear={usernameValue ? clearUsername : undefined}
          />

          <CustomInput
            control={control}
            name="password"
            label="Senha"
            placeholder="Digite sua senha"
            icon="lock-closed-outline"
            secureTextEntry
            error={errors.password}
            onClear={passwordValue ? clearPassword : undefined}
          />

          <TouchableOpacity
            style={[
              styles.loginButton,
              {
                backgroundColor:
                  isValid && !isLoading
                    ? theme.colors.primary
                    : theme.colors.gray,
              },
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
            activeOpacity={0.8}
          >
            <Text style={styles.forgotPasswordText}>Esqueci a Senha</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
