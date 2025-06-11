import React from "react";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";
import { UserProvider } from "./src/context/userContext";
import { EffectsProvider } from "./src/context/effectsContext";

export default function App() {
  return (
    <UserProvider>
      <EffectsProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </EffectsProvider>
    </UserProvider>
  );
}
