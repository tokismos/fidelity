import { REWARD_TYPE_INFO } from "@/constants/rewardTypes"
import { RewardIcon } from "@/components/RewardIcon"
import { Reward } from "@/types"
import { Text, View } from "react-native"

type Props = {
  reward: Reward
}

export const RewardDetailHeader = ({ reward }: Props) => (
  <View className="items-center">
    <RewardIcon reward={reward} size="large" />
    <Text className="mt-3 text-center text-2xl font-bold text-gray-900">{reward.title}</Text>
    <Text className="mt-1 text-xs uppercase tracking-wide text-gray-400">{REWARD_TYPE_INFO[reward.type].title}</Text>
    {reward.description ? <Text className="mt-2 text-center text-gray-600">{reward.description}</Text> : null}
  </View>
)
