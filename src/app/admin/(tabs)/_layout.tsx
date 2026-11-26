import { ScanTabButton } from "@/components/ScanTabButton"
import { TabBarIcon } from "@/components/TabBarIcon"
import { tabScreenOptions } from "@/constants/navigation"
import { Tabs } from "expo-router"

export default function AdminTabsLayout() {
  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen
        name="home"
        options={{ title: "Home", tabBarIcon: ({ color }) => <TabBarIcon name="home-outline" color={color} /> }}
      />
      <Tabs.Screen
        name="customers"
        options={{ title: "Customers", tabBarIcon: ({ color }) => <TabBarIcon name="people-outline" color={color} /> }}
      />
      <Tabs.Screen name="scan" options={{ title: "Scan", tabBarButton: () => <ScanTabButton /> }} />
      <Tabs.Screen
        name="program"
        options={{ title: "Program", tabBarIcon: ({ color }) => <TabBarIcon name="star-outline" color={color} /> }}
      />
      <Tabs.Screen
        name="store"
        options={{ title: "Store", tabBarIcon: ({ color }) => <TabBarIcon name="storefront-outline" color={color} /> }}
      />
    </Tabs>
  )
}
