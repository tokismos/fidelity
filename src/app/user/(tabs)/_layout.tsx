import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { Tabs } from "expo-router"

export default function UserTabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: colors.primary }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "My stores",
          tabBarIcon: ({ color, size }) => <Ionicons name="storefront-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "My QR code",
          tabBarIcon: ({ color, size }) => <Ionicons name="qr-code-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
