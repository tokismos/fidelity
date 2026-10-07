import { PromotionBanner } from "@/components/PromotionBanner"
import { StatCard } from "@/components/StatCard"
import { colors } from "@/constants/colors"
import { Promotion, Store, StoreStats } from "@/types"
import { Ionicons } from "@expo/vector-icons"
import { Link } from "expo-router"
import { Image, Pressable, Text, TextInput, View } from "react-native"

type Props = {
  store: Pick<Store, "name" | "image_url">
  stats: StoreStats | null | undefined
  search: string
  onSearchChange: (search: string) => void
  promotion: Promotion | undefined
  now: Date
  timeZone: string
}

const today = () => new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })

export const StoreDashboardHeader = ({ store, stats, search, onSearchChange, promotion, now, timeZone }: Props) => (
  <View className="mb-2">
    <View className="flex-row items-center">
      <Image source={{ uri: store.image_url }} className="h-12 w-12 rounded-2xl bg-gray-100" />
      <View className="ml-3 flex-1">
        <Text className="text-xs font-semibold text-gray-500">{today()}</Text>
        <Text className="text-2xl font-extrabold text-gray-900">{store.name}</Text>
      </View>
    </View>

    <Link href="/admin/scanner" asChild>
      <Pressable className="mt-4 flex-row items-center rounded-2xl bg-primary-600 p-4">
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-white/15">
          <Ionicons name="scan-outline" size={28} color={colors.white} />
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-lg font-extrabold text-white">Scan a customer</Text>
          <Text className="text-sm text-primary-100">Add points, stamp a card or give a reward</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={colors.white} />
      </Pressable>
    </Link>

    <View className="mt-3 flex-row gap-3">
      <StatCard label="Customers" value={stats?.customers ?? "-"} icon="people-outline" />
      <StatCard label="Points given" value={stats?.points_given ?? "-"} icon="star-outline" />
      <StatCard label="Rewards given" value={stats?.rewards_given ?? "-"} icon="gift-outline" />
    </View>

    {promotion && (
      <Link href="/admin/promotions" asChild>
        <Pressable className="mt-3">
          <PromotionBanner promotion={promotion} now={now} timeZone={timeZone} />
        </Pressable>
      </Link>
    )}

    <Text className="mb-2 mt-6 text-lg font-extrabold text-gray-900">Customers</Text>
    <View className="flex-row items-center rounded-xl border border-gray-300 bg-white px-3">
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
