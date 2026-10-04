import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { PointsBalance } from "@/components/PointsBalance"
import { RewardDetailHeader } from "@/components/RewardDetailHeader"
import { RewardReceivedInfo } from "@/components/RewardReceivedInfo"
import { RewardDetail } from "@/components/rewards/RewardDetail"
import { useAuth } from "@/hooks/useAuth"
import { useCustomerRewards } from "@/hooks/useCustomerRewards"
import { useGetGivenRewards } from "@/hooks/useGetGivenRewards"
import { useGetReward } from "@/hooks/useGetReward"
import { useLocalSearchParams } from "expo-router"
import { ScrollView, View } from "react-native"

export default function UserReward() {
  const { rewardId } = useLocalSearchParams<{ rewardId: string }>()
  const { userId } = useAuth()

  const reward = useGetReward({ rewardId })
  const storeId = reward.data?.store_id
  const customer = useCustomerRewards({ userId, storeId })
  const givenRewards = useGetGivenRewards({ userId, storeId })

  if (reward.isLoading || customer.isLoading) return <LoadingView />
  if (reward.error || !reward.data) return <ErrorView message={reward.error?.message} />

  const item = customer.items.find((entry) => entry.reward.id === rewardId)
  const received = (givenRewards.data ?? []).filter((given) => given.reward_id === rewardId)

  if (!item) return <ErrorView message="This reward is not available right now." />

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      <PointsBalance points={customer.points} label="Your points" />
      <View className="mt-6">
        <RewardDetailHeader reward={reward.data} />
      </View>
      <View className="mt-6">
        <RewardDetail reward={reward.data} progress={item.progress} />
      </View>
      <RewardReceivedInfo count={received.length} lastDate={received[0]?.created_at ?? null} />
    </ScrollView>
  )
}
