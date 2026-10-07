import { EmptyState } from "@/components/EmptyState"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { RewardAdminListItem } from "@/components/RewardAdminListItem"
import { RewardsListHeader } from "@/components/RewardsListHeader"
import { SectionTitle } from "@/components/SectionTitle"
import { useDeleteReward } from "@/hooks/useDeleteReward"
import { useGetRewards } from "@/hooks/useGetRewards"
import { useGetStore } from "@/hooks/useGetStore"
import { useSetRewardStatus } from "@/hooks/useSetRewardStatus"
import { Reward } from "@/types"
import { FlashList } from "@shopify/flash-list"
import { router } from "expo-router"
import { Alert } from "react-native"

type Row = { kind: "title"; id: string; title: string } | { kind: "reward"; id: string; reward: Reward }

// Active rewards first, paused ones under their own title
const groupedRows = (rewards: Reward[]): Row[] => {
  const active = rewards.filter((reward) => reward.status === "active")
  const paused = rewards.filter((reward) => reward.status !== "active")
  const section = (title: string, members: Reward[]): Row[] =>
    members.length === 0
      ? []
      : [
          { kind: "title", id: `title-${title}`, title },
          ...members.map((reward) => ({ kind: "reward" as const, id: reward.id, reward })),
        ]

  return [...section("Active · customers see these", active), ...section("Paused · hidden from customers", paused)]
}

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

  const activeCount = (rewards ?? []).filter((reward) => reward.status === "active").length

  return (
    <FlashList
      className="bg-gray-50"
      contentContainerStyle={{ padding: 16 }}
      data={groupedRows(rewards ?? [])}
      keyExtractor={(row) => row.id}
      renderItem={({ item: row }) =>
        row.kind === "title" ? (
          <SectionTitle title={row.title} />
        ) : (
          <RewardAdminListItem
            reward={row.reward}
            isBusy={isDeleting || isUpdating}
            onToggleActive={(isActive) =>
              setRewardStatus(
                { rewardId: row.reward.id, status: isActive ? "active" : "paused" },
                { onError: showError },
              )
            }
            onEdit={() =>
              router.push({ pathname: "/admin/upsert", params: { type: row.reward.type, rewardId: row.reward.id } })
            }
            onDelete={() => confirmDelete(row.reward)}
          />
        )
      }
      ListHeaderComponent={
        <RewardsListHeader activeCount={activeCount} pausedCount={(rewards?.length ?? 0) - activeCount} />
      }
      ListEmptyComponent={
        <EmptyState icon="gift-outline" title="No rewards yet" message='Tap "New reward" to create your first one.' />
      }
      onRefresh={refetch}
      refreshing={isRefetching}
    />
  )
}
