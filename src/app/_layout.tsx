import { AuthProvider } from "@/providers/AuthProvider"
import { Stack } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Layout() {
  return (
    <AuthProvider>
      <SafeAreaView className="flex-1">
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
        </Stack>
      </SafeAreaView>
    </AuthProvider>
  )
}
