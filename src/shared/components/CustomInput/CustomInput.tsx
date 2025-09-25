import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { CustomInputProps } from "./interface/custom-input-props";
import { styles } from "./styles";

export default function CustomInput({
  control,
  name,
  label,
  placeholder,
  icon,
  secureTextEntry = false,
  error,
  onClear,
}: CustomInputProps) {
  const { theme } = useUnistyles();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={isFocused ? theme.colors.primary : theme.colors.gray}
          style={styles.icon}
        />
        <View style={styles.innerContainer}>
          <Text style={styles.label}>{label}</Text>
          <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChange}
                onBlur={() => {
                  onBlur();
                  setIsFocused(false);
                }}
                onFocus={() => setIsFocused(true)}
                secureTextEntry={secureTextEntry && !isPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}
          />
        </View>
        {onClear && (
          <TouchableOpacity onPress={onClear} style={styles.clearIcon}>
            <Ionicons name="close-circle" size={20} color={theme.colors.gray} />
          </TouchableOpacity>
        )}

        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color={theme.colors.gray}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );
}
