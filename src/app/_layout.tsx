import { Stack } from "expo-router";
import React from "react";
import { QueryProvider } from "../providers/QueryProvider";

const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthInitializer>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(logged-out)" />
          <Stack.Screen name="(protected)" />
        </Stack>
      </AuthInitializer>
    </QueryProvider>
  );
}
