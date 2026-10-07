import { ProgressBar } from "@/components/ProgressBar"
import { PromotionBadge } from "@/components/PromotionBadge"
import { colors } from "@/constants/colors"
import { StoreOverview } from "@/types"
import { remainingLabel } from "@/utils/rewards"
import { Ionicons } from "@expo/vector-icons"
import { Link } from "expo-router"
import { Image, Pressable, Text, View } from "react-native"

type Props = {
  overview: StoreOverview
  // Multiplier of the running promotion, if any
  multiplier: number | undefined
}

// A customer's card in a store, with the reward they are closest to
export const StoreCard = ({ overview: { userStore, readyCount, nextReward }, multiplier }: Props) => {
  const { store, points } = userStore
  const progress = nextReward?.progress

  return (
    <Link href={{ pathname: "/user/store/[storeId]", params: { storeId: store.id } }} asChild>
      <Pressable className="mb-3 rounded-2xl border border-gray-200 bg-white p-4">
        <View className="flex-row items-center">
          <Image source={{ uri: store.image_url }} className="h-14 w-14 rounded-2xl bg-gray-100" />
          <View className="ml-3 flex-1">
            <Text className="text-lg font-bold text-gray-900">{store.name}</Text>
            <Text className="text-sm text-gray-600">{points} points</Text>
          </View>
          {multiplier ? (
            <PromotionBadge multiplier={multiplier} />
          ) : readyCount > 0 ? (
            <View className="flex-row items-center rounded-full bg-green-100 px-3 py-1">
              <Ionicons name="checkmark" size={14} color={colors.success} />
              <Text className="ml-1 text-xs font-bold text-green-700">{readyCount} ready</Text>
            </View>
          ) : (
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          )}
        </View>

        {nextReward && progress && (
          <View className="mt-3">
            <View className="flex-row items-center justify-between">
              <Text
                className={`flex-1 text-sm font-semibold ${progress.isReady ? "text-green-700" : "text-primary-700"}`}
                numberOfLines={1}
              >
                {progress.isReady
                  ? `${nextReward.reward.title} is ready`
                  : `${remainingLabel(progress)} to ${nextReward.reward.title}`}
              </Text>
              <Text className="ml-2 text-xs text-gray-500">
                {progress.current} / {progress.target}
              </Text>
            </View>
            <View className="mt-2">
              <ProgressBar current={progress.current} target={progress.target} isReady={progress.isReady} />
            </View>
          </View>
        )}
      </Pressable>
    </Link>
  )
}
