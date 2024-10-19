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
            <Stack.Screen name="(tabs)/admin" />
            <Stack.Screen name="(tabs)/user" />
            <Stack.Screen name="index" />
          </Stack>
        </SafeAreaView>
      </QueryProvider>
    </AuthProvider>
  )
}
