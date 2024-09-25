import { Stack } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Layout() {
  return (
    <SafeAreaView className="flex-1">
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  )
}
