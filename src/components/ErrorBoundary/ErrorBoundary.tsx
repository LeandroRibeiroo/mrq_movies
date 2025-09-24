import React, { ReactNode } from "react";
import { View } from "react-native";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import ErrorComponent from "../ErrorComponent/ErrorComponent";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ErrorBoundary({ children, fallback }: Props) {
  const { hasError, resetError } = useErrorHandler();

  if (hasError) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <View style={{ flex: 1, backgroundColor: "#16171B" }}>
        <ErrorComponent
          title="Erro inesperado"
          message="Algo deu errado. Tente novamente."
          onRetry={resetError}
        />
      </View>
    );
  }

  return <>{children}</>;
}
