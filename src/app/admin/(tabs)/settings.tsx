import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { StoreHeader } from "@/components/StoreHeader"
import { useAuth } from "@/hooks/useAuth"
import { useGetStore } from "@/hooks/useGetStore"
import { supabase } from "@/utils/supabase"
import { Alert, ScrollView, Text, View } from "react-native"

export default function Settings() {
  const { email } = useAuth()
  const { data: store } = useGetStore()

  const confirmSignOut = () =>
    Alert.alert("Log out", "Do you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: () => supabase.auth.signOut() },
    ])

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      {store && <StoreHeader name={store.name} imageUrl={store.image_url} subtitle="Your store" />}

      <View className="mt-4 rounded-xl bg-white p-4 shadow-sm">
        <Text className="text-sm text-gray-500">Signed in as</Text>
        <Text className="mt-1 text-base font-medium text-gray-900">{email}</Text>
      </View>

      <View className="mt-6">
        <ButtonWithIndicator title="Log out" variant="danger" isLoading={false} onPress={confirmSignOut} />
      </View>
    </ScrollView>
  )
}
