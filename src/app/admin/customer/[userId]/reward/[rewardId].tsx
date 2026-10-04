import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { PointsBalance } from "@/components/PointsBalance"
import { RewardDetailHeader } from "@/components/RewardDetailHeader"
import { RewardReceivedInfo } from "@/components/RewardReceivedInfo"
import { RewardDetail } from "@/components/rewards/RewardDetail"
import { useAddPurchase } from "@/hooks/useAddPurchase"
import { useCustomerRewards } from "@/hooks/useCustomerRewards"
import { useGetGivenRewards } from "@/hooks/useGetGivenRewards"
import { useGetReward } from "@/hooks/useGetReward"
import { useGetStore } from "@/hooks/useGetStore"
import { useGiveReward } from "@/hooks/useGiveReward"
import { useLocalSearchParams } from "expo-router"
import { Alert, ScrollView, Text, View } from "react-native"

export default function AdminCustomerReward() {
  const { userId, rewardId } = useLocalSearchParams<{ userId: string; rewardId: string }>()

  const { data: store } = useGetStore()
  const reward = useGetReward({ rewardId })
  const customer = useCustomerRewards({ userId, storeId: store?.id })
  const givenRewards = useGetGivenRewards({ userId, storeId: store?.id })
  const { giveReward, isPending: isGiving } = useGiveReward()
  const { addPurchase, isPending: isAddingPurchase } = useAddPurchase()

  if (reward.isLoading || customer.isLoading) return <LoadingView />
  if (reward.error || !reward.data) return <ErrorView message={reward.error?.message} />

  const item = customer.items.find((entry) => entry.reward.id === rewardId)
  const received = (givenRewards.data ?? []).filter((given) => given.reward_id === rewardId)
  const showError = (error: Error) => Alert.alert("Something went wrong", error.message)

  const confirmGive = () =>
    Alert.alert("Give reward", `Give "${reward.data?.title}" to this customer now?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Give",
        onPress: () =>
          giveReward(
            { userId, rewardId },
            { onSuccess: () => Alert.alert("Done", "The reward was given."), onError: showError },
          ),
      },
    ])

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      <PointsBalance points={customer.points} label="Customer points" />

      <View className="mt-6">
        <RewardDetailHeader reward={reward.data} />
      </View>

      <View className="mt-6">
        {item ? (
          <RewardDetail
            reward={reward.data}
            progress={item.progress}
            admin={{
              onGive: confirmGive,
              onAddPurchase: () => addPurchase({ userId, rewardId }, { onError: showError }),
              isPending: isGiving || isAddingPurchase,
            }}
          />
        ) : (
          <Text className="text-center text-gray-500">This reward is paused. Activate it in the Rewards tab.</Text>
        )}
      </View>

      <RewardReceivedInfo count={received.length} lastDate={received[0]?.created_at ?? null} />
    </ScrollView>
  )
}
