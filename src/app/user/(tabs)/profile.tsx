import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { QrCode } from "@/components/QrCode"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/utils/supabase"
import { Alert, ScrollView, Text, View } from "react-native"

export default function Profile() {
  const { userId, email } = useAuth()

  const confirmSignOut = () =>
    Alert.alert("Log out", "Do you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: () => supabase.auth.signOut() },
    ])

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      <View className="items-center rounded-xl bg-white p-6 shadow-sm">
        <Text className="text-lg font-bold text-gray-900">Your loyalty card</Text>
        <Text className="mb-4 mt-1 text-center text-gray-500">
          Show this code at the counter to collect points and get your rewards.
        </Text>
        {userId && <QrCode value={userId} />}
        <Text className="mt-4 text-sm text-gray-500">{email}</Text>
      </View>

      <View className="mt-6">
        <ButtonWithIndicator title="Log out" variant="danger" isLoading={false} onPress={confirmSignOut} />
      </View>
    </ScrollView>
  )
}
