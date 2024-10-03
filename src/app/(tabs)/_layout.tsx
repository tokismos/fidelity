import { Redirect, Tabs } from "expo-router"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { useAuth } from "@/hooks/useAuth"

export default function TabLayout() {
  const { session } = useAuth()

  if (!session) {
    return <Redirect href="/sign-in" />
  }
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
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
