import { Stack } from "expo-router"

export default function AdminRootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="scanner" />
    </Stack>
  )
}
