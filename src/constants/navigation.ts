import { colors } from "@/constants/colors"
import { NativeStackNavigationOptions } from "expo-router"

// Pushed screens draw their own NavBar, so the native header is off. Swipe back stays on.
export const stackScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  gestureEnabled: true,
  contentStyle: { backgroundColor: colors.ground },
}

// Tab bar of both roles: white, a hairline on top, navy when active
export const tabScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.ink,
  tabBarInactiveTintColor: colors.ink3,
  tabBarLabelStyle: { fontFamily: "RedHatDisplay_700Bold", fontSize: 11 },
  tabBarStyle: {
    backgroundColor: colors.surface,
    borderTopColor: colors.line,
    borderTopWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
  },
}
