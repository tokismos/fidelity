import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { QrCode } from "@/components/QrCode"
import { colors } from "@/constants/colors"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/utils/supabase"
import { Ionicons } from "@expo/vector-icons"
import { ComponentProps } from "react"
import { Alert, ScrollView, Text, View } from "react-native"

const USES: { icon: ComponentProps<typeof Ionicons>["name"]; text: string }[] = [
  { icon: "add-circle-outline", text: "Collect points and stamps after a purchase" },
  { icon: "gift-outline", text: "Get a reward that is ready" },
  { icon: "storefront-outline", text: "Join a new store on your first visit" },
]

export default function Profile() {
  const { userId, email } = useAuth()

  const confirmSignOut = () =>
    Alert.alert("Log out", "Do you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: () => supabase.auth.signOut() },
    ])

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      <View className="items-center rounded-3xl border border-gray-200 bg-white p-6">
        <Text className="text-lg font-extrabold text-gray-900">Your loyalty card</Text>
        <Text className="mb-5 mt-1 text-center text-gray-600">
          Show this code at the counter. One code for every store.
        </Text>
        {userId && <QrCode value={userId} />}
        <Text className="mt-5 text-sm font-semibold text-gray-600">{email}</Text>
      </View>

      <View className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
        <Text className="mb-3 text-xs font-extrabold uppercase tracking-wide text-gray-500">Use it for everything</Text>
        {USES.map((use) => (
          <View key={use.text} className="mb-3 flex-row items-center">
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary-50">
              <Ionicons name={use.icon} size={20} color={colors.primary} />
            </View>
            <Text className="ml-3 flex-1 text-gray-700">{use.text}</Text>
          </View>
        ))}
      </View>

      <View className="mt-6">
        <ButtonWithIndicator title="Log out" variant="secondary" isLoading={false} onPress={confirmSignOut} />
      </View>
    </ScrollView>
  )
}
