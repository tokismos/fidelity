import { ProgressBar } from "@/components/ProgressBar"
import { RewardIcon } from "@/components/RewardIcon"
import { Reward } from "@/types"
import { describeReward, getRewardProgress } from "@/utils/rewards"
import { Text, View } from "react-native"

type Props = {
  reward: Reward
}

// The card a new customer would see for this reward, updated while the admin types
export const RewardPreviewCard = ({ reward }: Props) => {
  const progress = getRewardProgress(reward, 0, 0, false)

  return (
    <View className="mb-4">
      <Text className="mb-2 text-xs font-extrabold uppercase tracking-wide text-gray-500">
        Preview · what customers see
      </Text>
      <View className="rounded-2xl border border-gray-200 bg-white p-4">
        <View className="flex-row items-center">
          <RewardIcon reward={reward} size="small" />
          <View className="ml-3 flex-1">
            <Text className="text-base font-bold text-gray-900">{reward.title}</Text>
            <Text className="text-sm text-gray-600">
              {describeReward(reward)}
              {reward.is_one_time ? " · one time" : ""}
            </Text>
          </View>
          {progress.unit && <Text className="text-sm font-bold text-primary-700">0/{progress.target}</Text>}
        </View>
        {progress.unit && (
          <View className="mt-3">
            <ProgressBar current={0} target={progress.target} isReady={false} />
          </View>
        )}
      </View>
    </View>
  )
}
