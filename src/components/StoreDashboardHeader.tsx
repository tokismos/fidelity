import { StatCard } from "@/components/StatCard"
import { StoreHeader } from "@/components/StoreHeader"
import { colors } from "@/constants/colors"
import { Store, StoreStats } from "@/types"
import { Ionicons } from "@expo/vector-icons"
import { Link } from "expo-router"
import { Pressable, Text, TextInput, View } from "react-native"

type Props = {
  store: Pick<Store, "name" | "image_url">
  stats: StoreStats | null | undefined
  search: string
  onSearchChange: (search: string) => void
}

export const StoreDashboardHeader = ({ store, stats, search, onSearchChange }: Props) => (
  <View className="mb-2">
    <StoreHeader name={store.name} imageUrl={store.image_url} subtitle="Your store" />

    <View className="mt-3 flex-row gap-3">
      <StatCard label="Customers" value={stats?.customers ?? "-"} icon="people-outline" />
      <StatCard label="Points given" value={stats?.points_given ?? "-"} icon="star-outline" />
      <StatCard label="Rewards given" value={stats?.rewards_given ?? "-"} icon="gift-outline" />
    </View>

    <Link href="/admin/scanner" asChild>
      <Pressable className="mt-3 flex-row items-center justify-center rounded-xl bg-blue-600 py-4">
        <Ionicons name="qr-code-outline" size={22} color={colors.white} />
        <Text className="ml-2 text-lg font-semibold text-white">Scan a customer</Text>
      </Pressable>
    </Link>

    <Text className="mb-2 mt-6 text-lg font-bold text-gray-900">Customers</Text>
    <View className="flex-row items-center rounded-lg border border-gray-300 bg-white px-3">
      <Ionicons name="search" size={18} color={colors.muted} />
      <TextInput
        value={search}
        onChangeText={onSearchChange}
        placeholder="Search by email"
        autoCapitalize="none"
        className="ml-2 flex-1 py-3 text-base"
      />
    </View>
  </View>
)
