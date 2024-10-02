import { useAuth } from "@/hooks/useAuth"
import { Redirect, Stack } from "expo-router"

export default function AuthLayout() {
  const { session } = useAuth()

  if (session) {
    return <Redirect href={"/(tabs)"} />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  )
}
