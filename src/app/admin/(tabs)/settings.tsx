import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { SectionTitle } from "@/components/SectionTitle"
import { SettingsRow } from "@/components/SettingsRow"
import { StoreHeader } from "@/components/StoreHeader"
import { useAuth } from "@/hooks/useAuth"
import { useGetStore } from "@/hooks/useGetStore"
import { useGetStoreStats } from "@/hooks/useGetStoreStats"
import { supabase } from "@/utils/supabase"
import { deviceTimeZone } from "@/utils/time"
import { Alert, ScrollView, View } from "react-native"

export default function Settings() {
  const { email } = useAuth()
  const { data: store } = useGetStore()
  const stats = useGetStoreStats({ storeId: store?.id })

  const confirmSignOut = () =>
    Alert.alert("Log out", "Do you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: () => supabase.auth.signOut() },
    ])

  const timeZone = store?.timezone ?? deviceTimeZone()

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      <SectionTitle title="Store" />
      {store && (
        <StoreHeader
          name={store.name}
          imageUrl={store.image_url}
          subtitle={stats.data ? `${stats.data.customers} customers` : "Your store"}
        />
      )}
      <View className="mt-2 rounded-2xl border border-gray-200 bg-white">
        <SettingsRow
          icon="globe-outline"
          title="Time zone"
          subtitle={`${timeZone} · promotion times use it`}
          value={new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", timeZone })}
        />
      </View>

      <SectionTitle title="Program" />
      <View className="rounded-2xl border border-gray-200 bg-white">
        <SettingsRow icon="gift-outline" title="Rewards" href="/admin/rewards" />
        <SettingsRow icon="flash-outline" title="Promotions" href="/admin/promotions" isLast />
      </View>

      <SectionTitle title="Account" />
      <View className="rounded-2xl border border-gray-200 bg-white">
        <SettingsRow icon="mail-outline" title={email ?? ""} subtitle="Store owner" isLast />
      </View>

      <View className="mt-6">
        <ButtonWithIndicator title="Log out" variant="secondary" isLoading={false} onPress={confirmSignOut} />
      </View>
    </ScrollView>
  )
}
