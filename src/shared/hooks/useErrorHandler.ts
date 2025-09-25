import { useCallback, useState } from "react";

interface ErrorState {
  hasError: boolean;
  error?: Error | any;
}

export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({ hasError: false });

  const handleError = useCallback((error: Error | any) => {
    console.error("Error caught:", error);
    setErrorState({ hasError: true, error });
  }, []);

  const resetError = useCallback(() => {
    setErrorState({ hasError: false, error: undefined });
  }, []);

  return {
    hasError: errorState.hasError,
    error: errorState.error,
    handleError,
    resetError,
  };
}
