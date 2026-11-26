import { RaisedTabButton } from "@/components/RaisedTabButton"
import { TabBarIcon } from "@/components/TabBarIcon"
import { tabScreenOptions } from "@/constants/navigation"
import { Tabs } from "expo-router"

export default function UserTabsLayout() {
  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen
        name="home"
        options={{ title: "My cards", tabBarIcon: ({ color }) => <TabBarIcon name="card-outline" color={color} /> }}
      />
      <Tabs.Screen
        name="code"
        options={{
          title: "My code",
          tabBarButton: ({ onPress }) => (
            <RaisedTabButton
              icon="qr-code-outline"
              label="My code"
              accessibilityLabel="My code"
              onPress={(event) => onPress?.(event)}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{ title: "Rewards", tabBarIcon: ({ color }) => <TabBarIcon name="gift-outline" color={color} /> }}
      />
    </Tabs>
  )
}
