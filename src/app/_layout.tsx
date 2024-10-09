import { AuthProvider } from "@/providers/AuthProvider"
import { Stack } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Layout() {
  return (
    <AuthProvider>
      <SafeAreaView className="flex-1">
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(user)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)/(admin)" />
          <Stack.Screen name="index" />
        </Stack>
      </SafeAreaView>
    </AuthProvider>
  )
}
