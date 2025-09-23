import { Ionicons } from "@expo/vector-icons";
import { Control, FieldError } from "react-hook-form";

export interface CustomInputProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  icon: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
  error?: FieldError;
  onClear?: () => void;
}
