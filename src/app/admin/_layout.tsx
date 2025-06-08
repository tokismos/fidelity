import { Stack } from "expo-router"

export default function AdminRootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="upsert" />
      <Stack.Screen name="scannedProfile/[userId]" />
      <Stack.Screen name="scannedProfile/scanner" />
    </Stack>
  )
}
