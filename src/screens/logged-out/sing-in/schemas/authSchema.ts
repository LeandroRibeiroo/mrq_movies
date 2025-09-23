import * as yup from "yup";

export const signInSchema = yup.object({
  username: yup
    .string()
    .required("Usuário é obrigatório")
    .min(3, "Usuário deve ter pelo menos 3 caracteres"),
  password: yup
    .string()
    .required("Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type SignInFormData = yup.InferType<typeof signInSchema>;
