import "../../global.css"
import { AuthProvider } from "@/providers/AuthProvider"
import QueryProvider from "@/providers/QueryProvider"
import {
  RedHatDisplay_500Medium,
  RedHatDisplay_700Bold,
  RedHatDisplay_900Black,
  useFonts,
} from "@expo-google-fonts/red-hat-display"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"

// Keep the splash screen up until the fonts are ready, so text never flashes in the system font
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ RedHatDisplay_500Medium, RedHatDisplay_700Bold, RedHatDisplay_900Black })
  const ready = fontsLoaded || !!fontError

  useEffect(() => {
    if (ready) SplashScreen.hideAsync()
  }, [ready])

  if (!ready) return null

  return (
    <AuthProvider>
      <QueryProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="admin" />
          <Stack.Screen name="user" />
        </Stack>
      </QueryProvider>
    </AuthProvider>
  )
}
