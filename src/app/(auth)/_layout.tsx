import { useAuth } from "@/hooks/useAuth"
import { Redirect, Stack } from "expo-router"
import { View } from "react-native"

export default function AuthLayout() {
  const { session, isAdmin, isLoading } = useAuth()

  if (isLoading) return <View className="flex-1 bg-red-600" />

  if (session) {
    return <Redirect href={isAdmin ? "/(admin)/home" : "/(user)/home"} />
  }

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  )
}
