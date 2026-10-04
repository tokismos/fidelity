import { EmptyState } from "@/components/EmptyState"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { RewardAdminListItem } from "@/components/RewardAdminListItem"
import { useDeleteReward } from "@/hooks/useDeleteReward"
import { useGetRewards } from "@/hooks/useGetRewards"
import { useGetStore } from "@/hooks/useGetStore"
import { useSetRewardStatus } from "@/hooks/useSetRewardStatus"
import { Reward } from "@/types"
import { FlashList } from "@shopify/flash-list"
import { router } from "expo-router"
import { Alert } from "react-native"

export default function AdminRewards() {
  const { data: store } = useGetStore()
  const {
    data: rewards,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useGetRewards({
    storeId: store?.id,
    activeOnly: false,
  })
  const { deleteReward, isPending: isDeleting } = useDeleteReward()
  const { setRewardStatus, isPending: isUpdating } = useSetRewardStatus()

  const showError = (error: Error) => Alert.alert("Something went wrong", error.message)

  const confirmDelete = (reward: Reward) =>
    Alert.alert("Delete reward", `Delete "${reward.title}"? Customers will no longer see it.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteReward({ rewardId: reward.id }, { onError: showError }),
      },
    ])

  if (isLoading) return <LoadingView />
  if (error) return <ErrorView message={error.message} />

  return (
    <FlashList
      className="bg-gray-50"
      contentContainerStyle={{ padding: 16 }}
      data={rewards ?? []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <RewardAdminListItem
          reward={item}
          isBusy={isDeleting || isUpdating}
          onToggleActive={(isActive) =>
            setRewardStatus({ rewardId: item.id, status: isActive ? "active" : "paused" }, { onError: showError })
          }
          onEdit={() => router.push({ pathname: "/admin/upsert", params: { type: item.type, rewardId: item.id } })}
          onDelete={() => confirmDelete(item)}
        />
      )}
      ListEmptyComponent={
        <EmptyState icon="gift-outline" title="No rewards yet" message='Create one in the "New reward" tab.' />
      }
      onRefresh={refetch}
      refreshing={isRefetching}
    />
  )
}
