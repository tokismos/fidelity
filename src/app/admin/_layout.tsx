import { LoadingView } from "@/components/LoadingView"
import { useAuth } from "@/hooks/useAuth"
import { Redirect, Stack } from "expo-router"

export default function AdminLayout() {
  const { session, isAdmin, isLoading } = useAuth()

  if (isLoading) return <LoadingView />
  if (!session) return <Redirect href="/sign-in" />
  if (!isAdmin) return <Redirect href="/user/home" />

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="upsert" options={{ title: "Reward" }} />
      <Stack.Screen name="promotions" options={{ title: "Double points" }} />
      <Stack.Screen name="scanner" options={{ title: "Scan a customer" }} />
      <Stack.Screen name="customer/[userId]/index" options={{ title: "Customer" }} />
      <Stack.Screen name="customer/[userId]/reward/[rewardId]" options={{ title: "Reward" }} />
    </Stack>
  )
}
