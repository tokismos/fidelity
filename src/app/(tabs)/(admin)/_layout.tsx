import { Redirect, Tabs } from "expo-router"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { useAuth } from "@/hooks/useAuth"
import { View } from "react-native"

export default function TabLayout() {
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
          title: "This is Home",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "This is Settings",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
    </Tabs>
  )
}
