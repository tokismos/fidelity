import { EmptyState } from "@/components/EmptyState"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { PointsBalance } from "@/components/PointsBalance"
import { RewardDetailHeader } from "@/components/RewardDetailHeader"
import { RewardHistoryTitle } from "@/components/RewardHistoryTitle"
import { TimelineItem } from "@/components/TimelineItem"
import { RewardDetail } from "@/components/rewards/RewardDetail"
import { useAddPurchase } from "@/hooks/useAddPurchase"
import { useCustomerRewards } from "@/hooks/useCustomerRewards"
import { useCustomerTimeline } from "@/hooks/useCustomerTimeline"
import { useGetReward } from "@/hooks/useGetReward"
import { useGetStore } from "@/hooks/useGetStore"
import { useGiveReward } from "@/hooks/useGiveReward"
import { useRemovePurchase } from "@/hooks/useRemovePurchase"
import { rewardTimeline } from "@/utils/timeline"
import { FlashList } from "@shopify/flash-list"
import { useLocalSearchParams } from "expo-router"
import { Alert, Text, View } from "react-native"

export default function AdminCustomerReward() {
  const { userId, rewardId } = useLocalSearchParams<{ userId: string; rewardId: string }>()

  const { data: store } = useGetStore()
  const reward = useGetReward({ rewardId })
  const customer = useCustomerRewards({ userId, storeId: store?.id })
  const { timeline, refetch, isRefetching } = useCustomerTimeline({ userId, storeId: store?.id })
  const { giveReward, isPending: isGiving } = useGiveReward()
  const { addPurchase, isPending: isAddingPurchase } = useAddPurchase()
  const { removePurchase, isPending: isRemovingPurchase } = useRemovePurchase()

  if (reward.isLoading || customer.isLoading) return <LoadingView />
  if (reward.error || !reward.data) return <ErrorView message={reward.error?.message} />

  const item = customer.items.find((entry) => entry.reward.id === rewardId)
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

  const confirmRemovePurchase = () =>
    Alert.alert("Remove purchase", "Remove the last purchase from this card?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removePurchase({ userId, rewardId }, { onError: showError }),
      },
    ])

  const header = (
    <View>
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
              onRemovePurchase: confirmRemovePurchase,
              isPending: isGiving || isAddingPurchase || isRemovingPurchase,
            }}
          />
        ) : (
          <Text className="text-center text-gray-500">This reward is paused. Activate it in the Rewards tab.</Text>
        )}
      </View>
      <RewardHistoryTitle />
    </View>
  )

  return (
    <FlashList
      className="bg-gray-50"
      contentContainerStyle={{ padding: 16 }}
      data={rewardTimeline(timeline, rewardId)}
      keyExtractor={(entry) => `${entry.kind}-${entry.id}`}
      renderItem={({ item: entry }) => <TimelineItem entry={entry} />}
      ListHeaderComponent={header}
      ListEmptyComponent={<EmptyState icon="time-outline" title="Nothing yet" />}
      onRefresh={() => Promise.all([customer.refetch(), refetch()])}
      refreshing={customer.isRefetching || isRefetching}
    />
  )
}
