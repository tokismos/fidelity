import { Redirect, Stack, Tabs } from "expo-router"
import { useAuth } from "@/hooks/useAuth"
import { View } from "react-native"

export default function UserLayout() {
  const { session, isLoading } = useAuth()

  if (isLoading) return <View className="flex-1 bg-red-600" />

  if (!session) {
    return <Redirect href="/" />
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "This is USER SCREEN",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "This is USER SCREEN",
        }}
      />
      <Tabs.Screen
        name="[storeId]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  )
}
