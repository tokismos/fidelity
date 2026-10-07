import { PointsRewardBody } from "@/components/rewards/PointsRewardBody"
import { colors } from "@/constants/colors"
import { FreeItemReward, RewardAdminActions, RewardProgress } from "@/types"
import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"

type Props = {
  reward: FreeItemReward
  progress: RewardProgress
  admin?: RewardAdminActions
}

export const FreeItemDetail = ({ reward, progress, admin }: Props) => (
  <View>
    <View className="items-center rounded-2xl bg-white p-5 shadow-sm">
      <Ionicons name="gift" size={40} color={colors.primary} />
      <Text className="mt-2 text-2xl font-bold text-gray-900">Free {reward.config.item_name}</Text>
      <Text className="mt-1 text-gray-500">for {reward.config.points_needed_value} points</Text>
    </View>
    <PointsRewardBody progress={progress} admin={admin} giveLabel={`Give ${reward.config.item_name}`} />
  </View>
)
