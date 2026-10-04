import "../../global.css"
import { AuthProvider } from "@/providers/AuthProvider"
import QueryProvider from "@/providers/QueryProvider"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"

export default function RootLayout() {
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
