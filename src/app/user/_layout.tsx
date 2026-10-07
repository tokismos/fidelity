import { LoadingView } from "@/components/LoadingView"
import { useAuth } from "@/hooks/useAuth"
import { Redirect, Stack } from "expo-router"

export default function UserLayout() {
  const { session, isAdmin, isLoading } = useAuth()

  if (isLoading) return <LoadingView />
  if (!session) return <Redirect href="/sign-in" />
  if (isAdmin) return <Redirect href="/admin/home" />

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="store/[storeId]" options={{ title: "Store" }} />
      <Stack.Screen name="reward/[rewardId]" options={{ title: "Reward" }} />
    </Stack>
  )
}
