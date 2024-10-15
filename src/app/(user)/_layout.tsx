import { Redirect, Stack } from "expo-router"
import { useAuth } from "@/hooks/useAuth"
import { View } from "react-native"

export default function UserLayout() {
  const { session, isLoading } = useAuth()

  if (isLoading) return <View className="flex-1 bg-red-600" />

  if (!session) {
    return <Redirect href="/" />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="home"
        options={{
          title: "This is USER SCREEN",
        }}
      />
    </Stack>
  )
}
