import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import queryClient from "../queries/index";
import { Colors } from "../constants/colors";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const colors = Colors[isDarkMode ? "dark" : "light"];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.text,
              headerShadowVisible: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="tournament/create"
              options={{
                title: "Новый турнир",
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="tournament/[id]/index"
              options={{ title: "Турнир" }}
            />
            <Stack.Screen
              name="tournament/[id]/match/[matchId]"
              options={{
                title: "Результат матча",
                presentation: "modal",
              }}
            />
          </Stack>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
