import { Redirect } from "expo-router";
import React from "react";
import { useAuthStore } from "../shared/store/authStore";

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(protected)" />;
  } else {
    return <Redirect href="/(logged-out)" />;
  }
}
