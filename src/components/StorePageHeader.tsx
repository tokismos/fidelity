import { PromotionBanner } from "@/components/PromotionBanner"
import { SegmentedControl } from "@/components/SegmentedControl"
import { colors } from "@/constants/colors"
import { Promotion, Store } from "@/types"
import { deviceTimeZone } from "@/utils/time"
import { Ionicons } from "@expo/vector-icons"
import { Link } from "expo-router"
import { Image, Pressable, Text, View } from "react-native"

export type StorePageSection = "rewards" | "history"

type Props = {
  store: Pick<Store, "name" | "image_url" | "timezone"> | undefined
  promotion: Promotion | undefined
  now: Date
  points: number
  section: StorePageSection
  onSectionChange: (section: StorePageSection) => void
}

export const StorePageHeader = ({ store, points, promotion, now, section, onSectionChange }: Props) => (
  <View className="mb-3">
    <View className="rounded-2xl bg-gray-900 p-4">
      {store && (
        <View className="flex-row items-center">
          <Image source={{ uri: store.image_url }} className="h-14 w-14 rounded-2xl bg-gray-700" />
          <Text className="ml-3 flex-1 text-xl font-bold text-white">{store.name}</Text>
        </View>
      )}
      <View className="mt-4 flex-row items-end justify-between">
        <View>
          <Text className="text-xs font-bold uppercase tracking-wide text-gray-400">Your points</Text>
          <Text className="text-5xl font-extrabold text-white">{points}</Text>
        </View>
        <Link href="/user/profile" asChild>
          <Pressable className="flex-row items-center rounded-xl bg-white px-4 py-3">
            <Ionicons name="qr-code-outline" size={20} color={colors.ink} />
            <Text className="ml-2 font-bold text-gray-900">Show my code</Text>
          </Pressable>
        </Link>
      </View>
    </View>
    {promotion && (
      <View className="mt-3">
        <PromotionBanner promotion={promotion} now={now} timeZone={store?.timezone ?? deviceTimeZone()} />
      </View>
    )}
    <View className="mt-4">
      <SegmentedControl
        options={[
          { value: "rewards", label: "Rewards" },
          { value: "history", label: "Activity" },
        ]}
        value={section}
        onChange={onSectionChange}
      />
    </View>
  </View>
)
