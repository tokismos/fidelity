import { Redirect, Tabs } from "expo-router"
import { useAuth } from "@/hooks/useAuth"
import { View } from "react-native"

export default function UserLayout() {
  const { session, isLoading } = useAuth()

  if (isLoading) return <View className="flex-1 bg-red-600" />

  if (!session) {
    return <Redirect href="/" />
  }

  return (
    <Tabs screenOptions={{ headerShown: false }} initialRouteName="profile">
      <Tabs.Screen name="home" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen
        name="[storeId]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  )
}
