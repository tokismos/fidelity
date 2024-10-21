import { AuthProvider } from "@/providers/AuthProvider"
import QueryProvider from "@/providers/QueryProvider"
import { Stack } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Layout() {
  return (
    <AuthProvider>
      <QueryProvider>
        <SafeAreaView className="flex-1">
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="admin" />
            <Stack.Screen name="user/(tabs)" />
            <Stack.Screen name="index" />
          </Stack>
        </SafeAreaView>
      </QueryProvider>
    </AuthProvider>
  )
}
